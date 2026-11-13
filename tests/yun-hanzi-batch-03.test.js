'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const cases=[
  {
    "path": "sishu/chapters/mengzi/08.json",
    "id": "sishu.mengzi.08.24",
    "count": 1,
    "yunTotal": 1,
    "phrase": "薄乎云爾",
    "witness": "KR1h0015_013.txt",
    "page": "KR1h0015_WYG_013-23b",
    "note": "‘曰薄乎云爾’ bermakna ‘hanya menyebut ringan’",
    "translationHash": "ce83fc87"
  },
  {
    "path": "sishu/chapters/mengzi/10.json",
    "id": "sishu.mengzi.10.03",
    "count": 3,
    "yunTotal": 3,
    "phrase": "入云則入，坐云則坐，食云則食",
    "witness": "KR1h0015_014.txt",
    "page": "KR1h0015_WYG_014-19a",
    "note": "ucapan 亥唐: ‘masuk’/‘duduk’/‘makan’ ketika diminta",
    "translationHash": "37a32e89"
  },
  {
    "path": "sishu/chapters/mengzi/10.json",
    "id": "sishu.mengzi.10.07",
    "count": 2,
    "yunTotal": 3,
    "phrase": "曰事之云乎，豈曰友之云乎",
    "witness": "KR1h0015_014.txt",
    "page": "KR1h0015_WYG_014-25a",
    "note": "dua 云 dalam kutipan ucapan 子思; 詩云 ketiga sejak awal sudah benar",
    "translationHash": "33b1baf9"
  },
  {
    "path": "sishu/chapters/mengzi/13.json",
    "id": "sishu.mengzi.13.39",
    "count": 1,
    "yunTotal": 1,
    "phrase": "姑徐徐云爾",
    "witness": "KR1h0015_016.txt",
    "page": "KR1h0015_WYG_016-14a",
    "note": "云爾 merupakan penutup ucapan",
    "translationHash": "3c8396fa"
  }
];
const FNV16=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h.toString(16).padStart(8,'0')};
const dist=read('dist/sishu-content.json');
const align=read('dist/sishu-english-alignment.json');
const byId=new Map(dist.chapters.flatMap(ch=>ch.passages.map(p=>[p.id,p])));
const norm=s=>(String(s).match(/\p{Script=Han}/gu)||[]).join('');
const script=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.traditional||t.value||'').join('')).join('\n');
for(const c of cases)test('MATAKIN stable and WYG-supported 云: '+c.id,()=>{
 const p=read(c.path).passages.find(x=>x.id===c.id),a=byId.get(c.id),e=align.entries.find(x=>x.indonesian_passage_ids.length===1&&x.indonesian_passage_ids[0]===c.id);
 assert.ok(p&&a&&e);
 assert.ok(script(p).includes(c.phrase),'Expected context: '+c.phrase);
 assert.doesNotMatch(script(p),/雲/);
 const ts=p.ruby_paragraphs.flat().filter(t=>t.type==='ruby'&&t.traditional==='云');
 assert.equal(ts.length,c.yunTotal);
 ts.forEach(t=>{assert.equal(t.pinyin,'yún');assert.equal(t.modern,undefined)});
 assert.equal(FNV16(p.translation_indonesian),c.translationHash,'MATAKIN changed');
 assert.equal(p.editorial_status,'unverified-draft');
 assert.deepEqual(p.ruby_paragraphs,a.ruby_paragraphs,'Dist not synchronized');
 assert.equal(norm(e.hanzi_span),norm(script(p)),'Legge Hanzi mapping not synchronized');
 assert.equal(e.status,'draft');
 assert.ok(e.english_segments.length>0);
});
test('Across all 965 passages only the four genuine cloud 雲 remain',()=>{
 const clouds=dist.chapters.flatMap(ch=>ch.passages.map(p=>({id:p.id,count:(script(p).match(/雲/g)||[]).length,hanzi:script(p)}))).filter(p=>p.count);
 assert.equal(clouds.reduce((n,p)=>n+p.count,0),4);
 assert.deepEqual(clouds.map(p=>p.id).sort(),[
  'sishu.lunyu.07.16','sishu.mengzi.01.06','sishu.mengzi.02.11','sishu.mengzi.09.04'
 ].sort());
 for(const [id,phrase] of [
  ['sishu.lunyu.07.16','浮雲'],
  ['sishu.mengzi.01.06','作雲'],
  ['sishu.mengzi.02.11','望雲霓'],
  ['sishu.mengzi.09.04','雲漢']
 ])assert.ok(clouds.find(p=>p.id===id).hanzi.includes(phrase));
});
test('Previous Yun batches and Mengzi IX:7 remain correct',()=>{
 const a=byId.get('sishu.lunyu.17.11'),b=byId.get('sishu.lunyu.19.03'),c=byId.get('sishu.mengzi.09.07');
 assert.equal((script(a).match(/云/g)||[]).length,6);
 assert.match(script(b),/子夏云何/);
 assert.doesNotMatch(script(c),/林氏曰|愚謂/);
 assert.equal(c.commentary_annotations.length,2);
});
