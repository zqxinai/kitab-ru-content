/* Ru Classics character dictionary: curated Indonesian + Unicode Unihan English fallback.
 * Self-contained curated starter glossary; not an authoritative classical dictionary.
 * Do not infer character meanings from MATAKIN/Legge translations, and do not use
 * these notes to rewrite canonical Si Shu text or cited references.
 * Romanization always comes from the source ruby token; not from this glossary.
 */
(function(scope){
'use strict';
const ENTRIES=Object.freeze({
  "子": {
    "gloss": "anak; sapaan kehormatan untuk seorang guru atau tokoh",
    "note": "Dalam 子曰, 子 merujuk pada Sang Guru (Kongzi)."
  },
  "曰": {
    "gloss": "berkata; bersabda",
    "note": "Lazim dipakai untuk memperkenalkan ucapan dalam naskah klasik."
  },
  "學": {
    "gloss": "belajar; mempelajari",
    "note": "Dapat menjadi bagian kata majemuk seperti 大學."
  },
  "而": {
    "gloss": "dan; lalu; tetapi (sesuai struktur kalimat)",
    "note": "Kata penghubung yang sering muncul dalam bahasa Tionghoa klasik."
  },
  "時": {
    "gloss": "waktu; pada waktunya",
    "note": "Makna tepat ditentukan oleh struktur frasa."
  },
  "習": {
    "gloss": "berlatih; mengulang pelajaran",
    "note": "Dalam 學而時習之 berkaitan dengan mengulang dan melatih pelajaran."
  },
  "之": {
    "gloss": "ini/itu; milik; penanda tata bahasa",
    "note": "Fungsinya bergantung pada susunan kalimat klasik."
  },
  "不": {
    "gloss": "tidak",
    "note": "Penanda negasi yang umum."
  },
  "亦": {
    "gloss": "juga; pula",
    "note": "Sering membentuk pola retoris 不亦…乎."
  },
  "說": {
    "gloss": "berbicara; menjelaskan; gembira pada bacaan yuè",
    "note": "Karakter ini memiliki lebih dari satu bacaan dan makna."
  },
  "乎": {
    "gloss": "partikel tanya atau seruan",
    "note": "Sering muncul di akhir pertanyaan retoris."
  },
  "有": {
    "gloss": "ada; mempunyai",
    "note": ""
  },
  "朋": {
    "gloss": "teman; sahabat",
    "note": ""
  },
  "自": {
    "gloss": "dari; sendiri",
    "note": ""
  },
  "遠": {
    "gloss": "jauh",
    "note": ""
  },
  "方": {
    "gloss": "arah; tempat; cara",
    "note": ""
  },
  "來": {
    "gloss": "datang",
    "note": ""
  },
  "樂": {
    "gloss": "gembira; kesenangan; musik",
    "note": "Bacaan lè berkaitan dengan kesenangan, sedangkan yuè dengan musik."
  },
  "人": {
    "gloss": "manusia; orang",
    "note": ""
  },
  "知": {
    "gloss": "mengetahui; memahami",
    "note": ""
  },
  "慍": {
    "gloss": "marah; kesal; menyimpan kejengkelan",
    "note": ""
  },
  "君": {
    "gloss": "pemimpin; penguasa; sosok terhormat",
    "note": "Dalam 君子, bagian dari istilah yang tidak dapat diterjemahkan huruf demi huruf."
  },
  "仁": {
    "gloss": "cinta kasih; kebajikan kemanusiaan",
    "note": "Konsep pokok ajaran Ru; makna kontekstual membutuhkan pembacaan keseluruhan bagian."
  },
  "義": {
    "gloss": "kebenaran moral; kepatutan",
    "note": "Konsep etis dalam ajaran Ru."
  },
  "禮": {
    "gloss": "kesusilaan; tata ritual; kesopanan",
    "note": "Makna klasiknya lebih luas dari upacara."
  },
  "道": {
    "gloss": "jalan; prinsip; Jalan Suci",
    "note": "Bisa bersifat harfiah atau filsafati."
  },
  "天": {
    "gloss": "langit; Tian",
    "note": "Penafsirannya harus memperhatikan konteks naskah."
  },
  "心": {
    "gloss": "hati; batin; pikiran",
    "note": "Dalam naskah klasik dapat mencakup perasaan dan pertimbangan."
  },
  "性": {
    "gloss": "watak; kodrat",
    "note": ""
  },
  "善": {
    "gloss": "baik; kebaikan",
    "note": ""
  },
  "孟": {
    "gloss": "urutan tertua; unsur nama Mengzi",
    "note": "Tidak diterjemahkan sebagai kata biasa saat menjadi nama orang."
  },
  "王": {
    "gloss": "raja; penguasa",
    "note": ""
  },
  "民": {
    "gloss": "rakyat; masyarakat",
    "note": ""
  },
  "國": {
    "gloss": "negeri; negara",
    "note": ""
  },
  "德": {
    "gloss": "kebajikan; daya moral",
    "note": ""
  },
  "明": {
    "gloss": "terang; jelas; menerangi",
    "note": ""
  },
  "大": {
    "gloss": "besar; agung",
    "note": ""
  },
  "中": {
    "gloss": "tengah; keseimbangan",
    "note": ""
  },
  "庸": {
    "gloss": "tetap; lazim; penerapan yang ajek",
    "note": "Dalam 中庸 perlu dibaca sebagai nama konsep/kitab, bukan arti huruf terpisah."
  },
  "信": {
    "gloss": "percaya; dapat dipercaya; ketulusan",
    "note": ""
  },
  "孝": {
    "gloss": "bakti kepada orang tua",
    "note": ""
  },
  "弟": {
    "gloss": "adik; persaudaraan yang hormat",
    "note": "Dalam 孝弟 berkaitan dengan perilaku dalam hubungan keluarga."
  },
  "友": {
    "gloss": "sahabat; bersahabat",
    "note": ""
  },
  "臣": {
    "gloss": "menteri; pejabat; bawahan penguasa",
    "note": ""
  },
  "父": {
    "gloss": "ayah",
    "note": ""
  },
  "母": {
    "gloss": "ibu",
    "note": ""
  },
  "行": {
    "gloss": "berjalan; menjalankan; perilaku",
    "note": ""
  },
  "言": {
    "gloss": "ucapan; berkata",
    "note": ""
  },
  "見": {
    "gloss": "melihat; menemui",
    "note": ""
  },
  "聞": {
    "gloss": "mendengar; mengetahui dari kabar",
    "note": ""
  },
  "聖": {
    "gloss": "arif-bijaksana; suci",
    "note": ""
  },
  "賢": {
    "gloss": "berbudi luhur; cakap",
    "note": ""
  },
  "過": {
    "gloss": "kesalahan; melewati; melampaui",
    "note": ""
  },
  "勇": {
    "gloss": "berani; keberanian",
    "note": ""
  },
  "教": {
    "gloss": "mengajar; pengajaran",
    "note": ""
  },
  "為": {
    "gloss": "melakukan; menjadi; demi (bergantung bacaan)",
    "note": "Bisa dibaca wéi atau wèi."
  },
  "無": {
    "gloss": "tidak ada; tanpa",
    "note": ""
  },
  "得": {
    "gloss": "memperoleh; mampu; mendapat",
    "note": ""
  },
  "氣": {
    "gloss": "napas; qi; energi dalam istilah klasik",
    "note": "Pengertian filsafatinya memerlukan konteks."
  },
  "公": {
    "gloss": "umum; publik; gelar kehormatan",
    "note": ""
  },
  "生": {
    "gloss": "lahir; hidup; tumbuh",
    "note": ""
  },
  "死": {
    "gloss": "mati; kematian",
    "note": ""
  }
});
const CONTEXT=Object.freeze({
  "sishu.lunyu.01.01": {
    "學": "Dalam 學而時習之, mengacu pada kegiatan belajar yang dilatih atau diulang.",
    "樂": "Dalam 不亦樂乎, menyatakan kegembiraan. Bacaan yang dipakai dalam ayat ini adalah lè.",
    "說": "Dalam 不亦說乎, bentuk 說 dibaca yuè dan bermakna gembira, bukan 'mengucapkan'."
  },
  "sishu.daxue.01.01": {
    "德": "Dalam 明明德, bagian dari gagasan menerangi atau menggemilangkan kebajikan."
  },
  "sishu.mengzi.01.01": {
    "義": "Mengzi mempertentangkan mengejar keuntungan dengan 仁義 dalam pembahasan ini."
  }
});
const PROVENANCE='Glosarium editorial awal Ru Classics (belum ditinjau akademik).';
let extended=null;
let metadata=null;
function installUnihan(payload){
 if(!payload||payload.schema!=='ru-classics.unihan-glossary.v1'||
    payload.license!=='Unicode-3.0'||payload.language!=='en'||
    !payload.definitions||typeof payload.definitions!=='object'||Array.isArray(payload.definitions)||
    !Number.isInteger(payload.total_unique_characters)||!Number.isInteger(payload.covered_unique_characters)){
   return false;
 }
 const entries=Object.entries(payload.definitions);
 if(entries.length!==payload.covered_unique_characters||entries.some(([char,gloss])=>
    [...char].length!==1||typeof gloss!=='string'||!gloss.trim()))return false;
 const source=String(payload.source||'').slice(0,120);
 const sourceUrl=String(payload.source_url||'');
 if(!source.startsWith('Unicode Unihan')||
    !['https://www.unicode.org/Public/17.0.0/ucd/Unihan.zip',
      'https://raw.githubusercontent.com/unicode-org/unihan-database/main/kDefinition.txt'].includes(sourceUrl))return false;
 extended=Object.assign(Object.create(null),payload.definitions);
 metadata=Object.freeze({
   total:payload.total_unique_characters,
   covered:payload.covered_unique_characters,
   source,sourceUrl,
   license:'Unicode-3.0'
 });
 return true;
}
function lookup(char, passageId){
 const entry=Object.prototype.hasOwnProperty.call(ENTRIES,char)?ENTRIES[char]:null;
 const context=Object.prototype.hasOwnProperty.call(CONTEXT,passageId)?CONTEXT[passageId]?.[char]:null;
 const english=extended&&Object.prototype.hasOwnProperty.call(extended,char)?extended[char]:null;
 return {
   char,gloss:entry?.gloss||null,note:entry?.note||null,
   context:context||null,source:entry||context?PROVENANCE:null,
   englishGloss:english||null,
   englishSource:english?(metadata?.source+' · Unicode-3.0'):null
 };
}
function coverage(){return metadata;}
const api=Object.freeze({lookup,installUnihan,coverage,
  entryCount:Object.keys(ENTRIES).length,
  contextCount:Object.values(CONTEXT).reduce((n,x)=>n+Object.keys(x).length,0)});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
scope.RuCharacterDictionary=api;
})(typeof globalThis!=='undefined'?globalThis:this);
