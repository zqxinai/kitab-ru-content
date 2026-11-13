'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {audit}=require('../tools/audit_review_status.js');
const scripture=()=>({chapters:[{passages:[{
  id:'sishu.daxue.01.01',
  ruby_paragraphs:[[{type:'ruby',traditional:'大'},{type:'ruby',traditional:'學'}]],
  translation_indonesian:'Ajaran Besar'
}]}]});
const alignment=()=>({entries:[{
  id:'legge-1',indonesian_passage_ids:['sishu.daxue.01.01'],
  english_segments:[{legge_ref:'Great Learning §1',text:'Great Learning'}],
  hanzi_span:'大學',status:'draft',source_url:'https://example.org'
}]});
const registry=()=>({entries:[{
  passage_id:'sishu.daxue.01.01',indonesian:'final',english:'final',
  hanzi_span:'大學',indonesian_text:'Ajaran Besar',english_text:'Great Learning',
  reviewed_by:'maintainer',reviewed_at:'2026-11-13',source_issue:12
}]});
test('both language approvals are valid for identical snapshots',()=>{
  assert.deepEqual(audit(scripture(),alignment(),registry()).errors,[]);
});
test('reopening final on changed Indonesian text',()=>{
  const b=scripture();b.chapters[0].passages[0].translation_indonesian='Edisi baru';
  assert.ok(audit(b,alignment(),registry()).errors.some(e=>e.includes('Indonesian final stale')));
});
test('reopening final on changed English text',()=>{
  const a=alignment();a.entries[0].english_segments[0].text='Altered';
  assert.ok(audit(scripture(),a,registry()).errors.some(e=>e.includes('English final stale')));
});
test('reopening final on changed Hanzi',()=>{
  const b=scripture();b.chapters[0].passages[0].ruby_paragraphs[0][0].traditional='天';
  assert.ok(audit(b,alignment(),registry()).errors.some(e=>e.includes('Approved Hanzi stale')));
});
test('rejecting untraceable approvals',()=>{
  const r=registry();delete r.entries[0].source_issue;
  assert.ok(audit(scripture(),alignment(),r).errors.some(e=>e.includes('Missing reviewer evidence')));
});
test('rejecting unknown chapter passage in alignment',()=>{
  const a=alignment();a.entries[0].indonesian_passage_ids=['missing'];
  assert.ok(audit(scripture(),a,registry()).errors.some(e=>e.includes('Unknown alignment passage')));
});
