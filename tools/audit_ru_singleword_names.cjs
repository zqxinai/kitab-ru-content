'use strict';
// Editorial triage for unpaired single-word proper names in the rendered text.
// Operates on every canonical passage; NEVER changes source content.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const reading=require('../ru-classics/reading-normalization.js');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'sishu/manifest.json'),'utf8'));
const passages=manifest.chapters.flatMap(ch=>JSON.parse(fs.readFileSync(path.join(root,ch.path),'utf8')).passages);
if(passages.length!==965)throw Error('Expected 965 passages');
const common=new Set('Nabi Guru Murid Rakyat Tuhan Siswa Raja Baginda Pangeran Putera Keluarga Pembesar Menteri Ketika Kemudian Dahulu Beliau Bila Jadi Maka Kini Lalu Tetapi Menurut Sudah Apabila Sebagai Kepada Akan Sungguh Ia Dia Yang Orang Untuk Seorang Tuan Barang Kalau Bapak Kata Ada Suatu Negeri Kitab Jalan Cinta Kasih Kebajikan Suci Kesusilaan Kebenaran Laku Bakti Benar Bukan Jawab Firman Sejati Berperi Maha Esa Dan Aku Kamu Padahal Sebuah Setiap Oleh Niscaya Sesungguhnya Dengan Bahkan Tidak Seperti Kesemuanya Tiap Demi Supaya Sebelum Sesudah Adapun Bahwa Karena Dalam Tetap Sangat Bagi Cukup Patut Kecuali Memang Bermula Banyak Kedudukan Peri Watak Tengah Sempurna Agama Bersabda Mengzi Bingcu Kongzi Zhong Yong Lun Yu Da Xue Shi Jing Si King Shu Zhou Salah Sama Hati Tahu Boleh Pagi Malam Hari Ajaran Lama Baru Artinya Pujangga Sabda Perkataan Kerajaan Perbuatan Peristiwa Itulah Bagaimanakah Biarpun Bagaimana Tiada Ujar Kalian Muridku Dialah Sikap Adakah Kemana Apakah Berapa Konghucu Khonghucu Mengapakah Hendak Sementara Sebab Selama Adalah Tatkala Namun Sesudahnya Kepandaian Sembahyang Mengatur Negara Penjelasan Pernah Sebagaimana Sebaiknya Umat Manusia Dinasti Kuil Makin Apapun Atau Justru Mereka Kita Kami Hamba Siapa Tepat Hanya Lainnya Sesungguhnya Sang'.split(/\s+/));
const capital=/(?<![\p{L}-])[\p{Lu}][\p{Ll}]{2,20}(?:-[\p{Ll}]{2,16})?/gu;
const records=new Map(),affected=new Set();
function esc(t){return t.replace(/[.*+?^$()|[\]{}\\]/g,'\\$&');}
for(const p of passages){
 const source=p.translation_indonesian||'',shown=reading.normalize(source,p.id);
 const zh=p.ruby_paragraphs.flat().map(t=>t.traditional||t.value||'').join('');
 const words=new Set();
 for(const m of source.matchAll(capital)){
  const term=m[0],i=m.index;
  if(common.has(term))continue;
  const before=source.slice(Math.max(0,i-50),i);
  if(/(?:[.!?]\s*["“'‘(]?\s*|\n\s*)$/u.test(before)||i===0)continue;
  words.add(term);
 }
 for(const term of words){
  const rx=new RegExp('(^|[^\\p{L}-])('+esc(term)+')(?=$|[^\\p{L}-])','giu');
  let unpaired=0,sample='';
  for(const m of shown.matchAll(rx)){
   const at=m.index+m[1].length,pre=shown.slice(Math.max(0,at-100),at);
   if(/\s-\s$/u.test(pre)||/\s-\s[\p{Lu}][\p{L}-]*(?:\s+[\p{Lu}][\p{L}-]*){1,2}\s*$/u.test(pre))continue;
   unpaired++;
   if(!sample)sample=shown.slice(Math.max(0,at-75),Math.min(shown.length,at+term.length+105));
  }
  if(!unpaired)continue;
  affected.add(p.id);
  const v=records.get(term)||{term,occurrences:0,passages:[],examples:[]};
  v.occurrences+=unpaired;
  if(v.passages.length<20)v.passages.push(p.id);
  if(v.examples.length<4)v.examples.push({id:p.id,sample,hanzi:zh.slice(0,750)});
  records.set(term,v);
 }
}
const candidates=[...records.values()].sort((a,b)=>b.occurrences-a.occurrences||a.term.localeCompare(b.term));
const result={schema:'ru-single-name-candidates.v1',passages_scanned:965,unique_tokens:candidates.length,passages_with_candidates:affected.size,candidates};
const dir=path.join(root,'audit/reports');fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'ru-single-word-name-candidates.json'),JSON.stringify(result,null,2)+'\n');
console.log('SINGLE_WORD_AUDIT '+JSON.stringify({passages:965,candidateTerms:candidates.length,affectedPassages:affected.size}));
for(const c of candidates.slice(0,240))console.log('SINGLE_CANDIDATE '+JSON.stringify({term:c.term,n:c.occurrences,passages:c.passages.slice(0,5),example:c.examples[0]?.sample}));
module.exports={result};
