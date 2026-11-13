import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync('editor/index.html','utf8'),code=readFileSync('editor/app.js','utf8');
const bundle=JSON.parse(readFileSync('dist/sishu-content.json','utf8'));
const english=JSON.parse(readFileSync('dist/sishu-english-alignment.json','utf8'));
const chapter=bundle.chapters.find(c=>c.id==='sishu.lunyu.14');
const target=chapter.passages.find(p=>p.id==='sishu.lunyu.14.39');
const one={...chapter,passages:[target]};
const fixture={schema:'ru-classics.content.v1',collection:'sishu',content_version:bundle.content_version,books:bundle.books,chapters:[one]};
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.textContent='';this.value='';this.disabled=false;this.hidden=false;this.className='';this.classList={toggle(){},add(){},remove(){}};this.style={};this.dataset={};this.attributes={};this.events={}}
 get childNodes(){return this.children}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=children}
 setAttribute(name,value){this.attributes[name]=value}
 addEventListener(name,fn){this.events[name]=fn}
 scrollIntoView(){}
 focus(){}
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
const el=Object.fromEntries(ids.map(id=>[id,new Element()]));
const document={getElementById:id=>el[id],createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text})};
const fetch=async url=>{
 if(url==='../dist/sishu-content.json')return {ok:true,json:async()=>fixture};
 if(url==='../dist/sishu-english-alignment.json')return {ok:true,json:async()=>english};
 return {ok:false};
};
vm.runInNewContext(code,{document,fetch,localStorage:{getItem:()=>null,setItem(){}},window:{open:()=>({})},navigator:{clipboard:{writeText:async()=>{}}},confirm:()=>true,console,URL,encodeURIComponent},{timeout:5000,filename:'editor/app.js'});
await new Promise(resolve=>setImmediate(resolve));
assert.equal(el.readerView.hidden,false);
assert.match(el.passagePosition.textContent,/Pasal 39/);
const nodes=el.hanziText.children;
assert.equal(nodes.length,2);
assert.equal(nodes[0].tag,'p');assert.equal(nodes[1].tag,'aside');
assert.equal(nodes[1].className,'textual-editorial-note textual-comparison-note');
assert.match(nodes[1].children[0].textContent,/己 \/ 已/);
assert.match(nodes[1].children[1].textContent,/jǐ/);
assert.match(nodes[1].children[2].textContent,/斯已而已矣/);
assert.equal(el.indonesianText.textContent,target.translation_indonesian);
assert.match(el.englishText.textContent,/give over his wish/);
assert.match(el.reviewDetail.textContent,/perlu review/);
console.log('PASS: Lun Yu XIV:39 keeps MATAKIN text, labels WYG variant and displays original Legge English.');
