'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const registry=read('sources/source-registry.json');
const manifest=read('sishu/manifest.json');
test('A fixed bibliographic master covers the correct Legge volumes for all four books',()=>{
 assert.equal(registry.schema,'ru-classics.source-registry.v1');
 assert.deepEqual(Object.keys(registry.legge.canonical_edition_by_book).sort(),['daxue','lunyu','mengzi','zhongyong']);
 const byId=new Map(registry.legge.bibliographic_master.map(e=>[e.id,e]));
 assert.equal(byId.size,2);
 for(const [book,id] of Object.entries(registry.legge.canonical_edition_by_book))
   assert.ok(byId.get(id)?.covers.includes(book),book+' not covered by '+id);
 assert.equal(byId.get('legge-vol1-1893')?.year,1893);
 assert.equal(byId.get('legge-vol2-1895')?.year,1895);
 assert.equal(registry.legge.canonical_edition_by_book.mengzi,'legge-vol2-1895');
 assert.match(manifest.languages.english.source,/Vol\. I.*1893/);
 assert.match(manifest.languages.english.source,/Vol\. II.*1895/);
 assert.match(manifest.languages.english.provenance,/source-registry\.json/);
});
test('MATAKIN witnesses and locked WYG comparator remain distinct sources',()=>{
 assert.equal(registry.matakin.base.id,'matakin2011');
 assert.equal(registry.matakin.print_witness.id,'matakin2012');
 assert.equal(registry.matakin.print_witness.availability,'selected-photographs-only');
 assert.equal(registry.hanzi.locked_comparator.commit,'84c6b2c5093c57ae5d41c60a73c02323d2420ef0');
 assert.equal(registry.matakin.print_witness.presentation.main_script,'traditional');
});
test('Every documented digital Legge witness has a real preserved source snapshot',()=>{
 const list=registry.legge.digital_witnesses;
 assert.ok(list.length>=5);
 assert.equal(new Set(list.map(w=>w.id)).size,list.length);
 for(const w of list){
  assert.match(w.url,/^https:\/\//,w.id);
  assert.ok(fs.existsSync(w.snapshot_example),'missing snapshot: '+w.snapshot_example);
  assert.notEqual(w.status,'verified',w.id+' cannot be auto-approved');
 }
});
test('All 965 English drafts remain drafts, not certified by the edition registry',()=>{
 assert.equal(registry.review.current_counts.legacy_passages,965);
 assert.equal(manifest.languages.english.target_passages,965);
 assert.equal(manifest.languages.english.total_draft_coverage,965);
 assert.equal(manifest.review_status,'unverified-draft');
});
