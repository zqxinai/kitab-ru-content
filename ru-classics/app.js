'use strict';
(() => {
  const BOOKS=[
    {id:'daxue',name:'Da Xue',hanzi:'大學',title:'Ajaran Besar',desc:'Gerbang awal pembelajaran dan kebajikan.'},
    {id:'zhongyong',name:'Zhong Yong',hanzi:'中庸',title:'Tengah Sempurna',desc:'Keseimbangan watak sejati dan Jalan Suci.'},
    {id:'lunyu',name:'Lun Yu',hanzi:'論語',title:'Sabda Suci',desc:'Ajaran dan percakapan Kongzi bersama para murid.'},
    {id:'mengzi',name:'Mengzi',hanzi:'孟子',title:'Mengzi',desc:'Percakapan mengenai kebajikan, manusia, dan pemerintahan.'}
  ];
  const main=document.getElementById('main');
  const state={tab:'home',book:null,chapter:null,id:null,data:null,chapters:[],passages:[],map:new Map(),overrides:[],saved:[],notes:{},last:null,search:'',filter:'all',theme:'paper',settings:{hanzi:true,pinyin:true,indo:true,english:true,font:32}};
  const STORE='ru_classics_web_v1';
  const H=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const book=id=>BOOKS.find(b=>b.id===id)||BOOKS[0];
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const showIndo=p=>window.RuReading?.normalize(p?.translation_indonesian||'',p?.id)||p?.translation_indonesian||'';
  const count=id=>state.passages.filter(p=>p._book===id).length;
  const byId=id=>{
    const original=state.map.get(id);if(!original)return null;
    const merged={...original};
    const relevant=state.overrides.filter(x=>x.passageId===id).sort((a,b)=>((a.reviewedAt?.seconds||0)-(b.reviewedAt?.seconds||0))||a.id.localeCompare(b.id));
    for(const change of relevant){if(['translation_indonesian','translation_english'].includes(change.field)&&typeof change.proposedText==='string')merged[change.field]=change.proposedText;
      else if(['ruby_paragraphs','editorial_annotations'].includes(change.field)){try{const data=JSON.parse(change.proposedText);if(Array.isArray(data))merged[change.field]=data;}catch(e){}}
    }
    return merged;
  };
  function toast(s){const el=document.getElementById('toast');el.textContent=s;el.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('visible'),2800);}
  function save(){try{localStorage.setItem(STORE,JSON.stringify({saved:state.saved,notes:state.notes,last:state.last,theme:state.theme,settings:state.settings}));}catch(e){toast('Penyimpanan lokal browser tidak tersedia.');}}
  function restore(){try{const v=JSON.parse(localStorage.getItem(STORE)||'{}');if(Array.isArray(v.saved))state.saved=v.saved;if(v.notes&&typeof v.notes==='object')state.notes=v.notes;if(typeof v.last==='string')state.last=v.last;if(['paper','light','dark'].includes(v.theme))state.theme=v.theme;if(v.settings)state.settings={...state.settings,...v.settings};state.settings.font=Number.isFinite(Number(state.settings.font))?Math.max(22,Math.min(50,Number(state.settings.font))):32;}catch(e){}setTheme(state.theme,false);}
  function setTheme(theme,persist=true){if(!['paper','light','dark'].includes(theme))return;state.theme=theme;document.body.dataset.theme=theme;document.querySelector('meta[name="theme-color"]').content=theme==='paper'?'#f5efe3':theme==='dark'?'#0c2025':'#edf9f7';if(persist)save();}
  function sectionTitle(title,right=''){return '<div class="section-title"><h2>'+title+'</h2>'+right+'</div>';}
  function card(b){return '<button class="book-card" data-book="'+b.id+'"><small>'+state.chapters.filter(c=>c.book===b.id).length+' BAB · '+count(b.id)+' PASAL</small><span class="book-hanzi" lang="zh-Hant">'+b.hanzi+'</span><h3>'+b.name+'</h3><p>'+b.title+'</p></button>';}
  function home(){const last=byId(state.last);
    main.innerHTML='<section class="hero"><div class="hero-body"><span class="eyebrow">儒家經典 · Perpustakaan digital</span><h1>Menemukan kebijaksanaan dalam setiap pasal.</h1><p>Bacalah kitab-kitab klasik Ru dalam tampilan yang hening dan jernih. Lengkap dengan Hanzi, pinyin, dan terjemahan untuk mendampingi pemahaman.</p><div class="actions"><button class="primary" data-action="start">Mulai membaca</button><button class="secondary" data-action="all">Jelajahi kitab</button></div></div></section>'
    +sectionTitle('Kitab Yang Empat','<button class="text-link" data-action="all">Lihat semua →</button>')
    +'<div class="book-grid">'+BOOKS.map(card).join('')+'</div>'
    +sectionTitle('Ruang baca Anda')
    +'<section class="continue"><div><span class="eyebrow">'+(last?'Lanjutkan bacaan':'Awali perjalanan')+'</span><h3>'+(last?book(last._book).name+' · '+H(last._chapterTitle):'Da Xue · Bab Utama')+'</h3><p>'+(last?'Pasal '+last.number:'Mulai dari kitab pertama.')+'</p></div><button class="primary" '+(last?'data-passage="'+H(last.id)+'"':'data-action="start"')+'>Baca sekarang</button></section><footer class="home-footer">Dibuat oleh <strong>周强信</strong> · <button class="text-link" data-action="about">Tentang Ru Classics</button></footer>';
  }
  function library(){if(!state.book){main.innerHTML='<div class="chapter-title"><span class="eyebrow">Perpustakaan</span><h1>Jelajahi kitab</h1><p class="muted">Pilih kitab, bab, lalu pasal.</p></div><div class="book-grid">'+BOOKS.map(card).join('')+'</div>';return;}
    const b=book(state.book),chapters=state.chapters.filter(c=>c.book===b.id);
    main.innerHTML='<button class="back" data-action="all">← Semua kitab</button><section class="book-hero"><span class="big-hanzi" lang="zh-Hant">'+b.hanzi+'</span><div><span class="eyebrow">Si Shu · '+chapters.length+' bab</span><h1>'+b.name+'</h1><p>'+b.desc+'</p></div></section>'+sectionTitle('Daftar bab','<small class="muted">'+count(b.id)+' pasal</small>')+'<div class="chapter-grid">'+chapters.map(c=>'<button class="chapter-card" data-chapter="'+H(c.id)+'"><span><strong>'+H(c.title)+'</strong><small>'+c.passages.length+' pasal</small></span><span class="arrow">›</span></button>').join('')+'</div>';
  }
  function chapter(){const c=state.chapters.find(c=>c.id===state.chapter);if(!c){navigate('books');return;}const b=book(c.book);
    main.innerHTML='<button class="back" data-book="'+b.id+'">← '+b.name+'</button><div class="chapter-title"><span class="eyebrow">'+b.name+' · '+b.hanzi+'</span><h1>'+H(c.title)+'</h1><p class="muted">'+c.passages.length+' pasal</p></div><div class="passage-list">'+c.passages.map((p,i)=>'<button class="result" data-passage="'+H(p.id)+'"><small>PASAL '+p.number+'</small><strong>'+H(c.title)+'</strong><span class="excerpt">'+H(showIndo(byId(p.id))||'')+'</span></button>').join('')+'</div>';
  }
  function ruby(paragraphs){if(!Array.isArray(paragraphs))return '';return paragraphs.map(par=>'<p>'+((Array.isArray(par)?par:[]).map(tok=>tok.type==='ruby'?'<ruby>'+H(tok.traditional||'')+(tok.modern&&tok.modern!==tok.traditional?'<span class="modern">('+H(tok.modern)+')</span>':'')+'<rt>'+H(tok.pinyin||'')+'</rt></ruby>':H(tok.value||'')).join(''))+'</p>').join('');}
  function annotation(p){const a=Array.isArray(p.editorial_annotations)?p.editorial_annotations:[];if(!a.length)return '<div class="rule"></div><h3>Komentar Ru</h3><p>Belum ada komentar dari sumber yang tertaut pada pasal ini.</p>';
    return '<div class="rule"></div><h3>Catatan & komentar sumber</h3>'+a.map(x=>'<div class="comment"><h4>'+H(x.title_indonesian||'Catatan teks')+'</h4>'+(x.hanzi?'<p lang="zh-Hant">'+H(x.hanzi)+'</p>':'')+(x.description_indonesian?'<p>'+H(x.description_indonesian)+'</p>':'')+(x.attribution?'<small>'+H(x.attribution)+'</small>':'')+'</div>').join('');
  }
  function reader(){const p=byId(state.id);if(!p){navigate('books');return;}state.last=p.id;save();const c=state.chapters.find(c=>c.id===p._chapter);const b=book(p._book);const pos=state.passages.findIndex(x=>x.id===p.id);const prev=state.passages[pos-1],next=state.passages[pos+1];const s=state.settings;
    main.innerHTML='<div class="breadcrumb"><button data-action="all">Kitab</button> › <button data-book="'+b.id+'">'+b.name+'</button> › <button data-chapter="'+H(c.id)+'">'+H(c.title)+'</button></div>'
    +'<div class="reader-heading"><div><span class="eyebrow">Si Shu · '+b.hanzi+'</span><h1>'+H(c.title)+'</h1><p>Pasal '+p.number+'</p></div><div class="chips">'+[['hanzi','Hanzi'],['pinyin','Pinyin'],['indo','Indonesia'],['english','English']].map(([key,text])=>'<button class="chip '+(s[key]?'on':'')+'" data-toggle="'+key+'" aria-pressed="'+s[key]+'">'+text+'</button>').join('')+'</div></div>'
    +'<div class="reader-grid"><article class="paper-page"><div class="passage-top"><span>PASAL '+p.number+'</span><button class="save-btn" data-action="bookmark" aria-pressed="'+state.saved.includes(p.id)+'">'+(state.saved.includes(p.id)?'♥ Tersimpan':'♡ Simpan')+'</button></div>'
    +(s.hanzi?'<div class="hanzi-text '+(s.pinyin?'':'no-pinyin')+'" style="--hanzi-size:'+s.font+'px" lang="zh-Hant">'+ruby(p.ruby_paragraphs)+'</div>':'')
    +(s.indo?'<section class="translation"><h3>Bahasa Indonesia · MATAKIN</h3><p>'+H(showIndo(p)||'Belum tersedia')+'</p></section>':'')
    +(s.english&&p.translation_english?'<section class="translation english"><h3>English · James Legge</h3><p lang="en">'+H(p.translation_english)+'</p></section>':'')
    +'</article><aside class="reader-aside"><h3>Catatan pribadi</h3><p>Catatan ini disimpan hanya di browser perangkat Anda.</p><textarea id="personal-note" aria-label="Catatan pribadi" placeholder="Tuliskan pemikiran Anda…">'+H(state.notes[p.id]||'')+'</textarea><button class="primary" data-action="save-note">Simpan catatan</button>'
    +annotation(p)+(window.RuEditorial?.canEdit?.()?'<div class="rule"></div><button class="secondary" data-action="propose" style="width:100%">Usulkan revisi teks</button>':'')
    +'</aside></div><div class="reader-nav"><button '+(prev?'data-passage="'+H(prev.id)+'"':'disabled')+'>← Pasal sebelumnya</button><button '+(next?'data-passage="'+H(next.id)+'"':'disabled')+'>Pasal berikutnya →</button></div>';
  }
  function renderSearchResults(){const box=document.getElementById('search-results');if(!box)return;const term=norm(state.search.trim());const candidates=state.passages.filter(p=>state.filter==='all'||p._book===state.filter);
    if(!term){box.innerHTML='<p class="muted">Ketik kata kunci untuk mencari dalam teks Hanzi, pinyin, atau terjemahan.</p>';return;}
    const matches=candidates.filter(p=>{const x=byId(p.id);const hanzi=(x.ruby_paragraphs||[]).flat().map(t=>t.traditional||t.value||'').join('');const pinyin=(x.ruby_paragraphs||[]).flat().map(t=>t.pinyin||'').join(' ');return norm([hanzi,pinyin,x.translation_indonesian,showIndo(x),x.translation_english].join(' ')).includes(term);});
    box.innerHTML='<p class="muted">'+matches.length+' pasal ditemukan'+(matches.length>60?' · menampilkan 60 pertama':'')+'</p><div class="results">'+matches.slice(0,60).map(p=>'<button class="result" data-passage="'+H(p.id)+'"><small>'+book(p._book).name+' · Pasal '+p.number+'</small><strong>'+H(p._chapterTitle)+'</strong><span class="excerpt">'+H(showIndo(byId(p.id))||'')+'</span></button>').join('')+'</div>';
  }
  function search(){main.innerHTML='<div class="chapter-title"><span class="eyebrow">Pencarian</span><h1>Temukan sebuah ayat</h1><p class="muted">Cari di seluruh '+state.passages.length+' pasal Si Shu.</p></div><label class="searchbox"><span aria-hidden="true">⌕</span><input id="search-input" type="search" autocomplete="off" placeholder="Ketik Hanzi, pinyin, atau terjemahan…" value="'+H(state.search)+'"></label><div class="search-filters"><select id="search-book" aria-label="Filter kitab"><option value="all">Semua kitab</option>'+BOOKS.map(b=>'<option value="'+b.id+'" '+(state.filter===b.id?'selected':'')+'>'+b.name+'</option>').join('')+'</select></div><div id="search-results"></div>';renderSearchResults();}
  function saved(){const bookmarked=state.saved.map(byId).filter(Boolean);const notes=Object.keys(state.notes).filter(k=>state.notes[k]).length;
    main.innerHTML='<div class="chapter-title"><span class="eyebrow">Koleksi pribadi</span><h1>Pasal tersimpan</h1><p class="muted">'+bookmarked.length+' pasal disimpan · '+notes+' catatan pribadi</p></div>'+(bookmarked.length?'<div class="passage-list">'+bookmarked.map(p=>'<button class="result" data-passage="'+H(p.id)+'"><small>'+book(p._book).name+' · Pasal '+p.number+'</small><strong>'+H(p._chapterTitle)+'</strong><span class="excerpt">'+H(showIndo(p))+'</span></button>').join('')+'</div>':'<div class="empty">Belum ada pasal tersimpan. Gunakan tombol ♡ Simpan di halaman bacaan.</div>');
  }
  function navHighlight(){document.querySelectorAll('[data-nav]').forEach(btn=>{const active=btn.dataset.nav===(state.tab==='reader'||state.tab==='chapter'?'books':state.tab);btn.classList.toggle('active',active);if(active)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');});}
  function render(){navHighlight();if(!state.data)return;if(state.tab==='home')home();else if(state.tab==='books')library();else if(state.tab==='chapter')chapter();else if(state.tab==='reader')reader();else if(state.tab==='search')search();else if(state.tab==='saved')saved();else if(state.tab==='editor')window.RuEditorial?.render?.(main);window.scrollTo({top:0,behavior:'instant'});}
  function navigate(tab,identity=null){state.tab=tab;if(tab==='books'&&identity!==null)state.book=identity;if(tab==='chapter')state.chapter=identity;if(tab==='reader')state.id=identity;location.hash=tab==='reader'?'read='+encodeURIComponent(identity):tab==='chapter'?'chapter='+encodeURIComponent(identity):tab==='books'&&state.book?'book='+state.book:tab;render();}
  function route(){if(!state.data)return;const raw=decodeURIComponent(location.hash.replace(/^#/,''));if(raw.startsWith('read=')){const id=raw.substring(5);if(state.map.has(id)){state.id=id;state.tab='reader';}}else if(raw.startsWith('chapter=')){state.chapter=raw.substring(8);state.tab='chapter';}else if(raw.startsWith('book=')){state.book=raw.substring(5);state.tab='books';}else if(['home','books','search','saved','editor'].includes(raw)){state.tab=raw;if(raw==='books')state.book=null;}render();}
  function parseBundle(data){if(data.schema!=='ru-classics.content.v1'||data.collection!=='sishu'||!Array.isArray(data.chapters))throw Error('Format paket kitab tidak sesuai');const chap=data.chapters;const pass=[];const ids=new Set();for(const c of chap){for(const p of (c.passages||[])){if(ids.has(p.id))throw Error('ID pasal ganda');ids.add(p.id);p._book=c.book;p._chapter=c.id;p._chapterTitle=c.title;pass.push(p);}}
    if(chap.length!==78||pass.length!==965)throw Error('Data Si Shu belum lengkap ('+chap.length+' bab, '+pass.length+' pasal).');
    state.data=data;state.chapters=chap;state.passages=pass;state.map=new Map(pass.map(p=>[p.id,p]));
  }
  async function boot(){restore();try{let response=await fetch('./data/sishu.json');if(!response.ok)throw Error('Data belum tersedia pada hasil publikasi');parseBundle(await response.json());route();window.dispatchEvent(new Event('ru:ready'));}catch(e){main.innerHTML='<div class="empty"><h2>Perpustakaan belum bisa dibuka</h2><p>'+H(e.message)+'</p><p>Periksa hasil build GitHub Pages atau coba lagi setelah publikasi selesai.</p><button class="secondary" onclick="location.reload()">Coba lagi</button></div>';}}
  document.addEventListener('click',e=>{
    const t=e.target.closest('button');if(!t)return;
    if(t.dataset.nav){if(t.dataset.nav==='books')state.book=null;navigate(t.dataset.nav);return;}
    if(t.dataset.book){state.book=t.dataset.book;navigate('books',t.dataset.book);return;}
    if(t.dataset.chapter){navigate('chapter',t.dataset.chapter);return;}
    if(t.dataset.passage){navigate('reader',t.dataset.passage);return;}
    if(t.dataset.toggle){state.settings[t.dataset.toggle]=!state.settings[t.dataset.toggle];save();render();return;}
    if(t.dataset.action){
      const a=t.dataset.action;
      if(a==='home')navigate('home');if(a==='all'){state.book=null;navigate('books');}
      if(a==='start')navigate('reader',state.last&&state.map.has(state.last)?state.last:state.passages[0]?.id);
      if(a==='theme'){const arr=['paper','light','dark'];setTheme(arr[(arr.indexOf(state.theme)+1)%arr.length]);render();}
      if(a==='settings'){fillSettings();document.getElementById('settings-dialog').showModal();}
      if(a==='about')document.getElementById('about-dialog').showModal();
      if(a==='smaller'||a==='larger'){state.settings.font=Math.max(22,Math.min(50,state.settings.font+(a==='larger'?2:-2)));save();fillSettings();if(state.tab==='reader')render();}
      if(a==='bookmark'&&state.id){const i=state.saved.indexOf(state.id);if(i===-1)state.saved.push(state.id);else state.saved.splice(i,1);save();render();toast(i===-1?'Pasal disimpan':'Pasal dihapus dari koleksi');}
      if(a==='save-note'&&state.id){state.notes[state.id]=document.getElementById('personal-note').value;save();toast('Catatan disimpan pada perangkat ini.');}
      if(a==='editor'){navigate('editor');}
      if(a==='propose'){navigate('editor');window.RuEditorial?.startProposal?.(state.id);}
    }
  });
  document.addEventListener('input',e=>{if(e.target.id==='search-input'){state.search=e.target.value;renderSearchResults();}});
  document.addEventListener('change',e=>{if(e.target.id==='search-book'){state.filter=e.target.value;renderSearchResults();}if(e.target.dataset.setting){state.settings[e.target.dataset.setting]=e.target.checked;save();if(state.tab==='reader')render();}});
  document.addEventListener('click',e=>{const t=e.target.closest('[data-theme-value]');if(t){setTheme(t.dataset.themeValue);fillSettings();render();}});
  function fillSettings(){document.getElementById('theme-options').innerHTML=[['paper','Paper'],['light','Light'],['dark','Dark']].map(([k,label])=>'<button class="'+(state.theme===k?'active':'')+'" data-theme-value="'+k+'">'+label+'</button>').join('');
    document.getElementById('reading-options').innerHTML=[['hanzi','Hanzi'],['pinyin','Pinyin Ruby'],['indo','Indonesia'],['english','English']].map(([k,label])=>'<label class="toggle-row">'+label+'<input type="checkbox" data-setting="'+k+'" '+(state.settings[k]?'checked':'')+'></label>').join('');document.getElementById('font-label').textContent=state.settings.font+' px';}
  window.RuApp={navigate,render,toast,getPassage:byId,getOriginal:id=>state.map.get(id),getPassages:()=>state.passages,getCurrent:()=>state.id,applyApproved:items=>{state.overrides=Array.isArray(items)?items:[];if(state.data&&state.tab!=='editor')render();}};
  window.addEventListener('hashchange',route);
  boot();
})();