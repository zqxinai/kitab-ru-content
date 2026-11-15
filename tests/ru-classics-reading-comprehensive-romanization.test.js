'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const reading = require('../ru-classics/reading-normalization.js');

const verified = {
  "sishu.mengzi.14.19": [
    "Mo Ji - Bik Khee"
  ],
  "sishu.mengzi.08.18": [
    "Xu Zi - Chicu"
  ],
  "sishu.mengzi.14.25": [
    "Haosheng Buhai - Hoo-sing Put-hai"
  ],
  "sishu.lunyu.02.05": [
    "Meng Yizi - Bing I-cu",
    "Fan Chi - Huan Thi"
  ],
  "sishu.lunyu.06.22": [
    "Fan Chi - Hwan Thi"
  ],
  "sishu.mengzi.05.05": [
    "Yi Zi - I-cu",
    "Yi Zhi - I-ci",
    "Mozi - Bikcu",
    "Xu Pi - Chi Piet"
  ],
  "sishu.lunyu.06.12": [
    "Ran Qiu - Jiam-kiu"
  ],
  "sishu.lunyu.07.15": [
    "Ran You - Jiam-yu"
  ],
  "sishu.mengzi.02.04": [
    "Zhi Shao - Ti-siau",
    "Jue Shao - Kak-siau"
  ],
  "sishu.mengzi.06.01": [
    "Chen Dai - Tien Tai",
    "Zhao Jianzi - Thio Kancu",
    "Jianzi - Kancu",
    "Wang Liang - Ong-liang",
    "Bi Xi - Pi Hee"
  ],
  "sishu.mengzi.03.01": [
    "Jiao Ge - Kau-kik"
  ],
  "sishu.lunyu.12.08": [
    "Ji Zicheng - Kik Cu-sing"
  ],
  "sishu.mengzi.06.02": [
    "Jing Chun - King Chun",
    "Gongsun Yan - Kong sun Yan",
    "Zhang Yi - Tio Gi"
  ],
  "sishu.mengzi.09.01": [
    "Gongming Gao - Kong-bing Koo",
    "Chang Xi - Tiang-siet"
  ],
  "sishu.mengzi.13.43": [
    "Gongduzi - Kongto-cu",
    "Teng Geng - Ting King"
  ],
  "sishu.lunyu.11.24": [
    "Ji Ziran - Kwi Cu-jian"
  ],
  "sishu.mengzi.12.05": [
    "Ji Ren - Kwi Jiem"
  ],
  "sishu.lunyu.11.12": [
    "Ji Lu - Kwi-lo"
  ],
  "sishu.mengzi.04.10": [
    "Jisun - Kwi-sun"
  ],
  "sishu.lunyu.14.05": [
    "Nangong Shi - Lam-kiong Kwat"
  ],
  "sishu.mengzi.06.04": [
    "Peng Geng - Phing-king"
  ],
  "sishu.mengzi.04.04": [
    "Pinglu - Ping-liok"
  ],
  "sishu.mengzi.04.08": [
    "Shen Tong - Siem-tong"
  ],
  "sishu.mengzi.08.31": [
    "Shenyou Xing - Siem-yu Hing"
  ],
  "sishu.mengzi.05.01": [
    "Cheng Jian - Sing-han"
  ],
  "sishu.mengzi.06.08": [
    "Dai Yingzhi - Tai Ing-ci"
  ],
  "sishu.lunyu.09.06": [
    "Taizai - Thai-cai"
  ],
  "sishu.mengzi.13.35": [
    "Tao Ying - Thiau Ing",
    "Gu Sou - Ko-so"
  ],
  "sishu.mengzi.04.03": [
    "Chen Zhen - Tien Cien"
  ],
  "sishu.mengzi.05.04": [
    "Chen Xiang - Tien Siang",
    "Chen Liang - Tien Liang",
    "Chen Xin - Tien Sien",
    "Shennong - Sien-long"
  ],
  "sishu.lunyu.14.21": [
    "Chen Chengzi - Tien Singcu",
    "Chen Heng - Tien Hing"
  ],
  "sishu.lunyu.07.31": [
    "Chen Sibai - Tien Supai",
    "Wuma Qi - Buma Ki",
    "Wu Mengzi - Go Mengzi - Bingcu"
  ],
  "sishu.mengzi.14.23": [
    "Chen Zhen - Tien-Cien",
    "Feng Fu - Phang Hu"
  ],
  "sishu.mengzi.12.14": [
    "Chen Zi - Tiencu"
  ],
  "sishu.mengzi.04.02": [
    "Dongguo - Tong-kok",
    "Jing Chou - King Thio",
    "Jingzi - Kingcu"
  ],
  "sishu.lunyu.05.10": [
    "Yu - I-lah",
    "Yu - I tidak"
  ],
  "sishu.mengzi.09.04": [
    "Xianqiu Meng - Hamkhiu Bong",
    "Gu Sou - Ko-so"
  ]
};
function passage(id) {
  const [,book,chapter] = id.split('.');
  const chapterData = JSON.parse(fs.readFileSync(path.join(__dirname,'..','sishu','chapters',book,chapter+'.json'), 'utf8'));
  const p = chapterData.passages.find(p => p.id === id);
  assert.ok(p, 'Missing '+id);
  return p;
}
test('Editorial name map: all curated people / places have Pinyin alongside MATAKIN wording', () => {
  for(const [id,expected] of Object.entries(verified)) {
    const p=passage(id);
    const after=reading.normalize(p.translation_indonesian,id);
    for(const term of expected) assert.ok(after.includes(term), id+': expected '+term+' in '+after.slice(0,250));
    assert.equal(reading.normalize(after,id),after,'Non-idempotent '+id);
  }
});

test('Small Hokkian homographs stay passage-specific and do not change unrelated MATAKIN', () => {
  assert.equal(reading.normalize('Bing I-cu', 'sishu.lunyu.02.05'), 'Meng Yizi - Bing I-cu');
  assert.equal(reading.normalize('I-cu', 'sishu.mengzi.05.05'), 'Yi Zi - I-cu');
  assert.equal(reading.normalize('I-lah yang', 'sishu.lunyu.05.10'), 'Yu - I-lah yang');
  assert.equal(reading.normalize('daerah Tong', 'sishu.mengzi.09.06'), 'daerah Tong');
  assert.equal(reading.normalize('Maka Tuhan YME-lah', 'sample'), 'Maka Tuhan YME-lah');
});

test('No change to canonical text and original Hanzi across every fixture in curated review', () => {
  for(const id of Object.keys(verified)) {
    const p=passage(id);
    assert.ok(p.translation_indonesian && p.ruby_paragraphs?.length);
    const before=p.translation_indonesian;
    reading.normalize(before,id);
    assert.equal(p.translation_indonesian,before);
  }
});
