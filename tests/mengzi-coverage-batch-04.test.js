'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snap=read('sources/legge/mengzi-chinesenotes-4-passages-batch-04.json');
const bible=read('dist/sishu-content.json'),map=read('dist/sishu-english-alignment.json');
const cat=read('catalog.json').collections.find(x=>x.id==='sishu');
const byId=new Map(bible.chapters.flatMap(c=>c.passages).map(p=>[p.id,p]));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const norm=s=>[...String(s).normalize('NFKC')].filter(c=>/[\u3400-\u9fff]/u.test(c)).join('');
function dist(a,b){let p=Array.from({length:b.length+1},(_,j)=>j);for(let i=1;i<=a.length;i++){let n=[i];for(let j=1;j<=b.length;j++)n.push(Math.min(n[j-1]+1,p[j]+1,p[j-1]+(a[i-1]===b[j-1]?0:1)));p=n;}return p[b.length]}
test('Mengzi batch 04 adds four unique drafts without changing Final status',()=>{
 const selected=snap.books.flatMap(b=>b.units);const ids=selected.map(x=>x.indonesian_passage_id);
 assert.equal(ids.length,4);assert.deepEqual(ids.sort(),['sishu.mengzi.09.05','sishu.mengzi.11.03','sishu.mengzi.12.01','sishu.mengzi.12.13']);
 assert.ok(new Set(map.entries.flatMap(e=>e.indonesian_passage_ids)).size>=622);
 assert.ok(cat.english_editor_passages>=868);assert.ok(cat.english_editor_unmapped<=97);assert.ok(cat.english_editor_alignment_drafts>=622);
 assert.equal(read('dist/sishu-review-status.json').entries.length,0);
});
test('Exact Legge bilingual source quotations, full Hanzi spans and pinned provenance',()=>{
 for(const book of snap.books){assert.match(book.source_url,/\/blob\/[0-9a-f]{40}\//);let prev=0;
  for(const u of book.units){
   assert.ok(u.source_unit_index_start>prev);prev=u.source_unit_index_end;
   let entry=map.entries.find(e=>e.id==='legge-mengzi-b04-'+String(book.book_index).padStart(2,'0')+'-'+u.indonesian_passage_id.split('.').at(-1));
   let passage=byId.get(u.indonesian_passage_id);assert.ok(entry&&passage,u.indonesian_passage_id);
   assert.equal(hanzi(passage),u.hanzi_span);assert.equal(entry.hanzi_span,u.hanzi_span);
   assert.equal(entry.source_hanzi_transcription,u.source_chinese);assert.equal(entry.english_segments[0].text,u.source_english);
   assert.equal(entry.source_url,book.source_url);assert.equal(entry.status,'draft');
   assert.doesNotMatch(u.source_english,/[\u3400-\u9fff]|English translation:\s*Legge|本作品/u);
   let a=norm(u.hanzi_span),b=norm(u.source_chinese),score=1-dist(a,b)/Math.max(a.length,b.length);
   assert.ok(score>=.965,u.indonesian_passage_id+': '+score);
   assert.ok(Math.abs(score-u.normalized_hanzi_similarity)<.000001);
  }
 }
});
