'use strict';
// Ensure no stale translation can retain a published Final status.
function hanziOf(p){return (p.ruby_paragraphs||[]).map(row=>row.map(t=>t.type==='ruby'?(t.traditional||''):(t.value||'')).join('')).join('\n')}
function audit(bundle,alignment,registry){
 const errors=[],passages=new Map(),englishById=new Map(),alignmentIds=new Set(),reviewIds=new Set();
 for(const ch of bundle.chapters||[])for(const p of ch.passages||[]){
  if(passages.has(p.id))errors.push('Duplicate passage '+p.id);
  passages.set(p.id,p);
 }
 for(const a of alignment.entries||[]){
  if(alignmentIds.has(a.id))errors.push('Duplicate alignment '+a.id);
  alignmentIds.add(a.id);
  let hanzi='';
  for(const id of a.indonesian_passage_ids||[]){
   const p=passages.get(id);
   if(!p){errors.push('Unknown alignment passage '+id);continue}
   hanzi+=hanziOf(p);
   const entries=englishById.get(id)||[];entries.push(a);englishById.set(id,entries);
  }
  const normalize=s=>(String(s||'').match(/\p{Script=Han}/gu)||[]).join('');
  if(normalize(hanzi)!==normalize(a.hanzi_span))errors.push('Hanzi mismatch '+a.id);
  if(!a.source_url||!['draft','verified'].includes(a.status))errors.push('Invalid alignment provenance '+a.id);
  for(const seg of a.english_segments||[])if(!seg.text||!seg.legge_ref)errors.push('Missing English segment '+a.id);
 }
 function englishOf(p){
  const mapped=(englishById.get(p.id)||[]).flatMap(a=>a.english_segments||[]).map(s=>String(s.text||'').trim()).filter(Boolean).join('\n\n');
  return mapped||String(p.translation_english||'');
 }
 let finalId=0,finalEn=0;
 for(const st of registry.entries||[]){
  if(reviewIds.has(st.passage_id))errors.push('Duplicate review status '+st.passage_id);
  reviewIds.add(st.passage_id);
  const p=passages.get(st.passage_id);
  if(!p){errors.push('Unknown review passage '+st.passage_id);continue}
  if(!['review','final'].includes(st.indonesian)||!['review','final'].includes(st.english))errors.push('Invalid review status '+st.passage_id);
  if(st.indonesian!=='final'&&st.english!=='final')continue;
  if(!String(st.reviewed_by||'').trim()||!st.reviewed_at||!Number.isInteger(st.source_issue)||st.source_issue<=0)
   errors.push('Missing reviewer evidence '+st.passage_id);
  if(st.hanzi_span!==hanziOf(p))errors.push('Approved Hanzi stale '+st.passage_id);
  if(st.indonesian==='final'){
   if(!String(p.translation_indonesian||'').trim()||st.indonesian_text!==p.translation_indonesian)errors.push('Indonesian final stale '+st.passage_id);
   else finalId++;
  }
  if(st.english==='final'){
   if(!englishOf(p).trim()||st.english_text!==englishOf(p))errors.push('English final stale '+st.passage_id);
   else finalEn++;
  }
 }
 return {errors,stats:{passages:passages.size,alignments:alignmentIds.size,indonesian_final:finalId,english_final:finalEn}};
}
if(typeof module!=='undefined')module.exports={audit,hanziOf};
if(typeof require!=='undefined'&&require.main===module){
 const fs=require('node:fs'),a=process.argv.slice(2);
 const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
 try{
  const result=audit(read(a[0]||'dist/sishu-content.json'),read(a[1]||'dist/sishu-english-alignment.json'),read(a[2]||'dist/sishu-review-status.json'));
  console.log(JSON.stringify(result,null,2));if(result.errors.length)process.exitCode=1;
 }catch(e){console.error(e);process.exitCode=1}
}
