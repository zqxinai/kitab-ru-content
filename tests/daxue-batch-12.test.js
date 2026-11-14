'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snap=read('sources/legge/daxue-b12-10-passages.json'),align=read('dist/sishu-english-alignment.json'),cat=read('catalog.json').collections.find(c=>c.id==='sishu'),chapter=read('sishu/chapters/daxue/11.json'),reviews=read('dist/sishu-review-status.json');
const byId=new Map(chapter.passages.map(p=>[p.id,p]));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const exp=Array.from({length:10},(_,i)=>'sishu.daxue.11.'+String(i+13).padStart(2,'0'));
test('Da Xue batch 12 covers ten drafts, preserving integrity and Final=0',()=>{
 assert.deepEqual(snap.units.map(u=>u.indonesian_passage_id),exp);
 const ids=align.entries.flatMap(e=>e.indonesian_passage_ids);
 assert.equal(new Set(ids).size,ids.length);
 assert.ok(cat.english_editor_passages>=936);
 assert.ok(cat.english_editor_unmapped<=29);
 assert.ok(cat.english_editor_alignment_drafts>=690);
 assert.equal(cat.english_passages,246);
 assert.equal(reviews.entries.length,0);
});
test('Exact source English and project Hanzi, no changes to MATAKIN',()=>{
 for(const u of snap.units){
  const p=byId.get(u.indonesian_passage_id);
  const entry=align.entries.find(e=>e.id==='legge-daxue-b12-'+u.indonesian_passage_id.split('.').slice(-2).join('-'));
  assert.ok(p&&entry,u.indonesian_passage_id);
  assert.deepEqual(entry.indonesian_passage_ids,[p.id]);
  assert.equal(entry.hanzi_span,hanzi(p));
  assert.equal(entry.hanzi_span,u.hanzi_span);
  assert.equal(entry.english_segments[0].text,u.english_transcription);
  assert.equal(entry.english_segments[0].legge_ref,u.legge_ref);
  assert.equal(entry.source_url,snap.source_english.url);
  assert.equal(entry.status,'draft');
  assert.equal(p.editorial_status,'unverified-draft');
  assert.equal(p.translation_english,undefined);
  assert.ok(u.english_source_lines[0]>0&&u.english_source_lines[1]>=u.english_source_lines[0]);
  assert.doesNotMatch(u.english_transcription,/\p{Script=Han}/u);
 }
});
test('Preserve unresolved textual differences and held passages',()=>{
 const get=n=>snap.units.find(u=>u.indonesian_passage_id==='sishu.daxue.11.'+n);
 assert.match(get('14').review_discrepancy,/媢疾.*媢嫉/);
 assert.match(get('16').review_discrepancy,/命.*慢/);
 assert.match(get('22').english_transcription,/pecuniary gain/);
 assert.equal(align.entries.filter(e=>e.indonesian_passage_ids.includes('sishu.daxue.06.01')).length,1);
 assert.equal(align.entries.filter(e=>e.indonesian_passage_ids.includes('sishu.daxue.11.02')).length,1);
});
