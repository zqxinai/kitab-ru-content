'use strict';
const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const source=read('sources/legge/mengzi-chinesenotes-10-passages-batch-02.json');
const bundle=read('dist/sishu-content.json');
const alignment=read('dist/sishu-english-alignment.json');
const suffix=source.books.flatMap(b=>b.units);
const selected=new Set(suffix.map(u=>u.indonesian_passage_id));
const mapped=alignment.entries.filter(e=>e.indonesian_passage_ids.some(id=>selected.has(id)));
const hanzi=p=>(p.ruby_paragraphs||[]).map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');

test('Batch 02 adds exactly ten unique draft English passages, no Final',()=>{
 assert.equal(suffix.length,10);
 assert.equal(selected.size,10);
 assert.deepEqual(source.books.map(b=>[b.book_index,b.units.length]),[[8,1],[10,7],[11,1],[12,1]]);
 assert.equal(mapped.length,10);
 assert.equal(new Set(mapped.map(e=>e.id)).size,10);
 assert.ok(new Set(alignment.entries.flatMap(e=>e.indonesian_passage_ids)).size>=622);
 assert.ok(mapped.every(e=>e.status==='draft'&&e.english_segments.length===1));
 assert.deepEqual([...selected].sort(),[
  'sishu.mengzi.08.24','sishu.mengzi.10.02','sishu.mengzi.10.04',
  'sishu.mengzi.10.05','sishu.mengzi.10.06','sishu.mengzi.10.07',
  'sishu.mengzi.10.08','sishu.mengzi.10.09','sishu.mengzi.11.05',
  'sishu.mengzi.12.02'].sort());
});

test('Exact English source snapshots and Hanzi match, with stable provenance',()=>{
 const byId=new Map(bundle.chapters.flatMap(c=>c.passages).map(p=>[p.id,p]));
 for(const book of source.books){
  assert.match(book.source_url,/\/blob\/[0-9a-f]{40}\//);
  let last=0;
  for(const unit of book.units){
   assert.ok(unit.source_index_start>last,'source units must not overlap');
   last=unit.source_index_end;
   assert.ok(unit.normalized_hanzi_similarity>=.985);
   assert.ok(unit.source_english.trim());
   assert.doesNotMatch(unit.source_english,/English translation:\s*Legge 1861|[\p{Script=Han}]/u);
   const passage=byId.get(unit.indonesian_passage_id);
   const entry=mapped.find(e=>e.indonesian_passage_ids[0]===unit.indonesian_passage_id);
   assert.ok(passage&&entry,unit.indonesian_passage_id);
   assert.equal(entry.hanzi_span,hanzi(passage));
   assert.equal(entry.hanzi_span,unit.hanzi_span);
   assert.equal(entry.source_hanzi_transcription,unit.source_chinese);
   assert.equal(entry.english_segments[0].text,unit.source_english);
   assert.equal(entry.source_url,book.source_url);
  }
 }
});

test('Coverage preserves its minimum baseline of 868, without finalizing any translation',()=>{
 const catalog=read('catalog.json').collections.find(x=>x.id==='sishu');
 assert.ok(catalog.english_editor_passages>=868);
 assert.ok(catalog.english_editor_unmapped<=97);
 assert.ok(catalog.english_editor_alignment_drafts>=622);
 const approved=read('dist/sishu-review-status.json');
 assert.equal(approved.entries.length,0);
});