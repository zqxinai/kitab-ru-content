'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snap=read('sources/legge/lunyu-b13-gutenberg-3330-4094.json'),align=read('dist/sishu-english-alignment.json'),cat=read('catalog.json').collections.find(x=>x.id==='sishu'),content=read('dist/sishu-content.json');
const all=new Map(content.chapters.flatMap(c=>c.passages.map(p=>[p.id,p])));
const hanzi=p=>p.ruby_paragraphs.map(r=>r.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const expected=['05.01','05.02','05.08','05.09','05.25','05.26','06.01','06.02','06.04','06.05'].map(x=>'sishu.lunyu.'+x);
test('Ten additional Lun Yu drafts have unique stable IDs and zero Final approvals',()=>{
 assert.deepEqual(snap.units.map(x=>x.indonesian_passage_id),expected);
 const ids=align.entries.flatMap(e=>e.indonesian_passage_ids);
 assert.equal(ids.length,new Set(ids).size);
 assert.equal(cat.english_editor_passages,946);
 assert.equal(cat.english_editor_unmapped,19);
 assert.equal(cat.english_editor_alignment_drafts,700);
 assert.equal(cat.english_passages,246);
 assert.equal(read('dist/sishu-review-status.json').entries.length,0);
});
test('All ten source mappings preserve complete Hanzi and actual copied Legge English',()=>{
 for(const u of snap.units){
  const e=align.entries.find(x=>x.id==='legge-lunyu-b13-'+u.indonesian_passage_id.split('.').slice(-2).join('-'));
  const p=all.get(u.indonesian_passage_id);
  assert.ok(p&&e,u.indonesian_passage_id);
  assert.deepEqual(e.indonesian_passage_ids,[p.id]);
  assert.equal(e.hanzi_span,hanzi(p));
  assert.equal(e.hanzi_span,u.hanzi_span);
  assert.equal(e.english_segments[0].text,u.english_transcription);
  assert.equal(e.english_segments[0].legge_ref,u.legge_ref);
  assert.equal(e.source_hanzi_transcription,u.source_hanzi_transcription);
  assert.equal(e.status,'draft');
  assert.equal(p.editorial_status,'unverified-draft');
  assert.equal(p.translation_english,undefined);
  assert.ok(u.normalized_hanzi_similarity>=.945);
  assert.doesNotMatch(u.english_transcription,/\p{Script=Han}/u);
 }
});
test('Source book/chapter split anomalies are documented instead of equating numbers',()=>{
 const x=code=>snap.units.find(u=>u.indonesian_passage_id==='sishu.lunyu.'+code);
 assert.deepEqual(x('05.01').source_sections,[1]);
 assert.deepEqual(x('05.02').source_sections,[2]);
 assert.equal(x('05.09').source_chapter_print_label,'VII');
 assert.match(x('05.09').review_discrepancy,/VIII/);
 assert.deepEqual(x('06.04').source_sections,[1,2]);
 assert.deepEqual(x('06.05').source_sections,[3,4]);
 assert.match(x('05.01').review_discrepancy,/縲絏/);
});
