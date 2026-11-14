/* MATAKIN 2012-style reference display — manually checked pilot batch 01.
 * Original MATAKIN 2011 translation_indonesian MUST remain unchanged.
 * Replacements are keyed by stable passage ID and exact old reference string.
 * This is a presentation convention, NOT a transcription claim about
 * the printed wording of the unavailable 2012 pages. No links to subayat. */
(function(scope){
  'use strict';
  const records=Object.freeze([
    Object.freeze({"passage_id":"sishu.lunyu.18.02","source":"(S.S. XV: 14)","display":"(Sabda Suci — Lun Yu XV:14)","target_id":"sishu.lunyu.15.14","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.18.03","source":"(S.S. II: 5)","display":"(Sabda Suci — Lun Yu II:5)","target_id":"sishu.lunyu.02.05","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.18.05","source":"(S.S. IX: 9)","display":"(Sabda Suci — Lun Yu IX:9)","target_id":"sishu.lunyu.09.09","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.18.06","source":"(S.S. XIV: 39)","display":"(Sabda Suci — Lun Yu XIV:39)","target_id":"sishu.lunyu.14.39","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.18.08","source":"(S.S. V:23)","display":"(Sabda Suci — Lun Yu V:23)","target_id":"sishu.lunyu.05.23","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.daxue.05.01","source":"(SS XII: 13)","display":"(Sabda Suci — Lun Yu XII:13)","target_id":"sishu.lunyu.12.13","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.daxue.11.15","source":"(S.S.IV 3)","display":"(Sabda Suci — Lun Yu IV:3)","target_id":"sishu.lunyu.04.03","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.daxue.11.18","source":"(S.S. XIII: 26)","display":"(Sabda Suci — Lun Yu XIII:26)","target_id":"sishu.lunyu.13.26","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.daxue.11.23","source":"(Bc. IA:1)","display":"(Mengzi — Bing Cu I A:1)","target_id":"sishu.mengzi.01.01","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.01.01","source":"(AB. X:23)","display":"(Ajaran Besar — Da Xue X:23)","target_id":"sishu.daxue.11.23","decision":"presentation-only / printed 2012 phrasing not attested"})
  ]);
  const byId=new Map();
  for(const r of records){
    if(!byId.has(r.passage_id))byId.set(r.passage_id,[]);
    byId.get(r.passage_id).push(r);
  }
  function present(passageId,text){
    if(typeof text!=='string')return text;
    let result=text;
    for(const r of byId.get(passageId)||[]){
      // Exact reference match, never a global S.S. / Bc. / AB. replacement.
      if(result.includes(r.source))result=result.split(r.source).join(r.display);
    }
    return result;
  }
  const api=Object.freeze({records,present});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  scope.Matakin2012References=api;
})(typeof globalThis!=='undefined'?globalThis:this);
