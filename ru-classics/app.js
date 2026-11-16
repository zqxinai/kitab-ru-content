'use strict';
(() => {
  const BOOKS=[
    {id:'daxue',name:'Da Xue',hanzi:'大學',title:'Ajaran Besar',desc:'Gerbang awal pembelajaran dan kebajikan.'},
    {id:'zhongyong',name:'Zhong Yong',hanzi:'中庸',title:'Tengah Sempurna',desc:'Keseimbangan watak sejati dan Jalan Suci.'},
    {id:'lunyu',name:'Lun Yu',hanzi:'論語',title:'Sabda Suci',desc:'Ajaran dan percakapan Kongzi bersama para murid.'},
    {id:'mengzi',name:'Mengzi',hanzi:'孟子',title:'Mengzi',desc:'Percakapan mengenai kebajikan, manusia, dan pemerintahan.'}
  ];
  const main=document.getElementById('main');
  const state={tab:'home',book:null,chapter:null,id:null,ayat:0,data:null,chapters:[],passages:[],map:new Map(),overrides:[],saved:[],notes:{},expandedChapters:{},last:null,search:'',filter:'all',theme:'paper',uiLanguage:'id',settings:{hanzi:true,pinyin:true,indo:true,english:true,hanziSize:32,pinyinSize:14,latinSize:17}};
  const LOCALES={
    id:{
      settings:'Pengaturan',settingsSubtitle:'Atur tampilan dan bahasa sesuai kenyamanan membaca.',close:'Tutup dialog',
      uiLanguage:'Bahasa antarmuka',uiLanguageHint:'Bahasa menu (bukan bahasa terjemahan kitab)',
      theme:'Tema',readingLanguages:'Bahasa dan aksara bacaan',readingHint:'Pilih bagian yang tampil tanpa mengubah naskah sumber.',
      fontSizes:'Ukuran teks',fontSizeHint:'Atur Hanzi, Pinyin Ruby, dan teks Latin secara terpisah.',
      hanziSize:'Hanzi',pinyinSize:'Pinyin Ruby',latinSize:'Teks Latin (ID/EN)',resetFonts:'Kembalikan ukuran awal',
      information:'Informasi',about:'Tentang Ru Classics',privacy:'Kebijakan Privasi',appVersion:'Versi aplikasi',
      aboutDescription:'Perpustakaan digital klasik Ru, dimulai dari Si Shu (四書) — Da Xue, Zhong Yong, Lun Yu, dan Mengzi. Pembaca dapat menjelajahi teks Hanzi, pinyin, terjemahan Indonesia, dan padanan Inggris.',
      aboutSources:'Terjemahan Indonesia mengacu pada edisi Si Shu MATAKIN. Komentar sumber ditampilkan terpisah dari teks utama.',
      createdBy:'Dibuat oleh',versionAndEditorial:'Versi dan status editorial',
      editorialStatus:'Teks masih melalui pemeriksaan editorial. Perubahan editor harus disetujui sebelum diterbitkan. Hak atas terjemahan dan anotasi tetap milik pemegang hak masing-masing.',
      privacyIntro:'Ru Classics adalah perpustakaan digital yang dapat dibaca tanpa akun. Fitur pembaca dan editor memiliki cara penyimpanan yang berbeda.',
      privacyLocalTitle:'Data pada perangkat',privacyLocal:'Pilihan tema, bahasa, ukuran huruf, penanda bacaan, dan catatan pribadi disimpan dalam penyimpanan lokal browser perangkat ini. Data tersebut bisa hilang jika penyimpanan browser dihapus dan tidak otomatis tersinkron antarperangkat.',
      privacyEditorTitle:'Akun dan ruang editor',privacyEditor:'Jika Anda masuk sebagai editor menggunakan Google, layanan Firebase Authentication dapat memproses data akun dan Firestore menyimpan informasi pengajuan serta persetujuan perubahan sesuai konfigurasi layanan. Membaca kitab tidak memerlukan login.',
      privacyHostingTitle:'Hosting dan layanan pihak ketiga',privacyHosting:'Situs dihosting melalui GitHub Pages. GitHub, Google, dan penyedia jaringan dapat memproses data teknis sesuai kebijakan layanan masing-masing. Jangan menulis informasi sensitif pada pengajuan editorial.',
      privacyDate:'Pembaruan kebijakan: 16 November 2026.',
      navHome:'Beranda',navBooks:'Kitab',navSearch:'Cari',navSaved:'Koleksi',navEditor:'Ruang Editor',
      chooseBook:'Pilih kitab',backToBooks:'Semua kitab',backToChapters:'Semua bab',changeBook:'Ganti kitab',
      passage:'Pasal',verse:'Ayat',chooseVerse:'Pilih ayat',wholePassage:'Seluruh pasal',read:'Baca sekarang',
      translation:'Terjemahan',notes:'Catatan & komentar',personalNotes:'Catatan pribadi',saveNote:'Simpan catatan',
      savePassage:'Simpan pasal',removePassage:'Hapus dari koleksi',nextPassage:'Pasal berikutnya',prevPassage:'Pasal sebelumnya',
      language:'Bahasa',hanzi:'汉字 · Hanzi',pinyin:'Pinyin',indo:'ID · Indonesia',english:'EN · English',
      translationId:'Terjemahan Indonesia (MATAKIN)',translationEn:'English · James Legge',
      readingLibrary:'Perpustakaan',exploreBooks:'Jelajahi kitab',chooseBookChapter:'Pilih kitab, bab, lalu pasal.',
      featuredBooks:'Kitab Yang Empat',seeAll:'Lihat semua →',readingSpace:'Ruang baca Anda',
      backToReading:'Lanjutkan bacaan',startJourney:'Awali perjalanan',beginFirst:'Mulai dari kitab pertama.',
      heroTitle:'Menemukan kebijaksanaan dalam setiap pasal.',
      heroDesc:'Bacalah kitab-kitab klasik Ru dengan Hanzi, pinyin, dan terjemahan untuk mendampingi pemahaman.',
      startReading:'Mulai membaca',explore:'Jelajahi kitab',chapter:'Bab',searchTitle:'Temukan sebuah ayat',
      searchPrompt:'Cari di seluruh koleksi Si Shu.',searchPlaceholder:'Ketik Hanzi, pinyin, atau terjemahan…',
      savedTitle:'Pasal tersimpan',savedPrompt:'Koleksi pribadi',noSaved:'Belum ada pasal tersimpan. Gunakan tombol Simpan di halaman bacaan.',
      notesLocal:'Catatan ini disimpan hanya di browser perangkat Anda.',notePlaceholder:'Tuliskan pemikiran Anda…',
      noComment:'Belum ada komentar dari sumber yang tertaut pada pasal ini.',atLeastOneText:'Aktifkan sedikitnya Hanzi, Indonesia, atau Inggris.',
      noteSaved:'Catatan disimpan pada perangkat ini.',saveBookmark:'Pasal disimpan',removeBookmark:'Pasal dihapus dari koleksi',
      textSourceNote:'Nomor ayat mengikuti MATAKIN. Teks Inggris ditampilkan untuk seluruh pasal; pembagian ayat James Legge belum diselaraskan.',
      readerTools:'Alat baca'
    },
    en:{
      settings:'Settings',settingsSubtitle:'Customize the appearance and reading languages.',close:'Close dialog',
      uiLanguage:'Interface language',uiLanguageHint:'Language of menus (not the translations of the classics)',
      theme:'Theme',readingLanguages:'Reading languages and scripts',readingHint:'Choose which text to display without changing the original sources.',
      fontSizes:'Text sizes',fontSizeHint:'Adjust Hanzi, Ruby Pinyin, and Latin text independently.',
      hanziSize:'Hanzi',pinyinSize:'Ruby Pinyin',latinSize:'Latin text (ID/EN)',resetFonts:'Restore default sizes',
      information:'Information',about:'About Ru Classics',privacy:'Privacy Policy',appVersion:'App version',
      aboutDescription:'A digital library of Ru classics, starting with the Four Books (四書): Da Xue, Zhong Yong, Lun Yu, and Mengzi. Read traditional Hanzi, Pinyin, the Indonesian translation, and the English translation.',
      aboutSources:'The Indonesian translation follows the Si Shu MATAKIN edition. Source annotations are separate from the primary texts.',
      createdBy:'Created by',versionAndEditorial:'Version and editorial status',
      editorialStatus:'The texts are still undergoing editorial review. Editor submissions require approval before publication. Translation and annotation rights remain with their respective owners.',
      privacyIntro:'Ru Classics can be read without an account. Reader features and editor features store information differently.',
      privacyLocalTitle:'Data on your device',privacyLocal:'Theme, language, text sizes, bookmarks, and personal notes are stored in this browser’s local storage. These may be lost if browser data is cleared and are not automatically synchronized between devices.',
      privacyEditorTitle:'Editor accounts',privacyEditor:'If you sign in as an editor with Google, Firebase Authentication may process account data, and Firestore may store submitted edits and approval records under the service configuration. Reading does not require signing in.',
      privacyHostingTitle:'Hosting and third parties',privacyHosting:'This website is hosted on GitHub Pages. GitHub, Google, and network providers may process technical information under their own policies. Do not include sensitive information in editorial submissions.',
      privacyDate:'Policy updated November 16, 2026.',
      navHome:'Home',navBooks:'Books',navSearch:'Search',navSaved:'Collection',navEditor:'Editor',
      chooseBook:'Choose book',backToBooks:'All books',backToChapters:'All chapters',changeBook:'Change book',
      passage:'Passage',verse:'Verse',chooseVerse:'Choose verse',wholePassage:'Entire passage',read:'Read now',
      translation:'Translation',notes:'Notes & commentary',personalNotes:'Personal notes',saveNote:'Save note',
      savePassage:'Save passage',removePassage:'Remove bookmark',nextPassage:'Next passage',prevPassage:'Previous passage',
      language:'Language',hanzi:'汉字 · Hanzi',pinyin:'Pinyin',indo:'ID · Indonesian',english:'EN · English',
      translationId:'Indonesian translation (MATAKIN)',translationEn:'English · James Legge',
      readingLibrary:'Library',exploreBooks:'Explore the books',chooseBookChapter:'Choose a book, chapter, then passage.',
      featuredBooks:'The Four Books',seeAll:'See all →',readingSpace:'Your reading space',
      backToReading:'Continue reading',startJourney:'Begin reading',beginFirst:'Start from the first book.',
      heroTitle:'Discover wisdom in every passage.',
      heroDesc:'Read the Ru classics with Hanzi, Pinyin, and translations to support your understanding.',
      startReading:'Start reading',explore:'Explore books',chapter:'Chapter',searchTitle:'Find a verse',
      searchPrompt:'Search throughout the Four Books.',searchPlaceholder:'Search Hanzi, Pinyin, or translations…',
      savedTitle:'Saved passages',savedPrompt:'Personal collection',noSaved:'No saved passages yet. Use Save while reading.',
      notesLocal:'Notes are saved only in this browser.',notePlaceholder:'Write your thoughts…',
      noComment:'No source commentary has been linked to this passage.',atLeastOneText:'Keep at least one of Hanzi, Indonesian, or English enabled.',
      noteSaved:'Note saved on this device.',saveBookmark:'Passage bookmarked',removeBookmark:'Bookmark removed',
      textSourceNote:'Verse numbering follows MATAKIN. The English translation is shown for the entire passage; James Legge verse divisions have not been aligned.',
      readerTools:'Reading tools'
    }
  };
  const tr=key=>LOCALES[state.uiLanguage]?.[key]||LOCALES.id[key]||key;
  const FONT_SIZES=Object.freeze({hanziSize:[22,50,2,32],pinyinSize:[10,22,1,14],latinSize:[14,26,1,17]});
  function normalizeFont(value,key){
    const [min,max,step,def]=FONT_SIZES[key];
    const x=Number(value);
    if(!Number.isFinite(x))return def;
    return Math.max(min,Math.min(max,min+Math.round((x-min)/step)*step));
  }
  function applyTypography(){
    const css=document.body.style;
    css?.setProperty?.('--hanzi-size',state.settings.hanziSize+'px');
    css?.setProperty?.('--pinyin-size',state.settings.pinyinSize+'px');
    css?.setProperty?.('--latin-size',state.settings.latinSize+'px');
  }
  function applyLanguage(){
    document.documentElement?.setAttribute?.('lang',state.uiLanguage);
    document.querySelectorAll?.('[data-i18n]')?.forEach(el=>{el.textContent=tr(el.dataset.i18n);});
    document.querySelectorAll?.('[data-i18n-placeholder]')?.forEach(el=>{el.setAttribute('placeholder',tr(el.dataset.i18nPlaceholder));});
    document.querySelectorAll?.('[data-i18n-aria]')?.forEach(el=>{el.setAttribute('aria-label',tr(el.dataset.i18nAria));});
    document.querySelectorAll?.('[data-i18n-title]')?.forEach(el=>{el.setAttribute('title',tr(el.dataset.i18nTitle));});
  }

  const STORE='ru_classics_web_v1';
  const H=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const book=id=>BOOKS.find(b=>b.id===id)||BOOKS[0];
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const count=id=>state.passages.filter(p=>p._book===id).length;
  // MATAKIN and its provenance remain unchanged; romanization is display-only.
  const displayIndo=(id,text)=>globalThis.RuReading?.normalize(text,id)??text;
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
  function save(){try{localStorage.setItem(STORE,JSON.stringify({saved:state.saved,notes:state.notes,last:state.last,theme:state.theme,uiLanguage:state.uiLanguage,settings:state.settings}));}catch(e){toast('Penyimpanan lokal browser tidak tersedia.');}}
  function restore(){
    try{
      const v=JSON.parse(localStorage.getItem(STORE)||'{}');
      if(Array.isArray(v.saved))state.saved=v.saved;
      if(v.notes&&typeof v.notes==='object')state.notes=v.notes;
      if(typeof v.last==='string')state.last=v.last;
      if(['paper','light','dark'].includes(v.theme))state.theme=v.theme;
      if(['id','en'].includes(v.uiLanguage))state.uiLanguage=v.uiLanguage;
      if(v.settings&&typeof v.settings==='object'){
        state.settings={...state.settings,...v.settings};
        if(v.settings.hanziSize===undefined&&v.settings.font!==undefined)state.settings.hanziSize=v.settings.font;
      }
    }catch(e){}
    for(const key of Object.keys(FONT_SIZES))state.settings[key]=normalizeFont(state.settings[key],key);
    setTheme(state.theme,false);applyTypography();applyLanguage();
  }
  function setTheme(theme,persist=true){if(!['paper','light','dark'].includes(theme))return;state.theme=theme;document.body.dataset.theme=theme;document.querySelector('meta[name="theme-color"]').content=theme==='paper'?'#f5efe3':theme==='dark'?'#0c2025':'#edf9f7';if(persist)save();}
  function sectionTitle(title,right=''){return '<div class="section-title"><h2>'+title+'</h2>'+right+'</div>';}
  function card(b){return '<button class="book-card" data-book="'+b.id+'"><small>'+state.chapters.filter(c=>c.book===b.id).length+' BAB · '+count(b.id)+' PASAL</small><span class="book-hanzi" lang="zh-Hant">'+b.hanzi+'</span><h3>'+b.name+'</h3><p>'+b.title+'</p></button>';}
  function home(){const last=byId(state.last);
    main.innerHTML='<section class="hero"><div class="hero-body"><span class="eyebrow">儒家經典 · Perpustakaan digital</span><h1 data-i18n="heroTitle">Menemukan kebijaksanaan dalam setiap pasal.</h1><p data-i18n="heroDesc">Bacalah kitab-kitab klasik Ru dalam tampilan yang hening dan jernih. Lengkap dengan Hanzi, pinyin, dan terjemahan untuk mendampingi pemahaman.</p><div class="actions"><button class="primary" data-action="start" data-i18n="startReading">Mulai membaca</button><button class="secondary" data-action="all" data-i18n="explore">Jelajahi kitab</button></div></div></section>'
    +sectionTitle(tr('featuredBooks'),'<button class="text-link" data-action="all" data-i18n="seeAll">Lihat semua →</button>')
    +'<div class="book-grid">'+BOOKS.map(card).join('')+'</div>'
    +sectionTitle(tr('readingSpace'))
    +'<section class="continue"><div><span class="eyebrow">'+(last?tr('backToReading'):tr('startJourney'))+'</span><h3>'+(last?book(last._book).name+' · '+H(last._chapterTitle):'Da Xue · Bab Utama')+'</h3><p>'+(last?tr('passage')+' '+last.number:tr('beginFirst'))+'</p></div><button class="primary" '+(last?'data-passage="'+H(last.id)+'"':'data-action="start"')+'>Baca sekarang</button></section><footer class="home-footer"><span data-i18n="createdBy">Dibuat oleh</span> <strong>周强信</strong> · <button class="text-link" data-action="about" data-i18n="about">Tentang Ru Classics</button></footer>';
  }
  function library(){
    if(!state.book){main.innerHTML='<div class="chapter-title"><span class="eyebrow" data-i18n="readingLibrary">Perpustakaan</span><h1 data-i18n="exploreBooks">Jelajahi kitab</h1><p class="muted" data-i18n="chooseBookChapter">Pilih kitab, bab, lalu pasal.</p></div><div class="book-grid">'+BOOKS.map(card).join('')+'</div>';return;}
    const b=book(state.book),chapters=state.chapters.filter(c=>c.book===b.id);
    const expanded=Object.prototype.hasOwnProperty.call(state.expandedChapters,b.id)?state.expandedChapters[b.id]:chapters[0]?.id;
    const chapterCard=c=>{
      const opened=expanded===c.id;
      return '<section class="chapter-group'+(opened?' is-open':'')+'">'
        +'<button type="button" class="chapter-card" data-expand-chapter="'+H(c.id)+'" aria-controls="chapter-passages-'+H(c.id)+'" aria-expanded="'+opened+'"><span><strong>'+H(c.title)+'</strong><small>'+c.passages.length+' pasal</small></span><span class="arrow" aria-hidden="true">'+(opened?'⌃':'⌄')+'</span></button>'
        +'<div class="chapter-passages" id="chapter-passages-'+H(c.id)+'"'+(opened?'':' hidden')+'>'
        +'<div class="passage-number-grid" role="group" aria-label="Pilih pasal '+H(c.title)+'">'
        +c.passages.map(p=>'<button type="button" class="passage-number" data-passage="'+H(p.id)+'" aria-label="'+H(c.title)+' — Pasal '+p.number+'">'+p.number+'</button>').join('')
        +'</div></div></section>';
    };
    main.innerHTML='<button class="back" data-action="all">← '+H(tr('backToBooks'))+'</button><section class="book-hero"><span class="big-hanzi" lang="zh-Hant">'+b.hanzi+'</span><div><span class="eyebrow">Si Shu · '+chapters.length+' bab · '+count(b.id)+' pasal</span><h1>'+b.name+'</h1><p>'+b.desc+'</p></div></section><div class="chapter-grid chapter-accordion">'+chapters.map(chapterCard).join('')+'</div>';
  }
  function chapter(){
    const c=state.chapters.find(ch=>ch.id===state.chapter);
    if(!c){navigate('books');return;}
    const b=book(c.book);
    const entry=p=>{
      const text=byId(p.id)?.translation_indonesian||'';
      const verses=globalThis.RuSubverses?.splitIndonesia(text);
      const ayat=verses?.length>1
        ?'<label class="chapter-ayat-label">Pilih ayat<select data-ayat-for="'+H(p.id)+'" aria-label="Pilih ayat Pasal '+p.number+'"><option value="">Pilih ayat…</option>'+verses.map(v=>'<option value="'+v.number+'">Ayat '+v.number+'</option>').join('')+'</select></label>'
        :'';
      return '<div class="passage-entry"><button class="result" data-passage="'+H(p.id)+'"><small>PASAL '+p.number+(verses?' · '+verses.length+' AYAT':'')+'</small><strong>'+H(c.title)+'</strong><span class="excerpt">'+H(displayIndo(p.id,text))+'</span></button>'+ayat+'</div>';
    };
    main.innerHTML='<button class="back" data-book="'+b.id+'">← '+b.name+'</button><div class="chapter-title"><span class="eyebrow">'+b.name+' · '+b.hanzi+'</span><h1>'+H(c.title)+'</h1><p class="muted">'+c.passages.length+' pasal</p></div>'
      +'<div class="chapter-quick"><label>Langsung ke pasal<select id="chapter-passage" aria-label="'+H(tr('passage'))+'"><option value="">Pilih pasal…</option>'+c.passages.map(p=>'<option value="'+H(p.id)+'">Pasal '+p.number+'</option>').join('')+'</select></label></div>'
      +'<div class="passage-list">'+c.passages.map(entry).join('')+'</div>';
  }
  function ruby(paragraphs){if(!Array.isArray(paragraphs))return '';return paragraphs.map(par=>'<p>'+((Array.isArray(par)?par:[]).map(tok=>tok.type==='ruby'?'<ruby>'+H(tok.traditional||'')+'<rt>'+H(tok.pinyin||'')+'</rt></ruby>'+(tok.modern&&tok.modern!==tok.traditional?'<span class="modern" title="Aksara sederhana dari metadata, bukan bagian teks utama">（'+H(tok.modern)+'）</span>':''):H(tok.value||'')).join(''))+'</p>').join('');}
  function annotation(p){const a=Array.isArray(p.editorial_annotations)?p.editorial_annotations:[];if(!a.length)return '<div class="rule"></div><h3>Komentar Ru</h3><p>Belum ada komentar dari sumber yang tertaut pada pasal ini.</p>';
    return '<div class="rule"></div><h3>Catatan & komentar sumber</h3>'+a.map(x=>'<div class="comment"><h4>'+H(x.title_indonesian||'Catatan teks')+'</h4>'+(x.hanzi?'<p lang="zh-Hant">'+H(x.hanzi)+'</p>':'')+(x.description_indonesian?'<p>'+H(x.description_indonesian)+'</p>':'')+(x.attribution?'<small>'+H(x.attribution)+'</small>':'')+'</div>').join('');
  }
  // Only photo/source-witnessed alignments may split the ruby tokens.
  // Other passages display numbered Indonesian ayat without pretending
  // that Hanzi or James Legge have been aligned automatically.
  function hanziWithSubverses(p,aligned){
    if(!aligned)return ruby(p.ruby_paragraphs);
    return aligned.map(verse=>
      '<div class="hanzi-verse'+(state.ayat===verse.number?' ayat-active':'')+'" data-ayat="'+verse.number+'">'+
      '<span class="ayat-label">Ayat '+verse.number+'</span>'+
      ruby([verse.ruby_tokens])+'</div>'
    ).join('');
  }
  // Each registered component is independently navigable; chapter-only
  // references remain unlinked. Slash /N points to Ayat N only if present.
  function referenceMarkup(id,text){
    const overlay=globalThis.Matakin2012References;
    if(!overlay?.segments)return H(displayIndo(id,overlay?.present(id,text)??text));
    const parts=globalThis.RuReferenceLinks?.parts(id,text,overlay)||overlay.segments(id,text);
    // A/B without a printed book alias means Mengzi only within Mengzi.
    // Only known passages and observed MATAKIN ayat can become deep links.
    const canNavigate=ref=>{
      const target=state.map.get(ref.target_id);
      if(!target)return false;
      return !ref.ayat||!!globalThis.RuSubverses?.splitIndonesia(target.translation_indonesian)?.some(v=>v.number===ref.ayat);
    };
    const sameBook=globalThis.RuSameBookReferences?.expand(id,parts,canNavigate)||parts;
    // Only four explicitly identified Si Shu books may be inherited within
    // a single reference group; external and ambiguous references stay text.
    const linked=globalThis.RuBookReferences?.expand(sameBook,canNavigate)||sameBook;
    return linked.map(part=>{
      const label=H(displayIndo(id,part.text));
      const editorialNote=part.note?'<span class="reference-editor-note" role="note">[Catatan rujukan: '+H(part.note)+']</span>':'';
      if(!part.target_id||!state.map.has(part.target_id))return label+editorialNote;
      const n=Number(part.ayat)||0;
      const target=state.map.get(part.target_id);
      const verses=n?globalThis.RuSubverses?.splitIndonesia(target.translation_indonesian):null;
      const verifiedAyat=verses?.some(v=>v.number===n)?n:0;
      return '<button type="button" class="reference-link" data-passage="'+H(part.target_id)+'"'+
        (verifiedAyat?' data-ref-ayat="'+verifiedAyat+'"':'')+
        ' title="Buka '+(verifiedAyat?'Ayat '+verifiedAyat:'pasal')+' rujukan" aria-label="Buka rujukan '+label+'">'+label+'</button>'+editorialNote;
    }).join('');
  }
  function readingParagraphs(text,lang,renderer){
    const pieces=globalThis.RuReadingLayout?.paragraphs(text,lang)||[text];
    return pieces.map(part=>'<p class="reading-paragraph">'+renderer(part)+'</p>').join('');
  }
  function indonesiaWithSubverses(p,aligned){
    // Layout is separate from the canonical MATAKIN source string.
    const display=text=>referenceMarkup(p.id,text);
    const format=text=>readingParagraphs(text,'id',display);
    const verses=aligned||globalThis.RuSubverses?.splitIndonesia(p.translation_indonesian||'');
    if(!verses)return '<div class="translation-prose">'+format(p.translation_indonesian||'Belum tersedia')+'</div>';
    return verses.map(verse=>
      '<div class="translation-verse'+(state.ayat===verse.number?' ayat-active':'')+'" data-ayat="'+verse.number+'">'+
      '<button type="button" class="ayat-label ayat-select" data-ayat-select="'+verse.number+'" aria-pressed="'+(state.ayat===verse.number)+'" title="Pilih ayat '+verse.number+'">Ayat '+verse.number+'</button>'+
      format(verse.indonesian||verse.text)+'</div>'
    ).join('');
  }
  function chapterPicker(p,c,b){
    const chapters=state.chapters.filter(ch=>ch.book===b.id);
    const option=(value,label,active)=>'<option value="'+H(value)+'"'+(active?' selected':'')+'>'+H(label)+'</option>';
    return '<div class="reader-topline"><button type="button" class="reader-back" data-book="'+b.id+'">← '+H(tr('backToChapters'))+'</button></div>'
      +'<section class="reader-chapter-card" aria-label="Kitab dan bab yang sedang dibaca">'
      +'<div class="reader-chapter-meta">'+H(b.name)+' · <span lang="zh-Hant">'+H(b.hanzi)+'</span></div>'
      +'<label class="reader-chapter-choice"><span class="visually-hidden">Pilih bab</span>'
      +'<select id="jump-chapter" aria-label="'+H(tr('chapter'))+'">'+chapters.map(ch=>option(ch.id,ch.title,ch.id===c.id)).join('')+'</select>'
      +'<span class="reader-choice-arrow" aria-hidden="true">⌄</span></label>'
      +'<details class="reader-book-details"><summary data-i18n="changeBook">Ganti kitab</summary><label>Kitab<select id="jump-book" aria-label="Pilih kitab">'+BOOKS.map(x=>option(x.id,x.name,x.id===b.id)).join('')+'</select></label></details>'
      +'</section>';
  }
  function jumpMenu(p,c,b,prev,next){
    const verses=globalThis.RuSubverses?.splitIndonesia(p.translation_indonesian)||[];
    const option=(value,label,active)=>'<option value="'+H(value)+'"'+(active?' selected':'')+'>'+H(label)+'</option>';
    return '<nav class="reader-pager" aria-label="Navigasi pasal dan ayat">'
      +'<button class="reader-pager-arrow" type="button" aria-label="'+H(tr('prevPassage'))+'" title="'+H(tr('prevPassage'))+'" '+(prev?'data-passage="'+H(prev.id)+'"':'disabled')+'>‹</button>'
      +'<label class="reader-passage-selector"><span class="visually-hidden">Pilih pasal</span><select id="jump-passage" aria-label="'+H(tr('passage'))+'">'+c.passages.map(x=>option(x.id,tr('passage')+' '+x.number,x.id===p.id)).join('')+'</select></label>'
      +'<button class="reader-pager-arrow" type="button" aria-label="'+H(tr('nextPassage'))+'" title="'+H(tr('nextPassage'))+'" '+(next?'data-passage="'+H(next.id)+'"':'disabled')+'>›</button>'
      +'</nav>'
      +'<details class="reader-ayat-disclosure"'+(state.ayat?' open':'')+'>'
      +'<summary>'+(state.ayat?tr('verse')+' '+state.ayat+' dipilih':tr('chooseVerse'))+'</summary>'
      +'<label><span class="visually-hidden">Pilih ayat</span><select id="jump-ayat" aria-label="'+H(tr('chooseVerse'))+'"'+(verses.length>1?'':' disabled title="Ayat bernomor belum terverifikasi"')+'>'
      +option('0',tr('wholePassage'),!state.ayat)+verses.map(x=>option(x.number,tr('verse')+' '+x.number,state.ayat===x.number)).join('')+'</select></label>'
      +'</details>';
  }
  // Legge supplies source paragraphs, NOT the MATAKIN numbered ayat.
  // Do not invent "Bagian 1/2" as if they were a different verse system.
  // Future editor-verified cross-language alignments can add per-ayat
  // English units without changing either canonical text.
  function englishReading(p){
    const source=p.translation_english||'';
    const verses=globalThis.RuSubverses?.splitIndonesia(p.translation_indonesian);
    const note=verses?.length>1
      ?'<p class="english-alignment-note">Nomor ayat mengikuti MATAKIN. Terjemahan James Legge masih ditampilkan untuk seluruh pasal karena batas ayatnya belum diselaraskan satu per satu'+(state.ayat?' (Ayat '+state.ayat+' sedang dipilih pada MATAKIN)':'')+'. Paragraf di bawah bukan nomor ayat tambahan.</p>'
      :'';
    return note+'<div class="translation-prose" lang="en">'+readingParagraphs(source,'en',H)+'</div>';
  }
  function reader(){
    const p=byId(state.id);if(!p){navigate('books');return;}
    state.last=p.id;save();
    const c=state.chapters.find(c=>c.id===p._chapter),b=book(p._book);
    const pos=state.passages.findIndex(x=>x.id===p.id);
    const prev=state.passages[pos-1],next=state.passages[pos+1];
    const s=state.settings;
    const aligned=globalThis.RuSubverses?.align(p)||null;
    main.innerHTML=chapterPicker(p,c,b)
      +'<div class="reader-grid"><article class="paper-page reader-page">'
      +'<div class="reader-text-heading"><span>'+tr('passage')+' '+p.number+(state.ayat?' · '+tr('verse')+' '+state.ayat+' dipilih':'')+'</span></div>'
      +(s.hanzi?'<section class="reader-script"><div class="hanzi-text '+(s.pinyin?'':'no-pinyin')+'" lang="zh-Hant">'+hanziWithSubverses(p,aligned)+'</div></section>':'')
      +'<div class="reader-translation-stack">'
      +(s.indo?'<section id="reader-translation-indo" class="translation translation-indo"><h3 data-i18n="translationId">Terjemahan Indonesia (MATAKIN)</h3>'+indonesiaWithSubverses(p,aligned)+'</section>':'')
      +(s.english&&p.translation_english?'<section id="reader-translation-en" class="translation english"><h3 data-i18n="translationEn">English · James Legge</h3>'+englishReading(p)+'</section>':'')
      +'</div></article></div>'
      +'<details class="reader-notes" id="reader-notes"><summary data-i18n="notes">Catatan &amp; komentar</summary>'
      +'<div class="reader-notes-body"><h3 data-i18n="personalNotes">Catatan pribadi</h3><p>Catatan ini disimpan hanya di browser perangkat Anda.</p>'
      +'<textarea id="personal-note" aria-label="Catatan pribadi" placeholder="Tuliskan pemikiran Anda…">'+H(state.notes[p.id]||'')+'</textarea>'
      +'<button class="primary" data-action="save-note" data-i18n="saveNote">Simpan catatan</button>'
      +annotation(p)
      +(window.RuEditorial?.canEdit?.()?'<div class="rule"></div><button class="secondary" data-action="propose">'+(state.ayat?'Usulkan revisi Ayat '+state.ayat:'Usulkan revisi teks')+'</button>':'')
      +'</div></details>'
      +'<div class="reader-bottom-controls">'
      +'<div class="reader-toolbar" role="toolbar" aria-label="Alat baca">'
      +'<details class="reader-language-tools"><summary aria-label="'+H(tr('readingLanguages'))+'">文A <span>'+H(tr('language'))+'</span></summary><div class="reader-language-popup">'+
        [['hanzi',tr('hanzi')],['pinyin',tr('pinyin')],['indo',tr('indo')],['english',tr('english')]].map(([key,label])=>'<label>'+H(label)+'<input type="checkbox" data-setting="'+key+'" '+(s[key]?'checked':'')+'></label>').join('')+
        '</div></details>'
      +'<button type="button" data-action="bookmark" aria-label="'+(state.saved.includes(p.id)?'Hapus dari koleksi':'Simpan pasal')+'" aria-pressed="'+state.saved.includes(p.id)+'">'+(state.saved.includes(p.id)?'♥':'♡')+'</button>'
      +'<button type="button" data-action="notes" title="'+H(tr('notes'))+'">▤ <span>'+H(tr('notes'))+'</span></button>'
      +'<button type="button" data-action="settings" aria-label="'+H(tr('settings'))+'">☷</button>'
      +'</div>'+jumpMenu(p,c,b,prev,next)+'</div>';
  }
  function renderSearchResults(){const box=document.getElementById('search-results');if(!box)return;const term=norm(state.search.trim());const candidates=state.passages.filter(p=>state.filter==='all'||p._book===state.filter);
    if(!term){box.innerHTML='<p class="muted">Ketik kata kunci untuk mencari dalam teks Hanzi, pinyin, atau terjemahan.</p>';return;}
    const matches=candidates.filter(p=>{const x=byId(p.id);const hanzi=(x.ruby_paragraphs||[]).flat().map(t=>t.traditional||t.value||'').join('');const pinyin=(x.ruby_paragraphs||[]).flat().map(t=>t.pinyin||'').join(' ');return norm([hanzi,pinyin,x.translation_indonesian,displayIndo(p.id,x.translation_indonesian),x.translation_english].join(' ')).includes(term);});
    box.innerHTML='<p class="muted">'+matches.length+' pasal ditemukan'+(matches.length>60?' · menampilkan 60 pertama':'')+'</p><div class="results">'+matches.slice(0,60).map(p=>'<button class="result" data-passage="'+H(p.id)+'"><small>'+book(p._book).name+' · Pasal '+p.number+'</small><strong>'+H(p._chapterTitle)+'</strong><span class="excerpt">'+H(displayIndo(p.id,byId(p.id).translation_indonesian||''))+'</span></button>').join('')+'</div>';
  }
  function search(){main.innerHTML='<div class="chapter-title"><span class="eyebrow" data-i18n="navSearch">Pencarian</span><h1 data-i18n="searchTitle">Temukan sebuah ayat</h1><p class="muted">Cari di seluruh '+state.passages.length+' pasal Si Shu.</p></div><label class="searchbox"><span aria-hidden="true">⌕</span><input id="search-input" type="search" autocomplete="off" data-i18n-placeholder="searchPlaceholder" placeholder="Ketik Hanzi, pinyin, atau terjemahan…" value="'+H(state.search)+'"></label><div class="search-filters"><select id="search-book" aria-label="Filter kitab"><option value="all">Semua kitab</option>'+BOOKS.map(b=>'<option value="'+b.id+'" '+(state.filter===b.id?'selected':'')+'>'+b.name+'</option>').join('')+'</select></div><div id="search-results"></div>';renderSearchResults();}
  function saved(){const bookmarked=state.saved.map(byId).filter(Boolean);const notes=Object.keys(state.notes).filter(k=>state.notes[k]).length;
    main.innerHTML='<div class="chapter-title"><span class="eyebrow" data-i18n="savedPrompt">Koleksi pribadi</span><h1 data-i18n="savedTitle">Pasal tersimpan</h1><p class="muted">'+bookmarked.length+' pasal disimpan · '+notes+' catatan pribadi</p></div>'+(bookmarked.length?'<div class="passage-list">'+bookmarked.map(p=>'<button class="result" data-passage="'+H(p.id)+'"><small>'+book(p._book).name+' · Pasal '+p.number+'</small><strong>'+H(p._chapterTitle)+'</strong><span class="excerpt">'+H(displayIndo(p.id,p.translation_indonesian))+'</span></button>').join('')+'</div>':'<div class="empty" data-i18n="noSaved">Belum ada pasal tersimpan. Gunakan tombol ♡ Simpan di halaman bacaan.</div>');
  }
  function navHighlight(){document.querySelectorAll('[data-nav]').forEach(btn=>{const active=btn.dataset.nav===(state.tab==='reader'||state.tab==='chapter'?'books':state.tab);btn.classList.toggle('active',active);if(active)btn.setAttribute('aria-current','page');else btn.removeAttribute('aria-current');});}
  function render(){navHighlight();if(!state.data)return;if(state.tab==='home')home();else if(state.tab==='books')library();else if(state.tab==='chapter')chapter();else if(state.tab==='reader')reader();else if(state.tab==='search')search();else if(state.tab==='saved')saved();else if(state.tab==='editor')window.RuEditorial?.render?.(main);applyLanguage();
    if(state.tab==='reader'&&state.ayat){
      window.requestAnimationFrame?.(()=>{
        const selected=document.querySelector('.translation-verse[data-ayat="'+state.ayat+'"]')||document.querySelector('.hanzi-verse[data-ayat="'+state.ayat+'"]');
        selected?.scrollIntoView?.({block:'center',behavior:'smooth'});
      });
    }else window.scrollTo({top:0,behavior:'instant'});}
  function navigate(tab,identity=null,verse=0){state.tab=tab;if(tab==='books'&&identity!==null)state.book=identity;if(tab==='chapter')state.chapter=identity;if(tab==='reader'){state.id=identity;state.ayat=Number(verse)||0;}location.hash=tab==='reader'?'read='+encodeURIComponent(identity)+(state.ayat?'&ayat='+state.ayat:''):tab==='chapter'?'chapter='+encodeURIComponent(identity):tab==='books'&&state.book?'book='+state.book:tab;render();}
  function route(){if(!state.data)return;const raw=decodeURIComponent(location.hash.replace(/^#/,''));if(raw.startsWith('read=')){const [id,verseParam]=raw.substring(5).split('&ayat=');if(state.map.has(id)){const requested=Number(verseParam)||0;const original=state.map.get(id);const valid=requested>0&&globalThis.RuSubverses?.splitIndonesia(original.translation_indonesian)?.some(v=>v.number===requested);state.id=id;state.ayat=valid?requested:0;state.tab='reader';}}else if(raw.startsWith('chapter=')){state.chapter=raw.substring(8);state.tab='chapter';}else if(raw.startsWith('book=')){state.book=raw.substring(5);state.tab='books';}else if(['home','books','search','saved','editor'].includes(raw)){state.tab=raw;if(raw==='books')state.book=null;}render();}
  function parseBundle(data){if(data.schema!=='ru-classics.content.v1'||data.collection!=='sishu'||!Array.isArray(data.chapters))throw Error('Format paket kitab tidak sesuai');const chap=data.chapters;const pass=[];const ids=new Set();for(const c of chap){for(const p of (c.passages||[])){if(ids.has(p.id))throw Error('ID pasal ganda');ids.add(p.id);p._book=c.book;p._chapter=c.id;p._chapterTitle=c.title;pass.push(p);}}
    if(chap.length!==78||pass.length!==965)throw Error('Data Si Shu belum lengkap ('+chap.length+' bab, '+pass.length+' pasal).');
    state.data=data;state.chapters=chap;state.passages=pass;state.map=new Map(pass.map(p=>[p.id,p]));
  }
  async function boot(){restore();try{let response=await fetch('./data/sishu.json');if(!response.ok)throw Error('Data belum tersedia pada hasil publikasi');parseBundle(await response.json());route();window.dispatchEvent(new Event('ru:ready'));}catch(e){main.innerHTML='<div class="empty"><h2>Perpustakaan belum bisa dibuka</h2><p>'+H(e.message)+'</p><p>Periksa hasil build GitHub Pages atau coba lagi setelah publikasi selesai.</p><button class="secondary" onclick="location.reload()">Coba lagi</button></div>';}}
  document.addEventListener('click',e=>{
    const t=e.target.closest('button');if(!t)return;
    if(t.hasAttribute('data-ayat-select')){
      const n=Number(t.dataset.ayatSelect);
      navigate('reader',state.id,state.ayat===n?0:n);
      return;
    }
    if(t.dataset.sizeKey&&Object.hasOwn(FONT_SIZES,t.dataset.sizeKey)){
      const key=t.dataset.sizeKey;
      state.settings[key]=normalizeFont(state.settings[key]+Number(t.dataset.sizeStep||0),key);
      applyTypography();save();updateFontControls();return;
    }
    if(t.dataset.nav){if(t.dataset.nav==='books')state.book=null;navigate(t.dataset.nav);return;}
    if(t.dataset.book){state.book=t.dataset.book;navigate('books',t.dataset.book);return;}
    if(t.dataset.expandChapter){
      const chapterId=t.dataset.expandChapter;
      const expanded=state.expandedChapters[state.book];
      const currentlyOpen=expanded===undefined?state.chapters.filter(c=>c.book===state.book)[0]?.id:expanded;
      const next=currentlyOpen===chapterId?null:chapterId;
      state.expandedChapters[state.book]=next;
      main.querySelectorAll('.chapter-group').forEach(group=>{
        const button=group.querySelector('[data-expand-chapter]');
        const open=button?.dataset.expandChapter===next;
        group.classList.toggle('is-open',open);
        button?.setAttribute('aria-expanded',String(open));
        const panel=group.querySelector('.chapter-passages');
        if(panel)panel.hidden=!open;
        const arrow=button?.querySelector('.arrow');
        if(arrow)arrow.textContent=open?'⌃':'⌄';
      });
      return;
    }
    if(t.dataset.chapter){navigate('chapter',t.dataset.chapter);return;}
    if(t.dataset.passage){navigate('reader',t.dataset.passage,Number(t.dataset.refAyat)||0);return;}
    if(t.dataset.toggle){state.settings[t.dataset.toggle]=!state.settings[t.dataset.toggle];save();render();return;}
    if(t.dataset.action){
      const a=t.dataset.action;
      if(a==='home')navigate('home');if(a==='all'){state.book=null;navigate('books');}
      if(a==='start')navigate('reader',state.last&&state.map.has(state.last)?state.last:state.passages[0]?.id);
      if(a==='translation'){const target=document.getElementById('reader-translation-indo')||document.getElementById('reader-translation-en');target?.scrollIntoView?.({behavior:'smooth',block:'start'});}
      if(a==='notes'){const notes=document.getElementById('reader-notes');if(notes){notes.open=true;notes.scrollIntoView?.({behavior:'smooth',block:'start'});}}

      if(a==='theme'){const arr=['paper','light','dark'];setTheme(arr[(arr.indexOf(state.theme)+1)%arr.length]);render();}
      if(a==='settings'){applyLanguage();fillSettings();document.getElementById('settings-dialog').showModal();}
      if(a==='about'){document.getElementById('settings-dialog')?.close?.();document.getElementById('about-dialog')?.showModal?.();}
      if(a==='privacy'){document.getElementById('settings-dialog')?.close?.();document.getElementById('privacy-dialog')?.showModal?.();}
      if(a==='reset-fonts'){for(const key of Object.keys(FONT_SIZES))state.settings[key]=FONT_SIZES[key][3];applyTypography();save();updateFontControls();}
      if(a==='bookmark'&&state.id){const i=state.saved.indexOf(state.id);if(i===-1)state.saved.push(state.id);else state.saved.splice(i,1);save();render();toast(i===-1?'Pasal disimpan':'Pasal dihapus dari koleksi');}
      if(a==='save-note'&&state.id){state.notes[state.id]=document.getElementById('personal-note').value;save();toast('Catatan disimpan pada perangkat ini.');}
      if(a==='editor'){navigate('editor');}
      if(a==='propose'){navigate('editor');window.RuEditorial?.startProposal?.(state.id,state.ayat);}
    }
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='search-input'){state.search=e.target.value;renderSearchResults();return;}
    const key=e.target.dataset?.fontSlider;
    if(key&&Object.hasOwn(FONT_SIZES,key)){
      state.settings[key]=normalizeFont(e.target.value,key);
      applyTypography();save();updateFontControls();
    }
  });
  document.addEventListener('change',e=>{
    const target=e.target,id=target.id,value=target.value;
    if(id==='ui-language'&&['id','en'].includes(value)){
      state.uiLanguage=value;save();render();applyLanguage();fillSettings();return;
    }
    if(id==='jump-book'){
      const chapter=state.chapters.find(c=>c.book===value);
      if(chapter?.passages?.length)navigate('reader',chapter.passages[0].id);
      return;
    }
    if(id==='jump-chapter'){
      const chapter=state.chapters.find(c=>c.id===value);
      if(chapter?.passages?.length)navigate('reader',chapter.passages[0].id);
      return;
    }
    if(id==='jump-passage'||id==='chapter-passage'){
      if(value&&state.map.has(value))navigate('reader',value);
      return;
    }
    if(id==='jump-ayat'){
      navigate('reader',state.id,Number(value)||0);
      return;
    }
    if(target.dataset?.ayatFor){
      if(value&&state.map.has(target.dataset.ayatFor))navigate('reader',target.dataset.ayatFor,Number(value)||0);
      return;
    }
    if(id==='search-book'){state.filter=value;renderSearchResults();}
    if(target.dataset?.setting){
      const key=target.dataset.setting;
      if(!['hanzi','pinyin','indo','english'].includes(key))return;
      if(!target.checked&&['hanzi','indo','english'].includes(key)&&!['hanzi','indo','english'].some(k=>k!==key&&state.settings[k])){target.checked=true;toast(tr('atLeastOneText'));return;}
      state.settings[key]=target.checked;save();if(state.tab==='reader')render();
    }
  });
  document.addEventListener('click',e=>{const t=e.target.closest('[data-theme-value]');if(t){setTheme(t.dataset.themeValue);fillSettings();render();}});
  function updateFontControls(){
    for(const key of Object.keys(FONT_SIZES)){
      const alias={hanziSize:'hanzi',pinyinSize:'pinyin',latinSize:'latin'}[key],value=state.settings[key];
      const slider=document.getElementById('font-'+alias);
      const label=document.getElementById('font-'+alias+'-label');
      if(slider)slider.value=String(value);
      if(label)label.textContent=value+' px';
    }
  }
  function fillSettings(){
    const themes=[['paper','Paper'],['light','Light'],['dark','Dark']];
    const themeBox=document.getElementById('theme-options');
    if(themeBox)themeBox.innerHTML=themes.map(([key,label])=>'<button type="button" aria-pressed="'+(state.theme===key)+'" class="'+(state.theme===key?'active':'')+'" data-theme-value="'+key+'">'+label+'</button>').join('');
    const reading=document.getElementById('reading-options');
    if(reading)reading.innerHTML=[['hanzi',tr('hanzi')],['pinyin',tr('pinyin')],['indo',tr('indo')],['english',tr('english')]].map(([key,label])=>
      '<label class="toggle-row">'+label+'<input type="checkbox" data-setting="'+key+'" aria-label="'+H(label)+'" '+(state.settings[key]?'checked':'')+'></label>'
    ).join('');
    const language=document.getElementById('ui-language');
    if(language)language.value=state.uiLanguage;
    updateFontControls();
  }
  window.RuApp={navigate,render,toast,referenceMarkup,readableIndonesian:(id,text)=>readingParagraphs(text,'id',part=>referenceMarkup(id,part)),readableEnglish:text=>readingParagraphs(text,'en',H),getPassage:byId,getOriginal:id=>state.map.get(id),getPassages:()=>state.passages,getCurrent:()=>state.id,applyApproved:items=>{state.overrides=Array.isArray(items)?items:[];if(state.data&&state.tab!=='editor')render();}};
  window.addEventListener('hashchange',route);
  boot();
})();