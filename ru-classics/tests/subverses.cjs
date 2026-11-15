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
  assert.match(app,/if\(!verses\)return '<div class="translation-prose">'\+format\(p\.translation_indonesian/);
  assert.match(app,/const display=text=>referenceMarkup\(p\.id,text\)/);
  assert.doesNotMatch(app,/if\(!aligned\)return hanziWithSubverses/);
  assert.doesNotMatch(app,/if\(!verses\)return indonesiaWithSubverses/);
});


test('editable ayat can be selected and reassembled without changing adjacent MATAKIN text',()=>{
  const p=passage(SOURCE[0][0],SOURCE[0][1]);
  const original=p.translation_indonesian;
  const segments=api.editable(original);
  assert.equal(segments.length,6);
  for(const selected of [segments[0],segments[2],segments[5]]){
    const candidate=api.replaceVerse(original,selected.number,'Usulan pengujian ayat '+selected.number+'.');
    assert.ok(candidate);
    assert.equal(api.changedVerse(original,candidate),selected.number);
    const next=api.editable(candidate);
    assert.deepEqual(next.map(v=>v.number),segments.map(v=>v.number));
    for(let i=0;i<segments.length;i++){
      if(segments[i].number===selected.number)assert.notEqual(segments[i].text,next[i].text);
      else assert.equal(segments[i].text,next[i].text,'Unrelated ayat mutated');
    }
  }
  assert.equal(p.translation_indonesian,original,'Never modify MATAKIN source');
});
test('rejects invalid ayat edit attempts without corrupting verse markers',()=>{
  const original=passage(SOURCE[0][0],SOURCE[0][1]).translation_indonesian;
  assert.equal(api.replaceVerse(original,99,'x'),null);
  assert.equal(api.replaceVerse(original,2,' '),null);
  assert.equal(api.replaceVerse(original,2,'Teks baru (3) penanda palsu'),null);
  assert.equal(api.replaceVerse('Tidak ada penanda ayat.',1,'x'),null);
  assert.equal(api.changedVerse(original,'Teks dengan pembagian berbeda'),null);
});
test('Firebase editor and public reader can choose ayat without changing Firestore schema',()=>{
  const reader=fs.readFileSync(path.join(root,'ru-classics/app.js'),'utf8');
  const editor=fs.readFileSync(path.join(root,'ru-classics/editor.js'),'utf8');
  assert.match(reader,/data-ayat-select/);
  assert.match(reader,/startProposal\?\.\(state\.id,state\.ayat\)/);
  assert.match(editor,/id="edit-book"/);
  assert.match(editor,/id="edit-chapter"/);
  assert.match(editor,/id="edit-passage"/);
  assert.match(editor,/id="edit-ayat"/);
  assert.match(editor,/replaceVerse\(oldText,state\.verse,entryText\)/);
  assert.match(editor,/passageId:p\.id,field:state\.field,baseText:oldText,proposedText:newText/);
  assert.match(editor,/auditPanel\(\)\+editorForm\(\)\+renderEdits\(\)/);
});
