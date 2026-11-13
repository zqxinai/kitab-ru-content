'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=n=>JSON.parse(fs.readFileSync('sishu/chapters/lunyu/'+n+'.json','utf8'));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?t.traditional:t.value).join('')).join('\n');
for(const [c,id,n,re] of [
 ['17','sishu.lunyu.17.11',6,/禮云禮云，玉帛云乎哉？樂云樂云，鐘鼓云乎哉？/],
 ['19','sishu.lunyu.19.03',1,/子夏云何/]
]){
 test('Semantically correct 云 with ruby, '+id,()=>{
  const p=read(c).passages.find(x=>x.id===id);
  assert.ok(p);
  const text=hanzi(p);
  assert.match(text,re);
  assert.doesNotMatch(text,/雲/);
  assert.equal((text.match(/云/g)||[]).length,n);
  const tokens=p.ruby_paragraphs.flatMap(row=>row.filter(t=>t.type==='ruby'&&t.traditional==='云'));
  assert.equal(tokens.length,n);
  tokens.forEach(t=>{assert.equal(t.pinyin,'yún');assert.equal(t.modern,undefined)});
  assert.equal(p.editorial_status,'unverified-draft');
  assert.ok(p.translation_indonesian.trim().length>50);
 });
}
test('A genuine cloud 雲 remains unchanged',()=>{
 const p=read('07').passages.find(x=>x.id==='sishu.lunyu.07.16');
 assert.match(hanzi(p),/浮雲/);
});
