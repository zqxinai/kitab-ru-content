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
  const state={ready:false,user:null,role:'guest',profile:null,db:null,auth:null,lib:null,edits:[],users:[],selected:null,book:null,chapter:null,verse:0,field:'translation_indonesian',auditStatus:new Map(),busy:false,error:''};
  const app=()=>window.RuApp;
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
        try{
          if(user){
            // A cached GitHub/password session must never inherit editor rights.
            const token=await user.getIdTokenResult();
            if(token.claims.firebase?.sign_in_provider!=='google.com'||!user.emailVerified||!user.email){
              await authLib.signOut(state.auth);
              state.ready=true;
              message('Akses editor hanya melalui Google dengan email terverifikasi. Silakan masuk kembali.');
              return;
            }
            const ref=dbLib.doc(state.db,'users',user.uid);let snap=await dbLib.getDoc(ref);
          if(!snap.exists()){
            await dbLib.setDoc(ref,{uid:user.uid,displayName:user.displayName||'Editor',
              email:user.email,role:'pending',createdAt:dbLib.serverTimestamp()});
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
    try{
      const provider=new state.lib.GoogleAuthProvider();
      provider.setCustomParameters({prompt:'select_account'});
      await state.lib.signInWithPopup(state.auth,provider);
    }catch(e){
      if(e.code==='auth/popup-closed-by-user')return;
      if(e.code==='auth/popup-blocked'){
        message('Jendela login Google diblokir browser. Izinkan pop-up untuk website Ru Classics, lalu coba lagi.');
      }else if(e.code==='auth/account-exists-with-different-credential'){
        message('Email ini terhubung ke metode login lain. Hubungi admin untuk migrasi akun; hak editor tidak dipindahkan otomatis.');
      }else message('Login Google gagal: '+e.message);
    }
  }
  async function signOut(){if(state.auth){await state.lib.signOut(state.auth);state.role='guest';update();}}
  function selectedPassage(){return app()?.getPassage(state.selected)||null;}
  function fillSelected(){
    const ps=app()?.getPassages()||[];
    if(!ps.length)return ps;
    if(!state.selected||!ps.some(p=>p.id===state.selected))
      state.selected=ps.some(p=>p.id===app()?.getCurrent())?app().getCurrent():ps[0].id;
    const chosen=ps.find(p=>p.id===state.selected);
    state.book=chosen._book;state.chapter=chosen._chapter;
    return ps;
  }
  const BOOK_NAMES={daxue:'Da Xue · Ajaran Besar',zhongyong:'Zhong Yong · Tengah Sempurna',lunyu:'Lun Yu · Sabda Suci',mengzi:'Mengzi · Bingcu'};
  function editorForm(){
    const all=fillSelected(),p=selectedPassage();
    if(!all.length||!p)return '<p>Data kitab sedang dimuat.</p>';
    const books=[...new Set(all.map(x=>x._book))];
    const chapterIds=[...new Set(all.filter(x=>x._book===state.book).map(x=>x._chapter))];
    const chapterPassages=all.filter(x=>x._chapter===state.chapter);
    const verses=globalThis.RuSubverses?.editable(p.translation_indonesian)||null;
    const canSelectVerse=state.field==='translation_indonesian'&&verses?.length>1;
    const chosen=canSelectVerse?verses.find(x=>x.number===state.verse):null;
    if(!chosen)state.verse=0;
    const current=chosen?chosen.text:currentText(p,state.field);
    return '<section class="editor-panel"><h2>Ajukan perbaikan teks</h2><p>Pilih kitab, bab, pasal, lalu ayat. Ayat yang diubah akan dipasang kembali ke pasal lengkap tanpa mengubah ayat lain, dan semua usulan tetap menunggu persetujuan admin.</p>'+
      '<form id="editor-form" class="editor-form"><div class="editor-filters">'+
      '<label>Kitab<select id="edit-book">'+books.map(id=>'<option value="'+H(id)+'" '+(id===state.book?'selected':'')+'>'+H(BOOK_NAMES[id]||id)+'</option>').join('')+'</select></label>'+
      '<label>Bab<select id="edit-chapter">'+chapterIds.map(id=>{const x=all.find(p=>p._chapter===id);return '<option value="'+H(id)+'" '+(id===state.chapter?'selected':'')+'>'+H(x?._chapterTitle||id)+'</option>';}).join('')+'</select></label>'+
      '<label>Pasal<select id="edit-passage">'+chapterPassages.map(x=>'<option value="'+H(x.id)+'" '+(x.id===state.selected?'selected':'')+'>Pasal '+H(x.number)+'</option>').join('')+'</select></label>'+
      '<label>Ayat<select id="edit-ayat" '+(!canSelectVerse?'disabled':'')+'><option value="0">Seluruh pasal</option>'+
      (canSelectVerse?verses.map(x=>'<option value="'+x.number+'" '+(x.number===state.verse?'selected':'')+'>Ayat '+x.number+'</option>').join(''):'')+
      '</select></label></div>'+
      (!canSelectVerse?'<p>Belum ada penanda ayat berurutan yang dapat dipastikan; penyuntingan tetap pada tingkat pasal.</p>':'')+
      '<label>Bagian teks<select id="edit-field">'+Object.entries(fields).map(([k,v])=>'<option value="'+k+'" '+(state.field===k?'selected':'')+'>'+H(v)+'</option>').join('')+'</select></label>'+
      '<label>Teks saat ini'+(chosen?' · Ayat '+chosen.number:'')+'<div id="edit-original" class="editor-compare">'+H(current)+'</div></label>'+
      '<label>Usulan perbaikan<textarea id="edit-content" required spellcheck="false">'+H(current)+'</textarea></label>'+
      (chosen?'<p>Hanya Ayat '+chosen.number+' yang disunting. Batas Hanzi, pinyin, dan Inggris tidak diasumsikan sejajar dengan ayat ini.</p>':'')+
      (state.field==='ruby_paragraphs'||state.field==='editorial_annotations'?'<p>Format JSON terstruktur wajib dipertahankan dan divalidasi sebelum pengiriman.</p>':'')+
      '<button type="submit" class="primary" '+(state.busy?'disabled':'')+'>Kirim untuk persetujuan</button></form></section>';
  }
  function sourceHanzi(p){
    return (p?.ruby_paragraphs||[]).flat().map(t=>t.type==='ruby'?t.traditional||'':t.value||'').join('');
  }
  function sourceRuby(paragraphs){
    return (Array.isArray(paragraphs)?paragraphs:[]).map(tokens=>
      '<p>'+((Array.isArray(tokens)?tokens:[]).map(t=>t.type==='ruby'?
        '<ruby>'+H(t.traditional||'')+'<rt>'+H(t.pinyin||'')+'</rt></ruby>':H(t.value||'')).join(''))+'</p>'
    ).join('');
  }
  function editorialStatus(p){
    const r=state.auditStatus.get(p.id)||{};
    const source=app()?.getOriginal(p.id);
    const traced=typeof r.reviewed_by==='string'&&!!r.reviewed_by.trim()&&
      typeof r.reviewed_at==='string'&&!!r.reviewed_at.trim()&&
      Number.isInteger(r.source_issue)&&r.source_issue>0&&
      r.hanzi_span===sourceHanzi(source);
    return {
      indonesian:!!(traced&&r.indonesian==='final'&&r.indonesian_text===source?.translation_indonesian),
      english:!!(traced&&r.english==='final'&&r.english_text===source?.translation_english)
    };
  }
  async function loadAuditStatus(){
    try{
      const response=await fetch('../dist/sishu-review-status.json',{cache:'no-store'});
      if(!response.ok)return;
      const data=await response.json();
      if(data?.schema!=='kitab-ru.review-status.v1'||!Array.isArray(data.entries))return;
      state.auditStatus=new Map(data.entries.filter(x=>typeof x.passage_id==='string').map(x=>[x.passage_id,x]));
      update();
    }catch(_){/* A missing registry can never imply Final. */}
  }
  function auditPanel(){
    const all=fillSelected(),p=selectedPassage();
    if(!p)return '';
    const original=app()?.getOriginal(p.id)||p;
    const verses=globalThis.RuSubverses?.editable(p.translation_indonesian);
    const selected=state.field==='translation_indonesian'?verses?.find(x=>x.number===state.verse):null;
    const originalVerse=selected?globalThis.RuSubverses?.editable(original.translation_indonesian)?.find(x=>x.number===selected.number):null;
    const aligned=selected?globalThis.RuSubverses?.align(original)?.find(x=>x.number===selected.number):null;
    const status=editorialStatus(p);
    const pStatus=state.edits.filter(e=>e.passageId===p.id&&e.status==='pending').length;
    const annot=Array.isArray(original.editorial_annotations)?original.editorial_annotations:[];
    const sourceInfo=H(original.translation_english_source||original.english_source||'Keterangan sumber per pasal belum tersedia');
    return '<section class="editor-panel audit-panel"><h2>Dashboard audit Si Shu</h2>'+
      '<p>'+all.length+' pasal dalam 78 bab · '+state.auditStatus.size+' entri register status editorial · '+pStatus+' usulan Firebase menunggu review pada pasal ini.</p>'+
      '<p><strong>'+H(BOOK_NAMES[p._book]||p._book)+' · '+H(p._chapterTitle)+' · Pasal '+H(p.number)+
      (selected?' · Ayat '+selected.number:'')+'</strong></p>'+
      '<p>Audit naskah: Indonesia <strong>'+(status.indonesian?'Final terverifikasi':'Perlu review')+
      '</strong> · Inggris <strong>'+(status.english?'Final terverifikasi':'Perlu review')+'</strong>. '+
      'Status persetujuan website terpisah dan tidak otomatis mengesahkan teks MATAKIN.</p>'+
      '<div class="audit-columns">'+
      '<div><strong>Hanzi & pinyin'+(selected&&!aligned?' (tingkat pasal; batas ayat belum terverifikasi)':'')+'</strong>'+
      '<div class="audit-ruby" lang="zh-Hant">'+sourceRuby(aligned?[aligned.ruby_tokens]:original.ruby_paragraphs)+'</div></div>'+
      '<div><strong>Terjemahan Indonesia · MATAKIN (sumber asli)</strong><div class="editor-compare">'+H(originalVerse?originalVerse.text:original.translation_indonesian)+'</div>'+      (p.translation_indonesian!==original.translation_indonesian?'<strong>Overlay website yang disetujui (bukan sumber MATAKIN)</strong><div class="editor-compare">'+H(selected?selected.text:p.translation_indonesian)+'</div>':'')+'</div>'+
      '<div><strong>English · James Legge (tingkat pasal, sumber asli)</strong><div class="editor-compare">'+H(original.translation_english||'Belum tersedia')+'</div>'+
      '<small>'+sourceInfo+'</small></div>'+
      '<div><strong>Komentar sumber · terpisah</strong><div class="editor-compare">'+
      (annot.length?annot.map(a=>'<p><strong>'+H(a.title_indonesian||'Catatan')+'</strong> '+H(a.description_indonesian||'')+
        (a.attribution?' <small>— '+H(a.attribution)+'</small>':'')+'</p>').join(''):'Belum tersedia')+
      '</div></div></div>'+
      '<p><a class="text-link" href="../editor/">Lihat arsip dashboard audit lama</a> · Usulan baru gunakan Firebase di bawah ini.</p>'+
      '</section>';
  }
  function renderRequests(){
    if(!state.users.length)return '';
    return '<section class="editor-panel"><h2>Permohonan editor · '+state.users.length+'</h2><p>Hanya pemilik dengan peran Admin dapat mengizinkan akun baru mengedit.</p>'+state.users.map(u=>'<div class="editor-entry"><strong>'+H(u.displayName||u.id)+'</strong><p><small>Email Google: '+H(u.email||'Tidak tersedia')+'</small></p><p><small>UID: '+H(u.uid)+'</small></p><div class="actions"><button class="primary" data-editor-approve="'+H(u.id)+'">Setujui editor</button><button class="secondary" data-editor-reject="'+H(u.id)+'">Tolak permohonan</button></div></div>').join('')+'</section>';
  }
  function renderEdits(){
    const pending=state.edits.filter(e=>e.status==='pending').sort((a,b)=>(a.createdAt?.seconds||0)-(b.createdAt?.seconds||0));
    const history=state.edits.filter(e=>e.status!=='pending').sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)).slice(0,20);
    const row=(e,review)=>{const source=app()?.getPassage(e.passageId),now=currentText(source,e.field),conflict=now!==e.baseText;
      return '<article class="editor-entry"><span class="status-tag">'+H(e.status||'pending')+'</span> <strong>'+H(e.passageId)+' · '+H(fields[e.field]||e.field)+(e.field==='translation_indonesian'&&globalThis.RuSubverses?.changedVerse(e.baseText,e.proposedText)?' · Ayat '+globalThis.RuSubverses.changedVerse(e.baseText,e.proposedText):'')+'</strong><p><small>Oleh '+H(e.authorName||'Editor')+' · '+formatTime(e.createdAt)+'</small></p>'
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
    element.innerHTML='<div class="chapter-title"><span class="eyebrow">Audit dan kolaborasi</span><h1>Ruang Editor Ru Classics</h1><p class="muted">Pendaftaran editor dan semua perubahan teks membutuhkan persetujuan pemilik.</p></div>'
      +(state.error?'<div class="empty" role="alert">'+H(state.error)+'</div>':'')
      +(!state.ready?'<div class="editor-panel"><p>Memeriksa status autentikasi…</p></div>':'')
      +(!state.auth?'<section class="editor-panel"><h2>Login editor belum diaktifkan</h2><p>Ruang baca sudah tersedia. Untuk masuk dengan Google, pemilik perlu mengaktifkan Google Sign-In pada Firebase Authentication, mengonfigurasi Firestore dan menerbitkan aturan akses aman. Akun yang baru masuk belum bisa mengedit sampai disetujui admin.</p><button type="button" class="secondary" disabled aria-disabled="true">Masuk dengan Google — belum aktif</button></section>':'')
      +(state.auth&&!state.user?'<section class="editor-panel"><h2>Masuk sebagai editor</h2><p>Gunakan akun Google Anda. Masuk pertama kali hanya mengirim permohonan editor; admin harus menyetujui sebelum Anda dapat mengusulkan perubahan.</p><button class="primary" data-editor-login>Masuk dengan Google</button></section>':'')
      +(state.auth&&state.user?'<div class="editor-tools"><span class="status-tag">'+H(state.role.toUpperCase())+'</span><span class="muted">'+H(state.user.displayName||state.user.uid)+'</span><button class="text-link" data-editor-logout>Keluar</button><button class="text-link" data-editor-refresh>Perbarui antrean</button></div>':'')
      +(state.user&&state.role==='pending'?'<section class="editor-panel"><h2>Permohonan menunggu persetujuan</h2><p>Akun Anda telah terdaftar, tetapi belum mendapat izin mengirim usulan teks. Pengelola harus menyetujui akun ini dahulu. Anda dapat kembali lagi untuk memeriksa status.</p></section>':'')
      +(state.user&&state.role==='rejected'?'<section class="editor-panel"><h2>Permohonan belum disetujui</h2><p>Akun ini tidak memiliki hak mengedit. Hubungi pengelola untuk klarifikasi.</p></section>':'')
      +(state.user&&state.role==='admin'?renderRequests():'')
      +(state.user&&['admin','editor'].includes(state.role)?auditPanel()+editorForm()+renderEdits():'');
  }
  async function createProposal(){
    if(!['admin','editor'].includes(state.role)||state.busy)return;
    const p=selectedPassage(),entryText=document.getElementById('edit-content').value,oldText=currentText(p,state.field);
    const newText=state.verse&&state.field==='translation_indonesian'?
      globalThis.RuSubverses?.replaceVerse(oldText,state.verse,entryText):entryText;
    if(newText==null){message('Usulan ayat tidak valid atau penanda ayat berubah; naskah tidak diubah.');return;}
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
    if(e.target.id==='edit-book'){
      const next=app()?.getPassages().find(p=>p._book===e.target.value);
      if(next){state.selected=next.id;state.verse=0;update();}
    }
    if(e.target.id==='edit-chapter'){
      const next=app()?.getPassages().find(p=>p._chapter===e.target.value);
      if(next){state.selected=next.id;state.verse=0;update();}
    }
    if(e.target.id==='edit-passage'){state.selected=e.target.value;state.verse=0;update();}
    if(e.target.id==='edit-ayat'){state.verse=Number(e.target.value)||0;update();}
    if(e.target.id==='edit-field'){state.field=e.target.value;state.verse=0;update();}
  });
  document.addEventListener('submit',e=>{if(e.target.id==='editor-form'){e.preventDefault();createProposal();}});
  window.RuEditorial={render,canEdit:()=>['admin','editor'].includes(state.role),startProposal:(id,verse=0)=>{state.selected=id;state.field='translation_indonesian';state.verse=Number(verse)||0;update();}};
  window.addEventListener('ru:ready',update);
  init();
  loadAuditStatus();
})();