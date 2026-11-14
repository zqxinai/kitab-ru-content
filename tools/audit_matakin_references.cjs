#!/usr/bin/env node
'use strict';
/* Read-only inventory of old-style MATAKIN references.
 * It never rewrites the source Indonesian translation or infers a book solely
 * from Roman numerals. The report is for editorial comparison with MATAKIN 2012. */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const roman='[IVXLCDM]{1,10}';
const probableRef=new RegExp('(?:'+roman+'[.\\s]*[AB]\\s*[.:]\\s*\\d{1,3})|(?:'+roman+'\\s*[.:]\\s*\\d{1,3})|(?:\\d{1,3}\\s*[.:]\\s*\\d{1,3})','i');
const explicitBook=/Mengzi|Meng Zi|Bingcu|Bing Cu|Sabda Suci|Lun Yu|Ajaran Besar|Da Xue|Tengah Sempurna|Zhong Yong|Shi Jing|Shijing|Si King|Shu Jing|Shujing|Su King|Li Ji|Liji|Yi Jing|Yijing|Zhou Yi|Zhouyi|Kitab Sanjak|Kitab Hikayat/i;
function classify(reference,book){
 const s=String(reference||'').trim();
 const hasNumeric=probableRef.test(s);
 const ss=/\bS\s*\.\s*S\s*\.?\s*(?=[IVXLCDM]|\d)/i.test(s)||
   /(?:^|[;,.\s])SS\s+[IVXLCDM]+/i.test(s);
 const ab=/\bA\s*\.\s*B\s*\.\s*(?=[IVXLCDM]|\d)/i.test(s);
 const bc=/\bB\s*\.\s*C\s*\.\s*(?=[IVXLCDM]|\d)/i.test(s);
 if(!hasNumeric&&!ss&&!ab&&!bc)return null;
 if(explicitBook.test(s)){
   return {kind:(ss||ab||bc)?'explicit-plus-abbreviation':'explicit-book',confidence:'observed',target_book:null};
 }
 if(ss)return {kind:'abbreviated-book',confidence:'high',target_book:'lunyu'};
 if(ab)return {kind:'abbreviated-book',confidence:'high',target_book:'daxue'};
 if(bc)return {kind:'abbreviated-book',confidence:'high',target_book:'mengzi'};
 if(book==='mengzi'&&new RegExp('^'+roman+'\\s*\\.?\\s*[AB]\\s*[.:]\\s*\\d{1,3}(?:\\s*[.:]\\s*\\d{1,3})?\\s*$','i').test(s))
   return {kind:'possible-same-book',confidence:'medium',target_book:'mengzi'};
 return {kind:'ambiguous-unlabeled',confidence:'unknown',target_book:null};
}
function scan(){
 const manifest=read('sishu/manifest.json'),results=[];
 let count=0;
 for(const item of manifest.chapters){
   const c=read(item.path);count+=c.passages.length;
   for(const p of c.passages){
     const text=p.translation_indonesian||'';
     for(const m of text.matchAll(/\(([^()\n]{1,125})\)/g)){
       const classification=classify(m[1],c.book);
       if(!classification)continue;
       results.push({
         passage_id:p.id,book:c.book,source_file:item.path,
         original_reference:m[0],offset:m.index,
         ...classification,
         context:text.slice(Math.max(0,m.index-55),Math.min(text.length,m.index+m[0].length+55))
       });
     }
   }
 }
 if(count!==965)throw Error('Unexpected pasal count: '+count);
 const counts=Object.fromEntries([...new Set(results.map(x=>x.kind))].sort().map(x=>[x,results.filter(y=>y.kind===x).length]));
 return {
  schema:'ru-classics.reference-audit.v1',
  policy:'2011 transcript preserved; MATAKIN 2012 full book names in same-book citations',
  passage_count:count,reviewed_references:results.length,counts,
  review_required:results.filter(r=>r.kind!=='explicit-book'),
  all_references:results
 };
}
if(require.main===module){
 const result=scan(),outArg=process.argv.indexOf('--out');
 if(outArg>=0){
  if(!process.argv[outArg+1])throw Error('Use --out <path>');
  fs.writeFileSync(process.argv[outArg+1],JSON.stringify(result,null,2)+'\n');
 }
 console.log('MATAKIN references: '+JSON.stringify({
  passages:result.passage_count,references:result.reviewed_references,groups:result.counts,
  samples:result.review_required.slice(0,15).map(x=>({id:x.passage_id,ref:x.original_reference,kind:x.kind,target:x.target_book}))
 },null,2));
}
module.exports={classify,scan};
