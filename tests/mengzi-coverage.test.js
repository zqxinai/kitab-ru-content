'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snap=read('sources/legge/mengzi-chinesenotes-01-03.json');
const alignment=read('dist/sishu-english-alignment.json');
const entries=alignment.entries.filter(e=>e.id.startsWith('legge-mengzi-'));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const trim=s=>String(s).replace(/\s+/g,' ').trim();
test('Mengzi batch contains 3 books, 32 distinct target IDs and no final',()=>{
 assert.equal(snap.books.length,3);assert.equal(entries.length,32);
 const ids=entries.flatMap(e=>e.indonesian_passage_ids);assert.equal(new Set(ids).size,32);
 assert.ok(entries.every(e=>e.status==='draft' && e.english_segments.length===1 && e.source_url));
});
test('each English translation exactly matches its cited source snapshot, with complete Hanzi span',()=>{
 for(const book of snap.books){
  const n=String(book.book_index).padStart(2,'0');
  const target=read('sishu/chapters/mengzi/'+n+'.json');
  assert.equal(book.units.length,target.passages.length);
  for(const unit of book.units){
   const passage=target.passages.find(p=>p.id===unit.indonesian_passage_id);
   assert.ok(passage);
   const matched=entries.find(e=>e.indonesian_passage_ids[0]===passage.id);
   assert.ok(matched);
   assert.equal(matched.hanzi_span,hanzi(passage));
   assert.equal(trim(matched.english_segments[0].text),trim(unit.source_english));
   assert.equal(trim(matched.source_hanzi_transcription),trim(unit.source_chinese));
  }
 }
});
