/* Conservative presentation-only split of explicit MATAKIN subverse markers.
   The source translation remains byte-for-byte unchanged in the content bundle.
   This does NOT align Hanzi, pinyin or Legge to subverses. */
(function(scope){
  'use strict';
  const markerPattern=/(^|\s)\((\d{1,2})\)(?=\s|["“'‘])/g;
  function splitIndonesia(source){
    if(typeof source!=='string'||!source.trim())return null;
    const markers=[];
    for(const match of source.matchAll(markerPattern)){
      const number=Number(match[2]);
      if(number>1)markers.push({
        number,
        start:match.index+match[1].length,
        after:match.index+match[0].length
      });
    }
    // Do not infer any missing verse or treat a nonsequential marker as a verse.
    if(!markers.length||markers[0].number!==2||
       markers.some((m,i)=>m.number!==i+2))return null;
    const verses=[{number:1,text:source.slice(0,markers[0].start).trim()}];
    for(let i=0;i<markers.length;i++)
      verses.push({
        number:markers[i].number,
        text:source.slice(markers[i].after,markers[i+1]?.start??source.length).trim()
      });
    return verses.every(v=>v.text.length>0)?verses:null;
  }
  const api={splitIndonesia};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  scope.MatakinVerses=api;
})(typeof globalThis!=='undefined'?globalThis:this);
