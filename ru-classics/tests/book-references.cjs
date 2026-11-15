'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const names=require('../book-references.js');
const legacy=require('../reference-overlay.js');
const grouped=require('../reference-links.js');
const same=require('../same-book-references.js');
const ayat=require('../subverses.js');
const chapters=read('sishu/manifest.json').chapters.map(e=>read(e.path));
const all=chapters.flatMap(ch=>ch.passages);
const byId=new Map(all.map(p=>[p.id,p]));
const canLink=r=>{
 const dest=byId.get(r.target_id);
 return !!dest&&(!r.ayat||!!ayat.splitIndonesia(dest.translation_indonesian)?.some(v=>v.number===r.ayat));
};
function parts(id,raw){
 const known=grouped.parts(id,raw,legacy);
 const internal=same.expand(id,known,canLink);
 return names.expand(internal,canLink);
}
function checkTargets(refs,expected){
 for(const [id,n] of expected){
   assert.ok(refs.some(r=>r.target_id===id&&Number(r.ayat||0)===n),'Missing '+id+(n?' Ayat '+n:''));
 }
}
test('Plain abbreviations, inherited chapters, and compound references work across all Si Shu books',()=>{
 checkTargets(parts('sishu.zhongyong.09.01','(S.S. V:8; XII: 20)'),[
   ['sishu.lunyu.05.08',0],['sishu.lunyu.12.20',0]]);
 checkTargets(parts('sishu.zhongyong.20.05','(Bc. VII B:16; IIA:5)'),[
   ['sishu.mengzi.14.16',0],['sishu.mengzi.03.05',0]]);
 checkTargets(parts('sishu.zhongyong.14.01','(S.S. XIV:26, 29)'),[
   ['sishu.lunyu.14.26',0],['sishu.lunyu.14.29',0]]);
 checkTargets(parts('sishu.daxue.10.04','(S.S. V: 12; XV: 24)'),[
   ['sishu.lunyu.05.12',0],['sishu.lunyu.15.24',0]]);
 checkTargets(parts('sishu.lunyu.12.16','(T.S. IX: 3)'),[
   ['sishu.zhongyong.10.03',0]]);
 checkTargets(parts('sishu.lunyu.15.24','(A.B. IX: 4)'),[
   ['sishu.daxue.10.04',0]]);
 checkTargets(parts('sishu.lunyu.03.21','(Bc. II A. 1/10)'),[
   ['sishu.mengzi.03.01',10]]);
 checkTargets(parts('sishu.mengzi.01.03','(III. A.3.10)'),[
   ['sishu.mengzi.05.03',10]]);
 const output=parts('sishu.zhongyong.09.01','(S.S. V:8; XII:20)').map(x=>x.text).join('');
 assert.equal(output,'(Sabda Suci — Lun Yu V:8; Lun Yu XII:20)');
});
test('Never invent chapter-only, external, malformed, or unavailable source references',()=>{
 const a=parts('sishu.daxue.04.01','Sanjak (IV.3.3.4)');
 assert.deepEqual(a,[{text:'Sanjak (IV.3.3.4)',target_id:null}]);
 const b=parts('sishu.lunyu.09.08','(T.S. V)');
 assert.ok(b.every(p=>!p.target_id));
 const c=parts('sishu.daxue.10.03','(S.S. XXV1:6)');
 assert.deepEqual(c,[{text:'(S.S. XXV1:6)',target_id:null}]);
 const d=parts('sishu.mengzi.05.03','(IA.22)');
 assert.deepEqual(d,[{text:'(IA.22)',target_id:null}]);
 const e=parts('sishu.lunyu.02.05','(Shu Jing - Su King V. 9.4)');
 assert.deepEqual(e,[{text:'(Shu Jing - Su King V. 9.4)',target_id:null}]);
 const f=parts('sishu.zhongyong.09.01','(II.5.4.4)');
 assert.deepEqual(f,[{text:'(II.5.4.4)',target_id:null}]);
});
test('Full 965-passage audit: every added link leads to an existing passage and verified ayat',()=>{
 assert.equal(chapters.length,78);
 assert.equal(all.length,965);
 const byBook={}; let addedLinks=0, addedPassages=0, finalLinks=0;
 for(const ch of chapters){
  for(const p of ch.passages){
   const source=p.translation_indonesian;
   const original=grouped.parts(p.id,source,legacy);
   const afterSame=same.expand(p.id,original,canLink);
   const derived=names.expand(afterSame,canLink);
   const added=derived.filter(r=>r.target_id).length-afterSame.filter(r=>r.target_id).length;
   assert.ok(added>=0,'Previously linked citation lost: '+p.id);
   if(added){addedLinks+=added;addedPassages++;byBook[ch.book]=(byBook[ch.book]||0)+added;}
   for(const ref of derived.filter(r=>r.target_id)){
     finalLinks++;
     assert.ok(byId.has(ref.target_id),'Invented target: '+p.id+' -> '+ref.target_id);
     assert.ok(canLink(ref),'Unverified ayat: '+p.id+' -> '+ref.target_id+'/'+ref.ayat);
   }
   assert.equal(p.translation_indonesian,source,'MATAKIN original must not be rewritten');
  }
 }
 console.log('BOOK_REFERENCE_AUDIT '+JSON.stringify({passages:all.length,addedLinks,addedPassages,finalLinks,byBook}));
 assert.ok(addedLinks>=35,'Cross-book resolver should find many new validated references');
 assert.ok(Object.keys(byBook).length>=3,'New links must cover multiple books');
});
