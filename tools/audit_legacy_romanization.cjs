#!/usr/bin/env node
'use strict';
/*
 * Inventory ONLY: suggestions are not proof of a Hanzi correspondence.
 * Deterministic scan of all four source books, zero modifications to source.
 */
const fs = require('node:fs');
const path = require('node:path');
const BASE = path.join(__dirname, '../sishu/chapters');
const reading = require('../ru-classics/reading-normalization.js');
const EXPECTED = {daxue:64, zhongyong:129, lunyu:512, mengzi:260};
const all = [];
const counts = {};
for (const [book, expected] of Object.entries(EXPECTED)) {
  const folder = path.join(BASE, book);
  const files = fs.readdirSync(folder).filter(n => /^\d{2}\.json$/.test(n)).sort();
  const passages = files.flatMap(name => {
    const data = JSON.parse(fs.readFileSync(path.join(folder, name), 'utf8'));
    return data.passages.map((passage, i) => ({
      id: passage.id, book, text: passage.translation_indonesian,
      hanzi: passage.ruby_paragraphs.flat().map(token => token.traditional || token.value || '').join(''),
      finalInChapter: i === data.passages.length - 1,
      chapter: data.id
    }));
  });
  if (passages.length !== expected) throw Error(book + ': unexpected count ' + passages.length);
  counts[book] = passages.length;
  all.push(...passages);
}
if (all.length !== 965) throw Error('Incomplete scan');
const names = new Map();
function add(key, property, row, snippet) {
  let item = names.get(key);
  if (!item) { item = {term:key, orphan:0, paired:0, examples:[], matches:0}; names.set(key, item); }
  item[property]++;
  item.matches++;
  if (item.examples.length < 3) item.examples.push({id:row.id, context:snippet});
}
const pairRegex = /(?<![\p{L}])([\p{Lu}][\p{L}]+(?:\s+[\p{Lu}][\p{L}]+){0,2})\s+-\s+([\p{Lu}][\p{L}-]+(?:\s+[\p{Lu}][\p{L}-]+){0,2})\b/gu;
for (const row of all) {
  for (const match of row.text.matchAll(pairRegex)) {
    const left = match[1], right = match[2];
    // Keep only right-hand terms that plausibly denote names or classical terms.
    if (left.length > 35 || right.length > 35) continue;
    const term = right.trim().replace(/\s+/g, ' ');
    if (term.length > 24) continue;
    add(term, 'paired', row, row.text.slice(Math.max(0, match.index - 34), match.index + match[0].length + 34));
  }
}
const seeds = [...names.entries()].filter(([term, x]) => x.paired >= 1 && term.length > 2).map(([term])=>term);
const extraTerms = ['Khongcu','Bingcu','Kuncu','Cingcu','Cusu','Thiacu','Thai Hak','Tiong Yong','Sing Thong','Giau','Sun','Pik-kwat','Khiem Tiang','Cing Sik','Bok Phi','I-ien','Lai-cu','Siancai','Pik-tat','Siau-tong','Kwi-wa'];
const terms = [...new Set([...seeds,...extraTerms])];
function escaped(s) {return s.replace(/[.*+?^$()|[\]{}\\]/g, '\\$&');}
for (const term of terms) {
  const patt = new RegExp('(^|[^\\p{L}])(' + escaped(term) + ')(?=$|[^\\p{L}])', 'giu');
  for (const row of all) {
    for (const m of row.text.matchAll(patt)) {
      const index = m.index + m[1].length;
      const before = row.text.slice(Math.max(0, index - 8), index);
      const rightSide = /\s-\s$/.test(before);
      // Paired terms are counted by the extraction above, so only emit uncovered occurrences here.
      if (!rightSide) add(term, 'orphan', row, row.text.slice(Math.max(0,index-50),Math.min(row.text.length,index+term.length+70)));
    }
  }
}
const orphans = [...names.values()].filter(x=>x.orphan>0)
  .sort((a,b)=>b.orphan-a.orphan || b.paired-a.paired || a.term.localeCompare(b.term));
const distinctive = all.filter(row => /(?:KATA PENGANTAR|BAB UTAMA|^JILID\s+[IVX]|SIANCAI\s*$)/u.test(row.text))
  .map(row=>({id:row.id, finalInChapter:row.finalInChapter, end:row.text.slice(-260)}));
const tailCases = all.filter(row=>row.finalInChapter).map(row=>({id:row.id,end:row.text.slice(-180)}));
const changed = all.filter(row=>reading.normalize(row.text,row.id)!==row.text).length;
const result = {
  schema: 'ru-classics.legacy-romanization-candidates.v1',
  generated_note: 'Automated candidates only; Hanzi-level confirmation required before editing.',
  passages: all.length, counts, changed, candidate_terms:terms.length,
  orphan_entries:orphans, distinct_headings_or_colophons:distinctive,
  chapter_endings:tailCases
};
fs.mkdirSync(path.join(__dirname,'../audit/reports'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'../audit/reports/legacy-romanization-inventory.json'), JSON.stringify(result,null,2)+'\n');
console.log('SUMMARY ' + JSON.stringify({passages:all.length,counts,changed,candidateTerms:terms.length,termsWithOrphans:orphans.length,headingsOrColophons:distinctive.length}));
console.log('ORPHAN_TOP_100 ' + JSON.stringify(orphans.slice(0,100)));
console.log('BOUNDARY_FLAGS ' + JSON.stringify(distinctive));
