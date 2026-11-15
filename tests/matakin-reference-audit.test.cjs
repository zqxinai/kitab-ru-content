'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {classify,scan}=require('../tools/audit_matakin_references.cjs');
test('References with explicit book names are not auto-rewritten',()=>{
 assert.equal(classify('Shi Jing - Si King IV.1.6','daxue').kind,'explicit-book');
 assert.equal(classify('Shu Jing - Su King V.9.4','daxue').kind,'explicit-book');
 assert.equal(classify('Si-kingIII.1.1.1','daxue').kind,'explicit-book');
});
test('Legacy S.S. and AB abbreviation identify books but remain for human 2012 comparison',()=>{
 assert.deepEqual(classify('S.S. XIV: 39','lunyu'),{kind:'abbreviated-book',confidence:'high',target_book:'lunyu'});
 assert.deepEqual(classify('AB. X:23','mengzi'),{kind:'abbreviated-book',confidence:'high',target_book:'daxue'});
 assert.deepEqual(classify('Bc. VIIA: 21.4','daxue'),{kind:'abbreviated-book',confidence:'high',target_book:'mengzi'});
});
test('SS / AB / BC / TS acronyms are fixed to confirmed book identities',()=>{
 const {ABBREVIATED_BOOKS}=require('../tools/audit_matakin_references.cjs');
 assert.deepEqual(ABBREVIATED_BOOKS,{ss:'lunyu',ab:'daxue',bc:'mengzi',ts:'zhongyong'});
 for(const [ref,expected] of [
  ['SS XIV:39','lunyu'],['S.S. XIV:39','lunyu'],['ss xiv:39','lunyu'],
  ['AB X:23','daxue'],['A.B. X:23','daxue'],['ab. X:23','daxue'],
  ['BC IA:1','mengzi'],['B.C. IA:1','mengzi'],['Bc. IA:1','mengzi'],
  ['TS XIII:3','zhongyong'],['T.S. XIII:3','zhongyong'],['ts xiii:3','zhongyong']
 ]){
  const r=classify(ref,'lunyu');
  assert.equal(r.kind,'abbreviated-book',ref);
  assert.equal(r.target_book,expected,ref);
 }
});
test('Mixed citations preserve ambiguity rather than assigning the first book',()=>{
 assert.deepEqual(classify('S.S. XIV:39; BC IA:1','lunyu'),
  {kind:'compound-abbreviations',confidence:'review-required',target_book:null});
 assert.equal(classify('Shi Jing - Si King I.15.1.8.;SS XI:17','daxue').kind,'explicit-plus-abbreviation');
 assert.equal(classify('T.S. XIII:3','lunyu').target_book,'zhongyong');
 assert.equal(classify('II.5.4.4','lunyu').kind,'ambiguous-unlabeled');
});
test('Mengzi-specific volume letter reference is only a candidate',()=>{
 assert.equal(classify('III. A.3.10','mengzi').kind,'possible-same-book');
 assert.equal(classify('II.5.4.4','mengzi').kind,'ambiguous-unlabeled');
 assert.equal(classify('2','mengzi'),null);
});
test('Full MATAKIN reference inventory carries 16 explicitly reviewed compound segments',()=>{
 const a=scan();
 assert.equal(a.passage_count,965);
 assert.equal(a.compound_segmented,7);
 assert.equal(a.compound_display_ready,6);
 assert.equal(a.compound_review_only,1);
 const ready=a.all_references.find(x=>x.passage_id==='sishu.lunyu.02.19'&&x.original_reference==='(T.S. XIX: 1; S.S. III: 21)');
 assert.equal(ready?.segmentation_status,'display-ready');
 assert.deepEqual(ready?.segments.map(x=>x.book_id),['zhongyong','lunyu']);
 assert.deepEqual(ready?.segments.flatMap(x=>x.target_passage_ids),['sishu.zhongyong.20.01','sishu.lunyu.03.21']);
 const complex=a.all_references.find(x=>x.passage_id==='sishu.lunyu.02.05'&&x.original_reference==='(S.S. I:9; III: 1,2; XIX:5; Bc. IIIA: 2)');
 assert.equal(complex?.segmentation_status,'review-only');
 assert.deepEqual(complex?.segments.map(x=>x.book_id),['lunyu','lunyu','lunyu','mengzi']);
 assert.equal(complex?.segments.flatMap(x=>x.target_passage_ids).length,5);
 assert.ok(complex.segments.every(x=>x.subverse_target_id===null));
});
test('Full source audit identifies reference records without changing scripture',()=>{
 const all=scan(),byId=id=>all.all_references.filter(x=>x.passage_id===id);
 assert.equal(all.passage_count,965);
 assert.ok(all.reviewed_references>10);
 assert.ok(byId('sishu.lunyu.18.06').some(x=>x.original_reference==='(S.S. XIV: 39)'&&x.target_book==='lunyu'));
 assert.ok(byId('sishu.mengzi.01.03').some(x=>x.original_reference==='(III. A.3.10)'&&x.kind==='possible-same-book'));
});
