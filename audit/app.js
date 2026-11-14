/* Ru Classics Audit Studio: source texts are read-only; approval is a proposal. */
'use strict';
(()=>{
const $=id=>document.getElementById(id);
const REPO='https://github.com/zqxinai/kitab-ru-content',KEY='ru-classics-audit-proposals-v1';
const BOOKS={daxue:['Da Xue','大學','Ajaran Besar'],zhongyong:['Zhong Yong','中庸','Tengah Sempurna'],lunyu:['Lun Yu','論語','Sabda Suci'],mengzi:['Mengzi','孟子','Kitab Mengzi']};
const CHECKS=[
['hanzi','Hanzi dibandingkan dengan saksi otoritatif; varian dibedakan dari teks utama'],
['pinyin','Pinyin diperiksa karakter demi karakter, termasuk pembacaan polifonik'],
['matakin','Teks Indonesia MATAKIN dipertahankan dan diperiksa terhadap sumber'],
['english','Terjemahan Inggris serta batas pasal dicocokkan berdasar Hanzi, bukan nomor saja'],
['annotation','Komentar Zhu Xi dan anotasi penyunting dipisahkan dari teks asli'],
['editor','Regression check navigasi, filter, pencarian, dan editor web lulus'],
['offline','Regression check data dan paket offline Android lulus']
];
const S={bundle:null,records:[],byId:new Map(),align:new Map(),splits:new Map(),reviews:new Map(),edition:new Map(),book:'daxue',batch:0,selected:null,query:'',enFilter:'all',zhFilter:'all',local:{schema:'ru-classics.audit-proposals.v1',entries:{}}};
const node=(tag,cl='',txt)=>{let e=document.createElement(tag);if(cl)e.className=cl;if(txt!==undefined)e.textContent=String(txt);return e};
const norm=s=>String(s??'').normalize('NFKC').toLowerCase();
const hanzi=p=>(p.ruby_paragraphs||[]).map(q=>q.map(t=>t.type==='ruby'?t.traditional||'':t.value||'').join('')).join('\n');
const pinyin=p=>(p.ruby_paragraphs||[]).map(q=>q.map(t=>t.type==='ruby'?t.pinyin||'':t.value||'').join(' ')).join('\n');
const notice=t=>{$('toast').textContent=t;$('toast').hidden=false;clearTimeout(notice.timer);notice.timer=setTimeout(()=>$('toast').hidden=true,4300)};
const httpsLink=(url,title)=>{if(!/^https:\/\//.test(url||''))return node('span','',title||url||'—');let a=node('a','',title||url);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a};
const rowNow=()=>S.byId.get(S.selected);
function sig(r){let v=JSON.stringify([r.p.id,r.hanzi,pinyin(r.p),r.p.translation_indonesian||'',r.english]),h=2166136261;for(let i=0;i<v.length;i++)h=Math.imul(h^v.charCodeAt(i),16777619);return 'fnv1a32-'+(h>>>0).toString(16).padStart(8,'0')}
function local(id){if(!S.local.entries[id])S.local.entries[id]={checks:{},history:[]};return S.local.entries[id]}
function log(e,action,detail=''){(e.history||(e.history=[])).push({at:new Date().toISOString(),action,detail});e.history=e.history.slice(-100)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S.local));return true}catch(_){notice('Penyimpanan browser gagal. Coba ekspor hasil audit.');return false}}
function getSaved(){try{let d=JSON.parse(localStorage.getItem(KEY)||'null');if(d?.schema===S.local.schema&&d.entries&&typeof d.entries==='object'&&!Array.isArray(d.entries))S.local=d}catch(_){}}
async function fetchJson(path,optional=false){try{let res=await fetch('../'+path,{credentials:'omit',cache:'no-store'});if(!res.ok)throw Error(path+' ('+res.status+')');return await res.json()}catch(e){if(optional)return null;throw e}}
function trace(rev){return typeof rev.reviewed_by==='string'&&!!rev.reviewed_by.trim()&&typeof rev.reviewed_at==='string'&&!!rev.reviewed_at.trim()&&Number.isInteger(rev.source_issue)&&rev.source_issue>0}
function status(r){
 const v=S.reviews.get(r.p.id)||{},t=trace(v)&&v.hanzi_span===r.hanzi;
 const enFinal=t&&v.english==='final'&&!!r.english.trim()&&v.english_text===r.english;
 const idFinal=t&&v.indonesian==='final'&&v.indonesian_text===r.p.translation_indonesian;
 const zhFinal=t&&['verified','final'].includes(v.hanzi||v.hanzi_status||v.hanzi_audit);
 const e=S.local.entries[r.p.id],pending=!!(e?.approval?.fingerprint===sig(r));
 const mismatch=!!e?.note;
 return {enFinal,idFinal,zhFinal,pending,mismatch,en:r.english?enFinal?'Final':r.warning?'Perlu Review':'Draft':'Perlu Review',zh:zhFinal?'Terverifikasi':'Belum terverifikasi'};
}
function textline(target,key,value){const p=node('p');p.append(node('strong','',key+': '),document.createTextNode(String(value??'—')));target.append(p)}
function mappingEnglish(id,p){let a=S.align.get(id)||[];let v=a.map(e=>e.indonesian_passage_ids.length>1?String(S.splits.get(id)||'').trim():(e.english_segments||[]).map(x=>String(x.text||'').trim()).filter(Boolean).join('\n\n')).filter(Boolean).join('\n\n');return v||(a.length?'':String(p.translation_english||''))}
async function load(){
 $('syncBadge').textContent='Memuat sumber…';$('loadError').hidden=true;
 try{
 const [b,aligned,splits,review,ed]=await Promise.all([fetchJson('dist/sishu-content.json'),fetchJson('dist/sishu-english-alignment.json',true),fetchJson('dist/sishu-english-passage-splits.json',true),fetchJson('dist/sishu-review-status.json',true),fetchJson('sishu/editions/matakin-2012-chapters.json',true)]);
 if(b?.schema!=='ru-classics.content.v1'||b.collection!=='sishu'||!Array.isArray(b.chapters))throw Error('Schema sumber tidak dikenali.');
 if(aligned?.schema&&aligned.schema!=='kitab-ru.english-alignment.v1')throw Error('Schema alignment tidak dikenali.');
 if(review?.schema&&review.schema!=='kitab-ru.review-status.v1')throw Error('Schema persetujuan tidak dikenali.');
 if(splits?.schema&&splits.schema!=='kitab-ru.english-passage-splits.v1')throw Error('Schema pemisahan Inggris tidak dikenali.');
 S.bundle=b;S.align.clear();S.splits.clear();S.reviews.clear();S.edition.clear();S.byId.clear();S.records=[];
 const splitByEntry=new Map((splits?.entries||[]).map(x=>[x.alignment_id,x]));
 for(const a of aligned?.entries||[])if(a.indonesian_passage_ids?.length>1){
  const parts=splitByEntry.get(a.id)?.passage_texts;
  if(!parts||a.english_segments?.length!==1||
      Object.keys(parts).length!==a.indonesian_passage_ids.length||
      a.indonesian_passage_ids.some(id=>!String(parts[id]||'').trim())||
      a.indonesian_passage_ids.map(id=>parts[id]).join('')!==a.english_segments[0].text)continue;
  for(const id of a.indonesian_passage_ids)S.splits.set(id,parts[id]);
 }
 for(const a of aligned?.entries||[])if(Array.isArray(a.indonesian_passage_ids)&&Array.isArray(a.english_segments))for(const id of a.indonesian_passage_ids){let v=S.align.get(id)||[];v.push(a);S.align.set(id,v)}
 for(const r of review?.entries||[])if(typeof r.passage_id==='string'&&!S.reviews.has(r.passage_id))S.reviews.set(r.passage_id,r);
 if(ed?.schema==='ru-classics.edition-chapters.v1')for(const ch of ed.chapters||[])S.edition.set(ch.id,ch);
 const order=Object.keys(BOOKS);
 for(const ch of b.chapters.slice().sort((a,b)=>order.indexOf(a.book)-order.indexOf(b.book)||a.index-b.index))for(const p of (ch.passages||[]).slice().sort((a,b)=>a.number-b.number)){
 if(!p.id||S.byId.has(p.id))throw Error('ID pasal duplikat: '+p.id);
 let r={ch,p,hanzi:hanzi(p),alignment:S.align.get(p.id)||[],english:mappingEnglish(p.id,p)};
 r.warning=!(r.english.trim())||/commentary|mixed|withheld|ambiguous/i.test(String(p.translation_english_alignment||''))||r.alignment.some(a=>/mixed.commentary|unmapped|withheld|ambiguous/i.test(String(a.status||'')+' '+String(a.review_reason||'')));
 r.search=norm([p.id,ch.title,r.hanzi,pinyin(p),p.translation_indonesian,r.english].join(' '));
 S.records.push(r);S.byId.set(p.id,r)
 }
 if(!S.records.length)throw Error('Tidak ada pasal.');
 $('syncBadge').textContent='Terhubung · '+S.records.length+' pasal';
 $('versionInfo').textContent='Versi '+(b.content_version||'—');
 $('editionInfo').textContent=ed?.edition||'Metadata edisi 2012 tidak termuat';
 if(S.records.length!==965){$('loadError').hidden=false;$('loadError').textContent='Peringatan: total sumber '+S.records.length+' tidak sama baseline 965; jangan terbitkan perubahan.'}
 else if(!aligned||!review){$('loadError').hidden=false;$('loadError').textContent='Sebagian file alignment atau status tidak tersedia. Jangan menyimpulkan Final dari data yang tidak termuat.'}
 metrics();books();todos();list();
 }catch(e){$('syncBadge').textContent='Sumber gagal dimuat';$('loadError').hidden=false;$('loadError').textContent='Gagal memuat naskah: '+e.message+'. Data sumber tidak berubah.';$('rows').replaceChildren(node('div','loading','Koleksi tidak bisa dibuka; coba Muat ulang.'))}
}
function metrics(){let a=S.records,available=a.filter(r=>r.english.trim()).length,fin=a.filter(r=>status(r).enFinal).length,zh=a.filter(r=>status(r).zhFinal).length;
 $('mTotal').textContent=a.length;$('mEnglish').textContent=available;$('mEnglishCaption').textContent=(a.length-available)+' Inggris belum tersedia';$('mFinal').textContent=fin+'/'+a.length;
 $('mFinalPct').textContent=(fin/a.length*100).toFixed(1)+'% dari seluruh pasal';$('mHanzi').textContent=zh+'/'+a.length;$('finalBar').style.width=(fin/a.length*100)+'%';$('hanziBar').style.width=(zh/a.length*100)+'%'}
function books(){let out=$('books');out.replaceChildren();for(const id of S.bundle.books){let spec=BOOKS[id]||[id,'書',''],btn=node('button','book'+(S.book===id?' active':''));btn.type='button';btn.append(node('span','char',spec[1]));let left=node('span');left.append(node('strong','',spec[0]),node('small','',spec[2]));btn.append(left,node('b','',S.records.filter(r=>r.ch.book===id).length));btn.onclick=()=>{S.book=id;S.batch=0;S.selected=null;books();list()};out.append(btn)}}
function filtered(){return S.records.filter(r=>{if(r.ch.book!==S.book)return false;let v=status(r);if(S.enFilter!=='all'&&v.en!==({draft:'Draft',review:'Perlu Review',final:'Final'}[S.enFilter]))return false;if(S.zhFilter==='verified'&&!v.zhFinal)return false;if(S.zhFilter==='review'&&v.zhFinal)return false;if(S.zhFilter==='discrepancy'&&!v.mismatch&&!(r.p.editorial_annotations||[]).some(a=>a.kind==='interpretive_comparison'))return false;return !S.query||r.search.includes(norm(S.query))})}
function list(){
 if(!S.bundle)return;let matches=filtered(),pages=Math.max(1,Math.ceil(matches.length/10));S.batch=Math.max(0,Math.min(S.batch,pages-1));
 let chunk=matches.slice(S.batch*10,S.batch*10+10),start=S.batch*10;
 $('resultCount').textContent=matches.length+' pasal sesuai filter';$('batchLabel').textContent='Kelompok '+(S.batch+1)+' / '+pages;$('batchSub').textContent=chunk.length?(start+1)+'–'+(start+chunk.length)+' dari '+matches.length:'Tidak ada pasal';
 $('prevBatch').disabled=S.batch===0;$('nextBatch').disabled=S.batch>=pages-1;
 let select=$('batchJump');select.replaceChildren();for(let k=0;k<pages;k++){let opt=node('option','',(k+1)+' / '+pages);opt.value=k;select.append(opt)}select.value=S.batch;
 let out=$('rows');out.replaceChildren();for(const r of chunk){let v=status(r),e=S.edition.get(r.ch.id),item=node('div','item'+(S.selected===r.p.id?' active':''));item.tabIndex=0;item.setAttribute('role','button');item.dataset.id=r.p.id;
 let left=node('div');left.append(node('div','id',(BOOKS[r.ch.book]?.[0]||r.ch.book)+' · '+r.p.number),node('div','sub',e?.label||r.ch.title));item.append(left,node('div','excerpt',r.p.translation_indonesian||'(Belum ada teks Indonesia)'),node('div','mini','Hanzi: '+v.zh),node('span','pill '+(v.enFinal?'ok':v.en==='Draft'?'':'warn'),v.en));
 item.onclick=()=>selectRow(r.p.id);item.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();selectRow(r.p.id)}};out.append(item)}
 if(!chunk.length)out.append(node('div','loading','Tidak ada hasil. Ganti filter atau pencarian.'));
 if(!chunk.some(r=>r.p.id===S.selected))S.selected=chunk[0]?.p.id||null;
 if(S.selected)detail();else{$('detailPanel').hidden=true;$('approvalPanel').hidden=true}
}
function selectRow(id){if(S.byId.has(id)){S.selected=id;detail();for(const e of $('rows').children)e.classList.toggle('active',e.dataset.id===id)}}
function ruby(r){let out=$('sourceText');out.replaceChildren();for(const para of r.p.ruby_paragraphs||[]){let p=node('p','zh');for(const t of para){if(t.type==='text')p.append(document.createTextNode(t.value||''));else if(t.type==='ruby'){let x=node('ruby');x.append(document.createTextNode(t.traditional||'□'));if(t.pinyin)x.append(node('rt','',t.pinyin));p.append(x)}}out.append(p)}if(!out.childNodes.length)out.append(node('p','empty','Hanzi tidak tersedia.'))}
function annotations(r){let out=$('annotationList');out.replaceChildren();let all=r.p.editorial_annotations||[];if(!all.length)out.append(node('p','muted','Belum ada komentar atau anotasi yang tercatat.'));for(const a of all){let x=node('div','annot');x.append(node('strong','',a.title_indonesian||'Anotasi terpisah'),node('small','',(a.attribution||'Sumber tidak dicantumkan')+' · '+(a.kind||'anotasi')));if(a.hanzi)x.append(node('p','quote',a.hanzi));if(a.description_indonesian)x.append(node('p','',a.description_indonesian));if(a.source_witness?.url){let p=node('p');p.append(httpsLink(a.source_witness.url,'Saksi teks · '+(a.source_witness.witness_file||'lihat sumber')));x.append(p)}if(a.edition_caveat)x.append(node('p','authnotice',a.edition_caveat));out.append(x)}}
function provenance(r){let out=$('sourceList');out.replaceChildren();let ch=r.ch,p=r.p,e=S.edition.get(ch.id);textline(out,'ID stabil',p.id);textline(out,'Berkas naskah','sishu/chapters/'+ch.book+'/'+String(ch.index).padStart(2,'0')+'.json');
 textline(out,'Indonesia','MATAKIN (sesuai data proyek; cetakan 2012 belum otomatis tervalidasi untuk tiap pasal)');
 if(e)textline(out,'Bab edisi 2012',(e.label||'')+' · '+(e.name||'')+(e.page?' · hlm. '+e.page:''));
 let sr=node('p');sr.append(node('strong','','Sumber Inggris: '),httpsLink(p.translation_english_source||'','Sumber Legge / periksa alignment'));out.append(sr);
 if(!r.alignment.length)textline(out,'Alignment','Bundel Inggris atau belum dipetakan');
 for(const a of r.alignment){textline(out,'Alignment',String(a.id||'tanpa ID')+' · '+(a.english_segments||[]).length+' segmen / '+(a.indonesian_passage_ids||[]).length+' ID Indonesia');if(a.source_url||a.url){let x=node('p');x.append(httpsLink(a.source_url||a.url,'Buka sumber alignment'));out.append(x)}}
 for(const a of r.p.editorial_annotations||[])if(a.source_witness?.url){let x=node('p');x.append(httpsLink(a.source_witness.url,'Sumber komentar · '+(a.source_witness.work||'rujukan')));out.append(x)}
}
function discrepancies(r){let out=$('discrepancyList');out.replaceChildren();let anns=(r.p.editorial_annotations||[]).filter(a=>a.kind==='interpretive_comparison');if(!anns.length)out.append(node('p','muted','Tidak ada discrepancy eksplisit dalam anotasi. Belum berarti lolos audit.'));for(const a of anns){let x=node('div','annot');x.append(node('strong','',a.title_indonesian||'Perbedaan bacaan'),node('p','',a.description_indonesian||''));out.append(x)}
 let v=S.local.entries[r.p.id];if(v?.note){let x=node('div','annot');x.append(node('strong','','Discrepancy lokal — terbuka'),node('p','',v.note),node('p','',v.source||''));out.append(x)}
 $('auditNote').value=v?.note||'';$('auditSource').value=v?.source||''}
function history(r){let v=S.reviews.get(r.p.id)||{},out=$('officialHistory');out.replaceChildren();
 if(trace(v)){textline(out,'Review resmi',(v.reviewed_by||'')+' · '+(v.reviewed_at||'')+' · issue #'+v.source_issue);let x=node('p');x.append(httpsLink(REPO+'/issues/'+v.source_issue,'Lihat GitHub Issue'));out.append(x)}else out.append(node('p','muted','Belum ada persetujuan Final resmi dalam registry.'));
 let list=$('localHistory');list.replaceChildren();let events=(S.local.entries[r.p.id]?.history||[]).slice().reverse();if(!events.length)list.append(node('li','','Belum ada riwayat lokal.'));for(const x of events.slice(0,30))list.append(node('li','',(x.at||'')+' · '+(x.action||'')+' '+(x.detail||'')))}
function userChecks(r){let v=S.local.entries[r.p.id];return v?.fingerprint===sig(r)?v.checks||{}:{}}
function valid(r){if(!r)return false;let s=status(r),c=userChecks(r);return CHECKS.every(([id])=>c[id]===true)&&!!$('reviewer').value.trim()&&!!$('approvalEvidence').value.trim()&&!!r.english.trim()&&!!r.hanzi.trim()&&!!pinyin(r.p).trim()&&!!String(r.p.translation_indonesian||'').trim()&&!s.mismatch&&!s.enFinal&&!r.warning}
function gate(r){let ok=valid(r),s=r?status(r):null;$('gateStatus').textContent=s?.enFinal?'Sudah Final resmi':ok?'Checklist lulus':'Belum lulus';$('gateStatus').className='pill '+(s?.enFinal||ok?'ok':'warn');$('approveBtn').disabled=!ok;$('issueBtn').disabled=!s?.pending}
function checklist(r){let out=$('regressionChecklist'),v=userChecks(r);out.replaceChildren();
 for(const [id,label] of CHECKS){let x=node('label','check'),input=node('input');input.type='checkbox';input.checked=!!v[id];input.onchange=()=>{let e=local(r.p.id);if(e.fingerprint!==sig(r)){e.fingerprint=sig(r);e.checks={};e.approval=null}e.checks[id]=input.checked;log(e,'Regression',id+' '+(input.checked?'✓':'dibatalkan'));save();gate(r)};x.append(input,node('span','',label));out.append(x)}gate(r)}
function detail(){let r=rowNow();if(!r)return;let s=status(r),ed=S.edition.get(r.ch.id);$('detailPanel').hidden=false;$('approvalPanel').hidden=false;
 $('detailLabel').textContent='Pemeriksaan '+(BOOKS[r.ch.book]?.[0]||r.ch.book);$('detailChapter').textContent=ed?.label?(ed.label+' · '+(ed.name||'')):r.ch.title;
 $('detailTitle').textContent='Pasal '+r.p.number;$('detailId').textContent=r.p.id;
 $('englishStatus').textContent=s.en;$('englishStatus').className='pill '+(s.enFinal?'ok':s.en==='Draft'?'':'warn');
 $('hanziStatus').textContent=s.zh;$('hanziStatus').className='pill '+(s.zhFinal?'ok':'warn');$('localStatus').hidden=!s.pending;$('localStatus').textContent='Usulan Final lokal · belum diterbitkan';
 $('editorLink').href='../editor/?passage='+encodeURIComponent(r.p.id);
 ruby(r);$('indonesianText').textContent=r.p.translation_indonesian||'Belum tersedia.';$('englishText').textContent=r.english||'Belum tersedia.';$('englishText').className=r.english?'':'empty';
 $('englishCaveat').textContent=r.alignment.length?'Teks Inggris dari '+r.alignment.length+' peta alignment; cocokkan pembagian pasal.':r.english?'Inggris tertanam dalam naskah; belum otomatis diverifikasi.':'Inggris belum tersedia. Jangan setujui Final.';
 annotations(r);provenance(r);discrepancies(r);history(r);$('reviewer').value=S.local.entries[r.p.id]?.reviewer||'';$('approvalEvidence').value=S.local.entries[r.p.id]?.evidence||'';checklist(r)}
function note(){let r=rowNow();if(!r)return;let note=$('auditNote').value.trim(),source=$('auditSource').value.trim();if(note&&!source){notice('Sertakan referensi discrepancy.');return}let e=local(r.p.id);e.note=note;e.source=source;if(note)e.approval=null;log(e,'Catatan audit',note?'Discrepancy dibuka':'Discrepancy ditutup');save();notice('Catatan disimpan lokal; naskah tidak berubah.');detail();todos();list()}
function approve(){let r=rowNow();if(!r||!valid(r)){notice('Checklist, bukti, atau status belum memenuhi syarat.');return}let e=local(r.p.id);e.fingerprint=sig(r);e.reviewer=$('reviewer').value.trim();e.evidence=$('approvalEvidence').value.trim();e.approval={status:'proposed-final',fingerprint:e.fingerprint,reviewer:e.reviewer,evidence:e.evidence,proposed_at:new Date().toISOString()};log(e,'Usulan Final','Belum status resmi');save();notice('Usulan disimpan secara lokal. Ajukan GitHub Issue untuk review resmi.');detail();todos();list()}
function issue(){let r=rowNow(),e=S.local.entries[r?.p?.id];if(!r||e?.approval?.fingerprint!==sig(r)){notice('Setujui usulan secara lokal terlebih dahulu.');return}
 let body=['## Pengajuan Final Ru Classics','', 'ID: '+r.p.id,'Reviewer: '+e.reviewer,'Bukti: '+e.evidence,'Fingerprint: '+e.fingerprint,'Versi: '+(S.bundle.content_version||'—'),
 'Alignment: '+(r.alignment.map(x=>x.id).filter(Boolean).join(', ')||'dari bundel'),
 'Checklist: '+CHECKS.map(([id])=>id+'='+!!e.checks?.[id]).join(', '),
 'Discrepancy: '+(e.note||'Tidak ada discrepancy lokal terbuka.'),'',
 'Persetujuan resmi wajib diverifikasi terhadap sumber dan digabung ke dist/sishu-review-status.json melalui proses review terpisah; issue ini bukan publikasi.'].join('\n');
 window.open(REPO+'/issues/new?title='+encodeURIComponent('Audit Final: '+r.p.id)+'&body='+encodeURIComponent(body),'_blank','noopener');
 notice('Halaman pengajuan GitHub dibuka; status belum Final resmi.')}
function exportJson(){let packet={schema:'ru-classics.audit-proposals.v1',generated_at:new Date().toISOString(),source_version:S.bundle?.content_version,baseline_count:S.records.length,warning:'Audit lokal; bukan registry Final resmi',entries:S.local.entries};
 let url=URL.createObjectURL(new Blob([JSON.stringify(packet,null,2)],{type:'application/json'})),a=node('a');a.href=url;a.download='ru-classics-audit-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);notice('Audit diekspor; bukan paket publikasi.')}
async function importJson(file){if(!file||file.size>2e6){notice('JSON audit harus berukuran di bawah 2 MB.');return}try{let d=JSON.parse(await file.text());if(d.schema!=='ru-classics.audit-proposals.v1'||!d.entries||Array.isArray(d.entries))throw Error('Schema tidak cocok');let count=0,skip=0;
 for(const [id,src] of Object.entries(d.entries)){let r=S.byId.get(id);if(!r||src.fingerprint!==sig(r)){skip++;continue}let e=local(id);e.fingerprint=src.fingerprint;e.note=String(src.note||'').slice(0,5000);e.source=String(src.source||'').slice(0,1500);e.reviewer=String(src.reviewer||'').slice(0,300);e.evidence=String(src.evidence||'').slice(0,1500);e.checks=Object.fromEntries(CHECKS.map(([k])=>[k,src.checks?.[k]===true]));if(src.approval?.status==='proposed-final'&&src.approval.fingerprint===src.fingerprint&&!e.note)e.approval=src.approval;log(e,'Impor','Fingerprint cocok');count++}
 save();todos();list();notice('Berhasil impor '+count+' pasal. '+skip+' ditolak karena ID/fingerprint.')}catch(err){notice('Gagal impor: '+err.message)}}
function todos(){if(!S.records.length)return;let arr=S.records,st=arr.map(status),todo=[['Inggris belum tersedia',arr.filter(r=>!r.english.trim()).length],['Inggris belum Final resmi',st.filter(x=>!x.enFinal).length],['Audit Hanzi belum Final',st.filter(x=>!x.zhFinal).length],['Indonesia belum Final resmi',st.filter(x=>!x.idFinal).length],['Usulan lokal menunggu review',st.filter(x=>x.pending&&!x.enFinal).length],['Discrepancy lokal terbuka',st.filter(x=>x.mismatch).length]];
 let out=$('todo');out.replaceChildren();for(const [label,n] of todo){let box=node('div');box.append(node('strong','',label),node('span','',n+' / '+arr.length));out.append(box)}}
$('reloadBtn').onclick=load;
$('search').oninput=e=>{S.query=e.target.value;S.batch=0;list()};
$('englishFilter').onchange=e=>{S.enFilter=e.target.value;S.batch=0;list()};
$('hanziFilter').onchange=e=>{S.zhFilter=e.target.value;S.batch=0;list()};
$('resetFilter').onclick=()=>{S.query='';S.enFilter='all';S.zhFilter='all';S.batch=0;$('search').value='';$('englishFilter').value='all';$('hanziFilter').value='all';list()};
$('prevBatch').onclick=()=>{S.batch=Math.max(0,S.batch-1);S.selected=null;list()};
$('nextBatch').onclick=()=>{S.batch++;S.selected=null;list()};
$('batchJump').onchange=e=>{S.batch=Number(e.target.value)||0;S.selected=null;list()};
$('saveNote').onclick=note;$('approveBtn').onclick=approve;$('issueBtn').onclick=issue;$('exportBtn').onclick=exportJson;
$('reviewer').oninput=()=>gate(rowNow());$('approvalEvidence').oninput=()=>gate(rowNow());
$('importFile').onchange=e=>{importJson(e.target.files?.[0]);e.target.value=''};
getSaved();load();
})();