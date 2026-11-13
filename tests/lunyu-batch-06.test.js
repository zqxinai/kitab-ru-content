'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snap=read('sources/legge/lunyu-b06-gutenberg-4094.json');
const bible=read('dist/sishu-content.json');
const align=read('dist/sishu-english-alignment.json');
const cat=read('catalog.json').collections.find(x=>x.id==='sishu');
const review=read('dist/sishu-review-status.json');
const passages=new Map(bible.chapters.flatMap(c=>c.passages).map(p=>[p.id,p]));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const norm=s=>(String(s).normalize('NFKC').match(/\p{Script=Han}/gu)||[]).join('');
const expected=['07.09','07.10','07.18','07.29','07.30','10.09','10.11','11.02','15.22','15.37'].map(x=>'sishu.lunyu.'+x);
test('Batch 06 adds ten safe English drafts, zero final approvals',()=>{
 assert.deepEqual(snap.units.map(x=>x.indonesian_passage_id),expected);
 assert.equal(new Set(snap.units.map(x=>x.indonesian_passage_id)).size,10);
 assert.ok(new Set(align.entries.flatMap(x=>x.indonesian_passage_ids)).size>=632);
 assert.ok(cat.english_editor_alignment_drafts>=632);
 assert.ok(cat.english_editor_passages>=878);
 assert.ok(cat.english_editor_unmapped<=87);
 assert.equal(review.entries.length,0);
});
test('Exact English snippets and full Hanzi character spans are preserved',()=>{
 for(const u of snap.units){
  const p=passages.get(u.indonesian_passage_id);assert.ok(p,u.indonesian_passage_id);
  const suffix=u.indonesian_passage_id.split('.').slice(-2).join('-');
  const e=align.entries.find(x=>x.id==='legge-lunyu-b06-'+suffix);
  assert.ok(e,u.indonesian_passage_id);
  assert.deepEqual(e.indonesian_passage_ids,[u.indonesian_passage_id]);
  assert.equal(e.hanzi_span,hanzi(p));
  assert.equal(e.hanzi_span,u.hanzi_span);
  assert.equal(norm(u.source_hanzi_transcription),norm(u.hanzi_span));
  assert.equal(e.source_hanzi_transcription,u.source_hanzi_transcription);
  assert.equal(e.english_segments[0].legge_ref,u.legge_ref);
  assert.equal(e.english_segments[0].text,u.source_english);
  assert.equal(e.source_url,snap.source_url);
  assert.equal(e.status,'draft');
  assert.ok(u.source_html_lines[0]>0&&u.source_html_lines[1]>=u.source_html_lines[0]);
  assert.doesNotMatch(u.source_english,/[\u3400-\u9fff]/u);
 }
});
test('Split Legge units and MATAKIN numbering stay distinct',()=>{
 const ref=id=>snap.units.find(x=>x.indonesian_passage_id==='sishu.lunyu.'+id).legge_ref;
 assert.match(ref('07.09'),/CHAP\. IX, §1/);
 assert.match(ref('07.10'),/CHAP\. IX, §2/);
 assert.match(ref('07.29'),/CHAP\. XXVIII/);
 assert.match(ref('07.30'),/CHAP\. XXIX/);
 assert.match(ref('10.09'),/CHAP\. VIII, §8/);
 assert.match(ref('10.11'),/CHAP\. VIII, §10/);
});
