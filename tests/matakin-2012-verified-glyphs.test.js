'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const cases=[
  {
    "id": "sishu.mengzi.07.23",
    "path": "sishu/chapters/mengzi/07.json",
    "printed": "IV A:23.1",
    "page": 655,
    "expected": "人之患",
    "englishId": "legge-mengzi-b05-07-23",
    "translationHash": "af416252",
    "sourceHanziFNV": "1ab36630",
    "correctedHanziFNV": "55be9dad",
    "checks": [
      [
        "患",
        "huàn",
        1
      ]
    ]
  },
  {
    "id": "sishu.mengzi.07.25",
    "path": "sishu/chapters/mengzi/07.json",
    "printed": "IV A:25.1",
    "page": 656,
    "expected": "徒餔啜也",
    "englishId": "legge-mengzi-b05-07-25",
    "translationHash": "6c4be4ec",
    "sourceHanziFNV": "857a2c67",
    "correctedHanziFNV": "085f4b47",
    "checks": [
      [
        "餔",
        "bū",
        2
      ],
      [
        "啜",
        "chuò",
        2
      ]
    ]
  },
  {
    "id": "sishu.lunyu.10.24",
    "path": "sishu/chapters/lunyu/10.json",
    "printed": "Jilid X:24",
    "page": 226,
    "expected": "寢不尸，居不容",
    "englishId": "legge-lunyu-b07-10-24",
    "translationHash": "ede20527",
    "sourceHanziFNV": "2c1631bb",
    "correctedHanziFNV": "d00376c1",
    "checks": [
      [
        "尸",
        "shī",
        1
      ],
      [
        "容",
        "róng",
        1
      ]
    ]
  },
  {
    "id": "sishu.lunyu.14.33",
    "path": "sishu/chapters/lunyu/14.json",
    "printed": "Jilid XIV:33",
    "page": 302,
    "expected": "子曰：“驥",
    "englishId": "legge-lunyu-b07-14-33",
    "translationHash": "5cbbb3ef",
    "sourceHanziFNV": "e8e58f97",
    "correctedHanziFNV": "4f265f09",
    "checks": [
      [
        "子",
        "zǐ",
        1
      ]
    ]
  }
];
const fnv=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h.toString(16).padStart(8,'0')};
const script=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.traditional||t.value||'').join('')).join('\n');
const dist=read('dist/sishu-content.json'),align=read('dist/sishu-english-alignment.json');
const byId=new Map(dist.chapters.flatMap(ch=>ch.passages.map(p=>[p.id,p])));
const historical=[...read('sources/legge/mengzi-variants-b05-chinesenotes.json').units,...read('sources/legge/lunyu-b07-gutenberg-4094.json').units];
for(const c of cases)test('2012 MATAKIN photographed witness: '+c.id,()=>{
 const p=read(c.path).passages.find(p=>p.id===c.id),built=byId.get(c.id),e=align.entries.find(x=>x.id===c.englishId);
 const snap=historical.find(x=>x.indonesian_passage_id===c.id);
 assert.ok(p&&built&&e&&snap,'Missing passage, dist, alignment, or original source snapshot');
 assert.equal(p.editorial_status,'unverified-draft');
 assert.equal(fnv(p.translation_indonesian),c.translationHash,'MATAKIN Indonesian translation modified');
 assert.equal(script(p),script(built),'Dist build not updated');
 assert.equal(fnv(script(p)),c.correctedHanziFNV);
 assert.ok(script(p).includes(c.expected),'Expected 2012 print excerpt not present');
 assert.equal(e.hanzi_span,script(p));
 assert.equal(e.status,'draft');
 assert.ok(e.review_note.includes('MATAKIN 2012')&&e.review_note.includes(String(c.page)));
 assert.equal(fnv(snap.hanzi_span),c.sourceHanziFNV,'Historical source snapshot unexpectedly changed');
 assert.notEqual(snap.hanzi_span,e.hanzi_span,'Original source archive must remain unchanged');
 assert.equal(e.source_hanzi_transcription,snap.source_chinese||snap.source_hanzi_transcription);
 assert.equal(e.english_segments[0].text,snap.source_english);
 const tokens=p.ruby_paragraphs.flat().filter(t=>t.type==='ruby');
 for(const [glyph,pinyin,count] of c.checks){
  let actual=tokens.filter(t=>t.traditional===glyph&&t.pinyin===pinyin);
  if(c.id==='sishu.lunyu.14.33'&&glyph==='子')assert.equal(tokens[0].traditional,'子');
  else assert.equal(actual.length,count,glyph+' / '+pinyin);
 }
});
test('Untouched Mengzi VII:24, romanization boundaries, and Final registry',()=>{
 const p=read('sishu/chapters/mengzi/07.json').passages.find(p=>p.id==='sishu.mengzi.07.24');
 assert.match(script(p),/捨館未定/);
 assert.match(script(p),/舍館|捨館/);
 assert.equal(read('dist/sishu-review-status.json').entries.length,0);
 assert.equal(dist.chapters.length,78);
 assert.equal(byId.size,965);
});
