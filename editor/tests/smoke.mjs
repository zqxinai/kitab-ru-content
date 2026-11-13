import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const html=readFileSync('editor/index.html','utf8');
const code=readFileSync('editor/app.js','utf8');
const complete=JSON.parse(readFileSync('dist/sishu-content.json','utf8'));
const first=complete.chapters[0];
const selected=first.passages[0];
const fixture={
  schema:'ru-classics.content.v1',collection:'sishu',
  content_version:complete.content_version,
  books:complete.books,chapters:[first]
};
class Element {
  constructor(tag='div'){
    this.tag=tag;this.children=[];this.textContent='';this.value='';
    this.disabled=false;this.hidden=false;this.className='';
    this.classList={toggle() {},add(){},remove(){}};
    this.style={};this.dataset={};this.attributes={};
    this.events={};
  }
  get childNodes(){return this.children}
  append(...nodes){this.children.push(...nodes)}
  replaceChildren(...nodes){this.children=nodes}
  setAttribute(name,value){this.attributes[name]=value}
  addEventListener(name,fn){this.events[name]=fn}
  scrollIntoView(){}
  focus(){}
  click(){this.onclick?.()}
  input(){this.events.input?.()}
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
const elements=Object.fromEntries(ids.map(id=>[id,new Element()]));
const document={
  getElementById:id=>elements[id],
  createElement:tag=>new Element(tag),
  createTextNode:text=>({textContent:text})
};
let opened='',fetchCalls=0;const saved=new Map();
const context={
  document,
  fetch:async url=>{
    assert.equal(url,'../dist/sishu-content.json');
    fetchCalls++;
    return {ok:true,json:async()=>fixture};
  },
  localStorage:{
    getItem:key=>saved.get(key)||null,
    setItem:(key,value)=>{saved.set(key,value)}
  },
  window:{open:url=>{opened=url;return {}}},
  navigator:{clipboard:{writeText:async()=>{}}},
  confirm:()=>true,console,
  URL,encodeURIComponent
};
vm.runInNewContext(code,context,{timeout:5000,filename:'editor/app.js'});
await new Promise(resolve=>setImmediate(resolve));

assert.equal(fetchCalls,1);
assert.equal(elements.loadingView.hidden,true);
assert.equal(elements.readerView.hidden,false,'Reader failed to open: '+elements.errorMessage.textContent);
assert.equal(elements.indonesianText.textContent,selected.translation_indonesian);
assert.equal(elements.bookList.children.length,4);
assert.equal(elements.chapterList.children.length,1);
assert.equal(elements.passageList.children.length,first.passages.length);
assert.equal(elements.hanziText.children.length,selected.ruby_paragraphs.length);
const initialEnglish=selected.translation_english?.trim();
assert.equal(elements.englishText.textContent,
  initialEnglish||'Terjemahan Inggris belum tersedia atau belum disetujui untuk pasal ini.');

elements.editButton.click();
assert.equal(elements.editPanel.hidden,false);
assert.equal(elements.editIndonesian.value,selected.translation_indonesian);
elements.editIndonesian.value=selected.translation_indonesian+' Koreksi pemeriksa.';
elements.editIndonesian.input();
elements.editReason.value='Pemeriksaan makna berdasarkan Hanzi asli.';
elements.editReason.input();
assert.equal(elements.draftNotice.hidden,false);
assert.equal(elements.draftCount.textContent,'1');
elements.submitProposal.click();
assert(opened.includes('/issues/new?title='));
const target=new URL(opened);
const issueBody=target.searchParams.get('body');
assert(issueBody.includes(selected.id));
assert(issueBody.includes('Koreksi pemeriksa'));
assert(issueBody.includes('Pemeriksaan makna'));
assert.equal(elements.indonesianText.textContent,selected.translation_indonesian,
  'A proposal must not silently modify the published translation');

elements.discardDraft.click();
assert.equal(elements.draftCount.textContent,'0');
assert.equal(elements.draftNotice.hidden,true);
elements.editButton.click();
assert.equal(elements.editIndonesian.value,selected.translation_indonesian,
  'Discard must not recreate draft');

elements.searchInput.value=selected.ruby_paragraphs[0]
  .find(token=>token.type==='ruby')?.traditional||'學';
elements.searchInput.input();
assert.equal(elements.searchResults.hidden,false);
assert(elements.searchMatches.children.length>0);
elements.reloadButton.click();
await new Promise(resolve=>setImmediate(resolve));
assert.equal(fetchCalls,2,'Reload must refetch latest version');
console.log('PASS: source loads automatically, navigates, previews, edits, drafts, discards, searches and opens review proposal.');
