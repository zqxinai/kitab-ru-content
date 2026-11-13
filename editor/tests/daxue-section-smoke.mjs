import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync('editor/index.html','utf8'),app=readFileSync('editor/app.js','utf8'),book=JSON.parse(readFileSync('dist/sishu-content.json','utf8'));
const chapter=book.chapters.find(ch=>ch.id==='sishu.daxue.06');
const fixture={schema:'ru-classics.content.v1',collection:'sishu',content_version:book.content_version,books:book.books,chapters:[chapter]};
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.textContent='';this.value='';this.disabled=false;this.hidden=false;this.className='';this.classList={toggle(){},add(){},remove(){}};this.style={};this.dataset={};this.attributes={};this.events={}}
 get childNodes(){return this.children}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=nodes}
 setAttribute(k,v){this.attributes[k]=v}
 addEventListener(k,fn){this.events[k]=fn}
 scrollIntoView(){}
 focus(){}
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]),els=Object.fromEntries(ids.map(id=>[id,new Element()]));
const document={getElementById:id=>els[id],createElement:tag=>new Element(tag),createTextNode:s=>({textContent:s})};
const fetch=async url=>url==='../dist/sishu-content.json'?{ok:true,json:async()=>fixture}:{ok:false};
vm.runInNewContext(app,{document,fetch,localStorage:{getItem:()=>null,setItem(){}},window:{open:()=>({})},navigator:{clipboard:{writeText:async()=>{}}},confirm:()=>true,console,URL,encodeURIComponent},{timeout:5000,filename:'editor/app.js'});
await new Promise(resolve=>setImmediate(resolve));
assert.equal(els.readerView.hidden,false,'Reader failed to open');
const nodes=els.hanziText.children;
assert.equal(nodes.length,5,'Expected text, supplemental note and labels');
assert.equal(nodes[0].className,'textual-section-label');assert.match(nodes[0].textContent,/MATAKIN 2012/);
assert.equal(nodes[1].tag,'p');
assert.equal(nodes[2].className,'textual-section-label');assert.match(nodes[2].textContent,/Zhu Xi/);
assert.equal(nodes[3].tag,'aside');assert.equal(nodes[3].className,'textual-editorial-note');
assert.match(nodes[3].children[0].textContent,/bukan teks utama/);
assert.match(nodes[3].children[1].textContent,/Chengzi/);
assert.match(nodes[3].children[2].textContent,/蓋釋格物/);
assert.equal(nodes[4].tag,'p');
assert.equal(els.indonesianText.textContent,chapter.passages[0].translation_indonesian);
console.log('PASS: Da Xue V displays source text, Zhu Xi note, supplement separately, with MATAKIN translation intact.');
