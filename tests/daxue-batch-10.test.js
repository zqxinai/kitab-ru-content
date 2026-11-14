'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const snapshot=read('sources/legge/daxue-b10-10-passages.json');
const alignment=read('dist/sishu-english-alignment.json');
const catalog=read('catalog.json').collections.find(x=>x.id==='sishu');
const book=['10','11'].flatMap(i=>read('sishu/chapters/daxue/'+i+'.json').passages);
const byId=new Map(book.map(p=>[p.id,p]));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const expected=['10.01','10.02','10.03','10.04','10.05','10.06','10.07','10.08','10.09','11.01'].map(x=>'sishu.daxue.'+x);
const entryFor=u=>alignment.entries.find(e=>e.id==='legge-daxue-b10-'+u.indonesian_passage_id.split('.').slice(-2).join('-'));

test('Da Xue batch 10 adds exactly ten English Draft passage IDs',()=>{
 assert.deepEqual(snapshot.units.map(u=>u.indonesian_passage_id),expected);
 assert.equal(new Set(expected).size,10);
 const mappedIds=alignment.entries.flatMap(e=>e.indonesian_passage_ids);
 assert.equal(new Set(mappedIds).size,mappedIds.length,'No passage duplicated in alignment');
 assert.ok(catalog.english_editor_passages>=916);
 assert.ok(catalog.english_editor_unmapped<=49);
 assert.ok(catalog.english_editor_alignment_drafts>=670);
 assert.equal(catalog.english_passages,246);
 assert.equal(read('dist/sishu-review-status.json').entries.length,0);
});

test('Da Xue batch 10 maps exact Hanzi spans without modifying MATAKIN or Final status',()=>{
 for(const u of snapshot.units){
  const p=byId.get(u.indonesian_passage_id),entry=entryFor(u);
  assert.ok(p&&entry,'Known passage and alignment: '+u.indonesian_passage_id);
  assert.deepEqual(entry.indonesian_passage_ids,[p.id]);
  assert.equal(entry.hanzi_span,hanzi(p));
  assert.equal(u.hanzi_span,hanzi(p));
  assert.equal(entry.english_segments.length,1);
  assert.equal(entry.english_segments[0].text,u.english_transcription);
  assert.equal(entry.english_segments[0].legge_ref,u.legge_ref);
  assert.equal(entry.source_url,snapshot.source_english.url);
  assert.equal(entry.status,'draft');
  assert.equal(p.editorial_status,'unverified-draft');
  assert.equal(p.translation_english,undefined);
  assert.ok(u.english_source_lines[0]>0&&u.english_source_lines[1]>=u.english_source_lines[0]);
  assert.ok(!/\p{Script=Han}/u.test(u.english_transcription));
 }
});

test('Split source paragraphs and disputed glyph variants remain explicit',()=>{
 const u=x=>snapshot.units.find(y=>y.indonesian_passage_id==='sishu.daxue.'+x);
 assert.deepEqual(u('10.04').english_source_lines,[80,81]);
 assert.deepEqual(u('11.01').english_source_lines,[89,90]);
 assert.match(u('10.04').english_transcription,/\n\nNever has there been/);
 assert.match(u('11.01').english_transcription,/\n\nThus the ruler/);
 assert.match(u('10.01').review_discrepancy,/悌.*弟/);
 assert.match(hanzi(byId.get('sishu.daxue.10.01')),/悌者/);
 assert.notEqual(u('10.05').english_transcription,u('10.09').english_transcription);
 assert.equal(alignment.entries.some(e=>e.indonesian_passage_ids.includes('sishu.daxue.06.01')),false);
});
