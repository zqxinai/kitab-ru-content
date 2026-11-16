'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const data=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const glossary=require('../character-dictionary.js');
test('CC-CIDICT is a corpus-filtered Indonesian dictionary with attribution',()=>{
 const payload=data('ru-classics/data/character-cidict.json');
 const corpus=data('ru-classics/data/sishu.json');
 const chars=new Set(),words=new Set();
 for(const ch of corpus.chapters)for(const p of ch.passages||[])for(const par of p.ruby_paragraphs||[]){
  let stream='';
  const flush=()=>{for(let i=0;i<stream.length;i++)for(let n=1;n<=8&&i+n<=stream.length;n++)words.add(stream.slice(i,i+n));stream='';};
  for(const t of par){const s=t.type==='ruby'?(t.traditional||''):(t.value||'');for(const letter of Array.from(s)){
    const code=letter.codePointAt(0);
    if(code>=0x3400&&code<=0x9fff||code>=0xf900&&code<=0xfaff||code>=0x20000&&code<=0x323af){
      chars.add(letter);stream+=letter;
    }else flush();
  }}flush();
 }
 assert.equal(payload.schema,'ru-classics.cidict-glossary.v1');
 assert.equal(payload.license,'CC-BY-SA-4.0');
 assert.equal(payload.language,'id');
 assert.equal(payload.corpus_unique_characters,chars.size);
 assert.equal(payload.single_character_covered,Object.keys(payload.headwords).filter(k=>Array.from(k).length===1).length);
 assert.ok(payload.source_entries_parsed>50000);
 assert.ok(payload.single_character_covered>350,'CIDICT must cover a substantial new set of Hanzi in Indonesian');
 assert.ok(Object.keys(payload.headwords).every(k=>words.has(k)));
 assert.ok(Object.values(payload.headwords).every(readings=>Array.isArray(readings)&&readings.length&&readings.every(r=>r.definitions.length)));
 assert.ok(glossary.installCIDict(payload));
 assert.equal(glossary.cidictCoverage().covered,payload.single_character_covered);
 const any=Object.keys(payload.headwords).find(k=>Array.from(k).length===1);
 assert.ok(glossary.lookup(any,'sishu.lunyu.01.01').indonesianReadings?.length);
 const curated=glossary.lookup('仁','sishu.lunyu.01.01');
 assert.ok(curated.gloss,'editorial Indonesian gloss must remain unchanged');
 assert.equal(glossary.installCIDict({schema:'invalid',headwords:{'仁':[{"definitions":["forged"]}]}}),false);
 assert.ok(glossary.cidictCoverage());
});
test('Compound lookup is position-aware and never matches across punctuation',()=>{
 const dict=glossary;
 dict.installCIDict({schema:'ru-classics.cidict-glossary.v1',license:'CC-BY-SA-4.0',language:'id',
   source_url:'https://cidict.org/download/',single_character_covered:2,corpus_unique_characters:4,
   headwords:{'仁義':[{pinyin:'ren2 yi4',definitions:['cinta kasih dan kebenaran']}],
     '君子':[{pinyin:'jun1 zi3',definitions:['orang berbudi luhur']}],
     '仁':[{pinyin:'ren2',definitions:['cinta kasih']}]}
 });
 assert.equal(dict.phrasesAt('仁義，君子。',0)[0].word,'仁義');
 assert.equal(dict.phrasesAt('仁義，君子。',3)[0].word,'君子');
 assert.deepEqual(dict.phrasesAt('仁義，君子。',2),[]);
 assert.deepEqual(dict.phrasesAt('仁義，君子。',10),[]);
 const html=read('ru-classics/index.html'),app=read('ru-classics/app.js');
 assert.match(html,/data-inspector="cidict"/);
 assert.match(html,/data-inspector-terms/);
 assert.match(html,/CC BY-SA 4\.0/);
 assert.match(html,/20261117-cidict-v2/);
 assert.match(app,/character-cidict\.json/);
 assert.match(app,/phrasesAt/);
 assert.match(app,/data-hanzi-index/);
 assert.match(app,/dictionary\.indonesianReadings/);
});
