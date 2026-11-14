/* MATAKIN subverse display and carefully witnessed Hanzi/pinyin alignment.
 * No source text is rewritten. The passage remains the editorial unit.
 * Do not infer Hanzi alignment from Indonesian marker counts alone. */
(function(scope){
  'use strict';
  const markers=/(^|\s)\((\d{1,2})\)(?=\s|["“'‘])/g;
  const STARTS=Object.freeze({
    'sishu.mengzi.01.01':[
      '孟子見梁惠王。','王曰：“叟','孟子對曰：“王何必曰利',
      '王曰：‘何以利吾國','未有仁而遺其親者也','王亦曰仁義而已矣'
    ],
    'sishu.mengzi.10.08':['孟子謂萬章曰','以友天下之善士為未足'],
    'sishu.mengzi.10.09':['齊宣王問卿','王勃然變乎色','曰：“王勿異也','王色定']
  });
  function splitIndonesia(source){
    if(typeof source!=='string'||!source.trim())return null;
    const matches=[];
    for(const match of source.matchAll(markers)){
      const number=Number(match[2]);
      if(number>1)matches.push({number,start:match.index+match[1].length,after:match.index+match[0].length});
    }
    if(!matches.length||matches[0].number!==2||
       matches.some((m,i)=>m.number!==i+2))return null;
    const verses=[{number:1,text:source.slice(0,matches[0].start).trim()}];
    for(let i=0;i<matches.length;i++){
      const m=matches[i];
      verses.push({number:m.number,text:source.slice(m.after,matches[i+1]?.start??source.length).trim()});
    }
    return verses.every(v=>v.text)?verses:null;
  }
  const textOf=token=>token?.type==='ruby'?(token.traditional||''):(token?.value||'');
  function align(passage){
    const starts=STARTS[passage?.id];
    if(!starts||!Array.isArray(passage.ruby_paragraphs))return null;
    const indonesia=splitIndonesia(passage.translation_indonesian);
    if(!indonesia||indonesia.length!==starts.length)return null;
    const tokens=passage.ruby_paragraphs.flat();
    const startAtToken=new Map();
    let source='',offset=0;
    for(let i=0;i<tokens.length;i++){
      if(startAtToken.has(offset))return null; // prevent empty/ambiguous tokens
      startAtToken.set(offset,i);
      const value=textOf(tokens[i]);
      if(!value)return null;
      source+=value;offset+=value.length;
    }
    const boundaries=[];let cursor=0;
    for(let i=0;i<starts.length;i++){
      const start=starts[i];
      const position=source.indexOf(start,cursor);
      if(position<0||(i===0&&position!==0)||!startAtToken.has(position))return null;
      boundaries.push(startAtToken.get(position));
      cursor=position+start.length;
    }
    if(boundaries[0]!==0||boundaries.some((n,i)=>i&&n<=boundaries[i-1]))return null;
    const aligned=indonesia.map((verse,i)=>{
      const ruby_tokens=tokens.slice(boundaries[i],boundaries[i+1]??tokens.length);
      if(!ruby_tokens.length)return null;
      return {
        id:passage.id+'.'+String(verse.number).padStart(2,'0'),
        number:verse.number,
        indonesian:verse.text,
        ruby_tokens
      };
    });
    if(aligned.some(x=>!x))return null;
    if(aligned.flatMap(x=>x.ruby_tokens).map(textOf).join('')!==source)return null;
    return aligned;
  }
  const api=Object.freeze({splitIndonesia,align,alignedPassageIds:Object.freeze(Object.keys(STARTS))});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  scope.RuSubverses=api;
})(typeof globalThis!=='undefined'?globalThis:this);
