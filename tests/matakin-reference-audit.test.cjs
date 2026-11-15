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
test('Full MATAKIN reference inventory combines 29 compound groups across three batches',()=>{
 const a=scan();
 assert.equal(a.passage_count,965);
 assert.equal(a.compound_segmented,29);
 assert.equal(a.compound_display_ready,29);
 assert.equal(a.compound_review_only,0);
 const ready=a.all_references.find(x=>x.passage_id==='sishu.lunyu.02.19'&&x.original_reference==='(T.S. XIX: 1; S.S. III: 21)');
 assert.equal(ready?.segmentation_status,'display-ready');
 assert.deepEqual(ready?.segments.map(x=>x.book_id),['zhongyong','lunyu']);
 assert.deepEqual(ready?.segments.flatMap(x=>x.target_passage_ids),['sishu.zhongyong.20.01','sishu.lunyu.03.21']);
 const complex=a.all_references.find(x=>x.passage_id==='sishu.lunyu.02.05'&&x.original_reference==='(S.S. I:9; III: 1,2; XIX:5; Bc. IIIA: 2)');
 assert.equal(complex?.segmentation_status,'display-ready');
 assert.deepEqual(complex?.segments.map(x=>x.book_id),['lunyu','lunyu','lunyu','mengzi']);
 assert.equal(complex?.segments.flatMap(x=>x.target_passage_ids).length,5);
 assert.ok(complex.segments.every(x=>x.subverse_target_id===null));
});
test('Batch 06 includes photo-evidenced IX:5 correction with original source preserved',()=>{
 const data=scan();
 const malformed=data.all_references.find(x=>x.passage_id==='sishu.lunyu.09.05'&&x.original_reference.includes('VII ": 23'));
 assert.equal(malformed?.segmentation_status,'display-ready');
 assert.deepEqual(malformed?.segments.map(x=>x.book_id),['lunyu','lunyu','lunyu','mengzi']);
 assert.ok(malformed.segments.every(x=>x.subverse_target_id===null));
 const inheritance=data.all_references.find(x=>x.passage_id==='sishu.lunyu.07.23'&&x.original_reference==='(S.S. III: 24; IX: 5)');
 assert.equal(inheritance?.segmentation_status,'display-ready');
 assert.equal(inheritance?.segments.length,2);
 const slash=data.all_references.find(x=>x.passage_id==='sishu.lunyu.07.02'&&x.original_reference==='(S.S. IX: 16; Bc. IIA: 2/19)');
 assert.equal(slash?.segmentation_status,'display-ready');
 assert.equal(slash?.segments[1].target_passage_ids[0],'sishu.mengzi.03.02');
 assert.equal(slash?.segments[1].subverse_target_id,null);
});
test('Compound rujukan means related content rather than an exact verbal quotation',()=>{
 const all=scan();
 const entries=all.all_references.filter(x=>x.segmentation_status);
 assert.equal(entries.length,29);
 assert.ok(entries.every(x=>x.reference_intent==='content-related'));
 assert.ok(entries.every(x=>x.verbatim_match_required===false));
 assert.ok(entries.every(x=>x.relation_verification.includes('accepted-on-MATAKIN-authority')));
 assert.ok(entries.every(x=>x.reference_authority==='MATAKIN'&&x.relationship_review_required===false));
 assert.ok(entries.every(x=>x.segments.every(y=>y.reference_intent==='content-related'&&y.verbatim_match_required===false)));
 const slash=entries.find(x=>x.passage_id==='sishu.lunyu.03.07');
 assert.equal(slash.segments[1].subverse_number,5);
 assert.equal(slash.segments[1].subverse_marker_status,'verified-in-2011-transcript');
 assert.equal(slash.segments[1].subverse_target_id,null);
 const two=entries.find(x=>x.passage_id==='sishu.lunyu.07.02');
 assert.equal(two.segments[1].subverse_number,19);
 const twentyEight=entries.find(x=>x.passage_id==='sishu.lunyu.09.09');
 assert.equal(twentyEight.segments[1].subverse_number,28);
});
test('Batch 07 inherited-book references are indexed without thematic re-review',()=>{
 const audit=scan();
 const refs=[
  'sishu.lunyu.01.08','sishu.lunyu.03.21','sishu.lunyu.03.24',
  'sishu.lunyu.05.02','sishu.lunyu.05.04','sishu.lunyu.09.16',
  'sishu.lunyu.12.20','sishu.lunyu.14.20','sishu.lunyu.20.02',
  'sishu.lunyu.14.36','sishu.lunyu.13.21','sishu.lunyu.13.26',
  'sishu.lunyu.11.12','sishu.lunyu.14.01'
 ];
 for(const id of refs){
  const found=audit.all_references.find(r=>r.passage_id===id&&r.segments);
  assert.ok(found,'missing index for '+id);
  assert.equal(found.segmentation_status,'display-ready');
  assert.equal(found.reference_authority,'MATAKIN');
  assert.equal(found.relationship_review_required,false);
  assert.ok(found.segments.length>=2);
 }
 const still=audit.all_references.filter(r=>r.segmentation_status==='review-only');
 assert.equal(still.length,0);
 const resolved=audit.all_references.find(x=>x.passage_id==='sishu.lunyu.09.05'&&x.segments);
 assert.equal(resolved.segmentation_status,'display-ready');
 assert.deepEqual(resolved.segments.map(x=>x.book_id),['lunyu','lunyu','lunyu','mengzi']);
 assert.deepEqual(resolved.segments.flatMap(x=>x.target_passage_ids),[
  'sishu.lunyu.03.24','sishu.lunyu.07.23','sishu.lunyu.14.36','sishu.mengzi.02.16'
 ]);
});
test('All MATAKIN cross-reference records signify related contents regardless of quote wording',()=>{
 const audit=scan();
 assert.equal(audit.passage_count,965);
 assert.ok(audit.reviewed_references>0);
 assert.ok(audit.all_references.every(r=>r.reference_authority==='MATAKIN'&&r.relationship_review_required===false));
 assert.ok(audit.all_references.every(r=>r.reference_intent==='content-related'));
 assert.ok(audit.all_references.every(r=>r.verbatim_match_required===false));
 assert.match(audit.policy,/slash N denotes ayat/);
});
test('Full source audit identifies reference records without changing scripture',()=>{
 const all=scan(),byId=id=>all.all_references.filter(x=>x.passage_id===id);
 assert.equal(all.passage_count,965);
 assert.ok(all.reviewed_references>10);
 assert.ok(byId('sishu.lunyu.18.06').some(x=>x.original_reference==='(S.S. XIV: 39)'&&x.target_book==='lunyu'));
 assert.ok(byId('sishu.mengzi.01.03').some(x=>x.original_reference==='(III. A.3.10)'&&x.kind==='possible-same-book'));
});
