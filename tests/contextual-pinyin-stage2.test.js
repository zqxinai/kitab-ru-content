'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const manifest = read('sishu/manifest.json');
const chapters = manifest.chapters.map(item => {
  const chapter = read(item.path);
  assert.equal(chapter.id, item.id);
  assert.equal(chapter.passages.length, item.passages);
  return chapter;
});
const passages = chapters.flatMap(c => c.passages);
const glyph = token => token.traditional || token.value || '';
const isQuestion = token => /^[？！?!]/.test(glyph(token));
const remainsYu = (p, preceding) =>
  (p.id === 'sishu.lunyu.07.11' && preceding.endsWith('誰')) ||
  (p.id === 'sishu.lunyu.18.06' && preceding.endsWith('誰')) ||
  (p.id === 'sishu.lunyu.17.01' && preceding.endsWith('歲不我')) ||
  (p.id === 'sishu.lunyu.18.08' && preceding.endsWith('叔齊'));

test('All 965 passages preserve the expected four-book structure and review status', () => {
  assert.equal(chapters.length, 78);
  assert.equal(passages.length, 965);
  const counts = {daxue: 0, zhongyong: 0, lunyu: 0, mengzi: 0};
  for (const p of passages) {
    counts[p.id.split('.')[1]]++;
    assert.equal(p.editorial_status, 'unverified-draft', p.id);
    assert.ok(p.translation_indonesian, p.id);
  }
  assert.deepEqual(counts, {daxue: 64, zhongyong: 129, lunyu: 512, mengzi: 260});
});

test('All 73 instances of 地 are dì in the classical land/earth context', () => {
  let total = 0;
  for (const p of passages) for (const t of p.ruby_paragraphs.flat()) {
    if (t.type === 'ruby' && t.traditional === '地') {
      total++;
      assert.equal(t.pinyin, 'dì', p.id);
    }
  }
  assert.equal(total, 73); // 72 fixed in stage 2; 配地 was already fixed.
});

test('104 question-particle 與 readings are yú; four nonparticle/ambiguous uses remain yǔ', () => {
  let particles = 0, retained = 0;
  for (const p of passages) {
    const tokens = p.ruby_paragraphs.flat();
    const chars = tokens.map(glyph);
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].traditional !== '與' || !isQuestion(tokens[i + 1] || {})) continue;
      const previous = chars.slice(Math.max(0, i - 6), i).join('');
      if (remainsYu(p, previous)) {
        assert.equal(tokens[i].pinyin, 'yǔ', p.id + ' ' + previous);
        retained++;
      } else {
        assert.equal(tokens[i].pinyin, 'yú', p.id + ' ' + previous);
        particles++;
      }
    }
  }
  assert.equal(particles, 107); // includes three corrected earlier in Zhong Yong IX:2.
  assert.equal(retained, 4);
});

test('Source text and translations match the distributable bundle except audited pinyin before rebuild', () => {
  const bundle = read('dist/sishu-content.json');
  assert.equal(bundle.chapters.length, 78);
  assert.equal(bundle.chapters.reduce((n, c) => n + c.passages.length, 0), 965);
  function normalize(chapter) {
    const copy = JSON.parse(JSON.stringify(chapter));
    for (const p of copy.passages) for (const row of p.ruby_paragraphs) {
      for (let i = 0; i < row.length; i++) {
        const t = row[i];
        if (t.traditional === '地') t.pinyin = '(earth)';
        if (t.traditional === '與' && /^[？！?!]/.test(glyph(row[i + 1] || {}))) t.pinyin = '(question-or-verb)';
      }
    }
    return copy;
  }
  for (const source of chapters) {
    const built = bundle.chapters.find(c => c.id === source.id);
    assert.ok(built, source.id);
    assert.deepEqual(normalize(source), normalize(built), source.id);
  }
});
