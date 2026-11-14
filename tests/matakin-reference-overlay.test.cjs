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
test('Twenty independently identified references have existing source and target passages',()=>{
 assert.equal(chapters.length,78);
 assert.equal(byId.size,965);
 assert.equal(overlay.records.length,21);
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
 assert.equal(new Set(overlay.records.map(r=>r.passage_id+'::'+r.source)).size,overlay.records.length,
   'no duplicate exact-match patterns within one passage');
 for(const r of overlay.records){
  assert.ok(byId.has(r.passage_id),'source missing: '+r.passage_id);
  if(r.target_id===null)assert.match(r.decision,/no passage link/);
  else assert.ok(byId.has(r.target_id),'target missing: '+r.target_id);
  assert.match(r.decision,/not attested/);
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
