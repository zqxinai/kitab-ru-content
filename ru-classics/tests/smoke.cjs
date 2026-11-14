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
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../reading-normalization.js'),'utf8'),context,{filename:'reading-normalization.js'});
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
  assert.match(nodes.main.innerHTML,/Catatan pribadi/);
  assert.match(nodes.main.innerHTML,/Pasal berikutnya/);
  click({passage:'sishu.mengzi.14.38'});
  assert.match(nodes.main.innerHTML,/Cheng Tang - Sing Thong/);
  assert.match(nodes.main.innerHTML,/Yu - I dan Gao Yao - Koo Yau/);
  assert.match(nodes.main.innerHTML,/Taigong Wang - Thai-kong Bong/);
  assert.doesNotMatch(nodes.main.innerHTML,/SIANCAI/);
  click({passage:'sishu.lunyu.12.11'});
  assert.match(nodes.main.innerHTML,/Siancai!/);
  console.log('Ru Classics smoke test passed: Paper, 4 books, chapter, reader, Ruby, Indonesian, English');
 }catch(e){console.error(e);process.exitCode=1;}
},0);