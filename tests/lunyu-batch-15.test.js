'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snap=read('sources/legge/lunyu-b15-gutenberg-3330-4094.json'),align=read('dist/sishu-english-alignment.json'),cat=read('catalog.json').collections.find(x=>x.id==='sishu'),content=read('dist/sishu-content.json');
const byId=new Map(content.chapters.flatMap(c=>c.passages.map(p=>[p.id,p])));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(x=>x.type==='ruby'?(x.traditional||''):(x.value||'')).join('')).join('\n');
const expected=['11.26','14.32','14.43','14.44','15.01','15.02'].map(x=>'sishu.lunyu.'+x);
const get=code=>snap.units.find(x=>x.indonesian_passage_id==='sishu.lunyu.'+code);
test('Six Lun Yu Drafts finish 512/512 while Final=0',()=>{
 assert.deepEqual(snap.units.map(x=>x.indonesian_passage_id),expected);
 const ids=align.entries.flatMap(e=>e.indonesian_passage_ids);
 assert.equal(ids.length,new Set(ids).size);
 assert.equal(cat.english_editor_passages,962);assert.equal(cat.english_editor_unmapped,3);
 assert.equal(cat.english_editor_alignment_drafts,716);assert.equal(cat.english_passages,246);
 assert.equal(read('dist/sishu-review-status.json').entries.length,0);
});
test('Exact Hanzi preserved and English text attributed',()=>{
 for(const u of snap.units){
  const entry=align.entries.find(e=>e.id==='legge-lunyu-b15-'+u.indonesian_passage_id.split('.').slice(-2).join('-'));
  const p=byId.get(u.indonesian_passage_id);
  assert.ok(p&&entry,u.indonesian_passage_id);assert.deepEqual(entry.indonesian_passage_ids,[p.id]);
  assert.equal(entry.hanzi_span,hanzi(p));assert.equal(u.hanzi_span,hanzi(p));
  assert.equal(entry.english_segments[0].text,u.english_transcription);
  assert.equal(entry.english_segments[0].legge_ref,u.legge_ref);
  assert.equal(entry.source_hanzi_transcription,u.source_hanzi_transcription);
  assert.equal(entry.status,'draft');assert.equal(p.editorial_status,'unverified-draft');
  assert.equal(p.translation_english,undefined);assert.ok(u.normalized_hanzi_similarity>=.93);
  assert.doesNotMatch(u.english_transcription,/\p{Script=Han}/u);
 }
});
test('Repeated chapter label and interlinear glyph explanation not confused with scripture',()=>{
 assert.equal(get('14.43').source_chapter_occurrence,0);assert.equal(get('14.44').source_chapter_occurrence,1);
 assert.equal(get('14.43').source_chapter_printed,'XLVI');assert.equal(get('14.44').source_chapter_printed,'XLVI');
 assert.match(get('11.26').review_discrepancy,/曾.*晰/);
 assert.deepEqual(get('15.01').source_sections,[1]);assert.deepEqual(get('15.02').source_sections,[2,3]);
 for(const u of snap.units)assert.ok(u.english_transcription.length>50);
});
