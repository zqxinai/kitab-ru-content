'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const cases=[
  {
    "path": "sishu/chapters/lunyu/04.json",
    "id": "sishu.lunyu.04.19",
    "ref": "Lun Yu IV:19",
    "page": 138,
    "from": "游",
    "to": "遊",
    "oldpy": "yóu",
    "newpy": "yóu",
    "modern": "游",
    "n": 2,
    "phrase": "不遠遊，遊必有方",
    "wyg": "KR1h0015_002.txt / WYG_002-13b",
    "hashIndonesian": "0f449fb6",
    "hashOriginalHanzi": "68a8d79f",
    "hashCorrectedHanzi": "42a1175f",
    "expectedHanzi": "子曰：“父母在，不遠遊，遊必有方。”"
  },
  {
    "path": "sishu/chapters/lunyu/17.json",
    "id": "sishu.lunyu.17.13",
    "ref": "Lun Yu XVII:13",
    "page": null,
    "from": "愿",
    "to": "原",
    "oldpy": "yuàn",
    "newpy": "yuán",
    "n": 1,
    "phrase": "鄉原，德之賊也",
    "wyg": "KR1h0015_008.txt / WYG_008-5a",
    "hashIndonesian": "fe183568",
    "hashOriginalHanzi": "a56cbd19",
    "hashCorrectedHanzi": "663c14b9",
    "expectedHanzi": "子曰：“鄉原，德之賊也。”"
  },
  {
    "path": "sishu/chapters/lunyu/14.json",
    "id": "sishu.lunyu.14.01",
    "ref": "Lun Yu XIV:1",
    "page": 285,
    "from": "谷",
    "to": "穀",
    "oldpy": "gǔ",
    "newpy": "gǔ",
    "modern": "谷",
    "n": 2,
    "phrase": "邦有道，穀；邦無道，穀",
    "wyg": "KR1h0015_006.txt / WYG_006-28a",
    "hashIndonesian": "316510dc",
    "hashOriginalHanzi": "1437d38d",
    "hashCorrectedHanzi": "0eef94c9",
    "expectedHanzi": "憲問恥，子曰：“邦有道，穀；邦無道，穀，恥也。”“克、伐、怨、欲不行焉，可以為仁矣？”子曰：“可以為難矣，仁則吾不知也。”"
  }
];
const fnv=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h.toString(16).padStart(8,'0')};
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.traditional||t.value||'').join('')).join('\n');
const book=read('dist/sishu-content.json'),map=read('dist/sishu-english-alignment.json');
const byId=new Map(book.chapters.flatMap(ch=>ch.passages.map(p=>[p.id,p])));
for(const c of cases)test('MATAKIN 2012 documented photo: '+c.id,()=>{
 const p=read(c.path).passages.find(x=>x.id===c.id),built=byId.get(c.id);
 assert.ok(p&&built);assert.equal(p.editorial_status,'unverified-draft');
 assert.equal(fnv(p.translation_indonesian),c.hashIndonesian,'Indonesian MATAKIN modified');
 assert.equal(fnv(hanzi(p)),c.hashCorrectedHanzi);
 assert.equal(hanzi(p),c.expectedHanzi);assert.ok(hanzi(p).includes(c.phrase));
 assert.ok(!hanzi(p).includes(c.from),'Old glyph persists');
 assert.deepEqual(p.ruby_paragraphs,built.ruby_paragraphs,'Dist content stale');
 const ts=p.ruby_paragraphs.flat().filter(t=>t.type==='ruby'&&t.traditional===c.to);
 assert.equal(ts.length,c.n);
 for(const t of ts){assert.equal(t.pinyin,c.newpy);if(c.modern)assert.equal(t.modern,c.modern)}
 const alignments=map.entries.filter(e=>e.indonesian_passage_ids.includes(c.id));
 for(const a of alignments){assert.equal(a.hanzi_span,hanzi(p));assert.equal(a.status,'draft')}
});
test('MATAKIN priority, 78 chapters, 965 passages, no automatic Final',()=>{
 assert.equal(book.chapters.length,78);assert.equal(byId.size,965);
 assert.equal(read('dist/sishu-review-status.json').entries.length,0);
 assert.match(hanzi(byId.get('sishu.lunyu.17.11')),/禮云禮云/);
 assert.match(hanzi(byId.get('sishu.lunyu.14.39')),/莫己知也/);
 assert.match(hanzi(byId.get('sishu.lunyu.14.39')),/斯己而已矣/);
 assert.deepEqual(cases.map(x=>x.page),[138,null,285]);
});
