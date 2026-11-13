'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const alignment=read('dist/sishu-english-alignment.json');
const source=read('sources/legge/zhongyong-confuciuspedia.json');
const entries=alignment.entries.filter(a=>a.id.startsWith('legge-zhongyong-'));
const chapters=Array.from({length:33},(_,i)=>read('sishu/chapters/zhongyong/'+String(i+1).padStart(2,'0')+'.json'));
const byId=new Map(chapters.flatMap(c=>c.passages.map(p=>[p.id,p])));
const chineseOf=p=>(p.ruby_paragraphs||[]).map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const normalize=s=>String(s).replace(/\s+/g,' ').trim();

test('Zhong Yong contains 33 chapters and 129 indexed MATAKIN passages',()=>{
  assert.equal(chapters.length,33);
  assert.equal(byId.size,129);
  assert.equal(chapters.reduce((n,ch)=>n+ch.passages.length,0),129);
});
test('every MATAKIN passage has exactly one Legge mapped source span',()=>{
  const ids=entries.flatMap(e=>e.indonesian_passage_ids);
  assert.equal(ids.length,129);
  assert.equal(new Set(ids).size,129);
  assert.deepEqual(new Set(ids),new Set(byId.keys()));
  for(const e of entries){
    assert.equal(e.hanzi_span,e.indonesian_passage_ids.map(id=>chineseOf(byId.get(id))).join(''),e.id);
    assert.equal(e.status,'draft');
    assert.ok(e.source_url);
  }
});
test('every one of 64 Legge source units is preserved unaltered exactly once',()=>{
  assert.equal(source.chapters.length,33);
  const original=source.chapters.flatMap(c=>c.units.map(u=>[c.chapter,u.source_unit,normalize(u.english_legge)]));
  assert.equal(original.length,64);
  const used=new Set();
  let total=0;
  for(const entry of entries){
    const chapter=Number(entry.indonesian_passage_ids[0].split('.')[2]);
    for(const seg of entry.english_segments){
      const unit=Number(seg.legge_ref.match(/source unit (\d+)/i)?.[1]);
      assert.ok(unit>0,'Missing Legge source unit '+entry.id);
      const record=source.chapters.find(c=>c.chapter===chapter).units[unit-1];
      assert.equal(normalize(seg.text),normalize(record.english_legge),'Legge source differs '+entry.id);
      const key=chapter+'-'+unit;
      assert.ok(!used.has(key),'Duplicate source unit '+key);
      used.add(key);total++;
    }
  }
  assert.equal(total,64);
  assert.equal(used.size,64);
});
test('re-running the importer does not add duplicate passage mappings',()=>{
  const {alignBatch}=require('../tools/import_legge_zhongyong.js');
  const dictionary=fs.readFileSync('tools/dictionaries/OpenCC-STCharacters.txt','utf8');
  const result=alignBatch(chapters,source,dictionary,alignment);
  assert.equal(result.alignment.entries.length,alignment.entries.length);
  assert.equal(result.report.reduce((sum,x)=>sum+x.new_entries,0),0);
});
