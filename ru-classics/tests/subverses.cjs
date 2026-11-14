'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const api=require('../subverses.js');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const passage=(file,id)=>read(file).passages.find(p=>p.id===id);
const SOURCE=[
  ['sishu/chapters/mengzi/01.json','sishu.mengzi.01.01',6],
  ['sishu/chapters/mengzi/10.json','sishu.mengzi.10.08',2],
  ['sishu/chapters/mengzi/10.json','sishu.mengzi.10.09',4]
];
const hanzi=tokens=>tokens.map(t=>t.traditional||t.value||'').join('');

for(const [file,id,count] of SOURCE){
  test(id+' aligns Indonesian and ruby Hanzi in '+count+' source-numbered ayat',()=>{
    const p=passage(file,id);
    const originalText=p.translation_indonesian;
    const originalRuby=JSON.stringify(p.ruby_paragraphs);
    const result=api.align(p);
    assert.ok(result,id+' returned no alignment');
    assert.equal(result.length,count);
    assert.deepEqual(result.map(x=>x.number),Array.from({length:count},(_,i)=>i+1));
    assert.deepEqual(result.map(x=>x.id),Array.from({length:count},(_,i)=>id+'.'+String(i+1).padStart(2,'0')));
    assert.deepEqual(result.map(x=>x.indonesian),api.splitIndonesia(originalText).map(x=>x.text));
    assert.equal(result.map(v=>hanzi(v.ruby_tokens)).join(''),hanzi(p.ruby_paragraphs.flat()));
    for(const x of result)assert.ok(x.ruby_tokens.every(t=>t.type==='ruby'?!!t.pinyin:typeof t.value==='string'));
    assert.equal(p.translation_indonesian,originalText,'MATAKIN translation mutated');
    assert.equal(JSON.stringify(p.ruby_paragraphs),originalRuby,'Hanzi/pinyin tokens mutated');
  });
}

test('reference citations and invalid marker sequences are not treated as ayat',()=>{
  const good=api.splitIndonesia('Satu (AB. X:23) (2) Dua (3) Tiga');
  assert.equal(good.length,3);
  assert.match(good[0].text,/\(AB\. X:23\)/);
  assert.equal(api.splitIndonesia('Satu (2) Dua (4) Empat'),null);
  assert.equal(api.splitIndonesia('Ayat satu saja'),null);
  assert.equal(api.splitIndonesia('Satu (3) Tiga'),null);
});
test('an unexpected Hanzi revision fails closed rather than silently misaligning pinyin',()=>{
  const p=JSON.parse(JSON.stringify(passage(SOURCE[0][0],SOURCE[0][1])));
  p.ruby_paragraphs[0][0].traditional='孔';
  assert.equal(api.align(p),null);
  assert.equal(api.align({...p,id:'sishu.unknown.01.01'}),null);
  p.ruby_paragraphs=passage(SOURCE[0][0],SOURCE[0][1]).ruby_paragraphs;
  p.translation_indonesian='Only one verse';
  assert.equal(api.align(p),null);
});

test('public reader loads alignment module and actually renders numbered ruby and Indonesian ayat',()=>{
  const html=fs.readFileSync(path.join(root,'ru-classics/index.html'),'utf8');
  const app=fs.readFileSync(path.join(root,'ru-classics/app.js'),'utf8');
  assert.match(html,/<script src="\.\/subverses\.js" defer><\/script>/);
  assert.ok(html.indexOf('src="./subverses.js"')<html.indexOf('src="./app.js"'),'Load module before reader');
  assert.match(app,/const aligned=globalThis\.RuSubverses\?\.align\(p\)\|\|null/);
  assert.match(app,/\+hanziWithSubverses\(p,aligned\)\+'<\/div>'/);
  assert.match(app,/\+indonesiaWithSubverses\(p,aligned\)\+'<\/section>'/);
  assert.match(app,/if\(!aligned\)return ruby\(p\.ruby_paragraphs\)/);
  assert.match(app,/if\(!verses\)return '<p>'\+H\(p\.translation_indonesian/);
  assert.doesNotMatch(app,/if\(!aligned\)return hanziWithSubverses/);
  assert.doesNotMatch(app,/if\(!verses\)return indonesiaWithSubverses/);
});
