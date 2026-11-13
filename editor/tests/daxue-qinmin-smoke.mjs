import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync('editor/index.html','utf8'),app=readFileSync('editor/app.js','utf8');
const book=JSON.parse(readFileSync('dist/sishu-content.json','utf8'));
const english=JSON.parse(readFileSync('dist/sishu-english-alignment.json','utf8'));
const chapter=book.chapters.find(ch=>ch.id==='sishu.daxue.01');
const fixture={schema:'ru-classics.content.v1',collection:'sishu',content_version:book.content_version,books:book.books,chapters:[chapter]};
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.textContent='';this.value='';this.disabled=false;this.hidden=false;this.className='';this.classList={toggle(){},add(){},remove(){}};this.style={};this.dataset={};this.attributes={};this.events={}}
 get childNodes(){return this.children}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=nodes}
 setAttribute(k,v){this.attributes[k]=v}
 addEventListener(n,fn){this.events[n]=fn}
 scrollIntoView(){}
 focus(){}
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]),el=Object.fromEntries(ids.map(id=>[id,new Element()]));
const doc={getElementById:id=>el[id],createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text})};
const fetch=async url=>{
 if(url==='../dist/sishu-content.json')return {ok:true,json:async()=>fixture};
 if(url==='../dist/sishu-english-alignment.json')return {ok:true,json:async()=>english};
 return {ok:false};
};
vm.runInNewContext(app,{document:doc,fetch,localStorage:{getItem:()=>null,setItem(){}},window:{open:()=>({})},navigator:{clipboard:{writeText:async()=>{}}},confirm:()=>true,console,URL,encodeURIComponent},{timeout:5000,filename:'editor/app.js'});
await new Promise(resolve=>setImmediate(resolve));
assert.equal(el.readerView.hidden,false,'Editor failed loading');
const nodes=el.hanziText.children;
assert.equal(nodes.length,2,'One scripture paragraph and one distinct comparison note expected');
assert.equal(nodes[0].tag,'p');
assert.equal(nodes[1].tag,'aside');
assert.equal(nodes[1].className,'textual-editorial-note textual-comparison-note');
assert.match(nodes[1].children[0].textContent,/親民 \/ 新民/);
assert.match(nodes[1].children[1].textContent,/mengasihi rakyat/);
assert.match(nodes[1].children[1].textContent,/renovate the people/);
assert.match(nodes[1].children[2].textContent,/親，當作新/);
assert.equal(el.indonesianText.textContent,chapter.passages[0].translation_indonesian);
assert.ok(el.englishText.textContent.includes('to renovate the people'));
assert.match(el.reviewDetail.textContent,/perlu review/);
console.log('PASS: Da Xue 親民 and Chengzi 新民 displayed separately; MATAKIN and Legge translations intact.');
