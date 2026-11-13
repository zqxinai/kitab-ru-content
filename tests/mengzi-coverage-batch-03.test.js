'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snap=read('sources/legge/mengzi-chinesenotes-10-passages-batch-03.json');
const scripture=read('dist/sishu-content.json'),alignment=read('dist/sishu-english-alignment.json');
const catalog=read('catalog.json').collections.find(x=>x.id==='sishu');
const units=snap.books.flatMap(b=>b.units),mapped=alignment.entries.filter(e=>e.id.startsWith('legge-mengzi-b03-'));
const byId=new Map(scripture.chapters.flatMap(c=>c.passages).map(p=>[p.id,p]));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const norm=s=>[...String(s).normalize('NFKC')].filter(c=>/[\u3400-\u9fff]/u.test(c)).join('');
function dist(a,b){let p=Array.from({length:b.length+1},(_,j)=>j);for(let i=1;i<=a.length;i++){let n=[i];for(let j=1;j<=b.length;j++)n.push(Math.min(n[j-1]+1,p[j]+1,p[j-1]+(a[i-1]===b[j-1]?0:1)));p=n}return p[b.length]}
test('Batch 03 has ten drafts and finishes Mengzi Book 5 as draft',()=>{
 assert.equal(units.length,10);assert.equal(new Set(units.map(u=>u.indonesian_passage_id)).size,10);
 assert.deepEqual(snap.books.map(b=>[b.book_index,b.units.length]),[[4,1],[5,5],[6,2],[13,1],[14,1]]);
 assert.equal(mapped.length,10);assert.ok(mapped.every(e=>e.status==='draft'&&e.english_segments.length===1));
 assert.equal(new Set(alignment.entries.flatMap(e=>e.indonesian_passage_ids)).size,608);
 assert.equal(catalog.english_editor_passages,854);assert.equal(catalog.english_editor_unmapped,111);
 assert.equal(catalog.english_editor_alignment_drafts,608);
 assert.equal(read('dist/sishu-review-status.json').entries.length,0);
});
test('Source snapshots retain complete Hanzi spans, pinned provenance and English verbatim',()=>{
 for(const book of snap.books){
  assert.match(book.source_url,/\/blob\/[0-9a-f]{40}\//);
  assert.equal(book.source_commit_sha,snap.source_commit_sha);
  let prev=0;
  for(const u of book.units){
   assert.ok(u.source_index_start>prev);prev=u.source_index_end;
   const target=byId.get(u.indonesian_passage_id);
   const entry=mapped.find(e=>e.indonesian_passage_ids[0]===u.indonesian_passage_id);
   assert.ok(target&&entry,u.indonesian_passage_id);
   assert.equal(u.hanzi_span,hanzi(target));
   assert.equal(entry.hanzi_span,u.hanzi_span);
   assert.equal(entry.source_hanzi_transcription,u.source_chinese);
   assert.equal(entry.english_segments[0].text,u.source_english);
   assert.equal(entry.source_url,book.source_url);
   assert.ok(u.source_english.trim());
   assert.doesNotMatch(u.source_english,/[\u3400-\u9fff]|English translation:\s*Legge|本作品/u);
   const a=norm(u.hanzi_span),b=norm(u.source_chinese),score=1-dist(a,b)/Math.max(a.length,b.length);
   assert.ok(score>=.965,u.indonesian_passage_id+': '+score);
   assert.ok(Math.abs(score-u.normalized_hanzi_similarity)<1e-6);
  }
 }
});
