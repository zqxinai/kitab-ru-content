'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const audit=require('../docs/audits/zhu-xi-wyg-965.json');
test('locked WYG source and 965 unique source-mapped IDs',()=>{
 assert.equal(audit.schema,'ru-classics.zhu-xi-wyg-screening.v1');
 assert.equal(audit.source.commit,'84c6b2c5093c57ae5d41c60a73c02323d2420ef0');
 assert.equal(audit.passages.length,965);
 assert.equal(new Set(audit.passages.map(p=>p.passage_id)).size,965);
 assert.equal(audit.totals.overall.total,965);
 assert.equal(audit.totals.overall.exact_substring,515);
 assert.equal(audit.totals.overall.high_risk,8);
 assert.ok(audit.passages.every(p=>p.witness_file&&p.witness_page&&p.screen_class));
});
test('Yun mistransliterations are context-scoped',()=>{
 const y=audit.confirmed_attention.yun_semantic_conversions;
 assert.equal(y.total,24);assert.equal(y.passages.length,16);
 assert.equal(y.passages.reduce((a,b)=>a+b.count,0),24);
 assert.equal(y.legitimate_cloud_passages.length,4);
 assert.equal(y.passages.find(x=>x.passage_id==='sishu.lunyu.17.11').count,6);
});
test('known editorial caveats survive automated report',()=>{
 const map=new Map(audit.confirmed_attention.manual_cases.map(x=>[x.id,x]));
 assert.match(map.get('sishu.mengzi.09.07').decision,/commentary/i);
 assert.match(map.get('sishu.lunyu.14.33').wyg,/子曰/);
 assert.match(map.get('sishu.daxue.01.01').wyg,/親民/);
});

const fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(t=>t.traditional||t.value||'').join('')).join('\n');
test('photo-verified Da Xue III:4 preserves 喧 and corrects 諠 twice',()=>{
 const p=read('sishu/chapters/daxue/04.json').passages.find(x=>x.id==='sishu.daxue.04.04');
 const h=hanzi(p);
 assert.equal((h.match(/赫兮喧兮/g)||[]).length,2);
 assert.equal((h.match(/終不可諠兮/g)||[]).length,2);
 assert.equal((h.match(/終不可喧兮/g)||[]).length,0);
 assert.equal(p.editorial_status,'unverified-draft');
});
test('photo-verified Da Xue VI:2 preserves proper 閒, 掩, 己',()=>{
 const p=read('sishu/chapters/daxue/07.json').passages.find(x=>x.id==='sishu.daxue.07.02');
 const h=hanzi(p);
 assert.match(h,/小人閒居為不善/);
 assert.match(h,/掩其不善/);
 assert.match(h,/人之視己/);
 assert.doesNotMatch(h,/小人閑居為不善/);
 assert.equal(p.editorial_status,'unverified-draft');
});
