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
