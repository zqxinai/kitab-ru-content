'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const book=read('dist/sishu-content.json'),align=read('dist/sishu-english-alignment.json');
const cat=read('catalog.json').collections.find(x=>x.id==='sishu');
const registry=read('dist/sishu-review-status.json');
const m=read('sources/legge/mengzi-variants-b05-chinesenotes.json');
const l=read('sources/legge/lunyu-b07-gutenberg-4094.json');
const byId=new Map(book.chapters.flatMap(c=>c.passages).map(p=>[p.id,p]));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const norm=s=>(String(s).match(/\p{Script=Han}/gu)||[]).join('');
function levenshtein(a,b){let x=[...a],y=[...b],p=Array.from({length:y.length+1},(_,j)=>j);for(let i=1;i<=x.length;i++){let n=[i];for(let j=1;j<=y.length;j++)n.push(Math.min(n[j-1]+1,p[j]+1,p[j-1]+(x[i-1]===y[j-1]?0:1)));p=n;}return p[y.length]}
test('seven variant-aware English drafts, no passage finalized',()=>{
 const units=[...m.units,...l.units];
 assert.equal(units.length,7);
 assert.equal(new Set(units.map(x=>x.indonesian_passage_id)).size,7);
 assert.ok(new Set(align.entries.flatMap(x=>x.indonesian_passage_ids)).size>=639);
 assert.ok(cat.english_editor_passages>=885);
 assert.ok(cat.english_editor_alignment_drafts>=639);
 assert.ok(cat.english_editor_unmapped<=80);
 assert.equal(cat.english_passages,246);
 assert.equal(registry.entries.length,0);
 for(const u of units){
  const p=byId.get(u.indonesian_passage_id);
  assert.ok(p,u.indonesian_passage_id);
  const e=align.entries.find(a=>a.id==='legge-'+(u.indonesian_passage_id.includes('.mengzi.')?'mengzi-b05-':'lunyu-b07-')+u.indonesian_passage_id.split('.').slice(-2).join('-'));
  assert.ok(e,u.indonesian_passage_id);
  assert.deepEqual(e.indonesian_passage_ids,[u.indonesian_passage_id]);
  const correctedIds=new Set(['sishu.mengzi.07.23','sishu.mengzi.07.25','sishu.lunyu.10.24','sishu.lunyu.14.33']);
  const expectedHanzi={
   'sishu.mengzi.07.23':s=>s.replace('忌','患'),
   'sishu.mengzi.07.25':s=>s.replace(/哺/g,'餔'),
   'sishu.lunyu.10.24':s=>s.replace('屍','尸').replace('客','容'),
   'sishu.lunyu.14.33':s=>'子'+s,
  }[u.indonesian_passage_id]?.(u.hanzi_span)||u.hanzi_span;
  assert.equal(e.hanzi_span,hanzi(p));
  assert.equal(e.hanzi_span,expectedHanzi);
  if(correctedIds.has(u.indonesian_passage_id))assert.notEqual(e.hanzi_span,u.hanzi_span,'Historical Legge snapshot stays unmodified');
  assert.equal(e.english_segments[0].text,u.source_english);
  assert.equal(e.english_segments[0].legge_ref,u.legge_ref);
  assert.equal(e.source_hanzi_transcription,u.source_chinese||u.source_hanzi_transcription);
  assert.equal(e.source_url,u.source_url);
  assert.equal(e.status,'draft');
  assert.ok(e.review_note.length>50);
  // The recorded alignment-distance describes the immutable historical source snapshot, not our corrected 2012 MATAKIN text.
  assert.equal(levenshtein(norm(u.hanzi_span),norm(e.source_hanzi_transcription)),u.normalized_character_edit_distance);
  assert.ok(u.normalized_character_edit_distance>=1&&u.normalized_character_edit_distance<=2);
 }
});
test('Mencius 09.07 historical exclusion remains documented after safe new mapping',()=>{
 const id='sishu.mengzi.09.07',p=byId.get(id);
 assert.ok(p);
 assert.doesNotMatch(hanzi(p),/林氏曰|愚謂/);
 assert.equal(p.commentary_annotations.length,2);
 assert.match(hanzi(p),/未聞以割烹也。伊訓曰/);
 assert.deepEqual(m.excluded.map(x=>x.id),[id]);
 const latest=align.entries.filter(e=>e.indonesian_passage_ids.includes(id));
 assert.equal(latest.length,1);
 assert.equal(latest[0].status,'draft');
});
test('explicit provenance and no silent Hanzi substitution',()=>{
 assert.match(m.source_commit_sha,/^[0-9a-f]{40}$/);
 assert.equal(l.source_ebook_id,4094);
 assert.ok(l.units.every(u=>u.source_html_lines[0]>0));
 assert.match(hanzi(byId.get('sishu.mengzi.07.23')),/人之患/);
 assert.match(hanzi(byId.get('sishu.mengzi.07.25')),/餔啜/);
 assert.match(hanzi(byId.get('sishu.mengzi.08.17')),/不祥/);
 assert.match(hanzi(byId.get('sishu.lunyu.11.03')),/季路/);
});
