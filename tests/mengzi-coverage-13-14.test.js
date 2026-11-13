'use strict';
const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const source=read('sources/legge/mengzi-chinesenotes-13-14.json');
const mapped=read('dist/sishu-english-alignment.json').entries.filter(e=>/^legge-mengzi-(13|14)-/.test(e.id));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
test('conservative Mengzi batch has 82 drafts and two documented exclusions',()=>{
 assert.equal(mapped.length,82);assert.equal(source.books.length,2);
 assert.deepEqual(source.books.map(x=>x.units.length),[45,37]);
 assert.deepEqual(source.books.map(x=>x.skipped.length),[1,1]);
 assert.equal(new Set(mapped.flatMap(e=>e.indonesian_passage_ids)).size,82);
 assert.ok(mapped.every(e=>e.status==='draft' && e.english_segments.length===1));
});
test('all 82 English texts match their pinned-source snapshot and target Hanzi',()=>{
 for(const book of source.books){
  const chap=read('sishu/chapters/mengzi/'+String(book.book_index).padStart(2,'0')+'.json');
  for(const unit of book.units){
   const target=chap.passages.find(p=>p.id===unit.indonesian_passage_id);
   const map=mapped.find(e=>e.indonesian_passage_ids[0]===unit.indonesian_passage_id);
   assert.ok(target && map, unit.indonesian_passage_id);
   assert.equal(map.hanzi_span,hanzi(target));
   assert.equal(map.source_hanzi_transcription,unit.source_chinese);
   assert.equal(map.english_segments[0].text,unit.source_english);
  }
 }
});
