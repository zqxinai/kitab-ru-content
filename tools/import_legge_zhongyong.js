#!/usr/bin/env node
'use strict';
/**
 * Deterministic Hanzi-based alignment of public-domain James Legge Zhong Yong
 * with the MATAKIN passage boundaries. Never infer a match from passage numbers.
 * Confidence >= 0.96, contiguous full passages and source units only.
 * All additions remain draft until independently reviewed.
 */
function charMap(dictionary) {
  const map=new Map();
  for(const line of dictionary.split(/\r?\n/)) {
    if(line.startsWith('#')||!line.includes('\t'))continue;
    const [from,to]=line.split('\t');
    if(from&&to)map.set(from,to.split(' ')[0]);
  }
  return map;
}
const VARIANTS={'爲':'為','衆':'眾','脩':'修','敎':'教','內':'内','后':'後','台':'臺','裡':'里'};
function normalizeHanzi(s,map) {
  return [...String(s||'').matchAll(/\p{Script=Han}/gu)]
    .map(m=>{const c=map.get(m[0])||m[0];return VARIANTS[c]||c}).join('');
}
function hanziOf(p) {
  return (p.ruby_paragraphs||[]).map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n');
}
function distance(a,b) {
  const aa=Array.from(a),bb=Array.from(b);
  if(a===b)return 0;
  let prev=Array.from({length:bb.length+1},(_,j)=>j);
  for(let i=0;i<aa.length;i++) {
    const row=[i+1];
    for(let j=0;j<bb.length;j++)
      row.push(Math.min(row[j]+1,prev[j+1]+1,prev[j]+(aa[i]===bb[j]?0:1)));
    prev=row;
  }
  return prev[bb.length];
}
function alignChapter(chapter,source,dictionary,threshold=0.96) {
  const map=charMap(dictionary);
  const src=source.units||[],ps=chapter.passages||[];
  const sNorm=src.map(u=>normalizeHanzi(u.hanzi_simplified,map));
  const pNorm=ps.map(p=>normalizeHanzi(hanziOf(p),map));
  const memo=new Map(),scoreCache=new Map();
  function similarity(i,si,j,pj){
    const key=[i,si,j,pj].join(':');
    if(scoreCache.has(key))return scoreCache.get(key);
    const a=sNorm.slice(i,si).join(''),b=pNorm.slice(j,pj).join('');
    let v=0;
    if(a.length>0&&b.length>0){
      const denominator=Math.max(a.length,b.length);
      if(Math.abs(a.length-b.length)<=denominator*(1-threshold)+1){
        v=a===b?1:1-distance(a,b)/denominator;
      }
    }
    scoreCache.set(key,v);
    return v;
  }
  function choose(i,j) {
    if(i>=src.length||j>=ps.length)
      return {score:0,matches:[]};
    const key=i+':'+j;
    if(memo.has(key))return memo.get(key);
    let best=choose(i+1,j);
    const skipP=choose(i,j+1);
    if(skipP.score>best.score)best=skipP;
    for(let ni=i+1;ni<=Math.min(src.length,i+8);ni++){
      for(let nj=j+1;nj<=Math.min(ps.length,j+16);nj++){
        const sim=similarity(i,ni,j,nj);
        if(sim<threshold)continue;
        const future=choose(ni,nj);
        // Prefer complete, minimally grouped alignments where equally valid.
        const points=future.score+100+(ni-i)*15+(nj-j)*25+sim*10;
        if(points>best.score)
          best={score:points,matches:[{si:i,ei:ni,sp:j,ep:nj,similarity:sim},...future.matches]};
      }
    }
    memo.set(key,best);return best;
  }
  const plan=choose(0,0);
  const entries=plan.matches.map(m=>{
    const ids=ps.slice(m.sp,m.ep).map(p=>p.id);
    const first=m.si+1,last=m.ei;
    const code=String(chapter.index).padStart(2,'0');
    const suffix=String(first).padStart(2,'0')+(first===last?'':'-to-'+String(last).padStart(2,'0'));
    return {
      id:'legge-zhongyong-'+code+'-'+suffix,
      indonesian_passage_ids:ids,
      english_segments:src.slice(m.si,m.ei).map((unit,k)=>({
        legge_ref:'The Doctrine of the Mean, chapter '+chapter.index+', source unit '+(first+k),
        text:unit.english_legge
      })),
      hanzi_span:ps.slice(m.sp,m.ep).map(hanziOf).join(''),
      source_hanzi_simplified:src.slice(m.si,m.ei).map(u=>u.hanzi_simplified).join(''),
      source_url:'https://confuciuspedia.com/lib/the-doctrine-of-the-mean/amp/',
      status:'draft',
      review_note:'Matched normalized Hanzi with similarity '+(m.similarity*100).toFixed(2)+
        '%. Source text checked against source snapshot; needs comparison to original James Legge edition. '+
        ids.length+' MATAKIN passage(s), '+(last-first+1)+' Legge source unit(s).'
    };
  });
  const covered=new Set(entries.flatMap(e=>e.indonesian_passage_ids));
  const sourceCovered=new Set(plan.matches.flatMap(m=>Array.from({length:m.ei-m.si},(_,k)=>m.si+k)));
  return {
    entries,
    report:{
      chapter:chapter.index,
      passages:ps.length,source_units:src.length,
      mapped_passages:covered.size,mapped_source_units:sourceCovered.size,
      unmatched_passage_ids:ps.filter(p=>!covered.has(p.id)).map(p=>p.id),
      unmatched_source_units:src.map((u,k)=>k+1).filter(k=>!sourceCovered.has(k-1)),
      mapped:entries.length
    }
  };
}
function alignBatch(chapters,sourceSnapshot,dictionary,current,threshold=0.96){
  const chapterMap=new Map(sourceSnapshot.chapters.map(c=>[c.chapter,c]));
  const next=JSON.parse(JSON.stringify(current)),report=[];
  const existingIds=new Set(next.entries.map(e=>e.id));
  const occupied=new Set(next.entries.flatMap(e=>e.indonesian_passage_ids));
  for(const chapter of chapters) {
    const source=chapterMap.get(chapter.index);
    if(!source){report.push({chapter:chapter.index,error:'Missing James Legge source'});continue}
    const aligned=alignChapter(chapter,source,dictionary,threshold);
    let added=0;
    for(const entry of aligned.entries){
      if(existingIds.has(entry.id))continue;
      if(entry.indonesian_passage_ids.some(id=>occupied.has(id)))
        throw Error('Overlapping alignment IDs in chapter '+chapter.index+': '+entry.id);
      next.entries.push(entry);existingIds.add(entry.id);
      for(const id of entry.indonesian_passage_ids)occupied.add(id);
      added++;
    }
    report.push({...aligned.report,new_entries:added});
  }
  return {alignment:next,report};
}
if(typeof module!=='undefined') module.exports={alignChapter,alignBatch,normalizeHanzi,hanziOf};
if(typeof require!=='undefined' && require.main===module){
  const fs=require('node:fs');
  const root=require('node:path').resolve(__dirname,'..');
  const read=path=>JSON.parse(fs.readFileSync(require('node:path').join(root,path),'utf8'));
  const source=read('sources/legge/zhongyong-confuciuspedia.json');
  const dictionary=fs.readFileSync(require('node:path').join(root,'tools/dictionaries/OpenCC-STCharacters.txt'),'utf8');
  const existing=read('dist/sishu-english-alignment.json');
  const chapters=Array.from({length:33},(_,i)=>read('sishu/chapters/zhongyong/'+String(i+1).padStart(2,'0')+'.json'));
  const {alignment,report}=alignBatch(chapters,source,dictionary,existing);
  fs.writeFileSync(require('node:path').join(root,'dist/sishu-english-alignment.json'),JSON.stringify(alignment,null,2)+'\n');
  console.log(JSON.stringify({report,entries:alignment.entries.length},null,2));
}
