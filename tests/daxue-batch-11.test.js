'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snap=read('sources/legge/daxue-b11-10-passages.json'),align=read('dist/sishu-english-alignment.json'),cat=read('catalog.json').collections.find(x=>x.id==='sishu'),book=read('sishu/chapters/daxue/11.json');
const byId=new Map(book.passages.map(p=>[p.id,p]));
const chinese=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const expected=Array.from({length:10},(_,i)=>'sishu.daxue.11.'+String(i+3).padStart(2,'0'));
const entryFor=u=>align.entries.find(e=>e.id==='legge-daxue-b11-'+u.indonesian_passage_id.split('.').slice(-2).join('-'));
test('Da Xue batch 11 holds exactly ten new unique drafts; no Final',()=>{
 assert.deepEqual(snap.units.map(u=>u.indonesian_passage_id),expected);
 const ids=align.entries.flatMap(e=>e.indonesian_passage_ids);
 assert.equal(new Set(ids).size,ids.length);
 assert.ok(cat.english_editor_passages>=926);
 assert.ok(cat.english_editor_unmapped<=39);
 assert.ok(cat.english_editor_alignment_drafts>=680);
 assert.equal(cat.english_passages,246);
 assert.equal(read('dist/sishu-review-status.json').entries.length,0);
});
test('Exact Hanzi and English snapshot, provenance and status are stable',()=>{
 for(const u of snap.units){
  const p=byId.get(u.indonesian_passage_id),e=entryFor(u);
  assert.ok(p&&e,u.indonesian_passage_id);
  assert.deepEqual(e.indonesian_passage_ids,[p.id]);
  assert.equal(e.hanzi_span,chinese(p));
  assert.equal(u.hanzi_span,chinese(p));
  assert.equal(e.english_segments[0].text,u.english_transcription);
  assert.equal(e.english_segments[0].legge_ref,u.legge_ref);
  assert.equal(e.source_hanzi_transcription,u.source_hanzi_transcription);
  assert.equal(e.source_url,snap.source_english.url);
  assert.equal(e.status,'draft');
  assert.equal(p.editorial_status,'unverified-draft');
  assert.equal(p.translation_english,undefined);
  assert.ok(u.english_source_lines[0]>0);
  assert.ok(u.chinese_source_lines[1]>=u.chinese_source_lines[0]);
  assert.ok(u.normalized_hanzi_similarity>=0.92);
  assert.doesNotMatch(u.english_transcription,/\p{Script=Han}/u);
 }
});
test('Leave XI:2 and VI:1 pending; report glyph/interpretation discrepancies',()=>{
 const get=n=>snap.units.find(u=>u.indonesian_passage_id==='sishu.daxue.11.'+n);
 assert.equal(align.entries.filter(e=>e.indonesian_passage_ids.includes('sishu.daxue.11.02')).length,1);
 assert.equal(align.entries.filter(e=>e.indonesian_passage_ids.includes('sishu.daxue.06.01')).length,1);
 assert.match(get('05').review_discrepancy,/鑒.*監/);
 assert.match(get('05').english_transcription,/God/);
 assert.match(chinese(byId.get('sishu.daxue.11.05')),/儀鑒於殷/);
 assert.match(get('12').review_discrepancy,/good men/);
 assert.notEqual(get('07').english_transcription,get('08').english_transcription);
});
