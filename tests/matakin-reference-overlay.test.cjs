'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const overlay=require('../ru-classics/reference-overlay.js');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const chapters=read('sishu/manifest.json').chapters.map(x=>read(x.path));
const byId=new Map(chapters.flatMap(c=>c.passages.map(p=>[p.id,p])));
const expectedTargets={
 'sishu.lunyu.18.02':'sishu.lunyu.15.14',
 'sishu.lunyu.18.03':'sishu.lunyu.02.05',
 'sishu.lunyu.18.05':'sishu.lunyu.09.09',
 'sishu.lunyu.18.06':'sishu.lunyu.14.39',
 'sishu.lunyu.18.08':'sishu.lunyu.05.23',
 'sishu.daxue.05.01':'sishu.lunyu.12.13',
 'sishu.daxue.11.15':'sishu.lunyu.04.03',
 'sishu.daxue.11.18':'sishu.lunyu.13.26',
 'sishu.daxue.11.23':'sishu.mengzi.01.01',
 'sishu.mengzi.01.01':'sishu.daxue.11.23'
};
test('Seventy-five exact references preserve original sources and resolve only evidenced targets',()=>{
 assert.equal(chapters.length,78);
 assert.equal(byId.size,965);
 assert.equal(overlay.records.length,75);
 // Historical batch 01 is immutable; batch 02 allows multiple references in one passage.
 for(const [sourceId,targetId] of Object.entries(expectedTargets))
  assert.ok(overlay.records.some(r=>r.passage_id===sourceId&&r.target_id===targetId),'legacy mapping changed: '+sourceId);
 const batch2=[
  ['sishu.lunyu.05.07','sishu.lunyu.09.14'],
  ['sishu.lunyu.05.08','sishu.lunyu.02.06'],
  ['sishu.lunyu.05.08','sishu.lunyu.06.04'],
  ['sishu.lunyu.05.10','sishu.lunyu.03.21'],
  ['sishu.lunyu.06.04','sishu.lunyu.05.08'],
  ['sishu.lunyu.06.22','sishu.lunyu.02.05'],
  ['sishu.lunyu.06.30','sishu.lunyu.14.42'],
  ['sishu.lunyu.10.01','sishu.lunyu.03.15'],
  ['sishu.lunyu.10.07','sishu.lunyu.07.13'],
  ['sishu.lunyu.10.08','sishu.lunyu.09.16']
 ];
 for(const [sourceId,targetId] of batch2)
  assert.ok(overlay.records.some(r=>r.passage_id===sourceId&&r.target_id===targetId),'batch 02 reference absent: '+sourceId+' → '+targetId);
 const batch3=[
  ['sishu.lunyu.05.12','(A.B. IX: 4)','sishu.daxue.10.04'],
  ['sishu.lunyu.05.25','(S.S. I: 3)','sishu.lunyu.01.03'],
  ['sishu.lunyu.10.21','(S.S. III: 15)','sishu.lunyu.03.15'],
  ['sishu.lunyu.10.25','(S.S. IX: 10)','sishu.lunyu.09.10'],
  ['sishu.lunyu.16.09','(T.S. XIX: 9)','sishu.zhongyong.20.09'],
  ['sishu.lunyu.16.12','(S.S. XII: 10)','sishu.lunyu.12.10'],
  ['sishu.lunyu.12.10','(S.S. XVI: 12)','sishu.lunyu.16.12'],
  ['sishu.lunyu.12.14','(S.S. XIII: 3)','sishu.lunyu.13.03'],
  ['sishu.lunyu.12.16','(T.S. IX: 3)','sishu.zhongyong.10.03'],
  ['sishu.zhongyong.10.03','(S.S. XII:16)','sishu.lunyu.12.16'],
  ['sishu.lunyu.12.22','(Bc. VIIA: 46)','sishu.mengzi.13.46'],
  ['sishu.lunyu.12.13','(A.B. IV )',null],
  ['sishu.lunyu.12.20','(T.S. VIII)',null]
 ];
 for(const [source,ref,target] of batch3){
  const found=overlay.records.find(r=>r.passage_id===source&&r.source===ref);
  assert.ok(found,'missing batch 03: '+source+' '+ref);
  assert.equal(found.target_id,target,source+' '+ref);
 }
 assert.equal(new Set(overlay.records.map(r=>r.passage_id+'::'+r.source)).size,overlay.records.length,
   'no duplicate exact-match patterns within one passage');
 for(const r of overlay.records){
  assert.ok(byId.has(r.passage_id),'source missing: '+r.passage_id);
  if(r.target_id===null)assert.match(r.decision,/no passage link/);
  else assert.ok(byId.has(r.target_id),'target missing: '+r.target_id);
  assert.match(r.decision,/not attested/);
 }
});
test('Batch 04 checks 29 new SS AB BC TS sources, number mapping and single-book safety',()=>{
 const cases=[
  ['01.07','(S.S. IX: 18)','lunyu.09.18'],
  ['01.09','(S.S. II: 5)','lunyu.02.05'],
  ['01.10','(S.S. V:4)','lunyu.05.04'],
  ['01.11','(S.S. IV: 20)','lunyu.04.20'],
  ['01.12','(S.S. IV: 13)','lunyu.04.13'],
  ['01.14','(S.S. II: 15)','lunyu.02.15'],
  ['01.15','(S.S. XIV: 10)','lunyu.14.10'],
  ['01.16','(S.S. XIV: 30)','lunyu.14.30'],
  ['02.02','(S.S. XIII: 5)','lunyu.13.05'],
  ['02.03','(Bc. VIIA: 3)','mengzi.13.03'],
  ['02.04','(S.S. VII: 17)','lunyu.07.17'],
  ['02.05','(S.S. VI.22)','lunyu.06.22'],
  ['02.06','(S.S. V:8)','lunyu.05.08'],
  ['02.12','(S.S. V:4)','lunyu.05.04'],
  ['02.13','(S.S. V.4)','lunyu.05.04'],
  ['02.14','(S.S. XIII: 23)','lunyu.13.23'],
  ['02.15','(S.S. I:14)','lunyu.01.14'],
  ['02.20','(S.S. X: 16)','lunyu.10.16'],
  ['02.23','(S.S. III:9)','lunyu.03.09'],
  ['04.02','(S.S. XV. 9)','lunyu.15.09'],
  ['04.03','(A.B. X 15)','daxue.11.15'],
  ['04.04','(S.S. XIV: 6)','lunyu.14.06'],
  ['04.07','(S.S. I: 8)','lunyu.01.08'],
  ['04.12','(A.B. X: 23)','daxue.11.23'],
  ['03.10','(T.S. XVIII:6)','zhongyong.19.06'],
  ['03.14','(T.S. XXVII: 5)','zhongyong.28.05'],
  ['07.26','(Bc. VIIB: 25)','mengzi.14.25'],
  ['07.30','(A.B. IX. 3)','daxue.10.03'],
  ['09.08','(T.S. V)',null]
 ];
 assert.equal(cases.length,29);
 for(const [source,original,target] of cases){
  const id='sishu.lunyu.'+source;
  const r=overlay.records.find(x=>x.passage_id===id&&x.source===original);
  assert.ok(r,'batch 04 citation missing: '+id+' '+original);
  assert.equal(r.target_id,target?'sishu.'+target:null,'wrong target: '+id);
  const text=byId.get(id)?.translation_indonesian;
  assert.equal(text?.split(original).length,2,'original source location missing or repeated: '+id);
  assert.ok(overlay.present(id,text).includes(r.display),'normalization not applied: '+id);
 }
 const compound=byId.get('sishu.lunyu.02.05').translation_indonesian;
 const displayed=overlay.present('sishu.lunyu.02.05',compound);
 assert.ok(displayed.includes('(Sabda Suci — Lun Yu VI:22)'));
 assert.ok(displayed.includes('(S.S. I:9; III: 1,2; XIX:5; Bc. IIIA: 2)'),
   'multi-book citation must remain unresolved rather than silently split');
 const chapterOnly=overlay.records.find(r=>r.passage_id==='sishu.lunyu.09.08'&&r.source==='(T.S. V)');
 assert.equal(chapterOnly.target_id,null,'chapter-only reference must not point to a fabricated verse');
});
test('Seven compound citations are individually segmented; six display, one remains review-only',()=>{
 const data=read('sources/references/matakin-compound-batch01.json');
 assert.equal(data.schema,'ru-classics.compound-references.v1');
 assert.deepEqual(data.book_aliases,{SS:'lunyu',AB:'daxue',BC:'mengzi',TS:'zhongyong'});
 assert.equal(data.entries.length,7);
 assert.equal(data.entries.filter(r=>r.display_status==='display-ready').length,6);
 assert.equal(data.entries.reduce((n,r)=>n+r.components.length,0),16);
 const originalIds=new Set();
 for(const entry of data.entries){
  assert.ok(byId.has(entry.passage_id),'missing compound source: '+entry.passage_id);
  assert.equal(byId.get(entry.passage_id).translation_indonesian.split(entry.source).length,2,'original compound citation not unique: '+entry.passage_id);
  assert.equal(entry.printed_2012_attested,false,'must not claim unavailable print evidence');
  assert.equal(new Set(entry.components.map(c=>c.order)).size,entry.components.length);
  for(const c of entry.components){
   assert.ok(['lunyu','daxue','mengzi','zhongyong'].includes(c.book_id));
   assert.equal(c.subverse_target_id,null,'subverses are not certified');
   assert.ok(c.source_segment&&entry.source.includes(c.source_segment),'segment not in source');
   assert.ok(c.target_passage_ids.length>=1);
   for(const id of c.target_passage_ids){
    assert.ok(byId.has(id),'segment target missing: '+id);
    assert.ok(id.startsWith('sishu.'+c.book_id+'.'),'target belongs to wrong book: '+id);
   }
  }
  if(entry.display_status==='display-ready'){
   const rendered=overlay.records.filter(r=>r.passage_id===entry.passage_id&&r.source===entry.source);
   assert.equal(rendered.length,1,'ready compound has no unique overlay: '+entry.passage_id);
   assert.equal(rendered[0].display,entry.display);
   assert.equal(rendered[0].target_id,null,'composite citation may not claim single target');
   assert.ok(overlay.present(entry.passage_id,byId.get(entry.passage_id).translation_indonesian).includes(entry.display));
  }else{
   assert.equal(entry.display_status,'review-only');
   assert.equal(entry.display,null);
   const original=byId.get(entry.passage_id).translation_indonesian;
   assert.ok(overlay.present(entry.passage_id,original).includes(entry.source),
    'unreviewed compound citation must remain unchanged');
   assert.ok(!overlay.records.some(r=>r.passage_id===entry.passage_id&&r.source===entry.source),
    'no display override is allowed for provisional inherited/subverse compounds');
  }
  originalIds.add(entry.passage_id);
 }
 assert.equal(originalIds.size,7);
});
test('Batch 06 has six display-ready compounds, two review-only cases, and never invents subverse links',()=>{
 const data=read('sources/references/matakin-compound-batch02.json');
 assert.equal(data.schema,'ru-classics.compound-references.v1');
 assert.deepEqual(data.book_aliases,{SS:'lunyu',AB:'daxue',BC:'mengzi',TS:'zhongyong'});
 assert.equal(data.entries.length,8);
 assert.equal(data.entries.filter(e=>e.display_status==='display-ready').length,6);
 assert.equal(data.entries.filter(e=>e.display_status==='review-only').length,2);
 assert.equal(data.entries.reduce((n,e)=>n+e.components.length,0),18);
 for(const entry of data.entries){
  const source=byId.get(entry.passage_id);
  assert.ok(source,'source ID not present in MATAKIN chapters: '+entry.passage_id);
  assert.equal(source.translation_indonesian.split(entry.source).length,2,'expected exactly one source occurrence: '+entry.passage_id);
  assert.equal(entry.printed_2012_attested,false,'no unsupported print verification');
  assert.equal(new Set(entry.components.map(c=>c.order)).size,entry.components.length);
  assert.ok(entry.review_note);
  for(const seg of entry.components){
   assert.ok(entry.source.includes(seg.source_segment),'reference fragment absent: '+seg.source_segment);
   assert.ok(['lunyu','daxue','mengzi','zhongyong'].includes(seg.book_id));
   assert.equal(seg.subverse_target_id,null,'subverse target has not been proven');
   assert.ok(seg.target_passage_ids.length>0);
   for(const id of seg.target_passage_ids){
    assert.ok(byId.has(id),'segment target missing: '+id);
    assert.ok(id.startsWith('sishu.'+seg.book_id+'.'),'wrong-book segment target: '+id);
   }
  }
  const found=overlay.records.filter(r=>r.passage_id===entry.passage_id&&r.source===entry.source);
  if(entry.display_status==='display-ready'){
   assert.equal(found.length,1,'missing display overlay for '+entry.passage_id);
   assert.equal(found[0].display,entry.display);
   assert.equal(found[0].target_id,null,'compound entry cannot have one synthetic link');
   assert.ok(overlay.present(entry.passage_id,source.translation_indonesian).includes(entry.display));
  }else{
   assert.equal(entry.display_status,'review-only');
   assert.equal(entry.display,null);
   assert.equal(found.length,0,'uncertain editorial citation must not have an overlay');
   assert.ok(overlay.present(entry.passage_id,source.translation_indonesian).includes(entry.source));
  }
 }
 const malformed=data.entries.find(x=>x.passage_id==='sishu.lunyu.09.05');
 assert.ok(malformed.source.includes('VII ": 23'));
 assert.equal(malformed.display_status,'review-only');
 const slash=data.entries.find(x=>x.passage_id==='sishu.lunyu.07.02');
 assert.equal(slash.components[1].source_segment,'Bc. IIA: 2/19');
 assert.equal(slash.components[1].subverse_target_id,null);
});
test('MATAKIN pasal/ayat notation resolves slash N to an existing Mengzi verse without inventing deep links',()=>{
 const refs=read('sources/references/matakin-compound-batch02.json');
 assert.match(refs.citation_slash_semantics,/Ayat N/);
 const cases=[
  ['sishu.lunyu.03.07','sishu.mengzi.03.07',5,'Bc IIA: 7/5'],
  ['sishu.lunyu.07.02','sishu.mengzi.03.02',19,'Bc. IIA: 2/19'],
  ['sishu.lunyu.09.09','sishu.mengzi.03.02',28,'Bc. IIA: 2/28']
 ];
 for(const [sourceId,targetId,ayat,segment] of cases){
  const entry=refs.entries.find(e=>e.passage_id===sourceId);
  assert.ok(entry,'missing source '+sourceId);
  const part=entry.components.find(c=>c.source_segment===segment);
  assert.equal(part?.subverse_number,ayat,'slash must map to numbered ayat');
  assert.equal(part.subverse_marker_status,'verified-in-2011-transcript');
  assert.deepEqual(part.target_passage_ids,[targetId]);
  assert.equal(part.subverse_target_id,null,'no verified deep-link URI exists yet');
  const p=byId.get(targetId);
  assert.ok(p,'target passage absent '+targetId);
  const found=[...p.translation_indonesian.matchAll(/(?:^|\s)\((\d{1,2})\)(?=\s|["“'‘])/g)].map(m=>Number(m[1]));
  assert.ok(found.includes(ayat),'MATAKIN Indonesian ayat marker missing '+targetId+'/'+ayat);
  assert.deepEqual(found,Array.from({length:found.length},(_,i)=>i+2),'verse numbering discontinuity '+targetId);
  const original=byId.get(sourceId).translation_indonesian;
  assert.ok(original.includes(entry.source),'source references must stay untouched');
  assert.ok(overlay.present(sourceId,original).includes('/'+ayat),'reader should preserve the printed slash notation');
 }
});
test('The exact legacy references remain intact in every source and the overlay changes only display',()=>{
 for(const r of overlay.records){
  const source=byId.get(r.passage_id).translation_indonesian;
  assert.equal(source.split(r.source).length,2,'missing or duplicated source reference: '+r.passage_id);
  assert.ok(!source.includes(r.display),'2012-style display must not be written to source');
  const before=source;
  const shown=overlay.present(r.passage_id,source);
  assert.ok(shown.includes(r.display),r.passage_id);
  assert.ok(!shown.includes(r.source),r.passage_id);
  assert.equal(source,before,'do not mutate 2011 source');
  assert.equal(overlay.present(r.passage_id,shown),shown,'display should be idempotent');
  assert.equal(overlay.present('another.passage.id',source),source,'do not expand references in other passages');
  assert.equal(overlay.present(r.passage_id,'No exact-match reference'), 'No exact-match reference');
 }
});
test('Multiple citations in one passage expand independently without changing subayat markers',()=>{
 const p=byId.get('sishu.lunyu.05.08');
 const before=p.translation_indonesian;
 const shown=overlay.present(p.id,before);
 assert.ok(shown.includes('(Sabda Suci — Lun Yu II:6)'));
 assert.ok(shown.includes('(Sabda Suci — Lun Yu VI:4)'));
 assert.ok(!shown.includes('(S.S. II: 6)'));
 assert.ok(!shown.includes('(S.S. VI: 4)'));
 assert.equal(p.translation_indonesian,before);
 assert.ok(shown.includes('(2)'), 'subayat marker (2) disappeared');
 assert.equal(overlay.present(p.id,shown),shown);
 assert.ok(shown.includes('(Tengah Sempurna — Zhong Yong VIII)'),'TS book name missing');
 assert.ok(!shown.includes('(T.S. VIII)'),'unexpanded TS remains');
 const chapterOnly=overlay.records.find(r=>r.passage_id===p.id&&r.source==='(T.S. VIII)');
 assert.equal(chapterOnly?.target_id,null,'chapter-only reference must not assert a passage target');
});
test('Batch 03 preserves cross-references without fabricating chapter-only passage links',()=>{
 const quote=byId.get('sishu.lunyu.12.16');
 const shown=overlay.present(quote.id,quote.translation_indonesian);
 assert.ok(shown.includes('(Tengah Sempurna — Zhong Yong IX:3)'));
 const cross=byId.get('sishu.zhongyong.10.03');
 assert.ok(overlay.present(cross.id,cross.translation_indonesian).includes('(Sabda Suci — Lun Yu XII:16)'));
 const chapterOnly=byId.get('sishu.lunyu.12.13');
 assert.ok(overlay.present(chapterOnly.id,chapterOnly.translation_indonesian).includes('(Ajaran Besar — Da Xue IV)'));
 const tsChapter=byId.get('sishu.lunyu.12.20');
 assert.ok(overlay.present(tsChapter.id,tsChapter.translation_indonesian).includes('(Tengah Sempurna — Zhong Yong VIII)'));
 assert.ok(overlay.records.filter(r=>r.source==='(A.B. IV )'||r.source==='(T.S. VIII)').every(r=>r.target_id===null));
});
test('Verse numbers, unrelated scripture references and original Hanzi are unaffected',()=>{
 const m=byId.get('sishu.mengzi.01.01');
 const result=overlay.present(m.id,m.translation_indonesian);
 assert.ok(result.includes('(Ajaran Besar — Da Xue X:23) (4)'));
 assert.ok(result.includes('(3)'));
 assert.ok(result.includes('(6)'));
 assert.match(result,/Cinta Kasih dan Kebenaran/);
 assert.equal(overlay.present(m.id,'(II.5.4.4)'), '(II.5.4.4)','ambiguous target must remain untouched');
 for(const p of byId.values()){
  const h=JSON.stringify(p.ruby_paragraphs);
  overlay.present(p.id,p.translation_indonesian);
  assert.equal(JSON.stringify(p.ruby_paragraphs),h);
 }
});
test('Browser scripts load the single shared overlay before either reader',()=>{
 const reader=fs.readFileSync(path.join(root,'ru-classics/index.html'),'utf8');
 const editor=fs.readFileSync(path.join(root,'editor/index.html'),'utf8');
 const readerCode=fs.readFileSync(path.join(root,'ru-classics/app.js'),'utf8');
 const editorCode=fs.readFileSync(path.join(root,'editor/app.js'),'utf8');
 assert(reader.indexOf('reference-overlay.js')<reader.indexOf('src="./app.js"'));
 assert(editor.indexOf('reference-overlay.js')<editor.indexOf('src="./app.js"'));
 assert.match(readerCode,/Matakin2012References\?\.present\(p\.id,text\)/);
 assert.match(editorCode,/Matakin2012References\?\.present\(passageId,part\)/);
});
