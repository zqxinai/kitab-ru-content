'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const reading=require('../ru-classics/reading-normalization.js');
const cases={
  "sishu.lunyu.14.01": [
    "Xian - Hian"
  ],
  "sishu.lunyu.09.07": [
    "Lao - Loo"
  ],
  "sishu.lunyu.12.09": [
    "You Ruo - Yu Jiak"
  ],
  "sishu.lunyu.05.10": [
    "Zai Yu - Cai-i"
  ],
  "sishu.lunyu.14.09": [
    "Zi Xi - Cu-see"
  ],
  "sishu.lunyu.19.12": [
    "Yan You - Gan-yu"
  ],
  "sishu.mengzi.06.09": [
    "Fei Lian - Hwi-liam"
  ],
  "sishu.mengzi.09.03": [
    "Xiang - Chiang",
    "Gong Gong - Kiong-kong",
    "Youzhou - Yu-ciu",
    "Sanmiao - Sambiau",
    "Sanwei - Sam-gwi",
    "Gun - Kun",
    "Yushan - I"
  ],
  "sishu.mengzi.05.04": [
    "Xie - Siat",
    "Hou Ji - Ho-chik"
  ],
  "sishu.mengzi.08.24": [
    "Yu Gong Zhi Si - Jikongci Su",
    "Yin Gong Zhi Ta - Ienkongci Too"
  ],
  "sishu.mengzi.12.03": [
    "Gao Sou - Koo-so",
    "Xiao Bian - Siau Pwan",
    "Kai Feng - Khai Hong"
  ],
  "sishu.mengzi.12.06": [
    "Gongyi Zi - Konggicu",
    "Zi Liu - Culiu",
    "Baili Xi - Pik-li He"
  ],
  "sishu.mengzi.04.10": [
    "Zishu Yi - Cu-siok Gi"
  ],
  "sishu.mengzi.13.31": [
    "Tai Jia - Thai-kak"
  ],
  "sishu.lunyu.11.26": [
    "Qiu - Kiu",
    "Chi - Chik",
    "Dian - Tiam"
  ]
};
for(const [id,pairs]of Object.entries(cases)){
  test('Named entities from Chinese source: '+id,()=>{
    const [,book,chapter]=id.split('.');
    const data=JSON.parse(fs.readFileSync(path.join(__dirname,'..','sishu','chapters',book,chapter+'.json'),'utf8'));
    const item=data.passages.find(p=>p.id===id);
    assert.ok(item,'Missing passage '+id);
    const shown=reading.normalize(item.translation_indonesian,id);
    for(const term of pairs)assert.ok(shown.includes(term),'Missing '+term+' in '+id);
    assert.equal(reading.normalize(shown,id),shown,'Non-idempotent '+id);
  });
}
test('Short Hokkian words are NOT global aliases',()=>{
 assert.equal(reading.normalize('Siat, I dan Kun','sample'),'Siat, I dan Kun');
 assert.equal(reading.normalize('Hian bertanya','sishu.lunyu.14.01'),'Xian - Hian bertanya');
 assert.equal(reading.normalize('Hian bertanya','sishu.lunyu.14.02'),'Hian bertanya');
 assert.equal(reading.normalize('Gunung I','sample'),'Gunung I');
});
