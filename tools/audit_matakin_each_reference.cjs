#!/usr/bin/env node
'use strict';
/* Read-only per-occurrence MATAKIN reference audit across all Si Shu chapters.
 * Never infer an external book solely from unlabelled roman numerals. */
const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(base,f),'utf8'));
const old=require('./audit_matakin_references.cjs');
const overlay=require('../ru-classics/reference-overlay.js');
const groups=require('../ru-classics/reference-links.js');
const same=require('../ru-classics/same-book-references.js');
const books=require('../ru-classics/book-references.js');
const subverse=require('../ru-classics/subverses.js');
const manifest=read('sishu/manifest.json');
const chapters=manifest.chapters.map(m=>read(m.path));
const all=chapters.flatMap(c=>c.passages);
if(chapters.length!==78||all.length!==965)throw Error('Dataset must contain 78 chapters and 965 passages');
const index=new Map(all.map(p=>[p.id,p]));
const canLink=r=>{const p=index.get(r.target_id);return !!p&&(!r.ayat||!!subverse.splitIndonesia(p.translation_indonesian)?.some(v=>v.number===r.ayat));};
const render=(id,source)=>books.expand(same.expand(id,groups.parts(id,source,overlay),canLink),canLink);
const outside=/Shi\s*Jing|Shijing|Si[\s-]*king|Shu\s*Jing|Su[\s-]*king|Shujing|Li\s*Ji|Liji|Yi\s*Jing|Yijing|Zhou\s*Yi|Chunqiu|Kitab\s*Sanjak|Kitab\s*Hikayat|Lee\s*Ki/i;
const inside=/\b(?:S\s*\.?\s*S|B\s*\.?\s*C|T\s*\.?\s*S|A\s*\.?\s*B)\s*\.?\s*(?=[IVXLCDM]|\d)|Sabda Suci|Lun Yu|Ajaran Besar|Da Xue|Tengah Sempurna|Zhong Yong|Mengzi|Bing Cu/i;
const looksLike=/(?:\b[IVXLCDM]{1,10}\s*[. ]\s*[AB]\s*[.:]?\s*\d+)|(?:\b[IVXLCDM]{1,10}\s*[.: ]\s*\d{1,3})|(?:\b\d+\s*[.:]\s*\d+(?:\s*[.:]\s*\d+)*)/i;
const baseline=old.scan();
const existing=new Set(baseline.all_references.map(r=>r.passage_id+'\0'+r.offset+'\0'+r.original_reference));
const candidates=baseline.all_references.map(r=>({...r,discovery:'existing-125-character-scanner'}));
let additional=0;
for(const ch of chapters)for(const p of ch.passages){
 const source=p.translation_indonesian||'';
 for(const m of source.matchAll(/\(([^()\n]{1,350})\)/g)){
  if(!looksLike.test(m[1]))continue;
  const key=p.id+'\0'+m.index+'\0'+m[0];
  if(existing.has(key))continue;
  const group=old.classify(m[1],ch.book)||{kind:'unusual-format',confidence:'unknown',target_book:null};
  candidates.push({passage_id:p.id,book:ch.book,original_reference:m[0],offset:m.index,context:source.slice(Math.max(0,m.index-55),m.index+m[0].length+55),discovery:'longer-parenthetical-scan',...group});
  existing.add(key);additional++;
 }
}
candidates.sort((a,b)=>a.passage_id.localeCompare(b.passage_id)||a.offset-b.offset);
const ledger=[];
for(const r of candidates){
 const parts=render(r.passage_id,r.original_reference);
 const targets=parts.filter(x=>x.target_id).map(x=>({id:x.target_id,ayat:x.ayat||null}));
 const unresolved=parts.filter(x=>!x.target_id&&looksLike.test(x.text)).map(x=>x.text.trim()).filter(Boolean);
 let status,action;
 if(targets.length&&unresolved.length){status='tautan-sebagian';action='Periksa bagian rujukan tanpa tujuan dan simbol separator';}
 else if(targets.length){status='si-shu-tertaut';action='Tautan teknis valid; format cetakan 2012 belum otomatis terverifikasi';}
 else if(outside.test(r.original_reference)){status='kitab-luar-si-shu';action='Kitab diketahui, tetapi ayatnya belum tersedia sebagai target di Ru Classics';}
 else if(inside.test(r.original_reference)){status='si-shu-belum-tertaut';action='Teliti bentuk penomoran dan keberadaan pasal atau ayat yang dituju';}
 else {status='asal-belum-pasti';action='Teliti konteks dan bukti cetak; jangan inferensi nama kitab dari angka';}
 ledger.push({no:ledger.length+1,id:r.passage_id,book:r.book,offset:r.offset,source:r.original_reference,display:parts.map(x=>x.text).join(''),status,kind:r.kind,discovery:r.discovery,targets,unresolved,context:r.context||'',action});
}
const summary={chapters:78,passages:965,baseline:baseline.reviewed_references,additional,total:ledger.length,statuses:{},byBook:{}};
for(const r of ledger){summary.statuses[r.status]=(summary.statuses[r.status]||0)+1;let b=summary.byBook[r.book]||(summary.byBook[r.book]={total:0,statuses:{}});b.total++;b.statuses[r.status]=(b.statuses[r.status]||0)+1;}
const output=path.join(base,'audit','reports');fs.mkdirSync(output,{recursive:true});
const stem=path.join(output,'matakin-reference-every-occurrence-2026-11-16');
fs.writeFileSync(stem+'.json',JSON.stringify({schema:'ru-reference-audit.v2',warning:'Technical check of transcribed references, not full 2012 photo collation.',summary,records:ledger},null,2)+'\n');
const cols=['no','id','book','offset','source','display','status','kind','targets','unresolved','action','context'];
const csvcell=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
fs.writeFileSync(stem+'.csv',cols.join(',')+'\n'+ledger.map(r=>cols.map(k=>csvcell(k==='targets'?r.targets.map(v=>v.id+(v.ayat?'/'+v.ayat:'')).join(' ; '):k==='unresolved'?r.unresolved.join(' ; '):r[k])).join(',')).join('\n')+'\n');
const escapeCell=x=>String(x??'').replace(/\|/g,'\\|').replace(/\r?\n/g,' ').slice(0,310);
const md=[
 '# Audit rujukan Ru Classics per kemunculan (16 November 2026)','',
 'Memeriksa seluruh 965 pasal dari 78 bab. Tujuan tautan hanya ditetapkan ketika tersedia dalam dataset; rujukan luar Si Shu tidak diberi tujuan semu. Yang diperiksa adalah identitas teknis, bukan validitas kaitan ajaran MATAKIN.','',
 '## Rekap','',
 'Jumlah pemindai lama: '+summary.baseline+'. Tambahan kandidat: '+additional+'. Total: '+ledger.length+'.','',
 '| Status | Jumlah |','|---|---:|',
 ...Object.entries(summary.statuses).map(([name,n])=>'| '+name+' | '+n+' |'),
 '','## Per kitab','','| Kitab | Rujukan |','|---|---:|',
 ...Object.entries(summary.byBook).map(([k,v])=>'| '+k+' | '+v.total+' |'),
 '','## Kasus yang belum menjadi tautan lengkap','','| No | Pasal | Kutipan rujukan | Status | Tujuan sementara |','|---:|---|---|---|---|',
 ...ledger.filter(v=>v.status!=='si-shu-tertaut').map(v=>'| '+v.no+' | '+v.id+' | '+escapeCell(v.source)+' | '+v.status+' | '+escapeCell(v.targets.map(x=>x.id+(x.ayat?'/'+x.ayat:'')).join(', '))+' |'),
 '','## Semua kemunculan rujukan','','| No | Pasal | Teks asal | Tampilan | Status | Target terverifikasi |','|---:|---|---|---|---|---|',
 ...ledger.map(v=>'| '+v.no+' | '+v.id+' | '+escapeCell(v.source)+' | '+escapeCell(v.display)+' | '+v.status+' | '+escapeCell(v.targets.map(x=>x.id+(x.ayat?'/'+x.ayat:'')).join(', '))+' |'),
 '','**Batasan:** OCR, sitasi di luar tanda kurung, rujukan yang salah tanda baca, atau panjang di atas 350 karakter masih bisa luput. Lihat CSV dan JSON untuk offset dan konteks lengkap.',''
].join('\n');
fs.writeFileSync(stem+'.md',md);
console.log('REFERENCE_AUDIT_SUMMARY '+JSON.stringify(summary));
for(const status of ['si-shu-belum-tertaut','tautan-sebagian','asal-belum-pasti','kitab-luar-si-shu']){
 const cases=ledger.filter(x=>x.status===status);
 console.log('GROUP '+status+' '+cases.length);
 for(const x of cases.slice(0,status==='si-shu-belum-tertaut'?50:25))console.log('CASE '+JSON.stringify({n:x.no,id:x.id,ref:x.source,targets:x.targets.map(t=>t.id+(t.ayat?'/'+t.ayat:''))}));
}
module.exports={summary,ledger};
