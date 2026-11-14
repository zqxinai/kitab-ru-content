'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const source=read('sources/legge/daxue-b09-10-passages.json');
const alignment=read('dist/sishu-english-alignment.json');
const catalog=read('catalog.json').collections.find(c=>c.id==='sishu');
const book=['07','08','09'].flatMap(i=>read('sishu/chapters/daxue/'+i+'.json').passages);
const byId=new Map(book.map(p=>[p.id,p]));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const expected=['07.01','07.02','07.03','07.04','08.01','08.02','08.03','09.01','09.02','09.03'].map(x=>'sishu.daxue.'+x);

test('Da Xue batch 09 contains exactly ten new English Draft mappings',()=>{
 assert.deepEqual(source.units.map(u=>u.indonesian_passage_id),expected);
 assert.equal(new Set(source.units.map(u=>u.indonesian_passage_id)).size,10);
 assert.equal(catalog.english_editor_passages,906);
 assert.equal(catalog.english_editor_unmapped,59);
 assert.equal(catalog.english_editor_alignment_drafts,660);
 assert.equal(catalog.english_passages,246);
 assert.equal(read('dist/sishu-review-status.json').entries.length,0);
 const allIds=alignment.entries.flatMap(a=>a.indonesian_passage_ids);
 assert.equal(new Set(allIds).size,allIds.length,'no duplicated passage alignment');
});

test('English is paired with exactly the unmodified Hanzi span and source text',()=>{
 for(const u of source.units){
  const p=byId.get(u.indonesian_passage_id);
  const id='legge-daxue-b09-'+u.indonesian_passage_id.split('.').slice(-2).join('-');
  const a=alignment.entries.find(e=>e.id===id);
  assert.ok(a&&p,u.indonesian_passage_id);
  assert.deepEqual(a.indonesian_passage_ids,[p.id]);
  assert.equal(a.hanzi_span,hanzi(p));
  assert.equal(u.hanzi_span,hanzi(p));
  assert.equal(a.english_segments.length,1);
  assert.equal(a.english_segments[0].text,u.english_transcription);
  assert.equal(a.english_segments[0].legge_ref,u.legge_ref);
  assert.equal(a.status,'draft');
  assert.equal(a.source_url,source.source_english.url);
  assert.equal(p.editorial_status,'unverified-draft');
  assert.equal(p.translation_english,undefined);
  assert.ok(u.english_source_lines[0]>0);
  assert.ok(u.english_source_lines[1]>=u.english_source_lines[0]);
 }
});

test('Do not falsely cover Da Xue VI:1 with incomplete Legge text',()=>{
 assert.equal(source.excluded.id,'sishu.daxue.06.01');
 assert.equal(alignment.entries.some(a=>a.indonesian_passage_ids.includes(source.excluded.id)),false);
 assert.match(source.units.find(u=>u.indonesian_passage_id==='sishu.daxue.09.01').review_discrepancy,/dua paragraf/);
});
