'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snap=read('sources/legge/daxue-b16-last-three-printed.json'),map=read('dist/sishu-english-alignment.json'),cat=read('catalog.json').collections.find(x=>x.id==='sishu'),bundle=read('dist/sishu-content.json'),review=read('dist/sishu-review-status.json');
const byId=new Map(bundle.chapters.flatMap(c=>c.passages.map(p=>[p.id,p])));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
test('All 965 Si Shu passages now offer mapped or bundled English Drafts, never Final',()=>{
 assert.deepEqual(snap.units.map(x=>x.indonesian_passage_id),['sishu.daxue.06.01','sishu.daxue.11.02','sishu.daxue.11.23']);
 const ids=map.entries.flatMap(e=>e.indonesian_passage_ids);
 assert.equal(ids.length,new Set(ids).size);
 assert.equal(ids.length,719);
 assert.equal(cat.english_editor_passages,965);
 assert.equal(cat.english_editor_alignment_drafts,719);
 assert.equal(cat.english_editor_unmapped,0);
 assert.equal(cat.english_passages,246);
 const embedded=bundle.chapters.flatMap(c=>c.passages.filter(p=>p.translation_english).map(p=>p.id));
 assert.equal(new Set([...ids,...embedded]).size,965);
 assert.equal(review.entries.length,0);
});
test('Legge bilingual print has exact attributed segments and untouched canonical Hanzi',()=>{
 for(const u of snap.units){
  const p=byId.get(u.indonesian_passage_id),e=map.entries.find(e=>e.id==='legge-daxue-b16-'+u.indonesian_passage_id.split('.').slice(-2).join('-'));
  assert.ok(p&&e,u.indonesian_passage_id);
  assert.deepEqual(e.indonesian_passage_ids,[p.id]);
  assert.equal(e.hanzi_span,hanzi(p));
  assert.equal(e.hanzi_span,u.hanzi_span);
  assert.equal(e.english_segments.length,u.english_segments.length);
  for(let i=0;i<u.english_segments.length;i++){
   assert.equal(e.english_segments[i].legge_ref,u.english_segments[i].ref);
   assert.equal(e.english_segments[i].text,u.english_segments[i].english);
   assert.equal(e.english_segments[i].segment_kind,u.english_segments[i].kind);
   assert.doesNotMatch(e.english_segments[i].text,/\p{Script=Han}/u);
  }
  assert.equal(e.status,'draft');
  assert.equal(p.editorial_status,'unverified-draft');
  assert.equal(p.translation_english,undefined);
  assert.equal(e.source_url,snap.source_english.url);
 });
});
test('Zhu Xi supplement is separate; six directional clauses restored',()=>{
 const get=code=>map.entries.find(e=>e.id==='legge-daxue-b16-'+code);
 const zh=get('06-01');assert.ok(zh);assert.deepEqual(zh.english_segments.map(x=>x.segment_kind),['received_text','zhu_xi_supplement']);
 assert.match(zh.english_segments[1].text,/But so long as all principles are not investigated/);
 const p=byId.get('sishu.daxue.06.01');
 assert.deepEqual(p.textual_sections.map(x=>x.kind),['matakin_2012_received_text','zhu_xi_supplement']);
 const square=get('11-02').english_segments[0].text;
 assert.match(square,/behind him, let him not therewith follow those who are before him/);
 assert.match(square,/on the right, let him not bestow on the left; what he hates to receive on the left/);
 assert.match(get('11-23').review_note,/KATA PENGANTAR ZHONG YONG/);
 assert.match(get('11-23').english_segments[0].text,/righteousness/);
});
