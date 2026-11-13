'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const manifest = read('sishu/manifest.json');
const passages = manifest.chapters.flatMap(ch => read(ch.path).passages);
const glyph = t => t?.traditional || t?.value || '';
const isMorning = (prev, ahead) => prev === '一' ||
  ahead.startsWith('朝聞道') || ahead.startsWith('朝暮') ||
  (prev === '來' && ahead.startsWith('朝走馬')) ||
  ahead.startsWith('朝不食') || ahead.startsWith('朝，將視朝');
const isWei = (prev, next) => prev === '以' || prev === '無' ||
  ['政', '仁', '善'].includes(next);
test('104 attested 曾/率/薄/便/朝 readings are correct with deliberate exceptions', () => {
  const counts = {曾:0, 率:0, 薄:0, 便:0, 朝:0, morning:0, lead:0, rate:0};
  for (const p of passages) {
    const tokens = p.ruby_paragraphs.flat();
    const chars = tokens.map(glyph);
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i], c = t.traditional;
      const prev = chars[i - 1] || '';
      const ahead = chars.slice(i, i + 7).join('');
      if (c === '曾') { counts.曾++; assert.equal(t.pinyin, 'zēng', p.id); }
      if (c === '薄') { counts.薄++; assert.equal(t.pinyin, 'bó', p.id); }
      if (c === '便') { counts.便++; assert.equal(t.pinyin, 'pián', p.id); }
      if (c === '率') {
        counts.率++;
        if (prev === '彀') { counts.rate++; assert.equal(t.pinyin, 'lǜ', p.id); }
        else { counts.lead++; assert.equal(t.pinyin, 'shuài', p.id); }
      }
      if (c === '朝') {
        counts.朝++;
        if (isMorning(prev, ahead)) {
          counts.morning++;
          assert.equal(t.pinyin, 'zhāo', p.id + ' '+ahead);
        }
      }
    }
  }
  assert.deepEqual(counts, {曾:59, 率:16, 薄:14, 便:5, 朝:61, morning:11, lead:15, rate:1});
});
test('149 verified verbal 為 are wéi; other uses are not guessed as wèi', () => {
  let total = 0, fixedRuleCount = 0, weiWithoutRule = 0;
  const perRule = {以為:0, 為政:0, 為仁:0, 為善:0, 無為:0};
  for (const p of passages) {
    const toks = p.ruby_paragraphs.flat();
    const chars = toks.map(glyph);
    for (let i=0;i<toks.length;i++) {
      const t=toks[i];
      if (t.traditional !== '為') continue;
      total++;
      const prev=chars[i-1]||'', next=chars[i+1]||'';
      if (isWei(prev,next)) {
        const rule=prev==='以'?'以為':next==='政'?'為政':next==='仁'?'為仁':next==='善'?'為善':'無為';
        perRule[rule]++;
        fixedRuleCount++;
        assert.equal(t.pinyin,'wéi',p.id+' '+chars.slice(Math.max(0,i-5),i+5).join(''));
      } else if(t.pinyin==='wèi')weiWithoutRule++;
    }
  }
  assert.equal(total,739);
  assert.equal(fixedRuleCount,149);
  assert.deepEqual(perRule,{以為:106, 為政:17, 為仁:12, 為善:9, 無為:5});
  assert.ok(weiWithoutRule > 0,'Some remaining contexts require separate editorial judgment');
});
