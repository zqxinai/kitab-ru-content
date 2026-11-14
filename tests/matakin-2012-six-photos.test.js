'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const get=(path,num)=>read(path).passages.find(p=>p.number===num);
const hanzi=p=>p.ruby_paragraphs.map(row=>row.map(x=>x.traditional||x.value||'').join('')).join('\n');
const rubies=p=>p.ruby_paragraphs.flat().filter(x=>x.type==='ruby');
const align=read('dist/sishu-english-alignment.json');
const byId=id=>align.entries.find(e=>e.indonesian_passage_ids.length===1&&e.indonesian_passage_ids[0]===id);
test('Lun Yu XVIII:11 2012 print uses 适 gua and paired Mandarin-Hokkian names',()=>{
 const p=get('sishu/chapters/lunyu/18.json',11);
 assert.match(hanzi(p),/伯适/);assert.doesNotMatch(hanzi(p),/伯適/);
 assert.ok(rubies(p).some(t=>t.traditional==='适'&&t.pinyin==='guā'));
 for(const pair of ['Bo Da - Pik Tat','Bo Gua - Pik Khwat','Zhong Tu - Tiong Tut','Zhong Hu - Tiong Hut','Shu Ye - Siok Ya','Shu Xia - Siok He','Ji Sui - Kwi Si','Ji Gua - Kwi Wa'])assert.ok(p.translation_indonesian.includes(pair),pair);
 assert.equal(p.editorial_status,'unverified-draft');
});
test('Da Xue X:5 printed 監, X:14 printed 壹個, historical Legge source remains separate',()=>{
 const p5=get('sishu/chapters/daxue/11.json',5),p14=get('sishu/chapters/daxue/11.json',14);
 assert.match(hanzi(p5),/儀監於殷/);assert.doesNotMatch(hanzi(p5),/儀鑒/);
 assert.ok(rubies(p5).some(t=>t.traditional==='監'&&t.modern==='监'&&t.pinyin==='jiàn'));
 assert.match(hanzi(p14),/若有壹個臣/);assert.doesNotMatch(hanzi(p14),/若有一介臣/);
 assert.ok(rubies(p14).some(t=>t.traditional==='壹'&&t.pinyin==='yī'));
 assert.ok(rubies(p14).some(t=>t.traditional==='個'&&t.pinyin==='gè'));
 assert.equal(byId(p5.id).hanzi_span,hanzi(p5));
 assert.equal(byId(p14.id).hanzi_span,hanzi(p14));
 assert.match(byId(p5.id).review_note,/MATAKIN 2012/);
 assert.match(byId(p14.id).review_note,/MATAKIN 2012/);
 for(const pair of ['Shi Jing - Si King','Yin - Ien','Tian - Thian'])assert.match(p5.translation_indonesian,new RegExp(pair));
 assert.match(get('sishu/chapters/daxue/11.json',12).translation_indonesian,/Kitab Kerajaan Chu - Cho/);
 assert.match(get('sishu/chapters/daxue/11.json',13).translation_indonesian,/Jiu Fan - Kiu Hwan/);
});
test('Zhong Yong XIII:4 uses si ming; Mengzi VB:9 has Xuan-Swan; Da Xue main 親民 supported',()=>{
 const z4=get('sishu/chapters/zhongyong/14.json',4);
 assert.ok(rubies(z4).some(t=>t.traditional==='俟'&&t.pinyin==='sì'));
 assert.match(z4.translation_indonesian,/Xiao Ren - Siau Jien/);
 assert.match(get('sishu/chapters/zhongyong/14.json',3).translation_indonesian,/Tian - Thian/);
 assert.match(get('sishu/chapters/mengzi/10.json',9).translation_indonesian,/Xuan - Swan/);
 const d1=get('sishu/chapters/daxue/01.json',1);
 assert.match(hanzi(d1),/親民/);assert.match(d1.editorial_annotations[0].edition_caveat,/telah diperiksa/);
});
test('965 pasal and 78 bab remain unapproved after photographed corrections',()=>{
 const book=read('dist/sishu-content.json'),passages=book.chapters.flatMap(c=>c.passages);
 assert.equal(book.chapters.length,78);assert.equal(passages.length,965);
 const current=new Map(passages.map(p=>[p.id,p]));
 for(const [path,nums] of [['sishu/chapters/lunyu/18.json',[11]],['sishu/chapters/zhongyong/14.json',[3,4]],['sishu/chapters/daxue/11.json',[5,6,12,13,14]],['sishu/chapters/daxue/01.json',[1]],['sishu/chapters/mengzi/10.json',[9]]])for(const n of nums){const p=get(path,n);assert.deepEqual(current.get(p.id),p);assert.equal(p.editorial_status,'unverified-draft')}
});
