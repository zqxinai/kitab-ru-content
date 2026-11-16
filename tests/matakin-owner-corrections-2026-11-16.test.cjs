'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const owner=read('sources/references/matakin-owner-corrections-2026-11-16.json');
const chapters=read('sishu/manifest.json').chapters.map(c=>read(c.path));
const all=chapters.flatMap(c=>c.passages),byId=new Map(all.map(p=>[p.id,p]));
const overlay=require('../ru-classics/reference-overlay.js');
const grouped=require('../ru-classics/reference-links.js');
const same=require('../ru-classics/same-book-references.js');
const book=require('../ru-classics/book-references.js');
const verses=require('../ru-classics/subverses.js');
const canNavigate=r=>{const p=byId.get(r.target_id);return !!p&&(!r.ayat||!!verses.splitIndonesia(p.translation_indonesian)?.some(v=>v.number===r.ayat));};
const view=(id,text)=>book.expand(same.expand(id,grouped.parts(id,text,overlay),canNavigate),canNavigate);
test('Owner 2012 decisions cover nine distinct exact citations in 965 unchanged passages',()=>{
 assert.equal(chapters.length,78);assert.equal(all.length,965);
 assert.equal(owner.records.length,9);
 assert.equal(new Set(owner.records.map(r=>r.passage_id+'::'+r.source)).size,9);
 assert.equal(overlay.records.length,126);
 for(const r of owner.records){
  const p=byId.get(r.passage_id);assert.ok(p,'Missing passage '+r.passage_id);
  assert.equal(p.translation_indonesian.split(r.source).length,2,'Source must appear once: '+r.passage_id);
  assert.equal(overlay.records.filter(x=>x.passage_id===r.passage_id&&x.source===r.source).length,1);
  assert.ok(overlay.present(r.passage_id,p.translation_indonesian).includes(r.display));
  assert.equal(overlay.present(r.passage_id,r.display),r.display,'Already normalized view must be idempotent');
  const parsed=overlay.segments(r.passage_id,r.source);
  assert.equal(parsed.map(x=>x.text).join(''),r.display);
  if(r.target_id)assert.ok(byId.has(r.target_id),'Missing curated target '+r.target_id);
  assert.ok(r.decision);
  assert.ok(!p.translation_indonesian.includes('Zhong Yong Bab VIII'),'No source text rewrite');
 }
});
test('Lun Yu XVIII:1 links to Mengzi II A:1/8 precisely, never ayat 5 or a note',()=>{
 const id='sishu.lunyu.18.01',raw='(Mengzi - Bingcu IIA: 1/8)';
 const result=view(id,raw);
 assert.deepEqual(result,[{text:'(Mengzi — Bing Cu II A:1/8)',target_id:'sishu.mengzi.03.01',ayat:8}]);
 assert.ok(canNavigate(result[0]),'Mengzi II A:1 must contain ayat 8');
 const target=byId.get('sishu.mengzi.03.01');
 const v=verses.splitIndonesia(target.translation_indonesian);
 assert.ok(v.find(x=>x.number===8)?.text.startsWith('"Siapakah') || v.find(x=>x.number===8)?.text.length>20);
 assert.equal(owner.records.find(x=>x.passage_id===id).note,undefined);
});
test('Zhong Yong VIII is one-passage chapter: display chapter, link to sole passage',()=>{
 const zy=chapters.find(c=>c.book==='zhongyong'&&c.index===9);
 assert.ok(zy);assert.equal(zy.passages.length,1);
 for(const id of ['sishu.lunyu.05.08','sishu.lunyu.12.20']){
  const result=view(id,'(T.S. VIII)');
  assert.deepEqual(result,[{text:'(Tengah Sempurna — Zhong Yong Bab VIII)',target_id:'sishu.zhongyong.09.01',ayat:null}]);
 }
 assert.deepEqual(view('sishu.lunyu.09.08','(T.S. V)'),[{text:'(Tengah Sempurna — Zhong Yong V)',target_id:null}]);
});
test('Lun Yu II:11 corrected XXVI:6; Lun Yu XIV:10 corrected I:15',()=>{
 const a=view('sishu.lunyu.02.11','(T.S. XXV1:6)');
 const b=view('sishu.lunyu.14.10','(S.S. 1:15)');
 assert.equal(a[0].target_id,'sishu.zhongyong.27.06');
 assert.match(a[0].text,/XXVI:6/);
 assert.equal(b[0].target_id,'sishu.lunyu.01.15');
 assert.match(b[0].text,/Lun Yu I:15/);
});
test('Unconfirmed V A:3/4 remains printed, unlinked and documented; contextual candidate has Chinese grounding',()=>{
 const id='sishu.lunyu.06.26';
 const a=view(id,'(Bc.VA: 3/4)');
 assert.equal(a.length,1);assert.equal(a[0].target_id,null);
 assert.match(a[0].note,/V A:2 ayat 4/);
 assert.match(a[0].text,/V A:3\/4/);
 const m=byId.get('sishu.mengzi.09.02');
 const hanzi=m.ruby_paragraphs.flat().map(t=>t.traditional||t.value||'').join('');
 assert.match(hanzi,/故君子可欺以其方，難罔以非其道/);
 const candidate=verses.splitIndonesia(m.translation_indonesian);
 assert.ok(candidate?.some(v=>v.number===4),'Candidate Mengzi V A:2 ayat 4 present');
});
test('Mengzi II A:2 ayat 26: Zhong Yong chapter range plus three separate clickable Lun Yu XIX references',()=>{
 const id='sishu.mengzi.03.02',p=byId.get(id);
 assert.match(verses.splitIndonesia(p.translation_indonesian)?.find(v=>v.number===26)?.text||'',/TS\.XXIX- XXXI;SS 23-25/);
 const result=view(id,'(TS.XXIX- XXXI;SS 23-25)');
 assert.equal(result.map(v=>v.text).join(''),'(Tengah Sempurna — Zhong Yong Bab XXIX–XXXI; Sabda Suci — Lun Yu XIX:23,24,25)');
 assert.deepEqual(result.filter(v=>v.target_id).map(v=>v.target_id),['sishu.lunyu.19.23','sishu.lunyu.19.24','sishu.lunyu.19.25']);
 assert.ok(result.some(v=>v.text.includes('Bab XXIX–XXXI')&&!v.target_id));
});
test('Shi Jing external references are named but never assigned fictitious Si Shu target',()=>{
 for(const [id,raw,display] of [
  ['sishu.mengzi.01.07','(II.5.4.4)','(Shi Jing — Si King II.5.4.4)'],
  ['sishu.daxue.03.03','(Si-kingIII.1.1.1)','(Shi Jing — Si King III.1.1.4)']
 ]){
   const result=view(id,raw);
   assert.equal(result.map(p=>p.text).join(''),display);
   assert.ok(result.every(p=>!p.target_id));
 }
});
