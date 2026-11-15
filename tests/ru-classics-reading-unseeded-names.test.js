'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const reading=require('../ru-classics/reading-normalization.js');
const cases={
  "sishu.lunyu.18.08": [
    "Yu Zhong - Gi-tiong",
    "Yi Yi - I- iet",
    "Zhu Zhang - Cu-tiang",
    "Shao Lian - Siau-lian"
  ],
  "sishu.lunyu.18.06": [
    "Chang Ju - Tiang-chi",
    "Jie Ni - Kiat-lik",
    "Jie Ni - Kia-tlik"
  ],
  "sishu.lunyu.07.23": [
    "Huan Tui - Hwan-twee"
  ],
  "sishu.lunyu.06.01": [
    "Ran Yong - Jiam-yong"
  ],
  "sishu.lunyu.16.13": [
    "Bo Yu - Pik-gi"
  ],
  "sishu.lunyu.13.04": [
    "Fan Xu - Hwan-su"
  ],
  "sishu.lunyu.05.06": [
    "Qi Diao Kai - Chiet-tiau Khai"
  ],
  "sishu.lunyu.06.15": [
    "Meng Zhifan - Bing Ci-hwan"
  ],
  "sishu.lunyu.07.29": [
    "Hu Xiang - Ho-hiang"
  ],
  "sishu.lunyu.19.23": [
    "Shusun Wushu - Sioksun Bu-siok"
  ],
  "sishu.lunyu.14.11": [
    "Meng Gongchuo - Bing Kong-too"
  ],
  "sishu.lunyu.14.44": [
    "Que Dang - Khwat-tong"
  ],
  "sishu.lunyu.17.05": [
    "Gongshan Furao - Kong-san Hut-jiau"
  ],
  "sishu.lunyu.05.01": [
    "Gongye Chang - Kong-ya Tiang"
  ],
  "sishu.lunyu.06.04": [
    "Zihua - Cu-hwa",
    "Ranzi - Jiamcu"
  ],
  "sishu.mengzi.03.02": [
    "Beigong You - Pak-kiong Yu",
    "Meng Shishe - Bing See-sia"
  ],
  "sishu.mengzi.04.04": [
    "Juxin - Ki-siem"
  ],
  "sishu.mengzi.04.09": [
    "Guan Shu - Kwan-siok",
    "Wu Geng - Bu-king"
  ],
  "sishu.mengzi.11.07": [
    "Yi Ya - Ik-ge",
    "Zi Du - Cu-to"
  ],
  "sishu.mengzi.12.01": [
    "Wulu - Ok-lo"
  ],
  "sishu.mengzi.12.02": [
    "Wu Huo - Oh-hik"
  ],
  "sishu.mengzi.12.06": [
    "Mian Ju - Bian-ki"
  ],
  "sishu.mengzi.08.01": [
    "Zhufeng - Cu-ping",
    "Fuxia - Hu-he",
    "Mingtiao - Bing-tiau",
    "Qizhou - Ki-ciu"
  ],
  "sishu.mengzi.09.08": [
    "Ji Huan - Ciet-hwan"
  ],
  "sishu.mengzi.08.31": [
    "Wucheng - Bu-sing"
  ],
  "sishu.mengzi.13.26": [
    "Zi Mo - Cu-bok"
  ],
  "sishu.mengzi.04.08": [
    "Zi Kuai - Cu-kwee",
    "Zi Zhi - Cu-ci"
  ]
};
const ROOT=path.join(__dirname,'..','sishu','chapters');
function read(id){
 const [,book,chapter]=id.split('.');
 const data=JSON.parse(fs.readFileSync(path.join(ROOT,book,chapter+'.json'),'utf8'));
 const p=data.passages.find(x=>x.id===id);
 assert.ok(p,'Passage missing: '+id);
 return p;
}
test('Names that all prior seeded scans missed now have Hanzi-grounded Pinyin',()=>{
 for(const [id,pairs] of Object.entries(cases)){
   const p=read(id);
   const display=reading.normalize(p.translation_indonesian,id);
   for(const expected of pairs)assert.ok(display.includes(expected),id+': missing '+expected);
   assert.equal(reading.normalize(display,id),display,id+': display not idempotent');
 }
});
test('Zhu Zhang 朱張 is NOT Zizhang 子張; Pinyin is chapter-sensitive',()=>{
 const one=read('sishu.lunyu.18.08');
 const a=reading.normalize(one.translation_indonesian,one.id);
 assert.match(a,/Zhu Zhang - Cu-tiang/);
 assert.doesNotMatch(a,/Zizhang - Zhu Zhang/);
 const other=read('sishu.lunyu.19.22');
 assert.match(reading.normalize('Cu-tiang',other.id),/Zizhang - Cu-tiang/);
});
test('Shao Lian and two hidden-name variants survive repeat normalization',()=>{
 const ids=['sishu.lunyu.18.06','sishu.lunyu.18.08','sishu.lunyu.17.05'];
 for(const id of ids){
  const p=read(id),after=reading.normalize(p.translation_indonesian,p.id);
  assert.equal(reading.normalize(after,p.id),after);
  assert.ok(p.ruby_paragraphs.length);
 }
});
