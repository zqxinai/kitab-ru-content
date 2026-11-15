'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const {parse,expand}=require('../same-book-references.js');
const {splitIndonesia}=require('../subverses.js');
const all=Array.from({length:14},(_,i)=>{
  const file=path.join(root,'sishu/chapters/mengzi',String(i+1).padStart(2,'0')+'.json');
  return JSON.parse(fs.readFileSync(file,'utf8')).passages;
}).flat();
const byId=new Map(all.map(p=>[p.id,p]));
const canNavigate=ref=>{
  const target=byId.get(ref.target_id);
  return !!target&&(!ref.ayat||!!splitIndonesia(target.translation_indonesian)?.some(v=>v.number===ref.ayat));
};
test('Mengzi III A:3/10 links to existing section, passage, and ayat 10',()=>{
 const p=byId.get('sishu.mengzi.01.03');
 const source='(III. A.3.10)';
 assert.ok(p.translation_indonesian.includes(source));
 const expanded=expand(p.id,[{text:source,target_id:null}],canNavigate);
 assert.equal(expanded.length,1);
 assert.deepEqual(expanded[0],{text:'(Mengzi — Bing Cu III A:3/10)',target_id:'sishu.mengzi.05.03',ayat:10});
 assert.ok(splitIndonesia(byId.get(expanded[0].target_id).translation_indonesian).some(v=>v.number===10));
});
test('All existing Mengzi A/B references map only to exact known destinations',()=>{
 const matcher=/\(([^()\n]{1,55})\)/g;
 let candidates=0,linked=0;
 for(const passage of all){
   const input=passage.translation_indonesian;
   const segments=expand(passage.id,[{text:input,target_id:null}],canNavigate);
   for(const match of input.matchAll(matcher))if(parse(passage.id,match[1]))candidates++;
   const displayed=segments.map(x=>x.text).join('');
   for(const ref of segments.filter(x=>x.target_id)){
     linked++;
     assert.ok(byId.has(ref.target_id));
     assert.ok(ref.text.includes('Mengzi — Bing Cu'));
     assert.ok(canNavigate(ref));
   }
   assert.equal(displayed.replace(/\(Mengzi — Bing Cu ([IVXLCDM]+) ([AB]):(\d+)(?:\/(\d+))?\)/g,
     (full,r,ab,p,n)=>'('+r+(ab==='A'?'A':'B')+'.'+p+(n?'.'+n:'')+')').includes('unreachable-sentinel'),false);
 }
 assert.equal(candidates,53,'source has changed; re-audit references before release');
 assert.equal(linked,52,'only references with verified target passage and ayat are interactive');
});
test('Missing and ambiguous references remain original, without fake destinations',()=>{
 assert.equal(parse('sishu.lunyu.01.01','III. A.3.10'),null);
 assert.equal(parse('sishu.mengzi.01.01','II.5.4.4'),null);
 assert.equal(parse('sishu.mengzi.01.01','III.1.1.1'),null);
 assert.equal(parse('sishu.mengzi.01.01','VII C:1'),null);
 const missing=expand('sishu.mengzi.05.03',[{text:'(IA.22)',target_id:null}],canNavigate);
 assert.deepEqual(missing,[{text:'(IA.22)',target_id:null}]);
 const protectedParts=[{text:'(Sabda Suci — Lun Yu III:7)',target_id:'sishu.lunyu.03.07',ayat:null}];
 assert.deepEqual(expand('sishu.mengzi.03.01',protectedParts,canNavigate),protectedParts);
});
