'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const bundle=JSON.parse(fs.readFileSync(path.join(__dirname,'../../ru-classics/data/sishu.json'),'utf8'));
const nodes={
 main:{innerHTML:''},
 toast:{textContent:'',classList:{add(){},remove(){}}},
 'settings-dialog':{showModal(){}},
 'about-dialog':{showModal(){}},
 'theme-options':{innerHTML:''},
 'reading-options':{innerHTML:''},
 'font-label':{textContent:''}
};
const handlers={};
const doc={
 body:{dataset:{}},
 getElementById(id){return nodes[id]||null;},
 querySelector(){return {content:''};},
 querySelectorAll(){return [];},
 addEventListener(type,fn){handlers[type]??=[];handlers[type].push(fn);}
};
let hash='#home';
const location={get hash(){return hash;},set hash(v){hash=v;}};
const page={addEventListener(){},dispatchEvent(){},scrollTo(){}};
const localStorage={getItem(){return null;},setItem(){}};
const context={document:doc,window:page,location,localStorage,console,Event,clearTimeout,setTimeout,
 fetch:async()=>({ok:true,json:async()=>bundle})};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../reference-overlay.js'),'utf8'),context,{filename:'reference-overlay.js'});
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),context,{filename:'app.js'});
function click(dataset){handlers.click[0]({target:{closest(){return {dataset};}}});}
setTimeout(()=>{
 try{
  assert.equal(doc.body.dataset.theme,'paper','Theme default should be Paper');
  assert.match(nodes.main.innerHTML,/Kitab Yang Empat/);
  assert.match(nodes.main.innerHTML,/Da Xue/);
  assert.match(nodes.main.innerHTML,/Mengzi/);
  click({book:'daxue'});
  assert.match(nodes.main.innerHTML,/Daftar bab/);
  click({chapter:'sishu.daxue.01'});
  assert.match(nodes.main.innerHTML,/Bab Utama/);
  click({passage:'sishu.daxue.01.01'});
  assert.match(nodes.main.innerHTML,/Bahasa Indonesia/);
  assert.match(nodes.main.innerHTML,/James Legge/);
  assert.match(nodes.main.innerHTML,/<ruby>/);
  assert.match(nodes.main.innerHTML,/<ruby>學<rt>xué<\/rt><\/ruby><span class="modern"[^>]*>（学）<\/span>/,
    '2012 script convention must keep simplified glyph after ruby');
  assert.doesNotMatch(nodes.main.innerHTML,/<ruby>學<span class="modern">/,
    'Pinyin must align with traditional Hanzi, not traditional plus simplified');
  assert.match(nodes.main.innerHTML,/Catatan pribadi/);
  assert.match(nodes.main.innerHTML,/Pasal berikutnya/);
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.18'});
  click({passage:'sishu.lunyu.18.06'});
  assert.match(nodes.main.innerHTML,/Sabda Suci — Lun Yu XIV:39/,'Full 2012-style book name should display');
  assert.doesNotMatch(nodes.main.innerHTML,/\\(S\\.S\\. XIV: 39\\)/,'Old abbreviated citation should not display');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.05'});
  click({passage:'sishu.lunyu.05.08'});
  assert.match(nodes.main.innerHTML,/Tengah Sempurna — Zhong Yong VIII/,
    'Owner-confirmed TS is displayed as book name without inventing a verse');
  assert.match(nodes.main.innerHTML,/Sabda Suci — Lun Yu II:6/,
    'Batch 02 SS normalized while TS remains separate');
  assert.match(nodes.main.innerHTML,/Sabda Suci — Lun Yu VI:4/,
    'Second reference in one passage remains independently normalized');
  assert.doesNotMatch(nodes.main.innerHTML,/\\(T\\.S\\. VIII\\)/,
    'Legacy T.S. VIII should not display to reader');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.16'});
  click({passage:'sishu.lunyu.16.09'});
  assert.match(nodes.main.innerHTML,/Tengah Sempurna — Zhong Yong XIX:9/,
    '2012-style TS reference should be rendered in Lun Yu XVI:9');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.12'});
  click({passage:'sishu.lunyu.12.13'});
  assert.match(nodes.main.innerHTML,/Ajaran Besar — Da Xue IV/,
    'Chapter-only A.B. IV should not invent a verse');
  click({passage:'sishu.lunyu.12.22'});
  assert.match(nodes.main.innerHTML,/Mengzi — Bing Cu VII A:46/,
    'BC should resolve to Mengzi while preserving chapter/verse numbers');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.02'});
  click({passage:'sishu.lunyu.02.03'});
  assert.match(nodes.main.innerHTML,/Mengzi — Bing Cu VII A:3/,
    'Batch 04 BC target should preserve the printed book and passage numbering');
  click({passage:'sishu.lunyu.02.05'});
  assert.match(nodes.main.innerHTML,/Sabda Suci — Lun Yu VI:22/,
    'Batch 04 SS citation with dot separator should render in canonical form');
  assert.ok(nodes.main.innerHTML.includes('(S.S. I:9; III: 1,2; XIX:5; Bc. IIIA: 2)'),
    'Composite unresolved references must remain visible and unaltered');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.03'});
  click({passage:'sishu.lunyu.03.14'});
  assert.match(nodes.main.innerHTML,/Tengah Sempurna — Zhong Yong XXVII:5/,
    'Batch 04 TS reference should map only the displayed book title');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.04'});
  click({passage:'sishu.lunyu.04.03'});
  assert.match(nodes.main.innerHTML,/Ajaran Besar — Da Xue X:15/,
    'Batch 04 A.B. should show Da Xue by printed chapter numbering');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.09'});
  click({passage:'sishu.lunyu.09.08'});
  assert.match(nodes.main.innerHTML,/Tengah Sempurna — Zhong Yong V/,
    'Batch 04 chapter-only TS reference should not invent a verse');
  // Compound citation batch: preserve each source's book without collapsing targets.
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.02'});
  click({passage:'sishu.lunyu.02.19'});
  assert.ok(nodes.main.innerHTML.includes('Tengah Sempurna — Zhong Yong XIX:1; Sabda Suci — Lun Yu III:21'),
    'Compound TS + SS book names are missing');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.05'});
  click({passage:'sishu.lunyu.05.16'});
  assert.ok(nodes.main.innerHTML.includes('Sabda Suci — Lun Yu XIV:9; Mengzi — Bing Cu IV B:2'),
    'Compound SS + BC book names are missing');
  click({passage:'sishu.lunyu.05.23'});
  assert.ok(nodes.main.innerHTML.includes('Mengzi — Bing Cu II A:2; Sabda Suci — Lun Yu VII:15'),
    'Compound BC + SS book names are missing');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.02'});
  click({passage:'sishu.lunyu.02.05'});
  assert.ok(nodes.main.innerHTML.includes('(S.S. I:9; III: 1,2; XIX:5; Bc. IIIA: 2)'),
    'Review-only compound reference should remain in its original form');
  console.log('Ru Classics smoke test passed: Paper, 4 books, chapter, reader, Ruby, Indonesian, English');
 }catch(e){console.error(e);process.exitCode=1;}
},0);