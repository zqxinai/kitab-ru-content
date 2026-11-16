/* Display-only Hanzi phrase grouping for the Ru Classics reader.
 * Punctuation is read from the existing source glyphs: no wording, Hanzi,
 * pinyin, ayat numbering, or editorial provenance is altered. */
(function(scope){
'use strict';
const PAUSES=Object.freeze({
  '，':'soft', '、':'soft', '；':'soft', '：':'soft',
  ',':'soft', ';':'soft', ':':'soft',
  '。':'strong', '！':'strong', '？':'strong', '!':'strong', '?':'strong'
});
const CLOSING=new Set(['”','’','」','』','）',')','】','》','〉','〕','〗','"',"'",'»']);
const textOf=t=>t?.type==='ruby'?String(t.traditional||''):String(t?.value||'');
function explode(tokens){
  const units=[];
  for(const token of tokens){
    if(token?.type==='ruby'){units.push(token);continue;}
    if(token?.type==='text'){
      for(const char of Array.from(String(token.value||'')))units.push({type:'text',value:char});
      continue;
    }
    // Keep any unexpected editorial token intact. Never silently delete text.
    units.push(token);
  }
  return units;
}
function segment(tokens){
  if(!Array.isArray(tokens)||!tokens.length)return [];
  const units=explode(tokens),groups=[];
  let chunk=[];
  const flush=pause=>{
    if(!chunk.length)return;
    const characters=chunk.reduce((n,t)=>n+Array.from(textOf(t)).length,0);
    groups.push({tokens:chunk,pause:pause||'none',length:characters});
    chunk=[];
  };
  for(let i=0;i<units.length;i++){
    const token=units[i],character=textOf(token);
    chunk.push(token);
    const pause=PAUSES[character];
    if(!pause)continue;
    // A closing Chinese quotation belongs with the punctuation before it.
    while(i+1<units.length&&CLOSING.has(textOf(units[i+1]))){
      chunk.push(units[++i]);
    }
    flush(pause);
  }
  flush('none');
  return groups;
}
const api=Object.freeze({segment,textOf});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
scope.RuHanziLayout=api;
})(typeof globalThis!=='undefined'?globalThis:this);
