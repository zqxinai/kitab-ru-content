'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),reader=require('../ru-classics/reading-normalization.js');
const chapters=JSON.parse(fs.readFileSync(path.join(root,'sishu/manifest.json'),'utf8')).chapters.map(v=>JSON.parse(fs.readFileSync(path.join(root,v.path),'utf8')));
const rows=chapters.flatMap(x=>x.passages),byId=new Map(rows.map(x=>[x.id,x]));
function hanzi(p){return p.ruby_paragraphs.flat().map(x=>x.traditional||x.value||'').join('');}
const cases=[
 ['sishu.zhongyong.08.01','回','Hui - Hwee'],
 ['sishu.lunyu.11.03','仲弓','Zhonggong - Tiong Kiong'],
 ['sishu.lunyu.14.05','稷','Ji - Cik'],
 ['sishu.mengzi.08.29','稷','Ji - Cik'],
 ['sishu.mengzi.08.24','羿','Yi - Gee'],
 ['sishu.mengzi.11.20','羿','Yi - Gee'],
 ['sishu.mengzi.05.04','許子','Xu Zi - Hicu'],
 ['sishu.daxue.10.04','桀','Jie - Kiat'],
 ['sishu.daxue.10.04','紂','Zhou - Tiu'],
 ['sishu.mengzi.07.09','桀','Jie - Kiat'],
 ['sishu.mengzi.07.09','紂','Zhou - Tiu'],
 ['sishu.mengzi.06.09','楊朱','Yang Zhu - Yangcu'],
 ['sishu.mengzi.06.09','墨翟','Mo Di - Bik Tik'],
 ['sishu.mengzi.13.26','楊子','Yangzi - Yangcu'],
 ['sishu.mengzi.14.26','楊','Yang Zhu - Yangcu'],
 ['sishu.lunyu.06.08','求','Qiu - Kiu']
];
test('Single-word names receive Chinese-character-grounded Pinyin without replacing Hokkian',()=>{
 assert.equal(rows.length,965);
 for(const [id,hanziNeed,expected]of cases){
  const p=byId.get(id);assert.ok(p,'No passage '+id);
  assert.ok(hanzi(p).includes(hanziNeed),id+' missing Hanzi '+hanziNeed);
  const after=reader.normalize(p.translation_indonesian,id);
  assert.ok(after.includes(expected),id+' missing '+expected);
  assert.equal(reader.normalize(after,id),after,id+' not idempotent');
 }
});
test('Cik can be Ji 稷 or Zhi 蹠 depending on exact passage',()=>{
 const id='sishu.mengzi.06.10',p=byId.get(id),shown=reader.normalize(p.translation_indonesian,id);
 assert.match(hanzi(p),/蹠/);
 assert.ok(shown.includes('perampok Zhi - Cik'));
 assert.ok(!shown.includes('perampok Ji - Cik'));
 assert.equal(reader.normalize(shown,id),shown);
});
test('All 965 passages keep stable normalization on second reading',()=>{
 assert.equal(rows.length,965);
 for(const p of rows){
  const shown=reader.normalize(p.translation_indonesian,p.id);
  assert.equal(reader.normalize(shown,p.id),shown,'Double Pinyin in '+p.id);
 }
});
