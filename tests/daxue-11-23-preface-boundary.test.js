'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const archive=read('sources/matakin/daxue-11-23-preface-overflow-20261114.json'),chapter=read('sishu/chapters/daxue/11.json'),manifest=read('sishu/manifest.json'),bundle=read('dist/sishu-content.json'),catalog=read('catalog.json').collections.find(x=>x.id==='sishu');
const p=chapter.passages.find(p=>p.id===archive.passage_id);
const compiled=bundle.chapters.flatMap(c=>c.passages).find(x=>x.id===p.id);
test('Only unrelated Zhong Yong preface is detached from Da Xue XI:23, byte-for-byte recoverable',()=>{
 assert.equal(archive.original_translation_indonesian,archive.retained_translation_indonesian+archive.detached_overlap);
 assert.equal(archive.retained_translation_indonesian,p.translation_indonesian);
 assert.equal(archive.cut_point,p.translation_indonesian.length);
 assert.ok(p.translation_indonesian.endsWith("(Bc. IA:1)."));
 assert.doesNotMatch(p.translation_indonesian,/Zhong Yong|KATA PENGANTAR CU-HI|TENGAH SEMPURNA BAB UTAMA/);
 assert.match(archive.detached_overlap,/Zhong Yong - Tiong Yong.*KATA PENGANTAR CU-HI/);
 assert.match(archive.detached_overlap,/TENGAH SEMPURNA BAB UTAMA/);
 assert.equal(manifest.front_matter.some(x=>x.id==='sishu.zhongyong.preface'),true);
 assert.deepEqual(p,compiled);
});
test('Hanzi, pinyin, other Da Xue passages, editor Final and all 965 Draft mappings remain unaffected',()=>{
 assert.equal(p.editorial_status,'unverified-draft');
 assert.ok(p.ruby_paragraphs.length>0);
 assert.equal(chapter.passages.length,23);
 assert.equal(bundle.chapters.length,78);
 assert.equal(bundle.chapters.reduce((n,c)=>n+c.passages.length,0),965);
 assert.equal(catalog.english_editor_passages,965);
 assert.equal(catalog.english_editor_unmapped,0);
 assert.equal(read('dist/sishu-review-status.json').entries.length,0);
});
