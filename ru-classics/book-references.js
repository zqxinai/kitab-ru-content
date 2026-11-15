/* Conservative book-aware Si Shu cross-references (MATAKIN display layer).
 * An explicit SS/AB/TS/BC book label is authoritative even when the
 * referencing passage belongs to a different book. A semicolon may inherit
 * its preceding book only inside the SAME parenthetical citation.
 *
 * Source translations, existing approved overlays and attribution remain
 * untouched. We never infer an external Shi Jing/Shu Jing/Li Ji numeral
 * from an unlabelled four-part reference.
 */
(function(scope){
  'use strict';
  const BOOKS=Object.freeze({
    lunyu:{title:'Sabda Suci — Lun Yu',short:'Lun Yu',maxChapter:20,offset:0},
    daxue:{title:'Ajaran Besar — Da Xue',short:'Da Xue',maxChapter:10,offset:1},
    zhongyong:{title:'Tengah Sempurna — Zhong Yong',short:'Zhong Yong',maxChapter:32,offset:1},
    mengzi:{title:'Mengzi — Bing Cu',short:'Bing Cu',maxChapter:7,offset:0}
  });
  const ALIASES=Object.freeze({ss:'lunyu',ab:'daxue',ts:'zhongyong',bc:'mengzi'});
  const ABBR=/^\s*(S\s*\.?\s*S|A\s*\.?\s*B|T\s*\.?\s*S|B\s*\.?\s*C)\s*\.?\s*/i;
  const LONG=/^\s*(Sabda Suci\s*[—-]\s*Lun Yu|Ajaran Besar\s*[—-]\s*Da Xue|Tengah Sempurna\s*[—-]\s*Zhong Yong|Mengzi\s*[—-]\s*Bing Cu)\s*/i;
  const PARENS=/\(([^()\n]{1,160})\)/g;
  // Split on semicolons and commas introducing another explicit book alias.
  // A comma separating two passages (III:1,2) stays within one group.
  const DELIMITER=/(;\s*|,\s*(?=(?:S\s*\.?\s*S|A\s*\.?\s*B|T\s*\.?\s*S|B\s*\.?\s*C)\s*\.?\s*))/i;
  const SIMPLE=/^([IVXLCDM]{1,10})(?:\s*[:.]\s*|\s+)(\d{1,2})(?:\s*([/.])\s*(\d{1,2}))?((?:\s*,\s*\d{1,2})*)$/i;
  const MENGZI=/^([IVXLCDM]{1,10})\s*\.?\s*([AB])(?:\s*[:.]\s*|\s+)(\d{1,2})(?:\s*([/.])\s*(\d{1,2}))?((?:\s*,\s*\d{1,2})*)$/i;
  function roman(n){
    const values=[[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    let answer='';for(const [value,symbol] of values)while(n>=value){answer+=symbol;n-=value;}
    return answer;
  }
  function chapterNumber(code,max){
    if(!/^[IVXLCDM]{1,10}$/i.test(code))return null;
    const symbol=code.toUpperCase();
    for(let i=1;i<=max;i++)if(roman(i)===symbol)return i;
    return null;
  }
  function parseGroup(group,inheritedBook){
    const leading=group.match(/^\s*/)[0],trailing=group.match(/\s*$/)[0];
    let body=group.trim(), book=inheritedBook, explicit=false;
    const abbr=ABBR.exec(body),long=abbr?null:LONG.exec(body);
    if(abbr){
      book=ALIASES[abbr[1].replace(/[^a-z]/gi,'').toLowerCase()];
      body=body.slice(abbr[0].length).trim();
      explicit=true;
    } else if(long){
      book=Object.keys(BOOKS).find(k=>BOOKS[k].title.toLowerCase()===long[1].replace(/\s+/g,' ').toLowerCase());
      body=body.slice(long[0].length).trim();
      explicit=true;
    }
    if(!book||!BOOKS[book])return null;
    const match=(book==='mengzi'?MENGZI:SIMPLE).exec(body);
    if(!match)return null;
    const prefix=BOOKS[book];
    const code=match[1].toUpperCase(),ch=chapterNumber(code,prefix.maxChapter);
    if(ch===null)return null;
    const section=book==='mengzi'?match[2].toUpperCase():null;
    const number=Number(match[book==='mengzi'?3:2]);
    const verseToken=match[book==='mengzi'?5:4];
    const ayat=verseToken===undefined?null:Number(verseToken);
    const extra=match[book==='mengzi'?6:5]||'';
    if(!number||!ayat&&verseToken!==undefined||number>99)return null;
    const numbers=[number,...[...extra.matchAll(/\d{1,2}/g)].map(x=>Number(x[0]))];
    if(numbers.some(n=>!n||n>99)||ayat!==null&&numbers.length>1)return null;
    const chapter=book==='mengzi'?(ch*2-1+(section==='B'?1:0)):(ch+prefix.offset);
    const head=book==='mengzi'?code+' '+section:code;
    const refs=numbers.map(n=>({
      target_id:'sishu.'+book+'.'+String(chapter).padStart(2,'0')+'.'+String(n).padStart(2,'0'),
      ayat:n===number?ayat:null,
      number:n
    }));
    if(!refs.length)return null;
    const label=(explicit?prefix.title:prefix.short)+' '+head+':'+number+(ayat===null?'':'/'+ayat);
    const parts=[{text:leading+label,target_id:refs[0].target_id,ayat:refs[0].ayat}];
    for(let i=1;i<refs.length;i++){
      parts.push({text:', ',target_id:null});
      parts.push({text:String(refs[i].number),target_id:refs[i].target_id,ayat:null});
    }
    if(trailing)parts.push({text:trailing,target_id:null});
    return {book,refs,parts};
  }
  function inner(raw,canNavigate){
    const pieces=raw.split(DELIMITER);
    let lastBook=null,any=false;
    const output=[];
    for(let i=0;i<pieces.length;i++){
      if(i%2){
        output.push({text:pieces[i],target_id:null});
        continue;
      }
      const parsed=parseGroup(pieces[i],lastBook);
      if(!parsed){
        output.push({text:pieces[i],target_id:null});
        lastBook=null;
        continue;
      }
      // Context inheritance is lexical, not a semantic inference.
      lastBook=parsed.book;
      if(parsed.refs.every(canNavigate)){
        any=true;
        output.push(...parsed.parts);
      }else{
        output.push({text:pieces[i],target_id:null});
      }
    }
    return any?output:null;
  }
  function expand(parts,canNavigate){
    if(!Array.isArray(parts))return [];
    if(typeof canNavigate!=='function')return parts;
    return parts.flatMap(part=>{
      if(part.target_id||typeof part.text!=='string')return [part];
      const results=[];let cursor=0;
      for(const m of part.text.matchAll(PARENS)){
        const parsed=inner(m[1],canNavigate);
        if(!parsed)continue;
        if(m.index>cursor)results.push({text:part.text.slice(cursor,m.index),target_id:null});
        results.push({text:'(',target_id:null},...parsed,{text:')',target_id:null});
        cursor=m.index+m[0].length;
      }
      if(!cursor)return [part];
      if(cursor<part.text.length)results.push({text:part.text.slice(cursor),target_id:null});
      return results;
    });
  }
  const api=Object.freeze({BOOKS,parseGroup,inner,expand});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  scope.RuBookReferences=api;
})(typeof globalThis!=='undefined'?globalThis:this);
