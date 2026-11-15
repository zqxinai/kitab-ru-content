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
const explicitBook=/Mengzi|Meng Zi|Bingcu|Bing Cu|Sabda Suci|Lun Yu|Ajaran Besar|Da Xue|Tengah Sempurna|Zhong Yong|Shi Jing|Shijing|Si[ -]*King|Shu Jing|Shujing|Su[ -]*King|Li Ji|Liji|Yi Jing|Yijing|Zhou Yi|Zhouyi|Kitab Sanjak|Kitab Hikayat/i;
const ABBREVIATED_BOOKS=Object.freeze({
 ss:'lunyu',ab:'daxue',bc:'mengzi',ts:'zhongyong'
});
const abbreviationMatcher=/\b(S\s*\.?\s*S|A\s*\.?\s*B|B\s*\.?\s*C|T\s*\.?\s*S)\s*\.?\s*(?=[IVXLCDM]|\d)/gi;
function canonicalAbbreviation(value){
 return value.replace(/[^a-z]/gi,'').toLowerCase();
}
function classify(reference,book){
 const s=String(reference||'').trim();
 const hasNumeric=probableRef.test(s);
 const abbreviations=Array.from(s.matchAll(abbreviationMatcher),x=>canonicalAbbreviation(x[1]))
   .filter(x=>Object.hasOwn(ABBREVIATED_BOOKS,x));
 if(!hasNumeric&&!abbreviations.length)return null;
 if(explicitBook.test(s)){
   return {kind:abbreviations.length?'explicit-plus-abbreviation':'explicit-book',confidence:'observed',target_book:null};
 }
 // A parenthetical may contain multiple source books; don't guess one target.
 if(abbreviations.length>1){
   return {kind:'compound-abbreviations',confidence:'review-required',target_book:null};
 }
 if(abbreviations.length===1){
   return {kind:'abbreviated-book',confidence:'high',target_book:ABBREVIATED_BOOKS[abbreviations[0]]};
 }
 if(book==='mengzi'&&new RegExp('^'+roman+'\\s*\\.?\\s*[AB]\\s*[.:]\\s*\\d{1,3}(?:\\s*[.:]\\s*\\d{1,3})?\\s*$','i').test(s))
   return {kind:'possible-same-book',confidence:'medium',target_book:'mengzi'};
 return {kind:'ambiguous-unlabeled',confidence:'unknown',target_book:null};
}
function scan(){
 const manifest=read('sishu/manifest.json'),results=[];
 const compoundFiles=[
  'sources/references/matakin-compound-batch01.json',
  'sources/references/matakin-compound-batch02.json',
  'sources/references/matakin-compound-batch03.json'
 ];
 const compoundEntries=compoundFiles.flatMap(file=>read(file).entries);
 const compoundIndex=new Map(compoundEntries.map(r=>[r.passage_id+'::'+r.source,r]));
 if(compoundIndex.size!==compoundEntries.length)throw Error('Duplicate source ID + citation text in compound registries');
 let count=0;
 for(const item of manifest.chapters){
   const c=read(item.path);count+=c.passages.length;
   for(const p of c.passages){
     const text=p.translation_indonesian||'';
     for(const m of text.matchAll(/\(([^()\n]{1,125})\)/g)){
       const classification=classify(m[1],c.book);
       if(!classification)continue;
       const matched=compoundIndex.get(p.id+'::'+m[0]);
       results.push({
         passage_id:p.id,book:c.book,source_file:item.path,
         original_reference:m[0],offset:m.index,
         // MATAKIN cross-references signal related teaching/content, not an exact quote.
         reference_intent:'content-related',verbatim_match_required:false,
         reference_authority:'MATAKIN',relationship_review_required:false,
         ...classification,
         ...(matched?{
           segmentation_status:matched.display_status,
           reference_intent:matched.reference_intent,
           verbatim_match_required:matched.verbatim_match_required,
           reference_authority:'MATAKIN',
           relationship_review_required:matched.relationship_review_required,
           relation_verification:matched.relation_verification,
           segments:matched.components.map(c=>({
             source_segment:c.source_segment,
             book_id:c.book_id,
             target_passage_ids:c.target_passage_ids,
             reference_intent:c.reference_intent,
             verbatim_match_required:c.verbatim_match_required,
             subverse_number:c.subverse_number??null,
             subverse_marker_status:c.subverse_marker_status??null,
             subverse_target_id:c.subverse_target_id
           }))
         }:{}),
         context:text.slice(Math.max(0,m.index-55),Math.min(text.length,m.index+m[0].length+55))
       });
     }
   }
 }
 if(count!==965)throw Error('Unexpected pasal count: '+count);
 const counts=Object.fromEntries([...new Set(results.map(x=>x.kind))].sort().map(x=>[x,results.filter(y=>y.kind===x).length]));
 return {
  schema:'ru-classics.reference-audit.v1',
  policy:'2011 transcript preserved; MATAKIN cross-reference relationships accepted as authoritative without independent thematic review; slash N denotes ayat; 2012-style full book names in display',
  passage_count:count,reviewed_references:results.length,counts,
  compound_segmented:results.filter(r=>r.segments).length,
  compound_display_ready:results.filter(r=>r.segmentation_status==='display-ready').length,
  compound_review_only:results.filter(r=>r.segmentation_status==='review-only').length,
  // Historical field: technical citation identification, NOT a review of MATAKIN teaching links.
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
  compound_segmented:result.compound_segmented,
  compound_display_ready:result.compound_display_ready,
  compound_review_only:result.compound_review_only,
  samples:result.review_required.slice(0,15).map(x=>({id:x.passage_id,ref:x.original_reference,kind:x.kind,target:x.target_book}))
 },null,2));
}
module.exports={classify,scan,ABBREVIATED_BOOKS};
