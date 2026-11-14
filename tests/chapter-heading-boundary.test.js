'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const manifest = read('sishu/manifest.json');
const chapters = manifest.chapters.map(entry => read(entry.path));
const passages = chapters.flatMap(chapter => chapter.passages);
const contaminant = /(?:TENGAH\s+SEMPURNA\s+BAB\s+[IVXLCDM]+|SABDA\s+SUCI\s+JILID\s+[IVXLCDM]+)(?:\s*[.:(]|\s|$)/i;

test('No next-chapter heading may appear inside any Indonesian passage', () => {
  assert.equal(chapters.length, 78, 'Si Shu chapter count unexpectedly changed');
  assert.equal(passages.length, 965, 'Si Shu passage count unexpectedly changed');
  assert.equal(new Set(passages.map(p => p.id)).size, 965, 'Passage IDs must remain unique');
  const errors = [];
  for (const chapter of chapters) {
    for (const passage of chapter.passages) {
      const text = passage.translation_indonesian || '';
      if (!text.trim()) errors.push(passage.id + ': missing text');
      if (contaminant.test(text)) errors.push(passage.id + ': embedded next-chapter heading');
      if (!passage.ruby_paragraphs?.length) errors.push(passage.id + ': lost Hanzi/pinyin');
    }
  }
  assert.deepEqual(errors, [], errors.join('\n'));
});

test('Regression: original Zhong Yong I:5 remains intact without next chapter label', () => {
  const passage = chapters.flatMap(ch => ch.passages).find(p => p.id === 'sishu.zhongyong.01.05');
  assert.equal(passage.translation_indonesian,
    'Bila dapat terselenggara Tengah dan Harmonis, maka kesejahteraan akan meliputi langit dan bumi, segenap makhluk dan benda akan terpelihara.');
  const next = chapters.find(ch => ch.id === 'sishu.zhongyong.02');
  assert.ok(next.title.includes('Bab I'));
});

test('Every intermediate chapter final passage excludes the following heading', () => {
  const affectedBooks = ['zhongyong', 'lunyu'];
  const ordered = chapters.filter(ch => affectedBooks.includes(ch.book));
  for (const chapter of ordered) {
    const last = chapter.passages.at(-1);
    assert.ok(last?.translation_indonesian?.trim(), chapter.id);
    assert.doesNotMatch(last.translation_indonesian, contaminant, last.id);
  }
});
