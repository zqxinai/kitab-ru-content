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
const placePattern = /\b(?:kota|Kota|daerah|Daerah|desa|Desa|Gunung|gunung|Sungai|sungai|Bukit|bukit|Negeri|negeri|Istana|istana|lembah|Lembah|telaga|Telaga)\s+[\p{Lu}][\p{L}-]{1,25}(?:\s+[\p{Lu}][\p{L}-]{1,25}){0,2}/gu;
const personPattern = /\b([\p{Lu}][\p{L}-]{2,}(?:[ -]+[\p{Lu}][\p{L}-]{2,}){0,2})\s+(?=bertanya|berkata|menjawab|datang|menemui|menyuruh|diangkat|membunuh|berdiam|yang|memerintah|menerima|pernah|meninggalkan|mewakili|berkuasa|mengajak)/gu;
const commonPlaceNames = new Set(['Negeri Yan','Negeri Song','Negeri Liang','Negeri Qi','Negeri Lu','Negeri Chu','Negeri Wei','Negeri Jin','Negeri Ge']);
const notPeople = new Set(['Jalan Suci','Cinta Kasih','Yang Maha','Kitab Sanjak','Raja Muda','Raja Besar','Nabi Kongzi','Tuhan Yang']);
// Exception ledger: these are not Hokkian names awaiting Pinyin. Their
// identification was checked in the cited passage; do not hide new candidates.
const NOT_HOKKIAN_PLACE = new Map([
  ['daerah Tong', '桐; Tong is already the Mandarin spelling'],
  ['daerah Negeri Chu', 'Indonesian nested geographic description'],
  ['daerah Negeri Lu', 'Indonesian nested geographic description'],
  ['daerah Selatankah', 'Indonesian directional adjective'],
  ['daerah Utarakah', 'Indonesian directional adjective'],
  ['daerah Sungai Han', 'Han is already the Mandarin river name'],
  ['istana Guru', 'Indonesian possessive phrase, not toponym'],
  ['istana Salju', 'Indonesian translation of 雪宮, not Hokkian'],
  ['istana Yao', 'Yao is already Hanyu Pinyin']
]);
const ORDINARY_FIRST = /^(?:Adapun|Anak|Bukankah|Bulan|Cara|Cinta|Daerah|Demikianlah|Hal|Hanya|Inilah|Karena|Kawan|Kebajikan|Keluhuran|Kerajaan|Maka|Nasehat|Siswa|Suci|Tata|Tiga)\b/;
const otherPlaces = new Map(), otherPeople = new Map();
function record(map,term,id) {
  const v = map.get(term) || {term, count:0, passages:[]};
  v.count++;
  if(v.passages.length<5&&!v.passages.includes(id))v.passages.push(id);
  map.set(term,v);
}
function unpairedInView(view,term) {
  let pos=-1;
  while((pos=view.indexOf(term,pos+1))>=0){
    if(pos>0&&/[\p{L}-]/u.test(view[pos-1]))continue;
    if(pos+term.length<view.length&&/[\p{L}-]/u.test(view[pos+term.length]))continue;
    if(view.slice(Math.max(0,pos-3),pos)===' - ')continue;
    if(/^\s*-\s*\p{L}/u.test(view.slice(pos+term.length)))continue; // Pinyin at left of pair
    if(term.includes(' - '))continue; // already a complete Pinyin–Hokkian pair
    const nearby = view.slice(Math.max(0,pos-60),pos).split(/[.,;:!?()“”"']/u).pop();
    if(/\s-\s[\p{L}\s-]*$/u.test(nearby))continue; // nested Hokkian suffix in a paired full name
    return true;
  }
  return false;
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
      for (const m of source.matchAll(placePattern)) {
        const term=m[0], label=term.replace(/^[^ ]+ /,'');
        if(term.includes(' - ')||commonPlaceNames.has(term)||NOT_HOKKIAN_PLACE.has(term)||/^(Timur|Barat|Utara|Selatan|Tengah|Suci|Besar)\b/.test(label))continue;
        if(!unpairedInView(view,term))continue;
        record(otherPlaces,term,verse.id);
      }
      for(const m of source.matchAll(personPattern)){
        const term=m[1],before=source.slice(Math.max(0,m.index-3),m.index);
        if(before===' - '||notPeople.has(term)||term.includes(' - ')||ORDINARY_FIRST.test(term))continue;
        if(/^(?:Negeri|negeri|kota|Kota|Gunung|gunung|Sungai|sungai|daerah|Kitab|Raja|Rajamuda|Pangeran|Nabi|Tuhan|Orang|Pembesar|Seorang|Sang|Suku|Murid|Badan|Dahulu|Ketika|Kini|Para)\b/.test(term))continue;
        if(!term.includes(' ')&&!term.includes('-')&&!/(?:cu|zi|tong|thio|kwi|liam|yan|sik)$/i.test(term))continue;
        if(!unpairedInView(view,term))continue;
        record(otherPeople,term,verse.id);
      }
    }
  }
}
const unresolved = [...candidates.values()].sort((a,b)=>b.count-a.count||a.term.localeCompare(b.term,'id'));
const sortReview = map => [...map.values()].sort((a,b)=>b.count-a.count||a.term.localeCompare(b.term,'id'));
const unpairedPlaces = sortReview(otherPlaces), unpairedPeople = sortReview(otherPeople);
const result = {
  passages,
  normalizedPassages:changed,
  recognizedTitleOccurrences:paired,
  unresolvedTitleCandidates:unresolved.length,
  unresolvedPlaceCandidates:unpairedPlaces.length,
  unresolvedPersonCandidates:unpairedPeople.length,
  placeCandidates:unpairedPlaces,
  personCandidates:unpairedPeople,
  warning:'Candidate finder is heuristic; zero candidates never proves full Hanzi-level completeness.',
  status:'requires-contextual-review',
  explanation:'Kandidat tersisa setelah pengecualian Pinyin yang sudah tersanding dan frasa Indonesia; nol kandidat bukan bukti semua Hokkian telah terdeteksi.',
  documentedNonHokkianPlaceExceptions:[...NOT_HOKKIAN_PLACE.entries()].map(([term,reason])=>({term,reason})),
  candidates:unresolved
};
if (process.argv.includes('--json')) process.stdout.write(JSON.stringify(result,null,2)+'\n');
else {
  console.log('Ru Classics: '+passages+' pasal; '+changed+' dengan normalisasi tampilan.');
  console.log('Kandidat nama yang perlu pemeriksaan kontekstual: '+unresolved.length);
  for (const row of unresolved.slice(0,80)) console.log(row.count+'x '+row.term+' ['+row.passages.join(', ')+']');
  console.log('Kandidat lokasi: '+unpairedPlaces.length+'; nama orang tanpa gelar: '+unpairedPeople.length);
  for(const [label,rows] of [['TEMPAT',unpairedPlaces],['ORANG',unpairedPeople]]) for(const row of rows.slice(0,150)) console.log(label+' '+row.count+'x '+row.term+' ['+row.passages.join(', ')+']');
}
if (passages !== 965) process.exitCode = 1;