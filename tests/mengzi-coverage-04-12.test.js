'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const source=read('sources/legge/mengzi-chinesenotes-04-12.json');
const originalIds=new Set(source.books.flatMap(book=>book.units.map(unit=>unit.indonesian_passage_id)));
const mapped=read('dist/sishu-english-alignment.json').entries.filter(e=>e.indonesian_passage_ids.some(id=>originalIds.has(id)));
const hanzi=p=>(p.ruby_paragraphs||[]).map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
test('118 conservative drafts with explicit exclusions and nonoverlapping source ranges',()=>{
 assert.equal(source.books.length,9);
 assert.equal(mapped.length,118);
 assert.deepEqual(source.books.map(b=>b.units.length),[13,0,8,26,31,7,2,18,13]);
 assert.deepEqual(source.books.map(b=>b.units.length+b.skipped.length),[14,5,10,28,33,9,9,20,16]);
 assert.equal(new Set(mapped.map(e=>e.id)).size,118);
 assert.equal(new Set(mapped.flatMap(e=>e.indonesian_passage_ids)).size,118);
 assert.ok(mapped.every(e=>e.status==='draft'&&e.english_segments.length===1));
});
test('exact source snapshots and target Hanzi, pinned original provenance, never fake Final',()=>{
 for(const book of source.books){
  assert.match(book.source_url,/\/blob\/[0-9a-f]{40}\//);
  const ch=read('sishu/chapters/mengzi/'+String(book.book_index).padStart(2,'0')+'.json');
  let last=0;
  for(const unit of book.units){
   assert.ok(unit.source_index_start>last,'overlapping source range');
   last=unit.source_index_end;
   assert.ok(unit.hanzi_similarity>=0.95);
   const target=ch.passages.find(p=>p.id===unit.indonesian_passage_id);
   const alignment=mapped.find(e=>e.indonesian_passage_ids[0]===unit.indonesian_passage_id);
   assert.ok(target&&alignment,unit.indonesian_passage_id);
   assert.equal(unit.hanzi_span,hanzi(target));
   assert.equal(alignment.hanzi_span,unit.hanzi_span);
   assert.equal(alignment.source_hanzi_transcription,unit.source_chinese);
   assert.equal(alignment.english_segments[0].text,unit.source_english);
   assert.equal(alignment.source_url,book.source_url);
   assert.doesNotMatch(unit.source_english,/English translation:\s*Legge 1861|本作品在全世界都属于公有领域/);
  }
 }
});
