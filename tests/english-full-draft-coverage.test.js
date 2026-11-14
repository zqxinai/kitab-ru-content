'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const bundle=read('dist/sishu-content.json');
const alignment=read('dist/sishu-english-alignment.json');
const catalog=read('catalog.json').collections.find(c=>c.id==='sishu');
const registry=read('dist/sishu-review-status.json');
const chapters=bundle.chapters;
const passages=chapters.flatMap(c=>c.passages);
const byId=new Map(passages.map(p=>[p.id,p]));
const hanzi=p=>p.ruby_paragraphs.map(r=>r.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
const normalize=s=>String(s).replace(/\s+/g,'');
test('965 passages have unique IDs and complete, source-attributed English drafts',()=>{
 assert.equal(chapters.length,78);
 assert.equal(passages.length,965);
 assert.equal(byId.size,965,'Duplicate scripture passage ID');
 const bundled=passages.filter(p=>p.translation_english).map(p=>p.id);
 const mapped=alignment.entries.flatMap(e=>e.indonesian_passage_ids);
 assert.equal(mapped.length,new Set(mapped).size,'Duplicate aligned passage IDs');
 for(const p of passages) if(p.translation_english) {
   assert.ok(p.translation_english.trim(),p.id);
   assert.ok(p.translation_english_source,p.id+' lacks embedded English provenance');
 }
 const available=new Set([...bundled,...mapped]);
 assert.equal(available.size,965,'Unmapped passages remain');
 assert.equal(bundled.length+mapped.length,965,'Overlapping English source coverage');
 assert.equal(catalog.english_editor_passages,available.size);
 assert.equal(catalog.english_editor_unmapped,965-available.size);
 assert.equal(catalog.english_editor_alignment_drafts,mapped.length);
 assert.equal(catalog.english_passages,bundled.length);
 assert.equal(catalog.total_passages,965);
});
test('Every mapped English draft retains full Hanzi spans, source and distinct draft status',()=>{
 const refs=new Set();
 for(const e of alignment.entries){
   assert.ok(e.id&&!refs.has(e.id),'Duplicate alignment ID: '+e.id);
   refs.add(e.id);
   assert.equal(e.status,'draft',e.id);
   assert.ok(e.source_url?.startsWith('https://'),e.id+' missing source URL');
   assert.ok(e.english_segments?.length>0,e.id+' missing English segments');
   assert.ok(e.english_segments.every(s=>s.text?.trim()&&s.legge_ref?.trim()),e.id+' segment lacks English or Legge reference');
   for(const id of e.indonesian_passage_ids)assert.ok(byId.has(id),id);
   const actual=e.indonesian_passage_ids.map(id=>hanzi(byId.get(id))).join('');
   assert.equal(normalize(e.hanzi_span),normalize(actual),e.id+' Hanzi scope mismatch');
 }
});
test('Corrected Da Xue XI:23 does not contain Zhong Yong preface; Final is a separate approval process',()=>{
 const p=byId.get('sishu.daxue.11.23');
 const snap=read('sources/matakin/daxue-11-23-preface-overflow-20261114.json');
 assert.ok(p&&snap);
 assert.doesNotMatch(p.translation_indonesian,/Zhong Yong\s*-\s*Tiong Yong|KATA PENGANTAR CU-HI/i);
 assert.ok(p.translation_indonesian.endsWith('(Bc. IA:1).'));
 assert.equal(registry.schema,'kitab-ru.review-status.v1');
 assert.ok(Array.isArray(registry.entries));
 // Intentionally do not force registry.entries to be empty: manual Final approvals must remain possible.
});
