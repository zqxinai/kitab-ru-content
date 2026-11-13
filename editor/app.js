/* Kitab Ru Editor — zero-dependency, local-first editor.
   Nothing is uploaded, and no authentication/token is requested.
   Unknown package metadata is preserved when the source is re-exported.
*/
'use strict';
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const defaultCatalog = {
    schema: 'kitab-ru.catalog.v1', catalog_version: '0.1.0',
    collections: [
      {id:'sishu',title:'Si Shu · Kitab Yang Empat',hanzi:'四書',status:'draft',description:'Da Xue, Zhong Yong, Lun Yu, Mengzi. Terjemahan Indonesia tersedia; English optional.',package_url:'',sha256:'',languages:['zh-Hant','pinyin','id'],english_status:'planned'},
      {id:'yijing',title:'Yi Jing · Kitab Perubahan',hanzi:'易經',status:'coming_soon',description:'',package_url:'',sha256:'',languages:['zh-Hant','pinyin','id','en']},
      {id:'shujing',title:'Shu Jing · Kitab Dokumen',hanzi:'書經',status:'coming_soon',description:'',package_url:'',sha256:'',languages:['zh-Hant','pinyin','id','en']},
      {id:'shijing',title:'Shi Jing · Kitab Sanjak',hanzi:'詩經',status:'coming_soon',description:'',package_url:'',sha256:'',languages:['zh-Hant','pinyin','id','en']},
      {id:'liji',title:'Li Ji · Kitab Kesusilaan',hanzi:'禮記',status:'coming_soon',description:'',package_url:'',sha256:'',languages:['zh-Hant','pinyin','id','en']},
      {id:'chunqiu',title:'Chun Qiu · Kronik',hanzi:'春秋',status:'coming_soon',description:'',package_url:'',sha256:'',languages:['zh-Hant','pinyin','id','en']}
    ]
  };
  let bundle = null;
  let pristine = null;
  let pristineSerialized = null;
  let catalog = clone(defaultCatalog);
  let catalogPristine = clone(defaultCatalog);
  let activeBook = null;
  let activeChapter = null;
  let activePassage = null;
  let activePreface = null;
  let activeCatalog = 'sishu';
  let mode = 'content';
  let editorTab = 'passage';
  let previewLang = 'id';
  let dialogCallback = null;
  let toastTimeout = 0;

  function toast(message) {
    const node = $('toast');
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => node.classList.remove('show'), 3400);
  }
  function persistDirty() {
    const dirty = bundle && JSON.stringify(bundle) !== pristineSerialized;
    $('changeStatus').textContent = dirty ? '● Ada perubahan' : 'Tidak ada perubahan';
    $('footerState').textContent = !bundle ? 'Belum ada naskah aktif' :
      ((dirty ? 'Belum diekspor · ' : 'Disimpan dari impor · ') + String(bundle.content_version || 'tanpa versi'));
    $('exportButton').disabled = !bundle;
    $('restoreSelection').disabled = !bundle || !dirty;
  }
  function chaptersForBook(book) {
    return bundle ? bundle.chapters.filter((ch) => ch.book === book).sort((a,b) => a.index - b.index) : [];
  }
  function chapter() { return bundle && bundle.chapters.find((ch) => ch.id === activeChapter); }
  function passage() {
    const ch = chapter();
    return ch && ch.passages.find((p) => p.id === activePassage);
  }
  function preface() {
    return bundle && bundle.front_matter.find((p) => p.id === activePreface);
  }
  function safeName(value) {
    return String(value || '').normalize('NFKD').toLowerCase()
      .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,45);
  }
  function btn(html, click, active, sub) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'nav-entry' + (active ? ' active' : '');
    b.innerHTML = html;
    b.onclick = click;
    if (sub) b.title = sub;
    return b;
  }
  function renderNavigation() {
    const list = $('bookList');
    list.replaceChildren();
    $('addBook').disabled = !bundle;
    $('addChapter').disabled = !bundle || !activeBook;
    $('addPassage').disabled = !bundle || !activeChapter;
    $('addPreface').disabled = !bundle || !activeBook;
    if (!bundle) {
      list.innerHTML = '<p class="empty-small">Impor JSON atau buat dokumen baru.</p>';
      ['chapterList','passageList','prefaceList'].forEach((id) => $(id).replaceChildren());
      return;
    }
    bundle.books.forEach((book) => {
      const cat = catalog.collections.find((x) => x.id === book);
      const display = cat ? cat.title : book;
      const hanzi = cat ? cat.hanzi : '書';
      const chCount = chaptersForBook(book).length;
      list.append(btn('<span class="glyph">' + esc(hanzi) + '</span><span class="entry-text">' +
        esc(display) + '<small class="entry-sub">' + chCount + ' bab</small></span>',
        () => selectBook(book), activeBook === book, display));
    });
    const chList = $('chapterList');
    chList.replaceChildren();
    chaptersForBook(activeBook).forEach((ch) => chList.append(btn(
      '<span class="entry-text">' + esc(ch.title) + '<small class="entry-sub">' +
      esc(String(ch.passages.length)) + ' pasal</small></span>',
      () => selectChapter(ch.id), activeChapter === ch.id)));
    const psList = $('passageList');
    psList.replaceChildren();
    const ch = chapter();
    if (ch) {
      ch.passages.forEach((p) => psList.append(btn(
        '<span class="entry-text">' + esc(String(p.number)) + '</span>',
        () => selectPassage(p.id), activePassage === p.id)));
    }
    const prList = $('prefaceList');
    prList.replaceChildren();
    bundle.front_matter.filter((p) => p.book === activeBook).forEach((p) => prList.append(btn(
      '<span class="entry-text">' + esc(p.title) + '</span>',
      () => selectPreface(p.id), activePreface === p.id)));
  }
  function setMode(next) {
    mode = next;
    $('modeContent').classList.toggle('active',mode==='content');
    $('modeCatalog').classList.toggle('active',mode==='catalog');
    $('modeContent').setAttribute('aria-pressed',String(mode==='content'));
    $('modeCatalog').setAttribute('aria-pressed',String(mode==='catalog'));
    $('contentNavigation').hidden = mode !== 'content';
    $('catalogNavigation').hidden = mode !== 'catalog';
    $('emptyView').hidden = mode !== 'content' || !!bundle;
    $('contentWorkspace').hidden = mode !== 'content' || !bundle;
    $('catalogWorkspace').hidden = mode !== 'catalog';
    renderCatalogNavigation();
    renderPreview();
    runValidation();
  }
  function setTab(next) {
    editorTab = next;
    for (const t of ['Passage','Preface','Metadata']) {
      const on = t.toLowerCase() === next;
      $('tab'+t).classList.toggle('active',on);
      $('tab'+t).setAttribute('aria-selected',String(on));
      $(t.toLowerCase()+'Editor').hidden = !on;
    }
    renderEditor();
  }
  function loadCatalog(payload) {
    if (!payload || payload.schema !== 'kitab-ru.catalog.v1' ||
        !Array.isArray(payload.collections)) {
      throw new Error('JSON bukan katalog Kitab Ru yang didukung.');
    }
    for (const item of payload.collections) {
      if (!item || typeof item.id !== 'string' ||
          typeof item.title !== 'string' || typeof item.status !== 'string') {
        throw new Error('Struktur daftar koleksi tidak lengkap.');
      }
    }
    catalog = payload;
    catalogPristine = clone(payload);
    activeCatalog = catalog.collections[0]?.id || null;
    setMode('catalog');
    renderCatalogNavigation();
    renderPreview();
    runValidation();
    toast('Katalog berhasil dimuat. Sunting lalu ekspor jika diperlukan.');
  }
  function loadBundle(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
        payload.schema !== 'ru-classics.content.v1' ||
        !Array.isArray(payload.books) || !Array.isArray(payload.chapters) ||
        (payload.front_matter != null && !Array.isArray(payload.front_matter))) {
      throw new Error('JSON bukan paket ru-classics.content.v1 yang didukung.');
    }
    for (const ch of payload.chapters) {
      if (!ch || !Array.isArray(ch.passages)) throw new Error('Struktur bab tidak valid.');
    }
    bundle = payload;
    if (!bundle.front_matter) bundle.front_matter = [];
    pristine = clone(bundle);
    pristineSerialized = JSON.stringify(bundle);
    activeBook = bundle.books[0] || null;
    activeChapter = chaptersForBook(activeBook)[0]?.id || null;
    activePassage = chapter()?.passages[0]?.id || null;
    activePreface = null;
    setMode('content');
    setTab('passage');
    refresh();
    toast('Naskah berhasil diimpor. Perubahan masih lokal.');
  }
  function refresh() {
    renderNavigation();
    renderEditor();
    renderCatalogNavigation();
    renderPreview();
    runValidation();
    persistDirty();
  }
  function selectBook(book) {
    activeBook = book;
    activeChapter = chaptersForBook(book)[0]?.id || null;
    activePassage = chapter()?.passages[0]?.id || null;
    activePreface = null;
    setTab('passage'); refresh();
  }
  function selectChapter(id) {
    activeChapter = id;
    activePassage = chapter()?.passages[0]?.id || null;
    activePreface = null;
    setTab('passage'); refresh();
  }
  function selectPassage(id) {
    activePassage = id;
    activePreface = null;
    setTab('passage'); refresh();
  }
  function selectPreface(id) {
    activePreface = id;
    setTab('preface'); refresh();
  }
  function renderEditor() {
    if (!bundle) return;
    const cat = catalog.collections.find((c) => c.id === activeBook);
    const name = cat ? cat.title : activeBook || 'Kitab Ru';
    const ch = chapter();
    const ps = passage();
    $('contentHero').dataset.watermark = cat?.hanzi || '四書';
    $('heroTitle').textContent = ch?.title || name || 'Pilih kitab';
    $('heroSubtitle').textContent = ch ? name + ' · ' + ch.passages.length + ' pasal' : 'Tambah bab untuk memulai';
    $('contentVersion').textContent = String(bundle.content_version || 'Draft');
    $('noPassage').hidden = !!ps;
    $('passageForm').hidden = !ps;
    $('noPreface').hidden = !!preface();
    $('prefaceForm').hidden = !preface();
    if (ps) {
      $('passageNumber').value = String(ps.number);
      $('passageId').value = ps.id;
      $('translationInput').value = ps.translation_indonesian || '';
      $('englishInput').value = ps.translation_english || '';
      renderTokenEditor(ps);
    }
    const pf = preface();
    if (pf) {
      $('prefaceTitle').value = pf.title;
      $('prefaceTitleEn').value = pf.title_english || '';
      $('prefaceId').value = pf.id;
      $('prefaceBody').value = pf.body_indonesian;
      $('prefaceBodyEn').value = pf.body_english || '';
    }
    $('metaCollection').value = bundle.collection || '';
    $('metaVersion').value = bundle.content_version || '';
    $('metaReview').value = ['unverified-draft','under-review','approved'].includes(bundle.review_status)
      ? bundle.review_status : 'unverified-draft';
    $('chapterTitleInput').value = ch?.title || '';
    $('chapterTitleEnInput').value = ch?.title_english || '';
    $('chapterIndexInput').value = ch?.index ?? '';
    $('chapterTitleInput').disabled = !ch;
    $('chapterTitleEnInput').disabled = !ch;
    $('chapterIndexInput').disabled = !ch;
    $('deleteChapter').disabled = !ch;
  }
  function renderTokenEditor(ps) {
    const root = $('tokenParagraphs');
    root.replaceChildren();
    (ps.ruby_paragraphs || []).forEach((paragraph, paragraphIndex) => {
      const section = document.createElement('section');
      section.className='paragraph';
      const head = document.createElement('div');
      head.className='paragraph-head';
      head.innerHTML='<span>Paragraf ' + (paragraphIndex+1) + '</span>';
      const actions=document.createElement('div');
      actions.className='paragraph-actions';
      const add=document.createElement('button');add.className='mini-button';add.type='button';add.textContent='+ Token';
      add.onclick=() => {paragraph.push({type:'ruby',traditional:'',pinyin:''});refresh();};
      const remove=document.createElement('button');remove.className='mini-button danger';remove.type='button';remove.textContent='Hapus paragraf';
      remove.onclick=() => {if(!confirm('Hapus paragraf ini?'))return; ps.ruby_paragraphs.splice(paragraphIndex,1);refresh();};
      actions.append(add,remove);head.append(actions);section.append(head);
      paragraph.forEach((token,tokenIndex)=>{
        const row=document.createElement('div');row.className='token-row';
        const label=(txt,ctl) => { const l=document.createElement('label'); l.className='field';const span=document.createElement('span');span.textContent=txt;l.append(span,ctl);return l;};
        const kind=document.createElement('select');
        for(const type of ['ruby','text']){const o=document.createElement('option');o.value=type;o.textContent=type==='ruby'?'Hanzi':'Teks';kind.append(o);}
        kind.value=token.type;
        kind.onchange=()=>{
          paragraph[tokenIndex]=kind.value==='ruby'?{type:'ruby',traditional:'',pinyin:''}:{type:'text',value:''};
          refresh();
        };
        row.append(label('Jenis',kind));
        if(token.type==='ruby'){
          for(const [key,title] of [['traditional','Hanzi'],['pinyin','Pinyin'],['modern','Modern (opsional)']]){
            const input=document.createElement('input');input.type='text';input.value=token[key]||'';
            input.setAttribute('aria-label',title);input.oninput=()=>{
              if(key==='modern'&&input.value==='')delete token.modern;else token[key]=input.value;
              renderPreview();runValidation();persistDirty();
            };
            row.append(label(title,input));
          }
        }else{
          const inp=document.createElement('input');inp.type='text';inp.value=token.value||'';
          inp.oninput=()=>{token.value=inp.value;renderPreview();runValidation();persistDirty();};
          const wrapper=label('Tanda baca / teks',inp);wrapper.style.gridColumn='span 3';row.append(wrapper);
        }
        const del=document.createElement('button');del.className='mini-button danger';del.type='button';del.textContent='×';del.title='Hapus token';del.setAttribute('aria-label','Hapus token');
        del.onclick=()=>{paragraph.splice(tokenIndex,1);refresh();};row.append(del);section.append(row);
      });
      root.append(section);
    });
  }
  function renderPreview() {
    const ps=mode==='content'?passage():null;
    const book= mode==='content' ? activeBook : activeCatalog;
    const cat=catalog.collections.find((x)=>x.id===book);
    $('previewCard').dataset.watermark=cat?.hanzi||'四書';
    $('previewBook').textContent=cat?.title||'KITAB RU';
    $('previewTitle').textContent=mode==='catalog' ? 'Katalog kitab' :
      (editorTab==='preface' && preface() ?
         (previewLang==='en' && preface().title_english ? preface().title_english : preface().title) :
         (previewLang==='en' && chapter()?.title_english ? chapter().title_english :
           (chapter()?.title || 'Pilih pasal')));
    $('previewId').classList.toggle('active',previewLang==='id');
    $('previewEn').classList.toggle('active',previewLang==='en');
    $('previewId').setAttribute('aria-pressed',String(previewLang==='id'));
    $('previewEn').setAttribute('aria-pressed',String(previewLang==='en'));
    $('translationTabId').classList.toggle('active',previewLang==='id');
    $('translationTabEn').classList.toggle('active',previewLang==='en');
    $('translationTabId').setAttribute('aria-pressed',String(previewLang==='id'));
    $('translationTabEn').setAttribute('aria-pressed',String(previewLang==='en'));
    $('previewLangLabel').textContent=previewLang==='en'?'ENGLISH TRANSLATION':'TERJEMAHAN INDONESIA';
    $('previewHanzi').replaceChildren();
    if(ps){
      (ps.ruby_paragraphs||[]).forEach((paragraph)=>{
        const block=document.createElement('div');
        paragraph.forEach((token)=>{
          if(token.type==='ruby'){
            const ruby=document.createElement('ruby');ruby.append(document.createTextNode(token.traditional||'□'));
            if(token.pinyin){const rt=document.createElement('rt');rt.textContent=token.pinyin;ruby.append(rt);}
            block.append(ruby);
          }else{block.append(document.createTextNode(token.value||''));}
        });
        $('previewHanzi').append(block);
      });
      const translation=previewLang==='en'?ps.translation_english:ps.translation_indonesian;
      $('previewTranslation').textContent=translation|| (previewLang==='en'?
        'English translation is not yet available for this passage.' : 'Terjemahan belum diisi.');
    } else {
      $('previewHanzi').textContent=cat?.hanzi||'學而時習之';
      const pf=editorTab==='preface'?preface():null;
      $('previewTranslation').textContent=mode==='catalog'
        ? (previewLang==='en'?(cat?.description_en || 'Coming soon'):(cat?.description||'Segera hadir'))
        : pf
          ? (previewLang==='en'?(pf.body_english||'English front matter not yet available.'):(pf.body_indonesian||'Pengantar belum diisi.'))
          : 'Pilih pasal untuk pratinjau.';
    }
  }
  function issues() {
    const problems=[];
    if(mode==='catalog'){
      for(const item of catalog.collections){
        if(!item.id||!item.title)problems.push('Katalog: ID dan nama wajib diisi.');
        if(item.status==='available'&&
          (!/^https:\/\//.test(item.package_url||'')||!/^[a-f0-9]{64}$/.test(item.sha256||'')))
          problems.push(item.id+': status tersedia memerlukan HTTPS URL dan checksum SHA-256.');
      }
      if(new Set(catalog.collections.map((x)=>x.id)).size!==catalog.collections.length)
        problems.push('Ada ID katalog duplikat.');
      return problems;
    }
    if(!bundle)return problems;
    if(bundle.schema!=='ru-classics.content.v1')problems.push('Schema tidak didukung.');
    if(!bundle.collection||!bundle.content_version)problems.push('Metadata koleksi dan versi wajib diisi.');
    const ids=new Set();
    const bookIds=new Set(bundle.books);
    if(bookIds.size!==bundle.books.length)problems.push('ID kitab duplikat.');
    for(const ch of bundle.chapters){
      if(!bookIds.has(ch.book))problems.push('Bab '+ch.id+' merujuk kitab yang tidak dikenal.');
      if(!ch.id||ids.has(ch.id))problems.push('ID bab kosong/duplikat: '+ch.id);ids.add(ch.id);
      if(!ch.title)problems.push('Bab '+ch.id+' belum diberi judul.');
      for(const p of ch.passages){
        if(!p.id||ids.has(p.id))problems.push('ID pasal kosong/duplikat: '+p.id);ids.add(p.id);
        if(!Number.isInteger(p.number)||p.number<1)problems.push('Nomor pasal invalid: '+p.id);
        if(typeof p.translation_indonesian!=='string'||!p.translation_indonesian.trim())
          problems.push('Terjemahan Indonesia belum diisi: '+p.id);
        if(p.translation_english!=null&&typeof p.translation_english!=='string')
          problems.push('English translation harus berupa teks: '+p.id);
        if(!Array.isArray(p.ruby_paragraphs)||!p.ruby_paragraphs.length)
          problems.push('Pasal tidak mempunyai paragraf Hanzi: '+p.id);
        for(const para of p.ruby_paragraphs||[]){
          if(!Array.isArray(para)||!para.length)problems.push('Paragraf kosong: '+p.id);
          for(const token of para||[]){
            if(token.type==='ruby'&&(!token.traditional||!token.pinyin))
              problems.push('Token Hanzi/pinyin kosong: '+p.id);
            if(token.type==='ruby'&&Array.from(token.traditional||'').length!==1)
              problems.push('Token Hanzi harus satu karakter: '+p.id);
          }
        }
      }
    }
    for(const pf of bundle.front_matter){
      if(!pf.id||ids.has(pf.id))problems.push('ID pengantar duplikat/kosong: '+pf.id);ids.add(pf.id);
      if(!pf.title||!pf.body_indonesian)problems.push('Isi pengantar tidak lengkap: '+pf.id);
    }
    if(bundle.collection==='sishu'){
      const totals={daxue:64,zhongyong:129,lunyu:512,mengzi:260};
      const chapters={daxue:11,zhongyong:33,lunyu:20,mengzi:14};
      for(const k in totals){
        const count=bundle.chapters.filter(c=>c.book===k).reduce((n,c)=>n+c.passages.length,0);
        if(count!==totals[k])problems.push(k+': '+count+' pasal, seharusnya '+totals[k]+'.');
        const c=bundle.chapters.filter(x=>x.book===k).length;
        if(c!==chapters[k])problems.push(k+': '+c+' bab, seharusnya '+chapters[k]+'.');
      }
      if(bundle.front_matter.length!==2)
        problems.push('Si Shu lengkap memerlukan 2 kata pengantar.');
      if(bundle.review_status!=='unverified-draft')
        problems.push('Importer Android Si Shu V1 hanya menerima status unverified-draft.');
    }
    return problems;
  }
  function runValidation(){
    const errors=issues();
    $('qaBadge').textContent=errors.length+' temuan';
    $('qaSummary').textContent=errors.length?'Periksa sebelum paket dipublikasikan.':
      (bundle||mode==='catalog'?'Pemeriksaan struktur dasar lulus. Ini bukan audit filologis.':'Impor naskah untuk pemeriksaan.');
    $('qaList').replaceChildren();
    if(!errors.length){
      const li=document.createElement('li');li.className='ok';li.textContent='Tidak ada masalah struktural terdeteksi.';$('qaList').append(li);
    }
    for(const message of errors.slice(0,35)){
      const li=document.createElement('li');li.textContent=message;$('qaList').append(li);
    }
    if(errors.length>35){
      const li=document.createElement('li');li.textContent='+'+(errors.length-35)+' masalah lainnya.';$('qaList').append(li);
    }
    $('statBooks').textContent=bundle?bundle.books.length:'0';
    $('statChapters').textContent=bundle?bundle.chapters.length:'0';
    $('statPassages').textContent=bundle?bundle.chapters.reduce((sum,ch)=>sum+ch.passages.length,0):'0';
  }
  function renderCatalogNavigation(){
    const list=$('catalogList');list.replaceChildren();
    catalog.collections.forEach((item)=>list.append(btn(
      '<span class="glyph">'+esc(item.hanzi||'書')+'</span><span class="entry-text">'+esc(item.title)+
      '<small class="entry-sub">'+esc(item.status.replace('_',' '))+'</small></span>',
      ()=>{activeCatalog=item.id;renderCatalogNavigation();renderCatalogEditor();renderPreview();},
      activeCatalog===item.id)));
    $('catalogCount').textContent=catalog.collections.length+' koleksi';
    renderCatalogEditor();
  }
  function renderCatalogEditor(){
    const item=catalog.collections.find(c=>c.id===activeCatalog);
    $('noCatalogItem').hidden=!!item;
    $('catalogItemForm').hidden=!item;
    if(!item)return;
    $('catalogItemHeading').textContent=item.title;
    $('catalogId').value=item.id;
    $('catalogTitle').value=item.title||'';
    $('catalogTitleEn').value=item.title_en||'';
    $('catalogHanzi').value=item.hanzi||'';
    $('catalogStatus').value=item.status||'coming_soon';
    $('catalogDescription').value=item.description||'';
    $('catalogDescriptionEn').value=item.description_en||'';
    $('catalogUrl').value=item.package_url||'';
    $('catalogHash').value=item.sha256||'';
  }
  function downloadJson(payload, fileName){
    const blob=new Blob([JSON.stringify(payload,null,2)+'\n'],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fileName;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
  }
  function askEntry(title,hint,label,cb){
    $('dialogHeading').textContent=title;$('dialogHint').textContent=hint;$('dialogLabel').textContent=label;
    $('dialogInput').value='';dialogCallback=cb;$('entryDialog').showModal();$('dialogInput').focus();
  }
  $('entryForm').onsubmit=(event)=>{
    event.preventDefault();const value=$('dialogInput').value.trim();
    if(!value)return;const cb=dialogCallback;dialogCallback=null;$('entryDialog').close();
    if(cb)cb(value);
  };
  $('dialogCancel').onclick=()=>$('entryDialog').close();
  $('importInput').onchange=async(event)=>{
    const file=event.target.files?.[0];if(!file)return;
    if(file.size>16*1024*1024){toast('Berkas lebih dari 16 MB.');event.target.value='';return;}
    if(bundle&&JSON.stringify(bundle)!==pristineSerialized&&
       !confirm('Naskah saat ini belum diekspor. Impor baru akan menggantikannya. Lanjut?')){
      event.target.value='';return;
    }
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed.schema === 'kitab-ru.catalog.v1') {
        if(JSON.stringify(catalog)!==JSON.stringify(catalogPristine) &&
          !confirm('Katalog saat ini belum diekspor. Timpa dengan impor baru?')){
            event.target.value='';return;
          }
        loadCatalog(parsed);
      } else {
        loadBundle(parsed);
      }
    } catch(e) { toast('Gagal mengimpor: '+e.message); }
    event.target.value='';
  };
  function newDocument(){
    if(bundle&&JSON.stringify(bundle)!==pristineSerialized&&
       !confirm('Perubahan belum diekspor. Buat naskah baru?'))return;
    loadBundle({
      schema:'ru-classics.content.v1',collection:'sishu',content_version:'0.1.0-draft',
      review_status:'unverified-draft',books:['daxue','zhongyong','lunyu','mengzi'],
      front_matter:[],chapters:[]
    });
    toast('Kerangka baru dibuat. Tambahkan bab dan pasal.');
  }
  $('newDocument').onclick=newDocument;$('emptyNew').onclick=newDocument;
  $('modeContent').onclick=()=>setMode('content');
  $('modeCatalog').onclick=()=>setMode('catalog');
  $('tabPassage').onclick=()=>setTab('passage');
  $('tabPreface').onclick=()=>setTab('preface');
  $('tabMetadata').onclick=()=>setTab('metadata');
  for(const [id,lang] of [['previewId','id'],['previewEn','en'],['translationTabId','id'],['translationTabEn','en']]){
    $(id).onclick=()=>{previewLang=lang;renderPreview();};
  }
  $('exportButton').onclick=()=>{
    if(!bundle)return;
    const errors=issues();
    if(errors.length&&!confirm('Ada '+errors.length+' temuan validasi. Ekspor draf tetap dilakukan?'))return;
    downloadJson(bundle,'kitab-ru-'+safeName(bundle.collection)+'-'+safeName(bundle.content_version)+'.json');
    pristine=clone(bundle);pristineSerialized=JSON.stringify(bundle);
    persistDirty();toast('JSON diunduh. Publikasi ke GitHub dilakukan terpisah.');
  };
  $('exportCatalog').onclick=()=>{
    const problems=issues();
    if(problems.length&&!confirm('Katalog memiliki '+problems.length+' temuan. Ekspor draf?'))return;
    downloadJson(catalog,'catalog.json');catalogPristine=clone(catalog);toast('catalog.json berhasil diekspor.');
  };
  $('addBook').onclick=()=>askEntry('Tambah kitab','Gunakan ID latin stabil tanpa spasi, misalnya xiaojing.','ID kitab',(value)=>{
    const id=safeName(value).replace(/-/g,'');
    if(!id||bundle.books.includes(id)){toast('ID kitab tidak valid atau sudah dipakai.');return;}
    bundle.books.push(id);selectBook(id);
  });
  $('addChapter').onclick=()=>askEntry('Tambah bab','Masukkan judul bab baru. Nomor dan ID bab dibuat otomatis.','Judul bab',(title)=>{
    const indices=chaptersForBook(activeBook).map(c=>c.index);
    const idx=Math.max(0,...indices)+1;
    const id='sishu.'+activeBook+'.'+String(idx).padStart(2,'0');
    if(bundle.chapters.some(c=>c.id===id)){toast('ID bab sudah ada.');return;}
    bundle.chapters.push({id:id,book:activeBook,index:idx,title:title,passages:[]});
    selectChapter(id);setTab('metadata');toast('Bab baru dibuat.');
  });
  $('addPassage').onclick=()=>askEntry('Tambah pasal','Buat pasal dalam bab terpilih.','Nomor pasal',(value)=>{
    const ch=chapter();if(!ch)return;
    const number=Number(value);
    if(!Number.isInteger(number)||number<1||ch.passages.some(p=>p.number===number)){
      toast('Nomor pasal harus bilangan positif dan belum dipakai.');return;
    }
    const id=ch.id+'.'+String(number).padStart(2,'0');
    ch.passages.push({id:id,number:number,editorial_status:'unverified-draft',
      translation_indonesian:'',ruby_paragraphs:[[{type:'ruby',traditional:'',pinyin:''}]]});
    ch.passages.sort((a,b)=>a.number-b.number);
    selectPassage(id);toast('Pasal baru siap disunting.');
  });
  $('addPreface').onclick=()=>askEntry('Tambah pengantar','Pengantar disimpan terpisah dari pasal.','Judul pengantar',(title)=>{
    if(!activeBook)return;
    const id='sishu.'+activeBook+'.preface.'+(bundle.front_matter.filter(p=>p.book===activeBook).length+1);
    bundle.front_matter.push({id:id,book:activeBook,title:title,body_indonesian:''});
    selectPreface(id);toast('Pengantar baru ditambahkan.');
  });
  $('addCatalogItem').onclick=()=>askEntry('Tambah katalog','ID pendek tanpa spasi, contoh xiaojing.','ID koleksi',(value)=>{
    const id=safeName(value).replace(/-/g,'');
    if(!id||catalog.collections.some(c=>c.id===id)){toast('ID sudah digunakan.');return;}
    catalog.collections.push({id:id,title:value,title_en:'',hanzi:'',status:'coming_soon',description:'',description_en:'',package_url:'',sha256:'',languages:['zh-Hant','pinyin','id','en']});
    activeCatalog=id;renderCatalogNavigation();renderPreview();runValidation();
  });
  function bindText(id,get,change){
    $(id).oninput=(event)=>{if(!get())return;change(event.target.value);renderPreview();runValidation();persistDirty();};
  }
  bindText('translationInput',passage,(v)=>{passage().translation_indonesian=v;});
  bindText('englishInput',passage,(v)=>{if(v)passage().translation_english=v;else delete passage().translation_english;});
  bindText('passageId',passage,(v)=>{passage().id=v;activePassage=v;});
  $('passageNumber').onchange=(e)=>{
    const ps=passage();if(!ps)return;ps.number=Number(e.target.value);refresh();
  };
  bindText('prefaceTitle',preface,(v)=>{preface().title=v;});
  bindText('prefaceTitleEn',preface,(v)=>{if(v)preface().title_english=v;else delete preface().title_english;});
  bindText('prefaceBody',preface,(v)=>{preface().body_indonesian=v;});
  bindText('prefaceBodyEn',preface,(v)=>{if(v)preface().body_english=v;else delete preface().body_english;});
  bindText('prefaceId',preface,(v)=>{preface().id=v;activePreface=v;});
  bindText('metaCollection',()=>bundle,(v)=>{bundle.collection=v;});
  bindText('metaVersion',()=>bundle,(v)=>{bundle.content_version=v;$('contentVersion').textContent=v;});
  $('metaReview').onchange=(e)=>{if(!bundle)return;bundle.review_status=e.target.value;runValidation();persistDirty();};
  bindText('chapterTitleInput',chapter,(v)=>{chapter().title=v;$('heroTitle').textContent=v;});
  bindText('chapterTitleEnInput',chapter,(v)=>{if(v)chapter().title_english=v;else delete chapter().title_english;});
  $('chapterIndexInput').onchange=(e)=>{const ch=chapter();if(!ch)return;ch.index=Number(e.target.value);refresh();};
  const catChange={
    catalogTitle:'title',catalogTitleEn:'title_en',
    catalogHanzi:'hanzi',catalogDescription:'description',catalogDescriptionEn:'description_en',
    catalogUrl:'package_url',catalogHash:'sha256'
  };
  for(const [id,key] of Object.entries(catChange)){
    $(id).oninput=(e)=>{
      const item=catalog.collections.find(c=>c.id===activeCatalog);if(!item)return;
      item[key]=e.target.value;if(id==='catalogTitle')$('catalogItemHeading').textContent=item.title;
      renderPreview();runValidation();$('footerState').textContent='Katalog diedit · ekspor untuk menyimpan';
    };
  }
  $('catalogStatus').onchange=(e)=>{
    const item=catalog.collections.find(c=>c.id===activeCatalog);if(!item)return;
    item.status=e.target.value;runValidation();renderCatalogNavigation();
  };
  $('deletePassage').onclick=()=>{
    const ch=chapter(),ps=passage();if(!ch||!ps)return;
    if(!confirm('Hapus pasal '+ps.number+' dari '+ch.title+'?'))return;
    ch.passages=ch.passages.filter(p=>p!==ps);
    activePassage=ch.passages[0]?.id||null;refresh();toast('Pasal dihapus dari draf lokal.');
  };
  $('deletePreface').onclick=()=>{
    const pf=preface();if(!pf)return;
    if(!confirm('Hapus pengantar '+pf.title+'?'))return;
    bundle.front_matter=bundle.front_matter.filter(p=>p!==pf);
    activePreface=null;setTab('passage');refresh();
  };
  $('deleteChapter').onclick=()=>{
    const ch=chapter();if(!ch)return;
    if(!confirm('Hapus bab '+ch.title+' dan seluruh '+ch.passages.length+' pasalnya?'))return;
    bundle.chapters=bundle.chapters.filter(c=>c!==ch);
    activeChapter=chaptersForBook(activeBook)[0]?.id||null;
    activePassage=chapter()?.passages[0]?.id||null;refresh();
  };
  $('addParagraph').onclick=()=>{
    const ps=passage();if(!ps)return;
    ps.ruby_paragraphs.push([{type:'ruby',traditional:'',pinyin:''}]);refresh();
  };
  $('restoreSelection').onclick=()=>{
    if(!pristine||!confirm('Batalkan seluruh perubahan naskah sejak impor/ekspor terakhir?'))return;
    bundle=clone(pristine);
    activeBook=bundle.books.includes(activeBook)?activeBook:bundle.books[0]||null;
    activeChapter=chaptersForBook(activeBook)[0]?.id||null;
    activePassage=chapter()?.passages[0]?.id||null;
    activePreface=null;refresh();toast('Perubahan dikembalikan.');
  };
  window.addEventListener('beforeunload',(e)=>{
    if(bundle&&JSON.stringify(bundle)!==pristineSerialized){
      e.preventDefault();e.returnValue='';
    }
  });
  setMode('content');renderNavigation();renderCatalogNavigation();runValidation();persistDirty();
  // Serve the repository catalog when hosted on GitHub Pages; file:// works offline.
  if (location.protocol === 'https:' || location.protocol === 'http:') {
    fetch('../catalog.json', {credentials:'omit',cache:'no-store'})
      .then((response) => {
        if (!response.ok) throw new Error('Catalog is not available');
        return response.json();
      }).then((remote) => {
        if (remote.schema === 'kitab-ru.catalog.v1' &&
            Array.isArray(remote.collections) &&
            JSON.stringify(catalog) === JSON.stringify(catalogPristine)) {
          catalog=remote;
          catalogPristine=clone(remote);
          renderCatalogNavigation();
          renderNavigation();
          renderPreview();
          runValidation();
        }
      }).catch(() => {});
  }
})();
