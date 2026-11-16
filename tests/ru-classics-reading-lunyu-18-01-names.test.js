'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const reader=require('../ru-classics/reading-normalization.js');
const chapter=JSON.parse(fs.readFileSync(path.join(__dirname,'../sishu/chapters/lunyu/18.json'),'utf8'));
const p=chapter.passages.find(p=>p.id==='sishu.lunyu.18.01');
test('Lun Yu XVIII:1: three one-token Hokkian names MUST have Hanzi-grounded Pinyin',()=>{
 const hanzi=p.ruby_paragraphs.flat().map(t=>t.traditional||t.value||'').join('');
 assert.match(hanzi,/微子去之/);
 assert.match(hanzi,/箕子為之奴/);
 assert.match(hanzi,/比乾諫而死/);
 const source=p.translation_indonesian;
 assert.ok(source.includes('Bicu menyingkirkan diri'));
 assert.ok(source.includes('Kicu dihukum menjadi budak'));
 assert.ok(source.includes('Pikan dianiaya sehingga mati'));
 const shown=reader.normalize(source,p.id);
 for(const expected of ['Weizi - Bicu','Jizi - Kicu','Bi Gan - Pikan'])assert.ok(shown.includes(expected),'Missing '+expected);
 assert.equal(reader.normalize(shown,p.id),shown,'Normalization must be idempotent');
 assert.equal(p.translation_indonesian,source,'Source MATAKIN must not be mutated');
});
test('Never globally replace Indonesian words or unrelated names from a screenshot',()=>{
 assert.equal(reader.normalize('Bicu, Kicu dan Pikan','sishu.lunyu.18.02'),'Bicu, Kicu dan Pikan');
 const t='Nama Bicu adalah nama dalam konteks micro';
 assert.equal(reader.normalize(t,'sample'),t);
});
