/* Kitab Ru · Ruang Editorial. Naskah dibaca langsung dari GitHub Pages.
   Draf lokal; usulan GitHub; tidak ada token atau terbit otomatis. */
'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const REPO='https://github.com/zqxinai/kitab-ru-content';
  const SOURCE='../dist/sishu-content.json';
  const EDITION_SOURCE='../sishu/editions/matakin-2012-chapters.json';
  const ALIGNMENT_SOURCE='../dist/sishu-english-alignment.json';
  const REVIEW_SOURCE='../dist/sishu-review-status.json';
  const KEY='kitab-ru-editorial-drafts-v1';
  const BOOKS={
    daxue:{name:'Da Xue',hanzi:'大學',sub:'Ajaran Besar'},
    zhongyong:{name:'Zhong Yong',hanzi:'中庸',sub:'Tengah Sempurna'},
    lunyu:{name:'Lun Yu',hanzi:'論語',sub:'Sabda Suci'},
    mengzi:{name:'Mengzi',hanzi:'孟子',sub:'Mengzi'}
  };
  const book=id=>BOOKS[id]||{name:id,hanzi:'書',sub:'Kitab klasik'};
  let bundle=null,chapters=[],records=[],byId=new Map(),englishAlignments=new Map(),reviewStatuses=new Map();
  let bookId='',chapterId='',passageId='',editing=false,loadNumber=0;
  let drafts={};
  try{const parsed=JSON.parse(localStorage.getItem(KEY)||'{}');
    if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))drafts=parsed;
  }catch(_){}
  const normalize=x=>String(x??'').normalize('NFKC').toLowerCase();
  const hanziOf=paras=>(paras||[]).map(tokens=>
    Array.isArray(tokens)?tokens.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join(''):''
  ).join('\n');
  // The editorial source of truth is the alignment map when a mapped translation exists.
  const englishTextFor=id=>{
    const mapped=(englishAlignments.get(id)||[]).flatMap(e=>e.english_segments||[])
      .map(s=>String(s.text||'').trim()).filter(Boolean).join('\n\n');
    return mapped||String(byId.get(id)?.passage.translation_english||'');
  };
  const record=id=>byId.get(id||passageId);
  const selectedChapter=()=>chapters.find(c=>c.id===chapterId);
  const draft=id=>drafts[id]&&typeof drafts[id]==='object'?drafts[id]:null;
  const changed=id=>{
    const d=draft(id),r=record(id);if(!d||!r)return false;
    return d.idText!==r.passage.translation_indonesian||
      d.enText!==englishTextFor(id)||!!String(d.reason||'').trim();
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
      let reviewData={entries:[]};
      try {
        const response=await fetch(REVIEW_SOURCE,{credentials:'omit',cache:'no-store'});
        if(response.ok)reviewData=await response.json();
      } catch (_) { /* An unavailable registry always means review required. */ }
      if(reviewData.schema && reviewData.schema!=='kitab-ru.review-status.v1')
        throw Error('Format status editorial tidak dikenali.');
      reviewStatuses=new Map();
      for(const entry of reviewData.entries||[]){
        if(typeof entry.passage_id==='string'&&!reviewStatuses.has(entry.passage_id)){
          reviewStatuses.set(entry.passage_id,entry);
        }
      }
      // Edition 2012 labels are presentation metadata. Preserve stable source chapter IDs.
      // If the independent metadata cannot load, the original scripture remains readable.
      let edition={chapters:[]};
      try{
        const resp=await fetch(EDITION_SOURCE,{credentials:'omit',cache:'no-store'});
        if(resp.ok){
          const received=await resp.json();
          if(received?.schema==='ru-classics.edition-chapters.v1'&&Array.isArray(received.chapters))edition=received;
        }
      }catch(_){ /* Fallback to the source chapter title without changing verse IDs. */ }
      const editionById=new Map(edition.chapters.map(e=>[e.id,e]));
      bundle=data;chapters=data.chapters.slice().sort((a,b)=>
        data.books.indexOf(a.book)-data.books.indexOf(b.book)||a.index-b.index).map(ch=>{
        const ed=editionById.get(ch.id);
        if(!ed)return ch;
        const sourceSuffix=ch.title.includes(' · ')?ch.title.slice(ch.title.indexOf(' · ')):'';
        return {...ch,title:ed.label+(ed.label==='Bab Utama'?'':' — '+ed.name)+sourceSuffix,
          edition_label:ed.label,edition_page:ed.page};
      });
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
      // Search the edition-aligned English text as well as the bundled language data.
      for(const r of records)r.search+=' '+normalize(englishTextFor(r.passage.id));
      $('loadingView').hidden=true;$('errorView').hidden=true;$('readerView').hidden=false;
      $('searchInput').disabled=false;
      $('passageFilter').disabled=false;
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
      const originalLabel=ch.title.match(/^(Bab Utama|Bab [IVXLCDM]+|Jilid [IVXLCDM]+\s*[AB]?)/)?.[0];
      const editionLabel=ch.edition_label||originalLabel||('Bagian '+ch.index);
      const detail=ch.edition_page?editionLabel+' · hlm. '+ch.edition_page:editionLabel;
      cs.append(navEntry(ch.title,detail,ch.id===chapterId,()=>{
        if(ch.passages?.length)select(ch.passages[0].id);
      },null,ch.passages?.length||0));
    }
    const ps=$('passageList');ps.replaceChildren();
    const filter=$('passageFilter').value||'all';
    let visible=0;
    for(const p of selectedChapter()?.passages||[]){
      const st=statusFor(byId.get(p.id));
      const kind=st.localDraft?'needs':st.bothFinal?'final':(st.idFinal||st.enFinal)?'partial':'needs';
      if(filter!=='all'&&kind!==filter)continue;
      visible++;
      const b=document.createElement('button');b.type='button';
      b.className='passage-button'+(p.id===passageId?' active':'')+
        (st.localDraft?' draft':st.bothFinal?' final':(st.idFinal||st.enFinal)?' partial':'');
      b.textContent=String(p.number);
      b.title='Pasal '+p.number+' · '+(kind==='final'?'Final':kind==='partial'?'Sebagian final':'Perlu review');
      b.setAttribute('aria-current',String(p.id===passageId));
      b.onclick=()=>select(p.id);ps.append(b);
    }
    if(!visible){
      const msg=document.createElement('p');
      msg.className='sidebar-hint';
      msg.textContent='Tidak ada pasal dengan status ini dalam bab terpilih.';
      ps.append(msg);
    }
  }
  function statusFor(r){
    const p=r.passage,review=reviewStatuses.get(p.id)||{};
    const trace=typeof review.reviewed_by==='string'&&!!review.reviewed_by.trim()&&
      typeof review.reviewed_at==='string'&&!!review.reviewed_at.trim()&&
      Number.isInteger(review.source_issue)&&review.source_issue>0;
    const hanziMatch=review.hanzi_span===r.hanzi;
    const idFinal=trace&&hanziMatch&&review.indonesian==='final'&&
      typeof review.indonesian_text==='string'&&
      review.indonesian_text===p.translation_indonesian;
    const english=englishTextFor(p.id).trim();
    const enFinal=trace&&hanziMatch&&review.english==='final'&&!!english&&
      typeof review.english_text==='string'&&review.english_text===englishTextFor(p.id);
    const localDraft=changed(p.id);
    return {idFinal,enFinal,bothFinal:idFinal&&enFinal&&!localDraft,
      hasId:!!String(p.translation_indonesian||'').trim(),
      hasEn:!!english,localDraft};
  }
  function languageAvailable(status,scope){
    return scope==='id'?status.hasId:scope==='en'?status.hasEn:(status.hasId&&status.hasEn);
  }
  function languageFinal(status,scope){
    return scope==='id'?status.idFinal:scope==='en'?status.enFinal:status.bothFinal;
  }
  function scopeName(scope){
    return scope==='id'?'Indonesia (MATAKIN)':scope==='en'?'Inggris (James Legge)':'Indonesia dan Inggris';
  }
  function updatePassageActions(){
    const status=statusFor(record()),scope=$('passageLanguage').value||'both';
    $('confirmFinalButton').disabled=languageFinal(status,scope)||!languageAvailable(status,scope)||status.localDraft;
    $('confirmFinalButton').title=!languageAvailable(status,scope)?'Terjemahan yang dipilih belum lengkap':
      status.localDraft?'Ajukan koreksi draf dahulu':
      languageFinal(status,scope)?'Status yang dipilih sudah final':'Ajukan status final untuk diperiksa';
  }
  function chapterRecords(){
    return (selectedChapter()?.passages||[]).map(p=>byId.get(p.id)).filter(Boolean);
  }
  function renderChapterReview(){
    const chapter=selectedChapter();if(!chapter)return;
    const rows=chapterRecords(),statuses=rows.map(statusFor),n=rows.length;
    const idFinal=statuses.filter(s=>s.idFinal).length;
    const enFinal=statuses.filter(s=>s.enFinal).length;
    const enMissing=statuses.filter(s=>!s.hasEn).length;
    const drafts=statuses.filter(s=>s.localDraft).length;
    $('chapterReviewHeading').textContent='Status Bab · '+chapter.title;
    $('chapterReviewTotal').textContent=n+' pasal';
    $('chapterIndonesianStatus').textContent='Indonesia final '+idFinal+'/'+n;
    $('chapterEnglishStatus').textContent='Inggris final '+enFinal+'/'+n;
    $('chapterEnglishMissing').textContent=enMissing+' terjemahan Inggris belum tersedia';
    const scope=$('chapterLanguage').value||'both';
    const missing=statuses.filter(s=>!languageAvailable(s,scope)).length;
    const allFinal=statuses.every(s=>languageFinal(s,scope));
    $('confirmChapterButton').disabled=n===0||missing>0||drafts>0||allFinal;
    $('confirmChapterButton').title=missing?'Ada '+missing+' pasal tanpa teks '+scopeName(scope):
      drafts?'Ada '+drafts+' draf lokal yang belum diajukan':
      allFinal?'Seluruh pasal dalam bahasa yang dipilih sudah final':'Buat satu pengajuan untuk semua pasal bab ini';
    $('chapterReviewHelp').textContent=missing?
      missing+' pasal belum memiliki terjemahan '+scopeName(scope)+'. Pilih bahasa lain atau lengkapi teks terlebih dahulu.':
      drafts?drafts+' pasal memiliki draf lokal. Ajukan perubahan dahulu sebelum meminta finalisasi bab.':
      allFinal?'Semua pasal pada cakupan ini sudah final berdasarkan status repository.':
      'Pengajuan massal mencakup '+n+' pasal. Pengelola tetap memeriksa tiap pasal sebelum menerbitkan status Final.';
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
    const status=statusFor(r), {idFinal,enFinal,bothFinal}=status;
    $('passageStatus').textContent=bothFinal?'Final':(idFinal||enFinal?'Sebagian final':'Perlu review');
    $('passageStatus').classList.toggle('final',bothFinal);
    $('passageStatus').classList.toggle('partial',!bothFinal&&(idFinal||enFinal));
    $('reviewDetail').textContent='Indonesia: '+(idFinal?'final':'perlu review')+
      ' · Inggris: '+(enFinal?'final':'perlu review');
    updatePassageActions();
    renderChapterReview();
    showHanzi(p.ruby_paragraphs);
    $('indonesianText').textContent=p.translation_indonesian||'Terjemahan belum tersedia.';
    const mappings=englishAlignments.get(p.id)||[];
    const segments=mappings.flatMap(entry=>entry.english_segments||[]);
    const en=englishTextFor(p.id).trim();
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
    $('editEnglish').value=d?.enText??englishTextFor(passageId);
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
    if(d.idText===p.translation_indonesian&&d.enText===englishTextFor(passageId)&&!d.reason.trim())
      delete drafts[passageId];
    else drafts[passageId]=d;
    if(persist())feedback('Draf tersimpan di browser ini. Belum diajukan kepada pemeriksa.');
    draftCount();navigation();reader();
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
    if(d.enText!==englishTextFor(p.id)){
      body+='### Terjemahan Inggris sebelumnya\n\n'+(englishTextFor(p.id)||'(Belum tersedia)')+'\n\n';
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
    if(d.idText===r.passage.translation_indonesian&&d.enText===englishTextFor(passageId)){
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
  function openEditorialIssue(title,body,feedbackId){
    const fullUrl=REPO+'/issues/new?title='+encodeURIComponent(title)+'&body='+encodeURIComponent(body);
    const fallbackBody='Buka issue ini untuk pemeriksaan editorial. Rincian lengkap ada pada teks yang disalin dari editor.';
    const shortUrl=REPO+'/issues/new?title='+encodeURIComponent(title)+'&body='+encodeURIComponent(fallbackBody);
    if(fullUrl.length>7500 && navigator.clipboard?.writeText)
      navigator.clipboard.writeText(body).catch(()=>{});
    window.open(fullUrl.length<=7500?fullUrl:shortUrl,'_blank','noopener,noreferrer');
    $(feedbackId).textContent=fullUrl.length<=7500?
      'Formulir GitHub disiapkan. Kirim issue untuk meminta pemeriksaan; status belum berubah.':
      'Formulir GitHub disiapkan. Jika rincian berhasil disalin, tempelkan ke issue. Status belum berubah.';
  }
  function requestEditorialStatus(requestedStatus){
    const r=record();if(!r)return;
    const scope=$('passageLanguage').value||'both',status=statusFor(r);
    if(requestedStatus==='final'&&status.localDraft){
      $('reviewHelp').textContent='Ada draf lokal. Ajukan koreksi terlebih dahulu.';
      return;
    }
    if(requestedStatus==='final'&&!languageAvailable(status,scope)){
      $('reviewHelp').textContent='Terjemahan '+scopeName(scope)+' belum tersedia. Pilih bahasa yang tersedia atau lengkapi teks.';
      return;
    }
    const p=r.passage,review=reviewStatuses.get(p.id)||{};
    const english=englishTextFor(p.id).trim();
    const title=(requestedStatus==='final'?'Konfirmasi final':'Perlu review')+
      ' '+book(r.chapter.book).name+' · '+r.chapter.title+' · Pasal '+p.number+' ['+p.id+']';
    const lines=[
      '## Pengajuan status editorial Kitab Ru',
      '',
      'Pasal: '+p.id,
      'Kitab: '+book(r.chapter.book).name,
      'Bab: '+r.chapter.title,
      'Tindakan: '+(requestedStatus==='final'?'Ajukan final':'Review ulang'),
      'Bahasa: '+scopeName(scope),
      'Status terbit saat ini: Indonesia '+(review.indonesian||'review')+
        ', Inggris '+(review.english||'review'),
      'Versi naskah: '+(bundle.content_version||'draf'),
      '',
      '### Hanzi asli',
      '',r.hanzi,'',
      '### Bahasa Indonesia (MATAKIN)',
      '',p.translation_indonesian||'(tidak tersedia)','',
      '### Bahasa Inggris (James Legge)',
      '',english||'(tidak tersedia)','',
      '### Checklist pemeriksa',
      '- [ ] Hanzi sesuai dengan rentang pasal',
      '- [ ] Terjemahan Indonesia sesuai edisi MATAKIN',
      '- [ ] Terjemahan Inggris dan referensi edisi Legge cocok',
      '- [ ] Batas pasal berbeda (jika ada) telah dipetakan',
      '',
      'Issue ini bukan keputusan final. Untuk mengesahkan, buat PR terpisah yang mengubah snapshot di dist/sishu-review-status.json untuk bahasa yang dipilih saja.'
    ];
    openEditorialIssue(title,lines.join('\n'),'reviewHelp');
  }
  function requestChapterStatus(requestedStatus){
    const ch=selectedChapter();if(!ch)return;
    const rows=chapterRecords(),scope=$('chapterLanguage').value||'both';
    const statuses=rows.map(statusFor);
    if(requestedStatus==='final'){
      const localDrafts=statuses.filter(s=>s.localDraft).length;
      const missing=statuses.filter(s=>!languageAvailable(s,scope)).length;
      if(localDrafts||missing){
        $('chapterReviewHelp').textContent='Belum bisa mengajukan finalisasi: '+
          missing+' pasal belum lengkap, '+localDrafts+' memiliki draf lokal.';
        return;
      }
      if(statuses.every(s=>languageFinal(s,scope))){
        $('chapterReviewHelp').textContent='Seluruh pasal pada bahasa ini sudah final.';
        return;
      }
    }
    const title=(requestedStatus==='final'?'Finalisasi bab':'Review ulang bab')+
      ' · '+book(ch.book).name+' · '+ch.title+' · '+scopeName(scope);
    const checklist=rows.map((r,i)=>{
      const st=statuses[i],p=r.passage;
      const parts=['- [ ] '+p.id+' (Pasal '+p.number+')',
        'ID: '+(st.idFinal?'final':'review'),'EN: '+(st.enFinal?'final':st.hasEn?'review':'kosong')];
      return parts.join(' · ');
    });
    const lines=[
      '## Pemeriksaan massal — '+book(ch.book).name+' / '+ch.title,
      '',
      'ID bab: '+ch.id,
      'Bahasa yang diminta: '+scopeName(scope),
      'Tindakan: '+(requestedStatus==='final'?'permohonan finalisasi':'permohonan review ulang'),
      'Versi paket: '+(bundle.content_version||'draf'),
      'Jumlah pasal: '+rows.length,
      'Terjemahan Inggris belum tersedia: '+statuses.filter(s=>!s.hasEn).length,
      '',
      '### Daftar pemeriksaan per pasal',
      '',
      ...checklist,
      '',
      '### Aturan persetujuan',
      '- [ ] Cocokkan Hanzi, pinyin, MATAKIN, sumber dan teks Legge per pasal.',
      '- [ ] Periksa pasal yang dipisah atau digabung antara dua edisi.',
      '- [ ] Pengelola menerbitkan snapshot teks/Hanzi lengkap, reviewed_by, reviewed_at dan source_issue untuk setiap pasal melalui PR.',
      '- [ ] Hanya bahasa yang dipilih yang berubah. Jangan menyatakan Final otomatis hanya karena issue dibuat.',
      '',
      'Registry: dist/sishu-review-status.json'
    ];
    openEditorialIssue(title,lines.join('\n'),'chapterReviewHelp');
  }
  $('confirmFinalButton').onclick=()=>requestEditorialStatus('final');
  $('requestReviewButton').onclick=()=>requestEditorialStatus('review');
  $('passageFilter').onchange=navigation;
  $('passageLanguage').onchange=updatePassageActions;
  $('chapterLanguage').onchange=renderChapterReview;
  $('confirmChapterButton').onclick=()=>requestChapterStatus('final');
  $('reviewChapterButton').onclick=()=>requestChapterStatus('review');
  $('editButton').onclick=beginEdit;$('resumeDraft').onclick=beginEdit;
  $('closeEdit').onclick=close;$('saveDraft').onclick=save;
  $('discardDraft').onclick=discard;$('submitProposal').onclick=submit;
  for(const id of ['editIndonesian','editEnglish','editReason'])$(id).addEventListener('input',save);
  draftCount();load();
})();
