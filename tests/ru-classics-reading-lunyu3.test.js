'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const reading = require('../ru-classics/reading-normalization.js');

function readPassage(id) {
  const [, book, chapter] = id.split('.');
  const file = path.join(__dirname, '..', 'sishu', 'chapters', book, chapter + '.json');
  const rows = JSON.parse(fs.readFileSync(file, 'utf8')).passages;
  const item = rows.find(row => row.id === id);
  assert.ok(item, 'Missing passage ' + id);
  return item;
}
const checks = {
  '03.01': ['keluarga Ji - Kwi', 'Ba Yi - Pat Iet'],
  '03.04': ['Lin Fang - Liem Hong'],
  '03.05': ['Bangsa Yi - I dan Di - Tik', 'Kerajaan Xia - He'],
  '03.06': ['Keluarga Ji - Kwi', 'Gunung Taishan - Thai', 'Lin Fang - Liem Hong'],
  '03.07': ['cara Yi - Iep'],
  '03.08': ['Engkaulah Shang - Siang'],
  '03.09': ['Kerajaan Xia - He', 'Kerajaan Yin - Ien'],
  '03.10': ['Sembahyang Di - Tee'],
  '03.11': ['Sembahyang Di - Tee'],
  '03.13': ['Wangsun Jia - Ong Sun-ke', 'Ao - Oo', 'Zao - Co'],
  '03.15': ['Taimiao - Bio Besar'],
  '03.17': ['Ci - Su, engkau'],
  '03.20': ['Guan Ju - Kwan-chi'],
  '03.21': ['Song - Siong', 'Bai - Pik', 'Li - Lik'],
  '03.22': ['Guan Zhong - Kwan-tiong', 'San Gui - Sam-kui'],
  '03.24': ['Mu Duo - Bok-tok'],
  '03.25': ['Shao - Siau', 'Wu - Bu']
};

test('Lun Yu III: Hanzi-grounded historical names and ritual terms keep legacy form', () => {
  for (const [suffix, terms] of Object.entries(checks)) {
    const id = 'sishu.lunyu.' + suffix;
    const source = readPassage(id).translation_indonesian;
    const shown = reading.normalize(source, id);
    for (const term of terms) {
      assert.ok(shown.includes(term), id + ' is missing: ' + term);
    }
    assert.equal(reading.normalize(shown, id), shown, 'Normalization must be idempotent: ' + id);
  }
});

test('Lun Yu III: every source passage is preserved and normalization is idempotent', () => {
  const file = path.join(__dirname, '..', 'sishu', 'chapters', 'lunyu', '03.json');
  const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
  const original = fs.readFileSync(file, 'utf8');
  assert.equal(chapter.passages.length, 26);
  for (const item of chapter.passages) {
    const shown = reading.normalize(item.translation_indonesian, item.id);
    assert.equal(reading.normalize(shown, item.id), shown, 'Repeated rendering changes ' + item.id);
  }
  assert.equal(fs.readFileSync(file, 'utf8'), original, 'Source MATAKIN must remain untouched');
});

test('Restored Lun Yu XVII:5 place alias shares the same dictionary key as its person alias', () => {
  const p = readPassage('sishu.lunyu.17.05');
  const shown = reading.normalize(p.translation_indonesian, p.id);
  assert.match(shown, /daerah Bi - Pi/);
  assert.match(shown, /Gongshan Furao - Kong-son Hut-jiau/);
  assert.equal(reading.normalize(shown, p.id), shown);
});

test('No duplicate keys in passage-specific normalization table', () => {
  const file = fs.readFileSync(path.join(__dirname, '..', 'ru-classics', 'reading-normalization.js'), 'utf8');
  const keys = [...file.matchAll(/'sishu\.(?:daxue|zhongyong|lunyu|mengzi)\.\d{2}\.\d{2}':\s*\[/g)].map(m => m[0]);
  assert.equal(keys.length, new Set(keys).size, 'Repeated passage ID silently overrides previous mapping');
});

test('Contextual terms must not rewrite ordinary Indonesian in other passages', () => {
  const plain = 'Siang hari ada musik Bu, pohon Pik, dan keluarga Kwi.';
  assert.equal(reading.normalize(plain, 'sishu.lunyu.02.01'), plain);
  assert.equal(reading.normalize('Kwan-tiong, Liem Hong, Ong Sun-ke, Pat Iet, Kwan-chi dan Bok-tok', 'sample'),
    'Guan Zhong - Kwan-tiong, Lin Fang - Liem Hong, Wangsun Jia - Ong Sun-ke, Ba Yi - Pat Iet, Guan Ju - Kwan-chi dan Mu Duo - Bok-tok');
});
