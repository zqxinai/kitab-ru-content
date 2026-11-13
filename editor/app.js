/* Kitab Ru · Ruang Editorial. Naskah dibaca langsung dari GitHub Pages.
   Draf lokal; usulan GitHub; tidak ada token atau terbit otomatis. */
'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const REPO='https://github.com/zqxinai/kitab-ru-content';
  const SOURCE='../dist/sishu-content.json';
  const ALIGNMENT_SOURCE='../dist/sishu-english-alignment.json';
  const KEY='kitab-ru-editorial-drafts-v1';
  const BOOKS={
    daxue:{name:'Da Xue',hanzi:'大學',sub:'Ajaran Besar'},
    zhongyong:{name:'Zhong Yong',hanzi:'中庸',sub:'Tengah Sempurna'},
    lunyu:{name:'Lun Yu',hanzi:'論語',sub:'Sabda Suci'},
    mengzi:{name:'Mengzi',hanzi:'孟子',sub:'Mengzi'}
  };
  const book=id=>BOOKS[id]||{name:id,hanzi:'書',sub:'Kitab klasik'};
  let bundle=null,chapters=[],records=[],byId=new Map(),englishAlignments=new Map();
  let bookId='',chapterId='',passageId='',editing=false,loadNumber=0;
  let drafts={};
  try{const parsed=JSON.parse(localStorage.getItem(KEY)||'{}');
    if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))drafts=parsed;
  }catch(_){}
  const normalize=x=>String(x??'').normalize('NFKC').toLowerCase();
  const hanziOf=paras=>(paras||[]).map(tokens=>
    Array.isArray(tokens)?tokens.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join(''):''
  ).join('\n');
  const record=id=>byId.get(id||passageId);
  const selectedChapter=()=>chapters.find(c=>c.id===chapterId);
  const draft=id=>drafts[id]&&typeof drafts[id]==='object'?drafts[id]:null;
  const changed=id=>{
    const d=draft(id),r=record(id);if(!d||!r)return false;
    return d.idText!==r.passage.translation_indonesian||
      d.enText!==(r.passage.translation_english||'')||!!String(d.reason||'').trim();
  };
  function feedback(message,error=false){
    $('draftFeedback').textContent=message;
    $('draftFeedback').style.color=error?'#a04e55':'#397e72';
  }
  function persist(){
    try{localStorage.setItem(KEY,JSON.stringify(drafts));return true}
    catch(_){feedback('Draf tidak dapat disimpan di browser ini. Jangan tutup halaman sebelum mengajukan.',true);return false}
  }
  function draftCount(){
    $('draftCount').textContent=String(Object.keys(drafts).filter(changed).length);
    $('draftNotice').hidden=!changed(passageId);
  }
  function stateLoading(){
    $('loadingView').hidden=false;$('errorView').hidden=true;$('readerView').hidden=true;
    $('connectionStatus').textContent='Memuat naskah…';$('connectionStatus').classList.remove('offline');
  }
  function stateError(error){
    $('loadingView').hidden=true;$('errorView').hidden=false;$('readerView').hidden=true;
    $('connectionStatus').textContent='Naskah belum terbuka';$('connectionStatus').classList.add('offline');
    $('errorMessage').textContent='Periksa koneksi internet dan coba lagi. '+(error?.message||'');
  }
  async function load(){
    const request=++loadNumber;stateLoading();
    try{
      const response=await fetch(SOURCE,{credentials:'omit',cache:'no-store'});
      if(!response.ok)throw Error('Naskah tidak tersedia ('+response.status+').');
      const data=await response.json();
      if(request!==loadNumber)return;
      if(data?.schema!=='ru-classics.content.v1'||data.collection!=='sishu'||
        !Array.isArray(data.books)||!Array.isArray(data.chapters))throw Error('Susunan naskah belum dikenali.');
      let alignmentData={entries:[]};
      try {
        const response=await fetch(ALIGNMENT_SOURCE,{credentials:'omit',cache:'no-store'});
        if(response.ok)alignmentData=await response.json();
      } catch (_) { /* Missing alignment must not block the scripture reader. */ }
      if(alignmentData.schema && alignmentData.schema!=='kitab-ru.english-alignment.v1')
        throw Error('Format padanan Inggris tidak dikenali.');
      englishAlignments=new Map();
      for(const entry of alignmentData.entries||[]){
        if(!Array.isArray(entry.indonesian_passage_ids)||!Array.isArray(entry.english_segments))continue;
        for(const id of entry.indonesian_passage_ids){
          const entries=englishAlignments.get(id)||[];
          entries.push(entry);
          englishAlignments.set(id,entries);
        }
      }
      bundle=data;chapters=data.chapters.slice().sort((a,b)=>
        data.books.indexOf(a.book)-data.books.indexOf(b.book)||a.index-b.index);
      records=[];byId=new Map();
      for(const ch of chapters){
        if(!Array.isArray(ch.passages))continue;
        for(const p of ch.passages.slice().sort((a,b)=>a.number-b.number)){
          if(!p.id||byId.has(p.id))continue;
          const r={chapter:ch,passage:p,hanzi:hanziOf(p.ruby_paragraphs)};
          r.search=normalize([book(ch.book).name,ch.title,r.hanzi,
            p.translation_indonesian,p.translation_english,
            ...(p.ruby_paragraphs||[]).flat().map(x=>x.pinyin||'')].join(' '));
          records.push(r);byId.set(p.id,r);
        }
      }
      if(!records.length)throw Error('Belum ada pasal dalam koleksi.');
      $('loadingView').hidden=true;$('errorView').hidden=true;$('readerView').hidden=false;
      $('searchInput').disabled=false;
      $('connectionStatus').textContent='Naskah terbaru terbuka';
      $('connectionStatus').classList.remove('offline');
      $('chapterCount').textContent=String(chapters.length);
      $('passageCount').textContent=String(records.length);
      $('collectionVersion').textContent='Edisi: '+(data.content_version||'draf')+' · Isi masih dalam pemeriksaan.';
      select(byId.has(passageId)?passageId:records[0].passage.id);
    }catch(error){if(request===loadNumber)stateError(error)}
  }
  function navEntry(title,detail,active,onClick,hanzi,count){
    const b=document.createElement('button');b.type='button';
    b.className='nav-entry'+(active?' active':'');
    b.setAttribute('aria-current',String(active));
    if(hanzi){const g=document.createElement('span');g.className='glyph';g.textContent=hanzi;b.append(g)}
    const c=document.createElement('span');c.className='copy';c.textContent=title;
    if(detail){const s=document.createElement('small');s.className='sub';s.textContent=detail;c.append(s)}
    b.append(c);
    if(count!=null){const n=document.createElement('span');n.className='count';n.textContent=String(count);b.append(n)}
    b.onclick=onClick;return b;
  }
  function navigation(){
    const books=$('bookList');books.replaceChildren();
    for(const id of bundle.books){
      const info=book(id);
      books.append(navEntry(info.name,info.sub,id===bookId,()=>{
        const ch=chapters.find(x=>x.book===id&&x.passages?.length);
        if(ch)select(ch.passages[0].id);
      },info.hanzi,chapters.filter(x=>x.book===id).length));
    }
    const cs=$('chapterList');cs.replaceChildren();
    for(const ch of chapters.filter(c=>c.book===bookId)){
      cs.append(navEntry(ch.title,'Bab '+ch.index,ch.id===chapterId,()=>{
        if(ch.passages?.length)select(ch.passages[0].id);
      },null,ch.passages?.length||0));
    }
    const ps=$('passageList');ps.replaceChildren();
    for(const p of selectedChapter()?.passages||[]){
      const b=document.createElement('button');b.type='button';
      b.className='passage-button'+(p.id===passageId?' active':'')+(changed(p.id)?' draft':'');
      b.textContent=String(p.number);b.title='Buka pasal '+p.number;
      b.setAttribute('aria-current',String(p.id===passageId));
      b.onclick=()=>select(p.id);ps.append(b);
    }
  }
  function showHanzi(paragraphs){
    const root=$('hanziText');root.replaceChildren();
    for(const tokens of paragraphs||[]){
      if(!Array.isArray(tokens))continue;
      const p=document.createElement('p');
      for(const t of tokens){
        if(t.type==='text'){p.append(document.createTextNode(t.value||''))}
        else if(t.type==='ruby'){
          const rb=document.createElement('ruby');
          rb.append(document.createTextNode(t.traditional||'□'));
          if(t.pinyin){const rt=document.createElement('rt');rt.textContent=t.pinyin;rb.append(rt)}
          p.append(rb);
        }
      }
      root.append(p);
    }
    if(!root.childNodes.length)root.textContent='Teks Hanzi belum tersedia.';
  }
  function reader(){
    const r=record();if(!r)return;
    const ch=r.chapter,p=r.passage,info=book(ch.book);
    $('breadcrumb').textContent='Si Shu / '+info.name+' / '+ch.title+' / Pasal '+p.number;
    $('chapterTitle').textContent=ch.title;
    $('chapterSubtitle').textContent=info.name+' · '+info.hanzi;
    $('readingHeader').dataset.watermark=info.hanzi;
    $('passageStatus').textContent=p.editorial_status==='approved'?'Telah diperiksa':'Perlu pemeriksaan';
    showHanzi(p.ruby_paragraphs);
    $('indonesianText').textContent=p.translation_indonesian||'Terjemahan belum tersedia.';
    const mappings=englishAlignments.get(p.id)||[];
    const segments=mappings.flatMap(entry=>entry.english_segments||[]);
    const mappedEnglish=segments.map(segment=>String(segment.text||'').trim()).filter(Boolean).join('\n\n');
    const en=mappedEnglish||String(p.translation_english||'').trim();
    $('englishText').textContent=en||'Terjemahan Inggris belum tersedia atau belum disetujui untuk pasal ini.';
    $('englishText').classList.toggle('unavailable',!en);
    if(mappings.length){
      const refs=[...new Set(segments.map(segment=>segment.legge_ref).filter(Boolean))];
      const verified=mappings.every(entry=>entry.status==='verified');
      $('englishSource').textContent='James Legge · '+(refs.join(', ')||'Rujukan belum tersedia')+
        (verified?' · Padanan terverifikasi':' · Padanan perlu verifikasi');
    }else{
      const source=String(p.translation_english_source||p.english_source||'');
      const isLegge=source.toLowerCase().includes('james legge')||source.includes('gutenberg.org/ebooks/4094');
      $('englishSource').textContent=en?(isLegge?
        'James Legge · Padanan pasal belum diverifikasi':'Sumber terjemahan perlu diperiksa'):
        'Menunggu pencocokan sumber';
    }
    const index=records.findIndex(item=>item.passage.id===passageId);
    $('passagePosition').textContent='Pasal '+p.number+' · '+(index+1)+' dari '+records.length;
    $('previousButton').disabled=index<=0;$('nextButton').disabled=index>=records.length-1;
    $('passageHistory').href=REPO+'/issues?q='+encodeURIComponent('is:issue '+p.id);
    draftCount();
  }
  function select(id){
    const r=record(id);if(!r)return;
    bookId=r.chapter.book;chapterId=r.chapter.id;passageId=id;
    editing=false;$('editPanel').hidden=true;$('readActions').hidden=false;
    $('searchInput').value='';$('searchResults').hidden=true;$('libraryNavigation').hidden=false;
    navigation();reader();
  }
  function beginEdit(){
    const r=record();if(!r)return;
    editing=true;const d=draft(passageId);
    $('editIndonesian').value=d?.idText??r.passage.translation_indonesian??'';
    $('editEnglish').value=d?.enText??r.passage.translation_english??'';
    $('editReason').value=d?.reason??'';
    $('editPanel').hidden=false;$('readActions').hidden=true;
    feedback(d?.version&&d.version!==bundle.content_version?
      'Naskah berubah sejak draf dibuat. Periksa kembali sebelum mengajukan.':
      'Perubahan menjadi draf sampai dikirim untuk pemeriksaan.');
    $('editPanel').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function draftFromInput(){
    return {idText:$('editIndonesian').value,enText:$('editEnglish').value,
      reason:$('editReason').value,version:bundle.content_version||''};
  }
  function save(){
    if(!editing||!passageId)return;
    const d=draftFromInput(),p=record().passage;
    if(d.idText===p.translation_indonesian&&d.enText===(p.translation_english||'')&&!d.reason.trim())
      delete drafts[passageId];
    else drafts[passageId]=d;
    if(persist())feedback('Draf tersimpan di browser ini. Belum diajukan kepada pemeriksa.');
    draftCount();navigation();
  }
  function close(){if(editing)save();editing=false;$('editPanel').hidden=true;$('readActions').hidden=false}
  function discard(){
    if(draft(passageId)&&!confirm('Buang perubahan untuk pasal ini?'))return;
    delete drafts[passageId];persist();
    editing=false;$('editPanel').hidden=true;$('readActions').hidden=false;
    reader();navigation();draftCount();
  }
  function proposalBody(r,d){
    const p=r.passage;let body='## Usulan perbaikan terjemahan Kitab Ru\n\n';
    body+='Kitab: '+book(r.chapter.book).name+'\n';
    body+='Bab: '+r.chapter.title+'\nPasal: '+p.number+'\n';
    body+='Penanda pasal: '+p.id+'\nVersi naskah: '+(bundle.content_version||'draf')+'\n\n';
    body+='### Teks asli (Hanzi)\n\n'+r.hanzi+'\n\n';
    if(d.idText!==p.translation_indonesian){
      body+='### Terjemahan Indonesia sebelumnya\n\n'+p.translation_indonesian+'\n\n';
      body+='### Terjemahan Indonesia yang diusulkan\n\n'+d.idText+'\n\n';
    }
    if(d.enText!==(p.translation_english||'')){
      body+='### Terjemahan Inggris sebelumnya\n\n'+(p.translation_english||'(Belum tersedia)')+'\n\n';
      body+='### Terjemahan Inggris yang diusulkan\n\n'+(d.enText||'(Dihapus)')+'\n\n';
    }
    body+='### Alasan dan rujukan\n\n'+d.reason.trim()+'\n\n';
    body+='Usulan ini belum mengubah naskah resmi dan memerlukan persetujuan pengelola.';
    return body;
  }
  function submit(){
    if(!editing)return;
    save();const r=record(),d=draft(passageId);
    if(!r||!d){feedback('Belum ada perubahan untuk diajukan.',true);return}
    if(!d.reason?.trim()){feedback('Tuliskan alasan dan rujukan agar pemeriksa dapat menilai usulan.',true);$('editReason').focus();return}
    if(d.idText===r.passage.translation_indonesian&&d.enText===(r.passage.translation_english||'')){
      feedback('Ubah terjemahan Indonesia atau Inggris terlebih dahulu.',true);return;
    }
    if(!d.idText.trim()){feedback('Terjemahan Indonesia tidak boleh dikosongkan.',true);return}
    if(d.version!==bundle.content_version&&!confirm('Draf dibuat dari versi lama. Sudah periksa naskah terbaru?'))return;
    const title='Koreksi '+book(r.chapter.book).name+' · '+r.chapter.title+
      ' · Pasal '+r.passage.number+' ['+passageId+']';
    const body=proposalBody(r,d);
    const url=REPO+'/issues/new?title='+encodeURIComponent(title)+'&body='+encodeURIComponent(body);
    if(url.length<=7500){
      window.open(url,'_blank','noopener,noreferrer');
      feedback('Halaman pengajuan dibuka. Masuk ke GitHub dan tekan Kirim untuk menyerahkan usulan.');
    }else{
      const small=REPO+'/issues/new?title='+encodeURIComponent(title)+
        '&body='+encodeURIComponent('Tempel usulan lengkap yang disalin dari Ruang Editorial.');
      window.open(small,'_blank','noopener,noreferrer');
      if(navigator.clipboard?.writeText)navigator.clipboard.writeText(body)
        .then(()=>feedback('Usulan panjang telah disalin. Tempel pada halaman pengajuan, lalu kirim.'))
        .catch(()=>feedback('Salin teks dari editor dan catatan pemeriksaan, lalu tempel ke halaman pengajuan.',true));
      else feedback('Salin teks dari editor dan catatan pemeriksaan, lalu tempel ke halaman pengajuan.',true);
    }
  }
  function search(){
    if(!bundle)return;
    const term=normalize($('searchInput').value.trim());
    if(!term){$('searchResults').hidden=true;$('libraryNavigation').hidden=false;return}
    $('searchResults').hidden=false;$('libraryNavigation').hidden=true;
    const hits=records.filter(r=>r.search.includes(term));
    $('searchCount').textContent=hits.length+' ditemukan';
    const root=$('searchMatches');root.replaceChildren();
    for(const r of hits.slice(0,60)){
      root.append(navEntry(book(r.chapter.book).name+' · Bab '+r.chapter.index+
        ' · Pasal '+r.passage.number,r.hanzi.slice(0,35).replace(/\n/g,' '),
        r.passage.id===passageId,()=>select(r.passage.id)));
    }
    if(!hits.length||hits.length>60){
      const note=document.createElement('p');note.className='sidebar-hint';
      note.textContent=!hits.length?'Belum ditemukan. Coba kata lain.':
        'Menampilkan 60 hasil pertama. Perjelas kata pencarian.';
      root.append(note);
    }
  }
  $('reloadButton').onclick=load;$('retryButton').onclick=load;
  $('searchInput').oninput=search;
  $('previousButton').onclick=()=>{const n=records.findIndex(r=>r.passage.id===passageId);if(n>0)select(records[n-1].passage.id)};
  $('nextButton').onclick=()=>{const n=records.findIndex(r=>r.passage.id===passageId);if(n>=0&&n<records.length-1)select(records[n+1].passage.id)};
  $('editButton').onclick=beginEdit;$('resumeDraft').onclick=beginEdit;
  $('closeEdit').onclick=close;$('saveDraft').onclick=save;
  $('discardDraft').onclick=discard;$('submitProposal').onclick=submit;
  for(const id of ['editIndonesian','editEnglish','editReason'])$(id).addEventListener('input',save);
  draftCount();load();
})();
