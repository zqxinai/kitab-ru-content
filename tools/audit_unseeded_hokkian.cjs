'use strict';
/**
 * Independent discovery from actual reader output. Does not use the known-name
 * dictionary as its seed: unlike audit_legacy_romanization.cjs it can discover
 * terms that have never previously been paired with Mandarin.
 *
 * Output is an editorial triage list, never permission to replace words.
 */
const fs=require('node:fs');
const path=require('node:path');
const normalizer=require('../ru-classics/reading-normalization.js');
const DIR=path.join(__dirname,'..','sishu','chapters');
const EXPECTED={daxue:11,zhongyong:33,lunyu:20,mengzi:14};
const rows=[];
for(const [book,count] of Object.entries(EXPECTED)){
  for(let n=1;n<=count;n++){
    const file=path.join(DIR,book,String(n).padStart(2,'0')+'.json');
    const chapter=JSON.parse(fs.readFileSync(file,'utf8'));
    for(const p of chapter.passages)rows.push(p);
  }
}
if(rows.length!==965)throw Error('Expected 965 passages, got '+rows.length);
const hyphen=new Map(),short=new Map(),paren=new Map();
const ignore=/^(?:Kata-kata|Orang-orang|Anak-anak|Tiba-tiba|Hati-hati|Cita-cita|Yang-yang|Murid-murid|Saudara-saudara|Negara-negara|Daerah-daerah|Raja-raja|Nasehat-nasehat|Ajaran-ajaran|Bukan-bukan|Berhari-hari|Siswa-siswa|Hal-hal|Caca|Macam-macam)$/iu;
const ordinary=new Set(['Nabi','Guru','Murid','Rakyat','Tuhan','Siswa','Raja','Baginda','Pangeran','Putera','Keluarga','Pembesar','Menteri','Ketika','Kemudian','Dahulu','Beliau','Bila','Jadi','Maka','Kini','Lalu','Tetapi','Menurut','Sudah','Apabila','Sebagai','Kepada','Akan','Sungguh','Ia','Dia','Yang','Orang','Untuk','Seorang','Tuan','Barang','Kalau','Bapak','Kata','Ada','Suatu','Negeri','Kitab','Jalan','Cinta','Kasih','Kebajikan','Suci','Kesusilaan','Kebenaran','Laku','Bakti','Benar','Bukan','Jawab']);
function record(map,term,p,text,i){
  const old=map.get(term)||{term,count:0,refs:[],sample:''};
  old.count++;
  if(!old.refs.includes(p.id)&&old.refs.length<6)old.refs.push(p.id);
  if(!old.sample)old.sample=text.slice(Math.max(0,i-55),Math.min(text.length,i+term.length+85));
  map.set(term,old);
}
function isPaired(text,i,length){
  const before=text.slice(Math.max(0,i-7),i);
  const after=text.slice(i+length,i+length+9);
  if(/\s-\s$/.test(before)||/^\s-\s[\p{Lu}]/u.test(after))return true;
  // Hokkian portion may have several words (e.g. Kong-sun Thio);
  // require immediately preceding words and a pair separator.
  const fragment=text.slice(Math.max(0,i-68),i);
  if(/\s-\s[\p{Lu}][\p{L}-]*(?:\s+[\p{Lu}][\p{L}-]*)?\s*$/u.test(fragment))return true;
  return false;
}
for(const p of rows){
  const text=normalizer.normalize(p.translation_indonesian,p.id);
  for(const m of text.matchAll(/\b[\p{Lu}][\p{L}]{1,24}(?:-[\p{L}]{1,20}){1,3}\b/gu)){
    const t=m[0],i=m.index;
    if(ignore.test(t)||isPaired(text,i,t.length))continue;
    record(hyphen,t,p,text,i);
  }
  for(const m of text.matchAll(/\b([\p{Lu}][\p{L}]{2,22})\s+(?=bertanya|berkata|menjawab|menemui|menghadap|mengusulkan|meninggalkan|membunuh|menyuruh|menjadi|datang|mendatangi|mengutus|memerintah|mengejar|belajar|memfitnah|menolong|menunggu|memuji|mencela|membantah)\b/gu)){
    const t=m[1],i=m.index;
    if(ordinary.has(t)||isPaired(text,i,t.length))continue;
    record(short,t,p,text,i);
  }
  for(const m of text.matchAll(/\(([\p{Lu}][\p{L}-]{2,24})\)/gu)){
    const t=m[1],i=m.index+1;
    if(ordinary.has(t)||isPaired(text,i,t.length))continue;
    record(paren,t,p,text,i);
  }
}
function list(m){return [...m.values()].sort((a,b)=>b.count-a.count||a.term.localeCompare(b.term));}
const result={
 schema:'ru-classics.unseeded-name-candidates.v1',
 description:'Unseeded source-based orthography candidates; NOT proven Hokkian until Hanzi compared.',
 passageCount:rows.length,
 hyphenated:list(hyphen),singleNameBeforeVerb:list(short),parenthetical:list(paren)
};
const output=path.join(__dirname,'..','audit','reports','unseen-hokkian-candidates.json');
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log('UNSEEDED AUDIT SUMMARY '+JSON.stringify({passages:rows.length,hyphenated:hyphen.size,verbs:short.size,parentheses:paren.size}));
for(const [label,items]of [['HYPHEN',result.hyphenated],['VERB',result.singleNameBeforeVerb],['PAREN',result.parenthetical]]){
 for(const t of items.slice(0,90))console.log(label+' '+t.count+'x '+t.term+' ['+t.refs.join(', ')+'] '+t.sample.slice(0,130));
}
