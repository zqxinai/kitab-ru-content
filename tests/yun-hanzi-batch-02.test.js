'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const fnv=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h.toString(16).padStart(8,'0')};
const cases=[
  {
    "path": "sishu/chapters/zhongyong/26.json",
    "id": "sishu.zhongyong.26.09",
    "phrase": "詩云",
    "witness": "KR1h0015_016.txt",
    "page": "KR1h0015_WYG_016-58b",
    "expectedYun": 1,
    "translationHash": "92f80801"
  },
  {
    "path": "sishu/chapters/lunyu/07.json",
    "id": "sishu.lunyu.07.19",
    "phrase": "云爾",
    "witness": "KR1h0015_004.txt",
    "page": "KR1h0015_WYG_004-5b",
    "expectedYun": 1,
    "translationHash": "eabffd23"
  },
  {
    "path": "sishu/chapters/lunyu/07.json",
    "id": "sishu.lunyu.07.34",
    "phrase": "謂云爾",
    "witness": "KR1h0015_004.txt",
    "page": "KR1h0015_WYG_004-9a",
    "expectedYun": 1,
    "translationHash": "abc52f2f"
  },
  {
    "path": "sishu/chapters/lunyu/14.json",
    "id": "sishu.lunyu.14.40",
    "phrase": "《書》云",
    "witness": "KR1h0015_006.txt",
    "page": "KR1h0015_WYG_006-38a",
    "expectedYun": 1,
    "translationHash": "34bcc449"
  },
  {
    "path": "sishu/chapters/lunyu/19.json",
    "id": "sishu.lunyu.19.23",
    "phrase": "夫子之云",
    "witness": "KR1h0015_009.txt",
    "page": "KR1h0015_WYG_009-5a",
    "expectedYun": 1,
    "translationHash": "6acd698b"
  },
  {
    "path": "sishu/chapters/mengzi/04.json",
    "id": "sishu.mengzi.04.02",
    "phrase": "云爾",
    "witness": "KR1h0015_011.txt",
    "page": "KR1h0015_WYG_011-18a",
    "expectedYun": 1,
    "translationHash": "6c6f5800"
  },
  {
    "path": "sishu/chapters/mengzi/05.json",
    "id": "sishu.mengzi.05.03",
    "phrase": "詩云",
    "witness": "KR1h0015_012.txt",
    "page": "KR1h0015_WYG_012-4a",
    "expectedYun": 3,
    "translationHash": "f24af910"
  },
  {
    "path": "sishu/chapters/mengzi/06.json",
    "id": "sishu.mengzi.06.05",
    "phrase": "不行王政云爾",
    "witness": "KR1h0015_012.txt",
    "page": "KR1h0015_WYG_012-20b",
    "expectedYun": 1,
    "translationHash": "ded21776"
  },
  {
    "path": "sishu/chapters/mengzi/07.json",
    "id": "sishu.mengzi.07.02",
    "phrase": "詩云",
    "witness": "KR1h0015_013.txt",
    "page": "KR1h0015_WYG_013-3b",
    "expectedYun": 1,
    "translationHash": "09c8c994"
  },
  {
    "path": "sishu/chapters/mengzi/07.json",
    "id": "sishu.mengzi.07.09",
    "phrase": "詩云",
    "witness": "KR1h0015_013.txt",
    "page": "KR1h0015_WYG_013-7b",
    "expectedYun": 1,
    "translationHash": "53c84438"
  }
];
const dist=read('dist/sishu-content.json');
const distById=new Map(dist.chapters.flatMap(ch=>ch.passages.map(p=>[p.id,p])));
const cache=new Map();
const chapter=p=>{if(!cache.has(p))cache.set(p,read(p));return cache.get(p)};
const hanzi=p=>p.ruby_paragraphs.map(r=>r.map(t=>t.traditional||t.value).join('')).join('\n');
for(const c of cases)test('Meaning-based 云 and unchanged MATAKIN: '+c.id,()=>{
 const p=chapter(c.path).passages.find(x=>x.id===c.id);
 assert.ok(p,c.id);
 assert.ok(hanzi(p).includes(c.phrase),c.id+' phrase');
 assert.doesNotMatch(hanzi(p),/雲/);
 const yun=p.ruby_paragraphs.flat().filter(x=>x.type==='ruby'&&x.traditional==='云');
 assert.equal(yun.length,c.expectedYun);
 for(const t of yun){assert.equal(t.pinyin,'yún');assert.equal(t.modern,undefined)}
 assert.equal(fnv(p.translation_indonesian),c.translationHash);
 assert.equal(p.editorial_status,'unverified-draft');
 assert.deepEqual(distById.get(c.id).ruby_paragraphs,p.ruby_paragraphs);
});
for(const [path,id,phrase] of [
 ['sishu/chapters/lunyu/07.json','sishu.lunyu.07.16','浮雲'],
 ['sishu/chapters/mengzi/01.json','sishu.mengzi.01.06','作雲'],
 ['sishu/chapters/mengzi/02.json','sishu.mengzi.02.11','望雲霓'],
 ['sishu/chapters/mengzi/09.json','sishu.mengzi.09.04','雲漢']
])test('Preserve actual cloud '+id,()=>{
 const p=chapter(path).passages.find(x=>x.id===id);
 assert.ok(hanzi(p).includes(phrase));
});
test('No regression to previous batch or Mengzi IX:7',()=>{
 const x=chapter('sishu/chapters/lunyu/17.json').passages.find(p=>p.id==='sishu.lunyu.17.11');
 const y=chapter('sishu/chapters/lunyu/19.json').passages.find(p=>p.id==='sishu.lunyu.19.03');
 const z=chapter('sishu/chapters/mengzi/09.json').passages.find(p=>p.id==='sishu.mengzi.09.07');
 assert.equal((hanzi(x).match(/云/g)||[]).length,6);
 assert.match(hanzi(y),/子夏云何/);
 assert.doesNotMatch(hanzi(z),/林氏曰|愚謂/);
 assert.equal(z.commentary_annotations.length,2);
});

const alignment=read('dist/sishu-english-alignment.json');
const normalized=s=>(String(s||'').match(/\p{Script=Han}/gu)||[]).join('');
test('The nine Legge Hanzi spans stay aligned after 云 corrections',()=>{
 const ids=[["legge-lunyu-07-18","sishu.lunyu.07.19"],["legge-lunyu-07-33","sishu.lunyu.07.34"],["legge-lunyu-14-43","sishu.lunyu.14.40"],["legge-zhongyong-26-07","sishu.zhongyong.26.09"],["legge-mengzi-04-02","sishu.mengzi.04.02"],["legge-mengzi-06-05","sishu.mengzi.06.05"],["legge-mengzi-07-02","sishu.mengzi.07.02"],["legge-mengzi-07-09","sishu.mengzi.07.09"],["legge-mengzi-b03-05-03","sishu.mengzi.05.03"]];
 for(const [alignmentId,passageId] of ids){
  const entry=alignment.entries.find(e=>e.id===alignmentId);
  const c=cases.find(x=>x.id===passageId);
  assert.ok(entry&&c,alignmentId);
  assert.deepEqual(entry.indonesian_passage_ids,[passageId]);
  assert.equal(normalized(entry.hanzi_span),normalized(hanzi(chapter(c.path).passages.find(x=>x.id===passageId))),alignmentId+' Hanzi mismatch');
  assert.ok(entry.english_segments?.length>0);
 }
});
