'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const overlay=require('../reference-overlay.js');
const links=require('../reference-links.js');
const layout=require('../reading-layout.js');
const verses=require('../subverses.js');
const chapters=[
  load('sishu/chapters/mengzi/01.json'),
  load('sishu/chapters/mengzi/03.json')
];
const sources=[1,2,3].map(i=>load('sources/references/matakin-compound-batch0'+i+'.json'));
const originals=sources.flatMap(x=>x.entries);
test('Every approved MATAKIN compound keeps its exact display while exposing verified passage targets',()=>{
  assert.equal(originals.length,29);
  let total=0;
  for(const entry of originals){
    const source=overlay.records.find(r=>r.passage_id===entry.passage_id&&r.source===entry.source);
    assert.ok(source,entry.passage_id+' missing overlay record');
    const parts=links.parts(entry.passage_id,entry.source,overlay);
    assert.equal(parts.map(p=>p.text).join(''),entry.display,'display text changed: '+entry.passage_id);
    const expected=entry.components.flatMap(c=>c.target_passage_ids);
    for(const target of expected){
      assert.ok(parts.some(x=>x.target_id===target),'target not clickable: '+entry.passage_id+' -> '+target);
    }
    total+=expected.length;
  }
  assert.equal(total,68);
});
test('Slash /5 is target Ayat 5, comma-separated passages stay distinct',()=>{
 const mixed=originals.find(x=>x.passage_id==='sishu.lunyu.03.07');
 const parts=links.parts(mixed.passage_id,mixed.source,overlay);
 assert.equal(parts.find(x=>x.target_id==='sishu.mengzi.03.07').ayat,5);
 const multi=originals.find(x=>x.passage_id==='sishu.lunyu.05.02');
 const fragments=links.parts(multi.passage_id,multi.source,overlay);
 assert.ok(fragments.some(x=>x.text==='1'&&x.target_id==='sishu.lunyu.06.01'));
 assert.ok(fragments.some(x=>x.text==='2'&&x.target_id==='sishu.lunyu.06.02'));
 assert.equal(fragments.map(x=>x.text).join(''),multi.display);
});
test('Chapter-only and ambiguous citations remain unlinked',()=>{
 const p=overlay.records.find(x=>x.passage_id==='sishu.lunyu.09.08'&&x.target_id===null);
 assert.ok(p);
 const parts=links.parts(p.passage_id,p.source,overlay);
 assert.ok(parts.every(x=>x.target_id==null));
 assert.deepEqual(links.parts('sishu.mengzi.01.01','(II.5.4.4)',overlay).map(x=>x.target_id),[null]);
});
test('Paragraph display preserves byte-for-byte Indonesian and English texts',()=>{
 const sources=[
   chapters[0].passages[0].translation_indonesian,
   chapters[0].passages[1].translation_indonesian,
   'Long paragraph. '.repeat(90),
   'The Master said, "Learning is good." He asked a question. '.repeat(35),
   'The first paragraph.\n\nA second paragraph.'
 ];
 for(const s of sources){
   const parts=layout.paragraphs(s,s.startsWith('The Master')?'en':'id');
   assert.equal(parts.join(''),s);
   assert.ok(parts.every(p=>p.length>0));
 }
 assert.ok(layout.paragraphs('The Master said, "Learning is good." He asked a question. '.repeat(35),'en').length>1);
});
test('Browser loads reference and typography modules before the reader',()=>{
 const html=read('ru-classics/index.html');
 const reader=read('ru-classics/app.js');
 const editor=read('ru-classics/editor.js');
 for(const file of ['reference-links.js','reading-layout.js','subverses.js']){
   assert.ok(html.includes('src="./'+file+'"'));
   assert.ok(html.indexOf('src="./'+file+'"')<html.indexOf('src="./app.js"'));
 }
 assert.match(reader,/RuReferenceLinks\?\.parts/);
 assert.match(reader,/data-ref-ayat/);
 assert.match(reader,/readableIndonesian:/);
 assert.match(reader,/readingParagraphs\(p\.translation_english,'en',H\)/);
 assert.match(editor,/app\(\)\?\.readableIndonesian/);
 assert.match(editor,/app\(\)\?\.readableEnglish/);
});
