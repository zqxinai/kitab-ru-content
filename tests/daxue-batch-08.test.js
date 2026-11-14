'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const alignment=read('dist/sishu-english-alignment.json');
const snapshot=read('sources/legge/daxue-b08-10-passages.json');
const catalog=read('catalog.json').collections.find(x=>x.id==='sishu');
const content=read('dist/sishu-content.json');
const status=read('dist/sishu-review-status.json');
const byId=new Map(content.chapters.flatMap(c=>c.passages).map(p=>[p.id,p]));
const hanzi=p=>p.ruby_paragraphs.map(r=>r.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\\n');
const expected=['03.01','03.02','03.03','03.04','04.01','04.02','04.03','04.04','04.05','05.01'].map(x=>'sishu.daxue.'+x);
test('Da Xue batch 08 includes exactly ten previously missing mapped draft passages',()=>{
 assert.deepEqual(snapshot.units.map(u=>u.indonesian_passage_id),expected);
 assert.equal(new Set(snapshot.units.map(u=>u.indonesian_passage_id)).size,10);
 const ids=alignment.entries.flatMap(x=>x.indonesian_passage_ids);
 assert.equal(new Set(ids).size,ids.length);
 assert.equal(catalog.english_editor_passages,896);
 assert.equal(catalog.english_editor_unmapped,69);
 assert.equal(catalog.english_editor_alignment_drafts,650);
 assert.equal(catalog.english_passages,246);
 assert.equal(status.entries.length,0);
});
test('English and Hanzi snapshots map one-to-one without changing source scripture',()=>{
 for(const u of snapshot.units){
  const entry=alignment.entries.find(e=>e.id==='legge-daxue-b08-'+u.indonesian_passage_id.split('.').slice(-2).join('-'));
  const p=byId.get(u.indonesian_passage_id);
  assert.ok(entry&&p,u.indonesian_passage_id);
  assert.deepEqual(entry.indonesian_passage_ids,[u.indonesian_passage_id]);
  assert.equal(entry.hanzi_span,hanzi(p));
  assert.equal(u.hanzi_span,hanzi(p));
  assert.equal(entry.english_segments[0].text,u.english_transcription);
  assert.equal(entry.english_segments[0].legge_ref,u.legge_ref);
  assert.equal(entry.source_hanzi_transcription,u.source_hanzi_transcription);
  assert.equal(entry.status,'draft');
  assert.equal(p.editorial_status,'unverified-draft');
  assert.equal(p.translation_english,undefined);
  assert.equal(entry.source_url,snapshot.source_english.url);
  assert.ok(u.english_source_lines[0]>0&&u.english_source_lines[1]>=u.english_source_lines[0]);
  assert.ok(u.normalized_hanzi_similarity>=0.9);
  assert.doesNotMatch(u.english_transcription,/\\p{Script=Han}/u);
 }
});
test('Keep documented source variants as review notes, not silent corrections',()=>{
 const entry=k=>alignment.entries.find(e=>e.id==='legge-daxue-b08-'+k);
 assert.match(entry('04-01').review_note,/維民所止.*惟民所止/);
 assert.match(entry('04-04').review_note,/喧.*諠/);
 const p=byId.get('sishu.daxue.04.04');
 const h=hanzi(p);assert.match(h,/赫兮喧兮/);assert.match(h,/不可諠兮/);
 assert.ok(snapshot.source_english.url&&snapshot.source_chinese.url&&snapshot.cross_reference.url);
});
