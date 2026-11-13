'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snapshot=read('sources/legge/lunyu-b05-gutenberg-4094.json');
const package_=read('dist/sishu-content.json');
const align=read('dist/sishu-english-alignment.json');
const catalog=read('catalog.json').collections.find(x=>x.id==='sishu');
const review=read('dist/sishu-review-status.json');
const byId=new Map(package_.chapters.flatMap(c=>c.passages).map(p=>[p.id,p]));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const norm=s=>[...String(s).normalize('NFKC')].filter(c=>/[\u3400-\u9fff]/u.test(c)).join('');
const numbers=[10,12,13,14,15,16,19,20,22,23];
test('Ten unique English drafts in Lun Yu Book X retain a historical minimum of 868/965',()=>{
 const ids=snapshot.units.map(x=>x.indonesian_passage_id);
 assert.equal(ids.length,10);
 assert.deepEqual(ids,numbers.map(n=>'sishu.lunyu.10.'+String(n).padStart(2,'0')));
 assert.equal(new Set(ids).size,10);
 assert.ok(new Set(align.entries.flatMap(e=>e.indonesian_passage_ids)).size>=622);
 assert.ok(catalog.english_editor_passages>=868);
 assert.ok(catalog.english_editor_unmapped<=97);
 assert.ok(catalog.english_editor_alignment_drafts>=622);
 assert.equal(review.entries.length,0);
});
test('Full Hanzi range, exact Legge quotation, editorial source and mismatched edition numbering',()=>{
 assert.equal(snapshot.source_ebook_id,4094);
 for(const u of snapshot.units){
  const p=byId.get(u.indonesian_passage_id);
  assert.ok(p,u.indonesian_passage_id);
  const entry=align.entries.find(a=>a.id==='legge-lunyu-b05-10-'+u.indonesian_passage_id.split('.').at(-1));
  assert.ok(entry,u.indonesian_passage_id);
  assert.deepEqual(entry.indonesian_passage_ids,[p.id]);
  assert.equal(entry.hanzi_span,hanzi(p));
  assert.equal(u.hanzi_span,hanzi(p));
  assert.equal(norm(u.source_hanzi_transcription),norm(u.hanzi_span));
  assert.equal(entry.source_hanzi_transcription,u.source_hanzi_transcription);
  assert.equal(entry.english_segments.length,1);
  assert.equal(entry.english_segments[0].text,u.source_english);
  assert.equal(entry.english_segments[0].legge_ref,u.legge_ref);
  assert.equal(entry.source_url,snapshot.source_url);
  assert.equal(entry.status,'draft');
  assert.ok(u.source_html_lines[0]>0&&u.source_html_lines[1]>=u.source_html_lines[0]);
  assert.doesNotMatch(u.source_english,/[\u3400-\u9fff]|English translation:\s*Legge|本作品/u);
 }
});
test('A split passage is not silently mapped to a different Legge chapter',()=>{
 const u=snapshot.units.find(x=>x.indonesian_passage_id==='sishu.lunyu.10.23');
 assert.match(u.legge_ref,/CHAP\. XV, §§2–3/);
 assert.match(u.source_english,/flesh of sacrifice/);
 assert.equal(snapshot.units.find(x=>x.indonesian_passage_id==='sishu.lunyu.10.10').legge_ref,'Confucian Analects, Book X, CHAP. VIII, §9');
});
