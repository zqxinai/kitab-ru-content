'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=path.join(__dirname,'..');
const reading=require('../ru-classics/reading-normalization.js');
const manifest=JSON.parse(fs.readFileSync(path.join(base,'sishu/manifest.json'),'utf8'));
const all=manifest.chapters.flatMap(ch=>JSON.parse(fs.readFileSync(path.join(base,ch.path),'utf8')).passages);
const byId=new Map(all.map(p=>[p.id,p]));
const cases=[
 ['sishu.lunyu.11.03','季路','Ji Lu - Kwi Lo'],
 ['sishu.lunyu.14.16','桓公','Rajamuda Huan - Hwan'],
 ['sishu.lunyu.14.16','桓公','Raja muda Huan - Hwan'],
 ['sishu.lunyu.14.16','召忽','Shao Hu - Tiau Hut'],
 ['sishu.lunyu.14.17','桓公','Raja muda Huan - Hwan'],
 ['sishu.lunyu.14.17','桓公','Rajamuda Huan - Hwan'],
 ['sishu.lunyu.16.01','季氏','Keluarga Ji - Kwi'],
 ['sishu.mengzi.02.16','臧倉','Zang Cang - Cong Chong'],
 ['sishu.mengzi.06.09','春秋','Chunqiu - Chun Chiu'],
 ['sishu.mengzi.06.09','楊朱','Ajaran Yang Zhu - Yang Cu'],
 ['sishu.mengzi.08.21','春秋','Chunqiu - Chun Chiu'],
 ['sishu.mengzi.08.21','乘','Kitab Sheng - Sing'],
 ['sishu.mengzi.08.21','檮杌','Kitab Taowu - Too Gut']
];
test('Batch 02: every extra Pinyin reading is grounded in its exact Hanzi source',()=>{
 assert.equal(all.length,965);
 for(const [id,hanzi,expected]of cases){
   const p=byId.get(id);assert.ok(p,'missing '+id);
   const sourceHanzi=p.ruby_paragraphs.flat().map(t=>t.traditional||t.value||'').join('');
   assert.ok(sourceHanzi.includes(hanzi),id+' Hanzi '+hanzi);
   const shown=reading.normalize(p.translation_indonesian,id);
   assert.ok(shown.includes(expected),id+' missing '+expected);
   assert.equal(reading.normalize(shown,id),shown,'unstable '+id);
 }
});
test('The same Hokkian syllables are not rewritten globally without Hanzi proof',()=>{
 assert.equal(reading.normalize('Hwan, Kwi Lo, Tiau Hut, Cong Chong','unrelated-sample'),
              'Hwan, Kwi Lo, Tiau Hut, Cong Chong');
});
test('Gongzi Jiu and other pre-existing personal names are not double-prefixed',()=>{
 const id='sishu.lunyu.14.16',p=byId.get(id),shown=reading.normalize(p.translation_indonesian,id);
 assert.match(shown,/Gongzi Jiu - Kongcu Kiu/);
 assert.doesNotMatch(shown,/Gongzi Jiu - Gongzi Jiu/);
 assert.match(shown,/Guan Zhong - Kwan-tiong/);
});
test('Jin historical chronicle 乘 is Sheng, not ordinary reading Cheng',()=>{
 const p=byId.get('sishu.mengzi.08.21'),display=reading.normalize(p.translation_indonesian,p.id);
 assert.ok(display.includes('Kitab Sheng - Sing'));
 assert.ok(!display.includes('Kitab Cheng - Sing'));
});
