/* Reading-only paragraph layout for MATAKIN and Legge.
 * No trimming, translation, punctuation rewrites, or source mutation.
 * Group sentences into readable paragraphs while preserving all bytes. */
(function(scope){
'use strict';
function paragraphs(source,locale='id'){
 if(typeof source!=='string'||!source)return [];
 const result=[];
 const segmenter=typeof Intl!=='undefined'&&typeof Intl.Segmenter==='function'?
   new Intl.Segmenter(locale==='en'?'en':'id',{granularity:'sentence'}):null;
 function addBlock(block){
   if(!block)return;
   if(!segmenter||block.length<410){result.push(block);return;}
   const sentences=[...segmenter.segment(block)].map(x=>x.segment);
   if(sentences.join('')!==block){result.push(block);return;}
   let current='',depth=0;
   for(const sentence of sentences){
     // Do not visually break inside parentheses, including MATAKIN citations.
     if(current.length>=180&&current.length+sentence.length>355&&depth===0){
       result.push(current);current='';
     }
     current+=sentence;
     for(const char of sentence){if(char==='(')depth++;else if(char===')')depth=Math.max(0,depth-1);}
   }
   if(current)result.push(current);
 }
 const separator=/\r?\n(?:[ \t]*\r?\n)+/g;
 let index=0;
 for(const m of source.matchAll(separator)){
   const before=result.length;
   addBlock(source.slice(index,m.index));
   if(result.length>before)result[result.length-1]+=m[0];
   else result.push(m[0]);
   index=m.index+m[0].length;
 }
 addBlock(source.slice(index));
 return result.length?result:[source];
}
const api=Object.freeze({paragraphs});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
scope.RuReadingLayout=api;
})(typeof globalThis!=='undefined'?globalThis:this);
