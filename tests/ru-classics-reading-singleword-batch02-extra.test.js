'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..');
const reading=require('../ru-classics/reading-normalization.js');
const data=JSON.parse(fs.readFileSync(path.join(base,'sishu/manifest.json'),'utf8')).chapters
 .flatMap(ch=>JSON.parse(fs.readFileSync(path.join(base,ch.path),'utf8')).passages);
const byId=new Map(data.map(p=>[p.id,p]));
const cases=[
 ['sishu.mengzi.03.01','微子','Weizi - Bicu'],
 ['sishu.mengzi.03.01','微仲','Weizhong - Bitiong'],
 ['sishu.mengzi.03.01','箕子','Jizi - Kicu'],
 ['sishu.mengzi.11.06','微子啓','Weizi Qi - Bicu Khee'],
 ['sishu.mengzi.08.29','顏回','Yan Hui - Gan Hwee'],
 ['sishu.mengzi.08.29','顏子','Yanzi - Gancu'],
 ['sishu.lunyu.11.19','回','Yan Hui - Gan Hwee'],
 ['sishu.lunyu.05.24','微生高','Weisheng Gao - Bising Koo'],
 ['sishu.lunyu.05.21','寧武子','Ning Wuzi - Ling Bucu'],
 ['sishu.mengzi.05.02','然友','Ran You - Jian Yu'],
 ['sishu.mengzi.11.09','弈秋','Yi Qiu - Phok Chiu'],
 ['sishu.mengzi.14.29','盆成括','Pencheng Kuo - Phunsing Kwat'],
 ['sishu.lunyu.11.02','蔡','Cai - Chai'],
 ['sishu.lunyu.11.18','柴','Gao Chai - Koo Chai'],
 ['sishu.lunyu.11.18','參','Zeng Shen - Cing Cham'],
 ['sishu.lunyu.11.18','師','Zhuansun Shi - Cwansun Su'],
 ['sishu.lunyu.17.07','佛肸','Bi Xi - Piet Hiet'],
 ['sishu.lunyu.05.25','左丘明','Zuoqiu Ming - Coo Khiubing'],
 ['sishu.lunyu.07.14','韶','Shao - Siau']
];
test('Batch 02 second pass: 19 actual missing proper names grounded by original verse Hanzi',()=>{
 assert.equal(data.length,965);
 for(const [id,zh,expected]of cases){
  const p=byId.get(id);assert.ok(p,'no passage '+id);
  const hanzi=p.ruby_paragraphs.flat().map(t=>t.traditional||t.value||'').join('');
  assert.ok(hanzi.includes(zh),id+' missing Chinese '+zh);
  const shown=reading.normalize(p.translation_indonesian,id);
  assert.ok(shown.includes(expected),id+' missing '+expected);
  assert.equal(reading.normalize(shown,id),shown,id+' repeated prefix');
 }
});
test('Chai in 陳蔡 is Cai (place), but 柴 is Gao Chai (disciple)',()=>{
 const place=byId.get('sishu.lunyu.11.02'),person=byId.get('sishu.lunyu.11.18');
 const p1=reading.normalize(place.translation_indonesian,place.id);
 const p2=reading.normalize(person.translation_indonesian,person.id);
 assert.match(p1,/Cai - Chai/);
 assert.match(p2,/Gao Chai - Koo Chai/);
 assert.doesNotMatch(p2,/Gao Cai - Koo Chai/);
 assert.equal(reading.normalize('Chai', 'random-other'), 'Chai');
});
test('Weizi Qi 微子啓 and Mo Ji 貉稽 are distinct; single Hokkian tokens have no global substitution',()=>{
 assert.equal(reading.normalize('Bicu Khee, Kicu, Gancu, Jian Yu', 'unknown'),
              'Bicu Khee, Kicu, Gancu, Jian Yu');
 assert.match(reading.normalize(byId.get('sishu.mengzi.11.06').translation_indonesian,'sishu.mengzi.11.06'),/Weizi Qi - Bicu Khee/);
 assert.match(reading.normalize(byId.get('sishu.mengzi.03.01').translation_indonesian,'sishu.mengzi.03.01'),/Weizi - Bicu/);
});
test('The unrelated character 參 is Zeng Shen personal name, never generic can reading',()=>{
 const p=byId.get('sishu.lunyu.11.18');
 assert.match(reading.normalize(p.translation_indonesian,p.id),/Zeng Shen - Cing Cham/);
});
