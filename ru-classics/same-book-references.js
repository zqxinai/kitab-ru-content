/* Same-book Mengzi citations with explicit A/B section and chapter numbers.
 * Display-only mapping: never edits MATAKIN translations or claims a
 * four-component, unlabeled Shi Jing-style reference is Mengzi.
 * A trailing verse number is linked ONLY when that ayat exists in the
 * target MATAKIN passage. */
(function(scope){
  'use strict';
  const ROMAN=Object.freeze({I:1,II:2,III:3,IV:4,V:5,VI:6,VII:7});
  const INNER=/^\s*([IVXLCDM]{1,10})\s*\.?\s*([AB])\s*[.:]\s*(\d{1,3})(?:\s*[.:]\s*(\d{1,3}))?\s*$/i;
  const PARENS=/\(([^()\n]{1,55})\)/g;
  function parse(sourceId,inside){
    if(typeof sourceId!=='string'||!sourceId.startsWith('sishu.mengzi.'))return null;
    const m=INNER.exec(inside);
    if(!m)return null;
    const bookNumber=ROMAN[m[1].toUpperCase()];
    if(!bookNumber)return null;
    const section=m[2].toUpperCase(),number=Number(m[3]);
    const ayat=m[4]?Number(m[4]):null;
    if(!number||number>99||(ayat!==null&&(!ayat||ayat>99)))return null;
    const chapter=2*bookNumber-1+(section==='B'?1:0);
    const target_id='sishu.mengzi.'+String(chapter).padStart(2,'0')+'.'+String(number).padStart(2,'0');
    const ref=m[1].toUpperCase()+' '+section+':'+number+(ayat===null?'':'/'+ayat);
    return {text:'(Mengzi — Bing Cu '+ref+')',target_id,ayat};
  }
  function expand(passageId,parts,canNavigate){
    if(!Array.isArray(parts))return [];
    if(typeof canNavigate!=='function'||!passageId?.startsWith('sishu.mengzi.'))return parts;
    return parts.flatMap(part=>{
      if(part.target_id||typeof part.text!=='string')return [part];
      const result=[];let cursor=0;
      for(const match of part.text.matchAll(PARENS)){
        const parsed=parse(passageId,match[1]);
        if(!parsed||!canNavigate(parsed))continue;
        if(match.index>cursor)result.push({text:part.text.slice(cursor,match.index),target_id:null});
        result.push(parsed);
        cursor=match.index+match[0].length;
      }
      if(!cursor)return [part];
      if(cursor<part.text.length)result.push({text:part.text.slice(cursor),target_id:null});
      return result;
    });
  }
  const api=Object.freeze({parse,expand});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  scope.RuSameBookReferences=api;
})(typeof globalThis!=='undefined'?globalThis:this);
