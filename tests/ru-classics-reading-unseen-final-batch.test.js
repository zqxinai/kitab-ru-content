'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const reading=require('../ru-classics/reading-normalization.js');
const cases={
  "sishu.lunyu.14.25": [
    "Qu Boyu - Ki Pik-giok"
  ],
  "sishu.lunyu.15.07": [
    "Shi Yu - Su-gi",
    "Qu Boyu - Ki Pik-giok"
  ],
  "sishu.lunyu.11.03": [
    "Ran Boniu - Jiam Pik-giu"
  ],
  "sishu.lunyu.06.10": [
    "Bo Niu - Pik-Giu"
  ],
  "sishu.lunyu.05.17": [
    "Yan Pingzhong - Yan Ping-tiong"
  ],
  "sishu.lunyu.08.01": [
    "Taibo - Thai-Pik"
  ],
  "sishu.lunyu.14.08": [
    "Dongli - Tong-li"
  ],
  "sishu.lunyu.05.07": [
    "Zhong You - Tiong-yulah"
  ],
  "sishu.mengzi.07.13": [
    "Taigong - Thai-kong"
  ],
  "sishu.mengzi.13.22": [
    "Taigong - Thai-kong"
  ],
  "sishu.mengzi.12.08": [
    "Shenzi - Sien-cu",
    "Jiang - Kiang",
    "Taigong - Thaikong"
  ],
  "sishu.mengzi.12.04": [
    "Shiqiu - Sik-khiu"
  ],
  "sishu.mengzi.13.36": [
    "Dieze - Tiat-tik"
  ],
  "sishu.mengzi.07.01": [
    "Shi Kuang - Su-khong"
  ],
  "sishu.mengzi.12.06": [
    "Wang Bao - Ong-pa"
  ],
  "sishu.mengzi.05.04": [
    "Xu Zi - Hi-cu"
  ],
  "sishu.mengzi.09.03": [
    "orang-orang Youbi - Yu-pi",
    "kepala daerah Youbi - Yu-pi"
  ],
  "sishu.daxue.10.06": [
    "Tao - Thoo"
  ],
  "sishu.mengzi.14.25": [
    "Shen - Sien"
  ]
};
test('Third unseeded sweep is matched to real Chinese passage and is stable',()=>{
 for(const [id,terms]of Object.entries(cases)){
  const [,book,chapter]=id.split('.');
  const p=JSON.parse(fs.readFileSync(path.join(__dirname,'..','sishu','chapters',book,chapter+'.json'),'utf8')).passages.find(x=>x.id===id);
  assert.ok(p,'Missing verse '+id);
  const value=reading.normalize(p.translation_indonesian,id);
  for(const term of terms)assert.ok(value.includes(term),'Missing '+term+' at '+id);
  assert.equal(reading.normalize(value,id),value,'Repeated prefix at '+id);
 }
});
test('Never confuse full Ran Boniu with standalone Bo Niu, or shorten Taigong Wang',()=>{
 assert.equal(reading.normalize('Jiam Pik-giu','sishu.lunyu.11.03'),'Ran Boniu - Jiam Pik-giu');
 assert.equal(reading.normalize('Pik-Giu','sishu.lunyu.06.10'),'Bo Niu - Pik-Giu');
 assert.equal(reading.normalize('Thai-kong','sishu.mengzi.07.13'),'Taigong - Thai-kong');
 assert.equal(reading.normalize('Thai-kong Bong','sample'),'Taigong Wang - Thai-kong Bong');
});
