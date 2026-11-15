'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const reading = require('../ru-classics/reading-normalization.js');

function passage(id) {
  const [, book, chapter] = id.split('.');
  const file = path.join(__dirname, '..', 'sishu', 'chapters', book, chapter + '.json');
  const item = JSON.parse(fs.readFileSync(file, 'utf8')).passages.find(p => p.id === id);
  assert.ok(item, 'Missing ' + id);
  return item;
}
const cases = {
  'sishu.lunyu.15.06': ['Man - Ban', 'Mo - Bekpun'],
  'sishu.lunyu.14.14': ['Fang - Hong', 'Zang Wuzhong - Cong Bu-tiong'],
  'sishu.lunyu.17.04': ['Wucheng - Bu-sing'],
  'sishu.lunyu.06.14': ['Wucheng - Busing', 'Tantai Mieming - Tam-tay Biat-bing'],
  'sishu.lunyu.14.08': ['Ziyu - Cu-i'],
  'sishu.lunyu.07.19': ['She - Siap'],
  'sishu.lunyu.06.09': ['Ji - Kwi', 'Wen - Bun'],
  'sishu.lunyu.18.09': ['Qin - Chien', 'He - Hoo', 'Zhi - Ci', 'Gan - Kan', 'Liao - Liau', 'Que - Khwat', 'Fangshu - Hong-siok', 'Wu - Bu', 'Xiang - Siang'],
  'sishu.lunyu.11.26': ['Yi - Ki'],
  'sishu.mengzi.04.14': ['Xiu - Hiu', 'Chong - Cong'],
  'sishu.mengzi.04.07': ['Ying - Ing', 'Chong Yu - Chiong Gi'],
  'sishu.mengzi.04.06': ['Ge - Khap', 'Wang Huan - Ong-hwan'],
  'sishu.mengzi.04.05': ['Lingqiu - Ling-khiu']
};

test('Geographical names and historical people use Hanzi-specific pairings', () => {
  for (const [id, pairs] of Object.entries(cases)) {
    const p = passage(id), shown = reading.normalize(p.translation_indonesian, id);
    for (const pair of pairs) assert.ok(shown.includes(pair), 'Missing '+pair+' at '+id);
    assert.equal(reading.normalize(shown, id), shown, 'Not idempotent '+id);
  }
});

test('Qin 秦 and Jin 晉 stay distinct, even though both have legacy Chien', () => {
  const qin = passage('sishu.lunyu.18.09');
  const shown = reading.normalize(qin.translation_indonesian, qin.id);
  assert.match(qin.translation_indonesian, /Negeri Jin - Chien/);
  assert.match(shown, /Negeri Qin - Chien/);
  assert.doesNotMatch(shown, /Negeri Jin - Chien/);
  const jin = passage('sishu.lunyu.14.15');
  assert.match(reading.normalize(jin.translation_indonesian, jin.id), /Negeri Jin - Cien/);
});

test('The same legacy Ki can denote different rivers, never globally normalized', () => {
  assert.match(reading.normalize('Sungai Ki', 'sishu.lunyu.11.26'), /Sungai Yi - Ki/); // 沂
  assert.equal(reading.normalize('Sungai Ki', 'other'), 'Sungai Ki');
});

test('Historical pairs do not alter ordinary Indonesian, non-contextual terms or archive text', () => {
  const plain = 'Daerah He Dong dan Sungai Ki mungkin biasa disebut lain.';
  assert.equal(reading.normalize(plain, 'sample'), plain);
  assert.equal(reading.normalize('Chiong Gi dan Ong-hwan', 'sample'), 'Chong Yu - Chiong Gi dan Wang Huan - Ong-hwan');
  for (const id of Object.keys(cases)) {
    const p = passage(id);
    assert.ok(p.translation_indonesian, 'MATAKIN source cannot be removed');
    assert.ok(p.ruby_paragraphs.length, 'Hanzi source cannot be removed');
  }
});
