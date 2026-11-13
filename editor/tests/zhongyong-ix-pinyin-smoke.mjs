import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import vm from 'node:vm';
const html=readFileSync('editor/index.html','utf8'),app=readFileSync('editor/app.js','utf8');
const book=JSON.parse(readFileSync('dist/sishu-content.json','utf8')),english=JSON.parse(readFileSync('dist/sishu-english-alignment.json','utf8'));
const ch=book.chapters.find(x=>x.id==='sishu.zhongyong.10');
const fixture={schema:'ru-classics.content.v1',collection:'sishu',content_version:book.content_version,books:book.books,chapters:[ch]};
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.textContent='';this.value='';this.disabled=false;this.hidden=false;this.className='';this.classList={toggle(){},add(){},remove(){}};this.style={};this.dataset={};this.attributes={};this.events={}}
 get childNodes(){return this.children}
 append(...v){this.children.push(...v)}
 replaceChildren(...v){this.children=v}
 setAttribute(k,v){this.attributes[k]=v}
 addEventListener(k,v){this.events[k]=v}
 scrollIntoView(){}
 focus(){}
 click(){this.onclick?.()}
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
const el=Object.fromEntries(ids.map(id=>[id,new Element()]));
const doc={getElementById:id=>el[id],createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text})};
const fetch=async url=>url==='../dist/sishu-content.json'?{ok:true,json:async()=>fixture}:url==='../dist/sishu-english-alignment.json'?{ok:true,json:async()=>english}:{ok:false};
vm.runInNewContext(app,{document:doc,fetch,localStorage:{getItem:()=>null,setItem(){}},window:{open:()=>({})},navigator:{clipboard:{writeText:async()=>{}}},confirm:()=>true,console,URL,encodeURIComponent},{timeout:5000,filename:'editor/app.js'});
await new Promise(resolve=>setImmediate(resolve));
assert.equal(el.readerView.hidden,false);
assert.equal(el.hanziText.children.length,1);
el.nextButton.click();
assert.match(el.passagePosition.textContent,/Pasal 2/);
const nodes=el.hanziText.children;
assert.equal(nodes.length,2);assert.equal(nodes[0].tag,'p');
assert.equal(nodes[1].className,'textual-editorial-note textual-comparison-note');
assert.match(nodes[1].children[0].textContent,/kontekstual yú/);
assert.match(nodes[1].children[1].textContent,/Foto langsung Si Shu MATAKIN 2012/);
assert.match(nodes[1].children[2].textContent,/與平聲/);
const rubies=nodes[0].children.filter(x=>x.tag==='ruby');
assert.equal(rubies.filter(x=>x.children[0].textContent==='與'&&x.children[1].textContent==='yú').length,3);
const source=ch.passages.find(p=>p.id==='sishu.zhongyong.10.02');
assert.equal(el.indonesianText.textContent,source.translation_indonesian);
assert.match(el.englishText.textContent,/energy of the South/);
console.log('PASS: Zhong Yong IX keeps MATAKIN, renders three contextual yú pinyin and separate commentary.');
