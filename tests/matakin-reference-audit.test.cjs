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
test('Mengzi-specific volume letter reference is only a candidate',()=>{
 assert.equal(classify('III. A.3.10','mengzi').kind,'possible-same-book');
 assert.equal(classify('II.5.4.4','mengzi').kind,'ambiguous-unlabeled');
 assert.equal(classify('2','mengzi'),null);
});
test('Full source audit identifies reference records without changing scripture',()=>{
 const all=scan(),byId=id=>all.all_references.filter(x=>x.passage_id===id);
 assert.equal(all.passage_count,965);
 assert.ok(all.reviewed_references>10);
 assert.ok(byId('sishu.lunyu.18.06').some(x=>x.original_reference==='(S.S. XIV: 39)'&&x.target_book==='lunyu'));
 assert.ok(byId('sishu.mengzi.01.03').some(x=>x.original_reference==='(III. A.3.10)'&&x.kind==='possible-same-book'));
});
