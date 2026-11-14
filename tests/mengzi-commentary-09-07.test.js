'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const p=read('sishu/chapters/mengzi/09.json').passages.find(x=>x.id==='sishu.mengzi.09.07');
const dist=read('dist/sishu-content.json').chapters.find(c=>c.id==='sishu.mengzi.09').passages.find(x=>x.id===p.id);
const hanzi=passage=>passage.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?t.traditional:t.value).join('')).join('\n');
const fnv16=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h.toString(16).padStart(8,'0');};
test('Mengzi 09.07 scripture excludes both Zhu Xi commentary blocks without dropping Yi Xun',()=>{
  assert.equal(p.editorial_status,'unverified-draft');
  assert.doesNotMatch(hanzi(p),/林氏曰|愚謂/);
  assert.match(hanzi(p),/吾聞其以堯舜之道要湯，未聞以割烹也。伊訓曰：‘天誅造攻自牧宮，朕載自亳。’/);
  const w=p.ruby_paragraphs.flatMap(row=>row).filter(t=>t.type==='ruby'&&t.traditional==='未');
  assert.ok(w.some(t=>t.pinyin==='wèi'));
  assert.deepEqual(p.ruby_paragraphs,dist.ruby_paragraphs);
});
test('Separate commentary keeps both authors and complete archived characters',()=>{
  const notes=p.commentary_annotations;
  assert.equal(notes.length,2);
  assert.equal(notes[0].id,'sishu.mengzi.09.07.note.lin');
  assert.equal(notes[0].attribution,'林氏');
  assert.equal(notes[0].hanzi,'林氏曰：“以堯舜之道要湯者，非實以是要之也，道在此而湯之聘自來耳。猶子貢言夫子之求之，異乎人之求之也”');
  assert.equal(notes[1].attribution,'朱熹 (愚謂)');
  assert.equal(notes[1].hanzi,'愚謂此語亦猶前章所論父不得而子之意。');
  for(const n of notes){
    assert.equal(n.kind,'commentary');
    assert.equal(n.source_commit,'84c6b2c5093c57ae5d41c60a73c02323d2420ef0');
    assert.equal(n.source_witness_file,'KR1h0015_014.txt');
    assert.equal(n.source_witness_page,'KR1h0015_WYG_014-10b');
  }
  assert.deepEqual(notes,dist.commentary_annotations);
});
test('MATAKIN Indonesian translation remains byte-for-byte identical to audited baseline',()=>{
  assert.equal(p.translation_indonesian.length,2943);
  assert.equal(fnv16(p.translation_indonesian),'7ebb66c0');
  assert.equal(dist.translation_indonesian,p.translation_indonesian);
});
test('Mengzi 09.07 Legge mapping now exists as Draft, with editorial Final still withheld',()=>{
  const a=read('dist/sishu-english-alignment.json');
  const final=read('dist/sishu-review-status.json');
  const matches=a.entries.filter(e=>e.indonesian_passage_ids.includes(p.id));
  assert.equal(matches.length,1);
  assert.equal(matches[0].id,'legge-mengzi-09-07');
  assert.equal(matches[0].status,'draft');
  assert.ok(!final.entries.some(e=>e.passage_id===p.id));
});
