'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const reading = require('../ru-classics/reading-normalization.js');
function passage(id) {
  const [,book,num] = id.split('.');
  const raw=fs.readFileSync(path.join(__dirname,'..','sishu','chapters',book,num+'.json'),'utf8');
  const item=JSON.parse(raw).passages.find(p=>p.id===id);
  assert.ok(item,id);
  return item;
}
const expected={
  'sishu.mengzi.09.06':[
    'Yi - Ik', 'Qi - Khee', 'Dan Zhu - Tancu', 'Baginda Tang - Thong',
    'Tai Ding - Thai ting', 'Wai Bing - Gwee-ping', 'Zhong Ren - Tiong-jiem',
    'Tai Jia - Thai-kak', 'ibukota Bo - Pok', 'Zhou - Ciu mewariskan',
    'Kerajaan Tang - Tong', 'Yu - Gi (Shun - Sun)'
  ],
  'sishu.mengzi.08.30':['Kuang Zhang - Khongciang','negeri (Qi - Cee)'],
  'sishu.mengzi.13.33':['raja (Qi - Cee)','Dian - Tiam'],
  'sishu.lunyu.05.19':['Lingyin - Ling Ien','Ziwen - Cu-bun','Cuizi - Cweecu','Chen Wenzi - Tien Buncu'],
  'sishu.daxue.04.05':['Wen - Bun dan Wu - Bu'],
  'sishu.zhongyong.18.02':['Ji - Kwi dan Wen - Bun'],
  'sishu.daxue.07.02':['Xiaoren - Siau Jien'],
  'sishu.lunyu.12.11':['Shanzai - Siancai'],
  'sishu.mengzi.02.05':['Shanzai - Siancai'],
  'sishu.lunyu.12.22':['Yi Yin - I Ien']
};
test('Final identified legacy orphans have contextual Pinyin without changing the archive',()=>{
  for(const [id,phrases] of Object.entries(expected)){
    const p=passage(id);const source=p.translation_indonesian;
    const view=reading.normalize(source,id);
    for(const phrase of phrases)assert.ok(view.includes(phrase),'Missing '+phrase+' in '+id);
    assert.equal(reading.normalize(view,id),view,'Non-idempotent '+id);
    assert.equal(p.translation_indonesian,source);
  }
});
test('Short names do not rewrite unrelated compound names',()=>{
  const examples=[
    ['Ciu Jiem','Zhou Ren - Ciu Jiem','sample'],
    ['Kitab Thong Si','Kitab Tang Shi - Thong Si','sishu.mengzi.01.02'],
    ['Sing Thong','Cheng Tang - Sing Thong','sample'],
    ['Meng Yizi - Bing I-cu','Meng Yizi - Bing I-cu','sample'],
    ['Chunyu Kun - Sun-i Khun','Chunyu Kun - Sun-i Khun','sample']
  ];
  for(const [before,after,id]of examples)assert.equal(reading.normalize(before,id),after,before);
});
test('Terminal SIANCAI remains a colophon, legitimate 善哉 gets Pinyin',()=>{
  assert.equal(reading.normalize('SIANCAI','sample'),'SIANCAI');
  assert.equal(reading.normalize('Siancai!','sishu.lunyu.12.11'),'Shanzai - Siancai!');
});
