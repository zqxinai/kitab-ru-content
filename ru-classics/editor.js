'use strict';
(() => {
  const config=window.RU_FIREBASE_CONFIG;
  const fields={
    translation_indonesian:'Terjemahan Indonesia (MATAKIN)',
    translation_english:'Terjemahan Inggris (Legge)',
    ruby_paragraphs:'Hanzi & pinyin (struktur Ruby)',
    editorial_annotations:'Komentar & anotasi sumber'
  };
  const H=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state={ready:false,user:null,role:'guest',profile:null,db:null,auth:null,lib:null,edits:[],users:[],selected:null,field:'translation_indonesian',busy:false,error:''};
  const app=()=>window.RuApp;
  const owner='zqxinai';
  const formatTime=t=>t&&typeof t.toDate==='function'?t.toDate().toLocaleString('id-ID'):'—';
  const currentText=(p,field)=>!p?'':typeof p[field]==='string'?p[field]:JSON.stringify(p[field]||[],null,2);
  function update(){if(location.hash==='#editor')render(document.getElementById('main'));}
  function message(text){state.error=text;update();}
  async function init(){
    if(!config||!config.apiKey||!config.authDomain||!config.projectId){state.ready=true;update();return;}
    try{
      const [fa,authLib,dbLib]=await Promise.all([
        import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
        import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')
      ]);
      const fb=fa.initializeApp(config);
      state.lib={...authLib,...dbLib};
      state.auth=authLib.getAuth(fb);state.db=dbLib.getFirestore(fb);
      authLib.onAuthStateChanged(state.auth,async user=>{
        state.user=user;state.role='guest';state.error='';
        try{if(user){const ref=dbLib.doc(state.db,'users',user.uid);let snap=await dbLib.getDoc(ref);
          if(!snap.exists()){
            await dbLib.setDoc(ref,{uid:user.uid,displayName:user.displayName||'Editor',role:'pending',createdAt:dbLib.serverTimestamp()});
            snap=await dbLib.getDoc(ref);
          }
          state.profile=snap.data();state.role=state.profile.role||'pending';
        }else{state.profile=null;}
        await refreshApproved();
        await refreshQueues();
        }catch(e){state.error='Data akun belum dapat dibaca: '+e.message;}
        state.ready=true;update();
      });
    }catch(e){state.error='Sistem autentikasi belum tersedia: '+e.message;state.ready=true;update();}
  }
  async function refreshApproved(){
    if(!state.db||!state.lib)return;
    const L=state.lib;const q=L.query(L.collection(state.db,'edits'),L.where('status','==','approved'));
    try{const snap=await L.getDocs(q);app()?.applyApproved(snap.docs.map(d=>({id:d.id,...d.data()})));}catch(e){state.error='Revisi terbit belum dapat dimuat: '+e.message;}
  }
  async function refreshQueues(){
    if(!state.db||!state.lib||!state.user){state.edits=[];state.users=[];return;}
    const L=state.lib;
    try{
      if(state.role==='admin'){
        const [edits,users]=await Promise.all([L.getDocs(L.collection(state.db,'edits')),L.getDocs(L.query(L.collection(state.db,'users'),L.where('role','==','pending')))]);
        state.edits=edits.docs.map(d=>({id:d.id,...d.data()}));state.users=users.docs.map(d=>({id:d.id,...d.data()}));
      }else if(state.role==='editor'){
        const own=L.query(L.collection(state.db,'edits'),L.where('authorUid','==',state.user.uid));
        state.edits=(await L.getDocs(own)).docs.map(d=>({id:d.id,...d.data()}));state.users=[];
      }
    }catch(e){state.error='Antrean belum dapat dimuat: '+e.message;}
  }
  async function signIn(){
    if(!state.auth||!state.lib){message('Login belum diaktifkan. Pengelola perlu menghubungkan Firebase Auth dan Firestore terlebih dahulu.');return;}
    try{const provider=new state.lib.GithubAuthProvider();provider.addScope('read:user');await state.lib.signInWithPopup(state.auth,provider);}catch(e){message('Login GitHub gagal: '+e.message);}
  }
  async function signOut(){if(state.auth){await state.lib.signOut(state.auth);state.role='guest';update();}}
  function selectedPassage(){return app()?.getPassage(state.selected)||null;}
  function fillSelected(){
    const ps=app()?.getPassages()||[];
    if(!state.selected||!ps.some(p=>p.id===state.selected))state.selected=app()?.getCurrent()||ps[0]?.id||null;
    return ps;
  }
  function editorForm(){
    const all=fillSelected();const selected=selectedPassage();if(!all.length)return '<p>Data kitab sedang dimuat.</p>';
    return '<section class="editor-panel"><h2>Ajukan perbaikan teks</h2><p>Perubahan Anda tidak langsung terbit. Pemilik proyek akan meninjau setiap usulan secara terpisah. Sumber asli tetap tersimpan.</p>'
      +'<form id="editor-form" class="editor-form"><label>Pasal<select id="edit-passage" required>'+all.map(p=>'<option value="'+H(p.id)+'" '+(p.id===state.selected?'selected':'')+'>'+H(p.id)+' — '+H(p._chapterTitle)+'</option>').join('')+'</select></label>'
      +'<label>Bagian teks<select id="edit-field">'+Object.entries(fields).map(([k,v])=>'<option value="'+k+'" '+(state.field===k?'selected':'')+'>'+H(v)+'</option>').join('')+'</select></label>'
      +'<label>Teks saat ini<div id="edit-original" class="editor-compare">'+H(currentText(selected,state.field))+'</div></label>'
      +'<label>Usulan perbaikan<textarea id="edit-content" required spellcheck="false">'+H(currentText(selected,state.field))+'</textarea></label>'
      +(state.field==='ruby_paragraphs'||state.field==='editorial_annotations'?'<p>Bagian ini menggunakan data JSON terstruktur. Semua karakter, atribut pinyin, dan susunan paragraf harus dijaga. Usulan akan divalidasi sebelum dapat dikirim.</p>':'')
      +'<button type="submit" class="primary" '+(state.busy?'disabled':'')+'>Kirim untuk persetujuan</button></form></section>';
  }
  function renderRequests(){
    if(!state.users.length)return '';
    return '<section class="editor-panel"><h2>Permohonan editor · '+state.users.length+'</h2><p>Hanya pemilik dengan peran Admin dapat mengizinkan akun baru mengedit.</p>'+state.users.map(u=>'<div class="editor-entry"><strong>'+H(u.displayName||u.id)+'</strong><p><small>UID: '+H(u.uid)+'</small></p><div class="actions"><button class="primary" data-editor-approve="'+H(u.id)+'">Setujui editor</button><button class="secondary" data-editor-reject="'+H(u.id)+'">Tolak permohonan</button></div></div>').join('')+'</section>';
  }
  function renderEdits(){
    const pending=state.edits.filter(e=>e.status==='pending').sort((a,b)=>(a.createdAt?.seconds||0)-(b.createdAt?.seconds||0));
    const history=state.edits.filter(e=>e.status!=='pending').sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)).slice(0,20);
    const row=(e,review)=>{const source=app()?.getPassage(e.passageId),now=currentText(source,e.field),conflict=now!==e.baseText;
      return '<article class="editor-entry"><span class="status-tag">'+H(e.status||'pending')+'</span> <strong>'+H(e.passageId)+' · '+H(fields[e.field]||e.field)+'</strong><p><small>Oleh '+H(e.authorName||'Editor')+' · '+formatTime(e.createdAt)+'</small></p>'
      +'<div class="editor-columns"><div><strong>Teks sebelumnya</strong><div class="editor-compare">'+H(e.baseText)+'</div></div><div><strong>Teks usulan</strong><div class="editor-compare">'+H(e.proposedText)+'</div></div></div>'
      +(conflict&&review?'<p><strong>Perhatian:</strong> Naskah sudah berubah setelah usulan dibuat. Tolak usulan ini dan minta pengajuan ulang agar tidak menimpa revisi terbaru.</p>':'')
      +(review?'<div class="actions"><button class="primary" data-change-approve="'+H(e.id)+'" '+(conflict?'disabled title="Bacaan sumber sudah berubah"':'')+'>Setujui dan terbitkan</button><button class="secondary" data-change-reject="'+H(e.id)+'">Tolak usulan</button></div>':'')+'</article>';
    };
    return '<section class="editor-panel"><h2>'+(state.role==='admin'?'Antrean persetujuan':'Riwayat pengajuan')+' · '+pending.length+'</h2>'
      +(pending.length?pending.map(e=>row(e,state.role==='admin')).join(''):'<p>Tidak ada usulan yang menunggu keputusan.</p>')
      +(history.length?'<h3 style="margin-top:26px">Riwayat keputusan</h3>'+history.map(e=>row(e,false)).join(''):'')+'</section>';
  }
  function render(element){
    if(!element)return;
    element.innerHTML='<div class="chapter-title"><span class="eyebrow">Ruang kolaborasi</span><h1>Editor Ru Classics</h1><p class="muted">Pendaftaran editor dan semua perubahan teks membutuhkan persetujuan pemilik.</p></div>'
      +(state.error?'<div class="empty" role="alert">'+H(state.error)+'</div>':'')
      +(!state.ready?'<div class="editor-panel"><p>Memeriksa status autentikasi…</p></div>':'')
      +(!state.auth?'<section class="editor-panel"><h2>Login editor belum diaktifkan</h2><p>Ruang baca sudah tersedia. Sebelum login GitHub dan permohonan editor bisa digunakan, pemilik perlu mengonfigurasi Firebase Authentication, Firestore, serta aturan persetujuan pada proyek ini.</p><p>Untuk sementara, Anda dapat meminta akses melalui GitHub. Permohonan tidak otomatis memberikan hak untuk mengubah teks.</p><a class="secondary" href="https://github.com/zqxinai/kitab-ru-content/issues/new?title=Permohonan%20akses%20editor%20Ru%20Classics" target="_blank" rel="noopener noreferrer">Ajukan melalui GitHub</a></section>':'')
      +(state.auth&&!state.user?'<section class="editor-panel"><h2>Masuk sebagai editor</h2><p>Gunakan akun GitHub. Setelah masuk pertama kali, akun Anda tetap dalam status menunggu persetujuan.</p><button class="primary" data-editor-login>Masuk dengan GitHub</button></section>':'')
      +(state.auth&&state.user?'<div class="editor-tools"><span class="status-tag">'+H(state.role.toUpperCase())+'</span><span class="muted">'+H(state.user.displayName||state.user.uid)+'</span><button class="text-link" data-editor-logout>Keluar</button><button class="text-link" data-editor-refresh>Perbarui antrean</button></div>':'')
      +(state.user&&state.role==='pending'?'<section class="editor-panel"><h2>Permohonan menunggu persetujuan</h2><p>Akun Anda telah terdaftar, tetapi belum mendapat izin mengirim usulan teks. Pengelola harus menyetujui akun ini dahulu. Anda dapat kembali lagi untuk memeriksa status.</p></section>':'')
      +(state.user&&state.role==='rejected'?'<section class="editor-panel"><h2>Permohonan belum disetujui</h2><p>Akun ini tidak memiliki hak mengedit. Hubungi pengelola untuk klarifikasi.</p></section>':'')
      +(state.user&&state.role==='admin'?renderRequests():'')
      +(state.user&&['admin','editor'].includes(state.role)?editorForm()+renderEdits():'');
  }
  async function createProposal(){
    if(!['admin','editor'].includes(state.role)||state.busy)return;
    const p=selectedPassage(),newText=document.getElementById('edit-content').value,oldText=currentText(p,state.field);
    if(!p||!newText.trim()){message('Pilih pasal dan isi usulan.');return;}
    if(newText===oldText){message('Teks usulan belum berbeda dari sumber.');return;}
    if(['ruby_paragraphs','editorial_annotations'].includes(state.field)){
      try{const parsed=JSON.parse(newText);if(!Array.isArray(parsed))throw Error('Wajib array JSON');
        if(state.field==='ruby_paragraphs'&&!parsed.every(p=>Array.isArray(p)&&p.every(t=>t&&['text','ruby'].includes(t.type)&&(t.type==='text'?typeof t.value==='string':typeof t.traditional==='string'&&typeof t.pinyin==='string'))))throw Error('Struktur Ruby tidak sesuai');
      }catch(e){message('Format data struktur tidak valid: '+e.message);return;}
    }
    state.busy=true;
    try{
      await state.lib.addDoc(state.lib.collection(state.db,'edits'),{
        passageId:p.id,field:state.field,baseText:oldText,proposedText:newText,
        authorUid:state.user.uid,authorName:state.user.displayName||'Editor',
        status:'pending',createdAt:state.lib.serverTimestamp()
      });
      await refreshQueues();state.error='';app()?.toast('Usulan telah dikirim untuk ditinjau.');update();
    }catch(e){message('Gagal mengirim usulan: '+e.message);}
    finally{state.busy=false;}
  }
  async function refreshRole(){
    if(!state.user||!state.db||!state.lib)return;
    try{
      const snap=await state.lib.getDoc(state.lib.doc(state.db,'users',state.user.uid));
      state.profile=snap.exists()?snap.data():null;
      state.role=state.profile?.role||'pending';
      state.error='';
      await refreshApproved();
      await refreshQueues();
      update();
    }catch(e){message('Status akun tidak dapat diperbarui: '+e.message);}
  }
  async function decideUser(uid,approved){
    if(state.role!=='admin')return;
    if(!confirm(approved?'Setujui akun ini sebagai editor?':'Tolak permohonan akun ini?'))return;
    try{await state.lib.updateDoc(state.lib.doc(state.db,'users',uid),{role:approved?'editor':'rejected',reviewedBy:state.user.uid,reviewedAt:state.lib.serverTimestamp()});await refreshQueues();app()?.toast('Keputusan akun tersimpan.');update();}catch(e){message('Keputusan gagal: '+e.message);}
  }
  async function decideEdit(id,approved){
    if(state.role!=='admin')return;
    const entry=state.edits.find(e=>e.id===id);if(!entry||entry.status!=='pending')return;
    if(approved&&currentText(app()?.getPassage(entry.passageId),entry.field)!==entry.baseText){message('Naskah sudah berubah; usulan tidak dapat langsung diterbitkan.');return;}
    if(!confirm(approved?'Setujui perubahan ini untuk tampil pada website publik?':'Tolak usulan perubahan ini?'))return;
    try{await state.lib.updateDoc(state.lib.doc(state.db,'edits',id),{status:approved?'approved':'rejected',approvedBy:state.user.uid,reviewedAt:state.lib.serverTimestamp()});await refreshApproved();await refreshQueues();app()?.toast(approved?'Perubahan telah diterbitkan.':'Usulan ditolak.');update();}
    catch(e){message('Persetujuan gagal: '+e.message);}
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-editor-login'))signIn();
    if(b.hasAttribute('data-editor-logout'))signOut();
    if(b.hasAttribute('data-editor-refresh'))refreshRole();
    if(b.dataset.editorApprove)decideUser(b.dataset.editorApprove,true);
    if(b.dataset.editorReject)decideUser(b.dataset.editorReject,false);
    if(b.dataset.changeApprove)decideEdit(b.dataset.changeApprove,true);
    if(b.dataset.changeReject)decideEdit(b.dataset.changeReject,false);
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='edit-passage'){state.selected=e.target.value;update();}
    if(e.target.id==='edit-field'){state.field=e.target.value;update();}
  });
  document.addEventListener('submit',e=>{if(e.target.id==='editor-form'){e.preventDefault();createProposal();}});
  window.RuEditorial={render,canEdit:()=>['admin','editor'].includes(state.role),startProposal:id=>{state.selected=id;update();}};
  window.addEventListener('ru:ready',update);
  init();
})();