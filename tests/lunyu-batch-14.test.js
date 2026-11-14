'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snap=read('sources/legge/lunyu-b14-gutenberg-3330-4094.json'),align=read('dist/sishu-english-alignment.json'),cat=read('catalog.json').collections.find(x=>x.id==='sishu'),content=read('dist/sishu-content.json');
const all=new Map(content.chapters.flatMap(c=>c.passages.map(p=>[p.id,p])));
const chinese=p=>p.ruby_paragraphs.map(r=>r.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const expected=['09.06','09.07','09.24','10.08','10.18','10.25','11.25','14.01','14.26','14.37'].map(x=>'sishu.lunyu.'+x);
const u=id=>snap.units.find(x=>x.indonesian_passage_id==='sishu.lunyu.'+id);
test('Ten stable mappings add source-backed Drafts; zero Final',()=>{
 assert.deepEqual(snap.units.map(x=>x.indonesian_passage_id),expected);
 const ids=align.entries.flatMap(e=>e.indonesian_passage_ids);
 assert.equal(ids.length,new Set(ids).size);
 assert.ok(cat.english_editor_passages>=956);assert.ok(cat.english_editor_unmapped<=9);
 assert.ok(cat.english_editor_alignment_drafts>=710);assert.equal(cat.english_passages,246);
 assert.equal(read('dist/sishu-review-status.json').entries.length,0);
});
test('English and Hanzi align exactly with all source units',()=>{
 for(const unit of snap.units){
  const entry=align.entries.find(e=>e.id==='legge-lunyu-b14-'+unit.indonesian_passage_id.split('.').slice(-2).join('-'));
  const p=all.get(unit.indonesian_passage_id);
  assert.ok(p&&entry,unit.indonesian_passage_id);
  assert.deepEqual(entry.indonesian_passage_ids,[p.id]);
  assert.equal(entry.hanzi_span,chinese(p));assert.equal(unit.hanzi_span,chinese(p));
  assert.equal(entry.source_hanzi_transcription,unit.source_hanzi_transcription);
  assert.equal(entry.english_segments.length,unit.english_segments.length);
  for(let i=0;i<unit.english_segments.length;i++){
   assert.equal(entry.english_segments[i].legge_ref,unit.english_segments[i].legge_ref);
   assert.equal(entry.english_segments[i].text,unit.english_segments[i].english_transcription);
   assert.doesNotMatch(entry.english_segments[i].text,/\p{Script=Han}/u);
  }
  assert.equal(entry.status,'draft');assert.equal(p.editorial_status,'unverified-draft');
  assert.equal(p.translation_english,undefined);assert.ok(unit.normalized_hanzi_similarity>=.955);
 }
});
test('MATAKIN source splits and linked source pairs remain complete',()=>{
 assert.equal(u('14.01').english_segments.length,2);
 assert.equal(u('14.26').english_segments.length,2);
 assert.equal(u('14.37').english_segments.length,2);
 assert.deepEqual(u('09.06').english_segments[0].source_sections,[1,2,3]);
 assert.deepEqual(u('09.07').english_segments[0].source_sections,[4]);
 assert.deepEqual(u('10.08').english_segments[0].source_sections,[1,2,3,4,5,6,7]);
 assert.deepEqual(u('10.18').english_segments[0].source_sections,[1,2]);
 assert.deepEqual(u('10.25').english_segments[0].source_sections,[2,3,4,5]);
 assert.match(u('09.06').review_discrepancy,/太宰.*大宰/);
});
