'use strict';
// Inventaris read-only: menemukan nama historis yang belum memperoleh pasangan
// Pinyin–Hokkian. Hasil ini kandidat audit, bukan klaim setiap temuan salah.
const fs = require('node:fs');
const path = require('node:path');
const reading = require('../ru-classics/reading-normalization.js');
const ROOT = path.join(__dirname, '..', 'sishu', 'chapters');
const BOOKS = { daxue:11, zhongyong:33, lunyu:20, mengzi:14 };
const KNOWN_MANDARIN = new Set([
  'Negeri Qi','Negeri Lu','Negeri Chu','Negeri Wei','Negeri Yan',
  'Negeri Jin','Negeri Song','Negeri Liang','Negeri Ge',
  'Raja Wen','Raja Wu','Raja Yao','Raja Shun','Raja Hui',
  'Raja Tang','Raja Xuan','Raja Cheng','Raja Yu','Raja Li',
  'Dinasti Zhou','Pangeran Ai','Rajamuda Ling','Rajamuda Ping',
  'Raja Negeri','Raja Besar','Raja Muda','Raja Suci',
  // Sudah memakai Pinyin atau merupakan istilah Indonesia, bukan Hokkian:
  'Negeri Kun', // awal frasa "Negeri Kun Yi - Khun I", 昆夷, sudah berpasangan
  'Negeri Tengah', // kata geografis Indonesia, bukan nama fonetis
  'Rajamuda Xuan', // Xuan adalah Mandarin, tanpa ejaan Hokkian terpisah
  'Pangeran Negeri','Pangeran Barat','Rajamuda Negeri',
  'Rajamuda Pemimpin','Raja Dinasti'
]);
const pattern = /\b(?:Negeri|Dinasti|Rajamuda|Pangeran|Raja|Pembesar)\s+[\p{Lu}][\p{L}-]{1,25}\b/gu;
function matchesAsStandalone(text, phrase) {
  const escaped = phrase.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  return new RegExp('(^|[^\\p{L}-])'+escaped+'(?=$|[^\\p{L}-])','u').test(text);
}
let passages = 0, changed = 0, paired = 0;
const candidates = new Map();
for (const [book, chapters] of Object.entries(BOOKS)) {
  for (let n = 1; n <= chapters; n++) {
    const file = path.join(ROOT, book, String(n).padStart(2,'0') + '.json');
    const chapter = JSON.parse(fs.readFileSync(file,'utf8'));
    for (const verse of chapter.passages) {
      passages++;
      const source = verse.translation_indonesian || '';
      const view = reading.normalize(source, verse.id);
      if (view !== source) changed++;
      for (const matched of source.matchAll(pattern)) {
        const term = matched[0];
        if (KNOWN_MANDARIN.has(term)) continue;
        if (!matchesAsStandalone(view,term)) {paired++;continue;}
        if (!candidates.has(term)) candidates.set(term,{term,count:0,passages:[]});
        const row = candidates.get(term);
        row.count++;
        if (row.passages.length < 6 && !row.passages.includes(verse.id)) row.passages.push(verse.id);
      }
    }
  }
}
const unresolved = [...candidates.values()].sort((a,b)=>b.count-a.count||a.term.localeCompare(b.term,'id'));
const result = {
  passages,
  normalizedPassages:changed,
  recognizedTitleOccurrences:paired,
  unresolvedTitleCandidates:unresolved.length,
  status:'requires-contextual-review',
  explanation:'Kandidat mencakup nama Hokkian, ejaan Mandarin yang belum di-allowlist, dan frasa editorial MATAKIN; tidak otomatis salah.',
  candidates:unresolved
};
if (process.argv.includes('--json')) process.stdout.write(JSON.stringify(result,null,2)+'\n');
else {
  console.log('Ru Classics: '+passages+' pasal; '+changed+' dengan normalisasi tampilan.');
  console.log('Kandidat nama yang perlu pemeriksaan kontekstual: '+unresolved.length);
  for (const row of unresolved.slice(0,80)) console.log(row.count+'x '+row.term+' ['+row.passages.join(', ')+']');
}
if (passages !== 965) process.exitCode = 1;