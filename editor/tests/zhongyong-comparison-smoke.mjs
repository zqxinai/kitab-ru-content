import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync('editor/index.html','utf8'),app=readFileSync('editor/app.js','utf8');
const book=JSON.parse(readFileSync('dist/sishu-content.json','utf8'));
const chapter=book.chapters.find(ch=>ch.id==='sishu.zhongyong.26');
const fixture={schema:'ru-classics.content.v1',collection:'sishu',content_version:book.content_version,books:book.books,chapters:[chapter]};
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.textContent='';this.value='';this.disabled=false;this.hidden=false;this.className='';this.classList={toggle(){},add(){},remove(){}};this.style={};this.dataset={};this.attributes={};this.events={}}
 get childNodes(){return this.children}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=nodes}
 setAttribute(n,v){this.attributes[n]=v}
 addEventListener(n,fn){this.events[n]=fn}
 scrollIntoView(){}
 focus(){}
 click(){this.onclick?.()}
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
const el=Object.fromEntries(ids.map(id=>[id,new Element()]));
const document={getElementById:id=>el[id],createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text})};
const fetch=async url=>url==='../dist/sishu-content.json'?{ok:true,json:async()=>fixture}:{ok:false};
vm.runInNewContext(app,{document,fetch,localStorage:{getItem:()=>null,setItem(){}},window:{open:()=>({})},navigator:{clipboard:{writeText:async()=>{}}},confirm:()=>true,console,URL,encodeURIComponent},{timeout:5000,filename:'editor/app.js'});
await new Promise(resolve=>setImmediate(resolve));
assert.equal(el.readerView.hidden,false,'Unable to load reader');
// Initial selection is XXV:1; the next button selects XXV:2.
el.nextButton.click();
assert.equal(el.passagePosition.textContent.startsWith('Pasal 2'),true,'Wrong passage selected');
const nodes=el.hanziText.children;
assert.equal(nodes.length,3,'Two scripture paragraphs and one comparison note');
assert.equal(nodes[0].tag,'p');assert.equal(nodes[1].tag,'p');
assert.equal(nodes[2].tag,'aside');
assert.equal(nodes[2].className,'textual-editorial-note textual-comparison-note');
assert.match(nodes[2].children[0].textContent,/bukan terjemahan MATAKIN/);
assert.match(nodes[2].children[1].textContent,/menghimpun banyak pengetahuan/);
assert.match(nodes[2].children[2].textContent,/徵，驗於外也/);
const ref=chapter.passages.find(p=>p.id==='sishu.zhongyong.26.02');
assert.equal(el.indonesianText.textContent,ref.translation_indonesian);
assert.ok(el.englishText.textContent.includes('Continuing long, it evidences itself'));
console.log('PASS: Zhong Yong XXV:2 comparison note appears outside original Hanzi and Indonesian translations remain unchanged.');
