'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const reading = require('../ru-classics/reading-normalization.js');

const ROOT = path.join(__dirname, '..', 'sishu', 'chapters');
const BOOKS = Object.freeze({
  daxue: { chapters: 11, passages: 64 },
  zhongyong: { chapters: 33, passages: 129 },
  lunyu: { chapters: 20, passages: 512 },
  mengzi: { chapters: 14, passages: 260 }
});
const boundary = phrase => new RegExp('(^|[^\\p{L}-])' +
  phrase.replace(/[.*+?^\\$()|[\\]{}]/g, '\\$&') +
  '(?=$|[^\\p{L}-])', 'iu');

test('965 pasal: all four books preserve source and normalized display is stable', () => {
  let total = 0, modified = 0, paired = 0;
  const used = new Map();
  for (const [book, expected] of Object.entries(BOOKS)) {
    let count = 0;
    for (let n = 1; n <= expected.chapters; n++) {
      const file = path.join(ROOT, book, String(n).padStart(2, '0') + '.json');
      const chapter = JSON.parse(fs.readFileSync(file, 'utf8'));
      for (const passage of chapter.passages) {
        count++; total++;
        const original = passage.translation_indonesian;
        assert.equal(typeof original, 'string', passage.id);
        const view = reading.normalize(original, passage.id);
        assert.equal(reading.normalize(view, passage.id), view,
          passage.id + ' must not double Pinyin on rerender');
        if (view !== original) modified++;
        for (const [legacy, preferred] of reading.verifiedPhrases) {
          if (!boundary(legacy).test(original)) continue;
          paired++;
          used.set(legacy, (used.get(legacy) || 0) + 1);
          assert.ok(view.includes(preferred),
            passage.id + ': missing Pinyin-Hokkian pair ' + legacy);
          assert.ok(!boundary(legacy).test(view),
            passage.id + ': orphan Hokkian term ' + legacy);
        }
        // Display-only policy: the MATAKIN source remains as imported.
        assert.equal(passage.translation_indonesian, original, passage.id);
      }
    }
    assert.equal(count, expected.passages, book + ': passage count changed');
  }
  assert.equal(total, 965);
  assert.equal(reading.verifiedPhrases.length, 46);
  assert.ok(modified > 0 && paired > 0);
  for (const [legacy] of reading.verifiedPhrases) {
    assert.ok(used.has(legacy), 'Document verified phrase absent from corpus: ' + legacy);
  }
  console.log('Reading regression: ' + total + ' pasal, ' + modified +
    ' tampilan tersanding, ' + paired + ' kemunculan 46 frasa terverifikasi.');
});

test('homograph guardrails: real Indonesian words and already-paired names stay intact', () => {
  assert.equal(reading.normalize('Siang hari di desa; Si memanah.', 'sample'),
    'Siang hari di desa; Si memanah.');
  assert.equal(reading.normalize('Raja Siang dari Negeri Liang, Dinasti Siang', 'sample'),
    'Raja Xiang - Siang dari Negeri Liang, Dinasti Shang - Siang');
  assert.equal(reading.normalize('Pangeran Siap, Pangeran King, Pangeran Kian', 'sample'),
    'Pangeran She - Siap, Pangeran Jing - King, Pangeran Jian - Kian');
  assert.equal(reading.normalize('Negeri Tin dan Negeri Ting', 'sample'),
    'Negeri Teng - Tin dan Negeri Zheng - Ting');
  assert.equal(reading.normalize('Negeri Coo, Negeri Co', 'sample'),
    'Negeri Zou - Coo, Negeri Zou - Co');
  assert.equal(reading.normalize('Pangeran She - Siap dan Raja Zhou - Tiu', 'sample'),
    'Pangeran She - Siap dan Raja Zhou - Tiu');
  assert.equal(reading.normalize('Negeri Qin - Chien dan Negeri Jin - Cien', 'sample'),
    'Negeri Qin - Chien dan Negeri Jin - Cien');
});
