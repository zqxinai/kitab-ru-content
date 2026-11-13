'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const read = file => JSON.parse(fs.readFileSync(file,'utf8'));
const registry = read('docs/audits/master-stage2-register-2026-11-14.json');
const matrix = read('docs/audits/zhu-xi-wyg-965.json');
const manifest = read('sishu/manifest.json');
const chapters = manifest.chapters.map(ch=>read(ch.path));
const byId = new Map(chapters.flatMap(ch=>ch.passages.map(p=>[p.id,p])));
const ambig = new Set(['為','樂','好','惡','長','王','中','處','數','間','行','朝']);

test('All 965 unique passage IDs are tracked and never auto-marked Final',()=>{
  assert.equal(registry.entries.length,965);
  assert.equal(new Set(registry.entries.map(x=>x.id)).size,965);
  assert.deepEqual(new Set(registry.entries.map(x=>x.id)),new Set(byId.keys()));
  assert.equal(chapters.length,78);
  assert.deepEqual(registry.summary, {
    machine_screen_only:912,
    reviewed_preliminary_not_final:44,
    needs_matakin_2012_photo:1,
    operational_reviewed_not_final:8,
  });
  for(const x of registry.entries){
    const p=byId.get(x.id);
    assert.ok(p);
    assert.equal(x.editorial_status,'unverified-draft',x.id);
    assert.equal(p.editorial_status,'unverified-draft',x.id);
    assert.notEqual(x.review_state,'final');
    if(x.review_evidence)assert.ok(fs.existsSync(x.review_evidence),x.id+' missing evidence');
  }
});
test('Each audit register row preserves original 965-passage screening result',()=>{
  const byScreenId=new Map(matrix.passages.map(x=>[x.passage_id,x]));
  assert.equal(byScreenId.size,965);
  assert.deepEqual(new Set(byScreenId.keys()),new Set(byId.keys()));
  for(const x of registry.entries){
    const source=byScreenId.get(x.id);
    assert.equal(x.screen_class_initial,source.screen_class,x.id);
    assert.equal(x.witness_page,source.witness_page,x.id);
    assert.equal(x.initial_edit_distance,source.canonical_edit_distance,x.id);
    const counts={};
    for(const t of byId.get(x.id).ruby_paragraphs.flat())
      if(t.type==='ruby'&&ambig.has(t.traditional))
        counts[t.traditional]=(counts[t.traditional]||0)+1;
    assert.deepEqual(x.polyphone_counters,counts,x.id);
  }
});
