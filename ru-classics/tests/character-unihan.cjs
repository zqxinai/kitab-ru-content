'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const dictionary=require('../character-dictionary.js');

function isHanzi(char){
 const n=char.codePointAt(0);
 return n>=0x3400&&n<=0x9fff||n>=0xf900&&n<=0xfaff||n>=0x20000&&n<=0x323af;
}
test('Unihan glossary is generated from and restricted to the canonical 965 passages',()=>{
 const bundle=JSON.parse(read('ru-classics/data/sishu.json'));
 const payload=JSON.parse(read('ru-classics/data/character-unihan.json'));
 assert.equal(bundle.chapters.length,78);
 const chars=new Set();
 let count=0;
 for(const chapter of bundle.chapters){
   for(const passage of chapter.passages){
     count++;
     for(const paragraph of passage.ruby_paragraphs||[])
       for(const token of paragraph)
         for(const char of token.type==='ruby'?String(token.traditional||''):String(token.value||''))
           if(isHanzi(char))chars.add(char);
   }
 }
 assert.equal(count,965);
 assert.equal(payload.schema,'ru-classics.unihan-glossary.v1');
 assert.equal(payload.license,'Unicode-3.0');
 assert.equal(payload.language,'en');
 assert.equal(payload.total_unique_characters,chars.size);
 assert.equal(payload.covered_unique_characters,Object.keys(payload.definitions).length);
 assert.ok(payload.covered_unique_characters/chars.size>=.85);
 assert.ok(Object.keys(payload.definitions).every(char=>chars.has(char)));
 assert.ok(payload.uncovered.every(char=>chars.has(char)&&!payload.definitions[char]));
 assert.equal(payload.covered_unique_characters+payload.uncovered.length,chars.size);
 for(const definition of Object.values(payload.definitions))
   assert.equal(typeof definition,'string');
 assert.ok(dictionary.installUnihan(payload),'valid glossary should install');
 const meaning=dictionary.lookup('仁','sishu.lunyu.01.01');
 assert.ok(meaning.gloss,'curated Indonesian definitions must be preserved');
 if(payload.definitions['仁'])assert.equal(meaning.englishGloss,payload.definitions['仁']);
 assert.ok(meaning.englishSource?.includes('Unicode Unihan'));
 assert.equal(dictionary.lookup('仁','sishu.lunyu.01.01').context,null);
 assert.deepEqual(dictionary.coverage().covered,payload.covered_unique_characters);
});
test('Glossary explicitly distinguishes absent English definitions and rejected payloads',()=>{
 const before=dictionary.lookup('樂','sishu.lunyu.01.01');
 assert.equal(dictionary.installUnihan({schema:'bad',definitions:{'樂':'forged'},language:'en'}),false);
 assert.equal(dictionary.lookup('樂','sishu.lunyu.01.01').gloss,before.gloss);
 const html=read('ru-classics/index.html'),app=read('ru-classics/app.js');
 assert.match(html,/data-inspector="unihan"/);
 assert.match(html,/Unicode Unihan/);
 assert.match(html,/Unicode License v3/);
 assert.match(html,/data\\/UNICODE-LICENSE\\.txt/);
 const license=read('ru-classics/data/UNICODE-LICENSE.txt');
 assert.match(license,/UNICODE LICENSE V3/);
 assert.match(license,/SPDX-License-Identifier: Unicode-3\\.0/);
 assert.match(license,/COPYRIGHT AND PERMISSION NOTICE/);
 assert.match(app,/dictionary\.englishGloss/);
 assert.match(app,/installUnihan/);
 assert.match(app,/data\/character-unihan\.json/);
 assert.match(html,/styles\.css\?v=20261117-unihan-v1/);
 assert.match(html,/app\.js\?v=20261117-unihan-v1/);
});
