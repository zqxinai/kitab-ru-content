'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const reading = require('../ru-classics/reading-normalization.js');

function get(id) {
  const [, book, chapter] = id.split('.');
  const file = path.join(__dirname, '..', 'sishu', 'chapters', book, chapter+'.json');
  const found = JSON.parse(fs.readFileSync(file,'utf8')).passages.find(p => p.id === id);
  assert.ok(found, 'Missing '+id);
  return found;
}
const pairedPeople = {
  'sishu.mengzi.07.24': ['Zi Ao - Cu-go', 'Yuezhengzi - Gak Cingcu'],
  'sishu.mengzi.09.04': ['Xianqiu Meng - Hamkhiu Bong'],
  'sishu.mengzi.04.12': ['Yin Shi - Ien-su'],
  'sishu.mengzi.09.08': ['Mizi - Biet-cu', 'Yan Chouyou - Gan Siu-yu'],
  'sishu.lunyu.02.05': ['Meng Yizi - Bing I-cu'],
  'sishu.mengzi.11.05': ['Meng Jizi - Bing Kwicu'],
  'sishu.lunyu.14.19': ['Zhu Tuo - Ciok Too', 'Zhongshu Yu - Tiongsiok Gi', 'Wangsun Jia - Ongsun Ke'],
  'sishu.mengzi.12.02': ['Cao Jiao - Coo Kau'],
  'sishu.lunyu.01.10': ['Zi Qin - Cu-khiem'],
  'sishu.lunyu.11.25': ['Zigao - Cu-koo'],
  'sishu.mengzi.08.24': ['Pang Meng - Hong Bong', 'Gongming Yi - Kongbing Gi', 'Zizhuo Ruzi - Cucok Jicu'],
  'sishu.lunyu.14.36': ['Zifu Jingbo - Cuhok Kingpik', 'Gongbo Liao - Kongpik Liau']
};

test('18 new person aliases remain paired and idempotent', () => {
  for (const [id, terms] of Object.entries(pairedPeople)) {
    const row = get(id);
    const view = reading.normalize(row.translation_indonesian, id);
    for (const expected of terms) assert.ok(view.includes(expected), id+' expected '+expected);
    assert.equal(reading.normalize(view,id),view,'Non-idempotent '+id);
  }
});

test('Yuezhengzi 樂正子 is distinct from Zengzi 曾子, without rewriting source', () => {
  const p = get('sishu.mengzi.07.24');
  assert.match(p.translation_indonesian,/Gak Zengzi - Cingcu/,'Original MATAKIN archive remains unchanged');
  const view = reading.normalize(p.translation_indonesian,p.id);
  assert.match(view,/Yuezhengzi - Gak Cingcu/);
  assert.doesNotMatch(view,/Gak Zengzi - Cingcu/);
  assert.equal(reading.normalize('Zengzi - Cingcu','other'),'Zengzi - Cingcu',
    'Legitimate Zengzi pairing must remain intact');
  assert.equal(reading.normalize(view,p.id),view);
});
