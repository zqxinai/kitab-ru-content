'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const reading = require('../ru-classics/reading-normalization.js');
const BASE = path.resolve(__dirname, '../sishu/chapters');
const EXPECTED = { daxue: [11, 64], zhongyong: [33, 129], lunyu: [20, 512], mengzi: [14, 260] };

test('Pinyin - Hokkian: existing pairs are neither removed nor doubled', () => {
  const before = 'Mengzi - Bingcu, Kongzi - Khongcu, Junzi - Kuncu, Shun - Sun.';
  assert.equal(reading.normalize(before, 'sample'), before);
  assert.equal(reading.normalize('Yao (Giau) dan Sun', 'sample'), 'Yao - Giau dan Shun - Sun');
  assert.equal(reading.normalize('Dari Sing Thong, I- ien dan Lai-cu', 'sample'), 'Dari Cheng Tang - Sing Thong, Yi Yin - I-ien dan Lai Zhu - Lai-cu');
  assert.equal(reading.normalize('Thai-kong Bong dan San Gi-sing', 'sample'), 'Taigong Wang - Thai-kong Bong dan San Yisheng - San Gi-sing');
  assert.equal(reading.normalize('Orang-orang seperti I dan Koo Yau', 'sample'), 'Orang-orang seperti Yu - I dan Gao Yao - Koo Yau');
  assert.equal(reading.normalize('Raja I dan Raja Wen - Bun', 'sample'), 'Raja Yu - I dan Raja Wen - Bun');
  assert.equal(reading.normalize('(IIB:13) Raja', 'sample'), '(IIB:13) Raja');
  assert.equal(reading.normalize('Khiem Tiang, Cing Sik dan Bok Phi', 'sample'), 'Qin Zhang - Khiem Tiang, Zeng Xi - Cing Sik dan Mu Pi - Bok Phi');
  assert.equal(reading.normalize('Negeri Tien, Dinasti Ien, suku bangsa Tik dan suku bangsa I', 'sample'), 'Negeri Chen - Tien, Dinasti Yin - Ien, suku bangsa Di - Tik dan suku bangsa Yi - I');
  assert.equal(reading.normalize('Kun Hu-jien, Hu-jien, Siau-tong, Kwa Siau-kun', 'sample'), 'Jun Furen - Kun Hu-jien, Furen - Hu-jien, Xiaotong - Siau-tong, Gua Xiaojun - Kwa Siau-kun');
  assert.equal(reading.normalize('Pik-tat, Pik-kwat, Tiong-tut, Tiong-hut, Siok-ya, Siok-he, Kwi-swi dan Kwi-wa', 'sample'), 'Bo Da - Pik-tat, Pik-kwat, Zhong Tu - Tiong-tut, Zhong Hu - Tiong-hut, Shu Ye - Siok-ya, Shu Xia - Siok-he, Ji Sui - Kwi-swi dan Ji Gua - Kwi-wa');

  assert.equal(reading.normalize('Sun-i Khun', 'sishu.mengzi.07.17'), 'Chunyu Kun - Sun-i Khun');
  assert.equal(reading.normalize('Kong-sun Thio', 'sishu.mengzi.03.01'), 'Gongsun Chou - Kong-sun Thio');
  assert.equal(reading.normalize('Zi Lu - Zi Lu - Cu Lo', 'sishu.lunyu.11.13'), 'Zi Lu - Cu Lo');
  assert.equal(reading.normalize('Raja Wu - Bu-ting', 'sishu.mengzi.03.01'), 'Raja Wu Ding - Bu-ting');
  assert.equal(reading.normalize('Guan Zhong (Kwan Tiong)', 'sishu.mengzi.03.01'), 'Guan Zhong - Kwan Tiong');
  assert.equal(reading.normalize('Zisi (Cusu)', 'sishu.mengzi.12.06'), 'Zisi - Cusu');
  assert.equal(reading.normalize('Tiong- hut', 'sishu.lunyu.18.11'), 'Zhong Hu - Tiong-hut');
  assert.equal(reading.normalize('Cing See dan Cing Sik', 'sample'), 'Zeng Xi - Cing See dan Zeng Xi - Cing Sik');

});

test('only Mengzi VII B:38 drops extraneous terminal colophon; legitimate Siancai stays', () => {
  const tail = 'Mengapa tiada yang meneruskan ajaran Nya?" ( IIB:13 ). SIANCAI';
  assert.equal(reading.normalize(tail, 'sishu.mengzi.14.38'), 'Mengapa tiada yang meneruskan ajaran Nya?" ( IIB:13 ).');
  assert.equal(reading.normalize('Ia berkata, "Siancai! Sungguh tepat."', 'sishu.lunyu.12.11'),
    'Ia berkata, "Siancai! Sungguh tepat."');
  assert.equal(reading.normalize(tail, 'other'), tail);
});

test('entire source: 78 chapters, 965 unique verses, no lossy edits, stable display', () => {
  let chapterCount = 0;
  let passageCount = 0;
  let normalizedCount = 0;
  const ids = new Set();
  const perBook = {};
  for (const [book, [expectedChapters, expectedVerses]] of Object.entries(EXPECTED)) {
    const dir = path.join(BASE, book);
    const files = fs.readdirSync(dir).filter(name => /^\d{2}\.json$/.test(name)).sort();
    assert.equal(files.length, expectedChapters, book + ' chapter coverage');
    perBook[book] = 0;
    for (const name of files) {
      const chapter = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
      chapterCount++;
      for (const verse of chapter.passages) {
        passageCount++;
        perBook[book]++;
        assert.ok(!ids.has(verse.id), 'duplicate ' + verse.id);
        ids.add(verse.id);
        const source = verse.translation_indonesian;
        assert.ok(typeof source === 'string' && source.length > 0, verse.id);
        const output = reading.normalize(source, verse.id);
        assert.equal(reading.normalize(output, verse.id), output, 'idempotency ' + verse.id);
        assert.equal(verse.translation_indonesian, source, 'source immutable ' + verse.id);
        if (output !== source) normalizedCount++;
        assert.doesNotMatch(output, /(?:KATA PENGANTAR|BAB UTAMA|SIANCAI)\s*$/u, 'unexpected ending ' + verse.id);
        if (verse.id === 'sishu.daxue.11.23') {
          assert.ok(!output.includes('Zhong Yong - Tiong Yong'), 'previous chapter overflow');
        }
      }
    }
    assert.equal(perBook[book], expectedVerses, book + ' verse coverage');
  }
  assert.equal(chapterCount, 78);
  assert.equal(passageCount, 965);
  console.log('Audited all passages: ' + JSON.stringify({ chapterCount, passageCount, normalizedCount, perBook }));
});
