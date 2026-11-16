'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const overlay=require('../reference-overlay.js');
const links=require('../reference-links.js');
const layout=require('../reading-layout.js');
const hanziLayout=require('../hanzi-layout.js');
const characterDictionary=require('../character-dictionary.js');
const verses=require('../subverses.js');
const sameBook=require('../same-book-references.js');
const namedBooks=require('../book-references.js');
const chapters=[
  load('sishu/chapters/mengzi/01.json'),
  load('sishu/chapters/mengzi/03.json')
];
const sources=[1,2,3].map(i=>load('sources/references/matakin-compound-batch0'+i+'.json'));
const originals=sources.flatMap(x=>x.entries);
/* The source inventory retains its historical display labels.
 * The live reader standardizes book labels without touching passage IDs. */
const canonicalDisplay=s=>s
  .replaceAll('Sabda Suci — Lun Yu','Lunyu - Sabda Suci')
  .replaceAll('Ajaran Besar — Da Xue','Daxue - Ajaran Besar')
  .replaceAll('Tengah Sempurna — Zhong Yong','Zhongyong - Tengah Sempurna')
  .replaceAll('Mengzi — Bing Cu','Mengzi - Bingcu');
test('Every approved MATAKIN compound keeps its exact display while exposing verified passage targets',()=>{
  assert.equal(originals.length,29);
  let total=0;
  for(const entry of originals){
    const source=overlay.records.find(r=>r.passage_id===entry.passage_id&&r.source===entry.source);
    assert.ok(source,entry.passage_id+' missing overlay record');
    const parts=links.parts(entry.passage_id,entry.source,overlay);
    assert.equal(parts.map(p=>p.text).join(''),canonicalDisplay(entry.display),'display text changed: '+entry.passage_id);
    const expected=entry.components.flatMap(c=>c.target_passage_ids);
    for(const target of expected){
      assert.ok(parts.some(x=>x.target_id===target),'target not clickable: '+entry.passage_id+' -> '+target);
    }
    total+=expected.length;
  }
  assert.equal(total,68);
});
test('Slash /5 is target Ayat 5, comma-separated passages stay distinct',()=>{
 const mixed=originals.find(x=>x.passage_id==='sishu.lunyu.03.07');
 const parts=links.parts(mixed.passage_id,mixed.source,overlay);
 assert.equal(parts.find(x=>x.target_id==='sishu.mengzi.03.07').ayat,5);
 const multi=originals.find(x=>x.passage_id==='sishu.lunyu.05.02');
 const fragments=links.parts(multi.passage_id,multi.source,overlay);
 assert.ok(fragments.some(x=>x.text.endsWith('VI:1')&&x.target_id==='sishu.lunyu.06.01'));
 assert.ok(fragments.some(x=>x.text==='2'&&x.target_id==='sishu.lunyu.06.02'));
 assert.equal(fragments.map(x=>x.text).join(''),canonicalDisplay(multi.display));
});
test('Chapter-only and ambiguous citations remain unlinked',()=>{
 const p=overlay.records.find(x=>x.passage_id==='sishu.lunyu.09.08'&&x.target_id===null);
 assert.ok(p);
 const parts=links.parts(p.passage_id,p.source,overlay);
 assert.ok(parts.every(x=>x.target_id==null));
 assert.deepEqual(links.parts('sishu.mengzi.01.01','(II.5.4.4)',overlay).map(x=>x.target_id),[null]);
});
test('Paragraph display preserves byte-for-byte Indonesian and English texts',()=>{
 const sources=[
   chapters[0].passages[0].translation_indonesian,
   chapters[0].passages[1].translation_indonesian,
   'Long paragraph. '.repeat(90),
   'The Master said, "Learning is good." He asked a question. '.repeat(35),
   'The first paragraph.\n\nA second paragraph.'
 ];
 for(const s of sources){
   const parts=layout.paragraphs(s,s.startsWith('The Master')?'en':'id');
   assert.equal(parts.join(''),s);
   assert.ok(parts.every(p=>p.length>0));
 }
 assert.ok(layout.paragraphs('The Master said, "Learning is good." He asked a question. '.repeat(35),'en').length>1);
});
test('Browser loads reference and typography modules before the reader',()=>{
 const html=read('ru-classics/index.html');
 const reader=read('ru-classics/app.js');
 const editor=read('ru-classics/editor.js');
 for(const file of ['reference-links.js','same-book-references.js','book-references.js','reading-layout.js','subverses.js','hanzi-layout.js']){
   assert.ok(html.includes('src="./'+file+'"'));
   assert.ok(html.indexOf('src="./'+file+'"')<html.indexOf('src="./app.js'));
 }
 assert.match(reader,/RuReferenceLinks\?\.parts/);
 assert.match(reader,/RuSameBookReferences\?\.expand/);
 assert.match(reader,/RuBookReferences\?\.expand/);
 assert.ok(namedBooks.BOOKS.zhongyong.offset===1);
 assert.equal(sameBook.parse('sishu.mengzi.01.03','III. A.3.10').target_id,'sishu.mengzi.05.03');
 assert.match(reader,/data-ref-ayat/);
 assert.match(reader,/readableIndonesian:/);
 assert.match(reader,/englishReading\(p\)/);
 assert.match(reader,/id="jump-ayat"/);
 assert.match(reader,/id="jump-chapter"/);
 assert.match(editor,/app\(\)\?\.readableIndonesian/);
 assert.match(editor,/app\(\)\?\.readableEnglish/);
});


test('Mobile passage and ayat selectors share one pager; desktop has independent four-level navigation',()=>{
  const app=read('ru-classics/app.js');
  const html=read('ru-classics/index.html');
  const styles=read('ru-classics/styles.css');
  for(const id of ['desktop-jump-book','desktop-jump-chapter','desktop-jump-passage','desktop-jump-ayat','jump-passage','jump-ayat']){
    assert.ok(app.includes(id),'missing navigation id '+id);
  }
  assert.match(app,/data-reader-step/);
  assert.match(app,/function stepReader\(direction\)/);
  assert.match(app,/function readerStepAvailable/);
  assert.match(app,/reader-desktop-navigation/);
  assert.match(app,/verticalHanzi:true/);
  assert.match(html,/id="vertical-hanzi"/);
  assert.match(styles,/grid-template-columns:42px minmax\(0,1fr\) minmax\(0,1fr\) 42px/);
  assert.match(styles,/writing-mode:vertical-rl/);
  assert.match(styles,/\.reader-script \.hanzi-text ruby rt/);
  assert.match(styles,/writing-mode:horizontal-tb/);
  assert.match(styles,/\.reader-grid:not\(\.horizontal-hanzi\)/);
  assert.match(styles,/\.reader-desktop-navigation\{position:sticky/);
  // The number/meaning of source ayat remains supplied by the existing MATAKIN split module.
  assert.match(app,/RuSubverses\?\.splitIndonesia\(p\.translation_indonesian\)/);
  assert.match(app,/English units without changing either canonical text/);
});

test('Desktop layout activates at tablet viewport and does not rely on :has or stale CSS URLs',()=>{
 const css=read('ru-classics/styles.css');
 const app=read('ru-classics/app.js');
 const html=read('ru-classics/index.html');
 assert.match(css,/@media\(min-width:768px\)\{/);
 assert.match(css,/\.reader-page\.reader-two-column\{display:grid;grid-template-columns:minmax\(0,2fr\) minmax\(0,3fr\)/);
 assert.match(css,/\.reader-script \.hanzi-text\{[\s\S]*?writing-mode:vertical-rl/);
 assert.match(css,/\.reader-script \.hanzi-text ruby rt\{[\s\S]*?writing-mode:horizontal-tb/);
 assert.doesNotMatch(css,/reader-page:has\(/);
 assert.match(app,/reader-two-column/);
 assert.match(app,/main\.classList\?\.toggle\?\.\('is-reading'/);
 assert.match(html,/styles\.css\?v=20261117-cidict-v2/,'CSS asset must be cache-busted for the current release');
 assert.match(html,/app\.js\?v=20261117-cidict-v2/);
});

test('Hanzi clauses respect original punctuation and keep quote closures with the preceding question',()=>{
 const tokens=[
  {type:'ruby',traditional:'子',pinyin:'zǐ'},
  {type:'ruby',traditional:'曰',pinyin:'yuē'},
  {type:'text',value:'：“'},
  {type:'ruby',traditional:'學',modern:'学',pinyin:'xué'},
  {type:'ruby',traditional:'而',pinyin:'ér'},
  {type:'text',value:'，'},
  {type:'ruby',traditional:'不',pinyin:'bù'},
  {type:'ruby',traditional:'亦',pinyin:'yì'},
  {type:'text',value:'？”'}
 ];
 const old=JSON.stringify(tokens);
 const chunks=hanziLayout.segment(tokens);
 assert.deepEqual(chunks.map(x=>x.pause),['soft','soft','strong']);
 assert.equal(chunks.map(x=>x.tokens.map(hanziLayout.textOf).join('')).join(''),tokens.map(hanziLayout.textOf).join(''));
 assert.equal(chunks.at(-1).tokens.at(-1).value,'”');
 assert.equal(chunks[1].tokens.find(t=>t.type==='ruby'&&t.traditional==='學').modern,'学');
 assert.equal(JSON.stringify(tokens),old,'source tokens must remain unchanged');
});
test('Display-only punctuation segmentation preserves Hanzi and Ruby across all Si Shu passages',()=>{
 let count=0,multi=0;
 for(const name of ['daxue','zhongyong','lunyu','mengzi']){
  const directory=path.join(root,'sishu/chapters',name);
  for(const file of fs.readdirSync(directory).filter(f=>f.endsWith('.json'))){
   const chapter=JSON.parse(fs.readFileSync(path.join(directory,file),'utf8'));
   for(const passage of chapter.passages||[]){
    count++;
    for(const par of passage.ruby_paragraphs||[]){
     const before=JSON.stringify(par);
     const chunks=hanziLayout.segment(par);
     const source=par.map(hanziLayout.textOf).join('');
     assert.equal(chunks.flatMap(x=>x.tokens).map(hanziLayout.textOf).join(''),source,passage.id);
     assert.deepEqual(chunks.flatMap(x=>x.tokens).filter(x=>x.type==='ruby'),par.filter(x=>x.type==='ruby'),passage.id);
     assert.equal(JSON.stringify(par),before,passage.id+' was mutated');
     if(chunks.length>1)multi++;
    }
   }
  }
 }
 assert.equal(count,965);
 assert.ok(multi>300,'Punctuation grouping should affect a substantial part of the corpus');
});

test('Traditional Chinese vertical punctuation display is distinct from source and covers major marks',()=>{
 const glyphs={
  ':':'：', ',':'，', ';':'；', '!':'！', '?':'？', '.':'。',
  '“':'「','”':'」','‘':'『','’':'』'
 };
 for(const [source,vertical] of Object.entries(glyphs))
   assert.equal(hanziLayout.verticalForm(source),vertical,'vertical form for '+source);
 for(const ch of ['，','。','：','；','！','？','「','」','學','仁'])
   assert.equal(hanziLayout.verticalForm(ch),ch,'do not rewrite traditional form '+ch);
 const original=[{type:'text',value:'：“你好！”'}];
 const snapshot=JSON.stringify(original);
 assert.equal(hanziLayout.segment(original).flatMap(group=>group.tokens).map(hanziLayout.textOf).join(''),original[0].value);
 assert.equal(JSON.stringify(original),snapshot,'source token data must not be rewritten');
});
test('Vertical reader uses uniform character cells and horizontal Ruby while mobile retains original marks',()=>{
 const css=read('ru-classics/styles.css');
 const app=read('ru-classics/app.js');
 assert.match(app,/class="hanzi-unit"/);
 assert.match(app,/class="hanzi-mark-cell/);
 assert.match(app,/class="hanzi-mark-source"/);
 assert.match(app,/class="hanzi-mark-vertical"/);
 assert.match(css,/--vertical-step:calc\(/);
 assert.match(css,/--vertical-column-width:max\(/);
 assert.match(css,/\.hanzi-unit\{[\s\S]*?width:var\(--vertical-column-width\);height:var\(--vertical-step\)/);
 assert.match(css,/\.hanzi-mark-cell\{[\s\S]*?width:var\(--vertical-column-width\);height:var\(--vertical-step\)/);
 assert.match(css,/\.hanzi-unit ruby\{[\s\S]*?display:ruby;writing-mode:horizontal-tb/);
 assert.match(css,/\.hanzi-mark-cell\.has-vertical-form \.hanzi-mark-source\{[\s\S]*?display:none/);
 assert.match(css,/\.hanzi-mark-vertical\{display:none/);
 assert.match(css,/\.hanzi-clause\.keep-together\{[\s\S]*?display:contents/);
 assert.match(css,/\.hanzi-text\.no-pinyin \.hanzi-unit ruby rt\{[\s\S]*?display:none/);
});

test('Character inspector script is loaded before app and all Ruby Hanzi are keyboard-clickable',()=>{
 const html=read('ru-classics/index.html'),app=read('ru-classics/app.js'),css=read('ru-classics/styles.css');
 assert.ok(html.indexOf('src="./character-dictionary.js"')<html.indexOf('src="./app.js'),'dictionary must load before reader');
 assert.match(html,/id="character-inspector"/);
 assert.match(html,/id="character-inspector-backdrop"/);
 assert.match(html,/data-inspector="gloss"/);
 assert.match(html,/data-inspector="pinyin"/);
 assert.match(html,/data-inspector="source-clause"/);
 assert.match(html,/data-character-close/);
 assert.match(html,/data-character-find/);
 assert.match(app,/class="hanzi-lookup"/);
 assert.match(app,/data-hanzi-char/);
 assert.match(app,/aria-haspopup="dialog"/);
 assert.match(app,/function openCharacterInspector\(trigger\)/);
 assert.match(app,/function closeCharacterInspector\(restoreFocus=false\)/);
 assert.match(app,/hasAttribute\('data-hanzi-char'\)/);
 assert.match(app,/e\.key==='Escape'/);
 assert.match(app,/data-source-clause/);
 assert.match(css,/\.character-inspector\.as-sheet/);
 assert.match(css,/\.hanzi-unit \.hanzi-lookup/);
 assert.match(css,/\[aria-expanded="true"\]/);
 assert.match(css,/\.character-inspector\[hidden\]/);
});
test('Dictionary exposes source-backed Pinyin separately from provisional editorial definitions',()=>{
 const x=characterDictionary.lookup('樂','sishu.lunyu.01.01');
 assert.ok(x.gloss.includes('gembira'));
 assert.ok(x.context.includes('不亦樂乎'));
 assert.match(x.source,/belum ditinjau/);
 assert.equal(characterDictionary.lookup('學','sishu.lunyu.01.01').context.includes('學而時習之'),true);
 assert.ok(characterDictionary.entryCount>=55);
 assert.ok(characterDictionary.contextCount>=3);
 const unknown=characterDictionary.lookup('龜','sishu.lunyu.01.01');
 assert.equal(unknown.gloss,null);
 assert.equal(unknown.context,null);
 assert.equal(unknown.source,null);
 assert.equal(characterDictionary.lookup('樂','sishu.lunyu.01.02').context,null,'do not claim contextual meaning in other passages');
});
test('Character lookup is safe and total across all Si Shu original tokens without changing them',()=>{
 let count=0,unknown=0;
 for(const name of ['daxue','zhongyong','lunyu','mengzi']){
  const dir=path.join(root,'sishu/chapters',name);
  for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){
   const ch=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
   for(const passage of ch.passages||[]){
    count++;
    for(const par of passage.ruby_paragraphs||[]){
     const snapshot=JSON.stringify(par);
     for(const token of par){
      if(token.type!=='ruby')continue;
      const data=characterDictionary.lookup(token.traditional,passage.id);
      assert.equal(data.char,token.traditional);
      assert.ok(data.gloss===null||typeof data.gloss==='string');
      if(!data.gloss)unknown++;
     }
     assert.equal(JSON.stringify(par),snapshot,'character lookup mutated the MATAKIN script: '+passage.id);
    }
   }
  }
 }
 assert.equal(count,965);
 assert.ok(unknown>0,'missing definitions must remain visibly unavailable rather than fabricated');
});

test('Reader navigation and dictionary close buttons use geometry-centered SVG icons',()=>{
 const app=read('ru-classics/app.js'),html=read('ru-classics/index.html'),css=read('ru-classics/styles.css');
 assert.match(app,/function readerChevron\(direction\)/);
 assert.equal((app.match(/readerChevron\(-1\)/g)||[]).length,2,'backward arrow in phone and desktop');
 assert.equal((app.match(/readerChevron\(1\)/g)||[]).length,2,'forward arrow in phone and desktop');
 assert.match(app,/class="reader-step-icon"/);
 assert.match(app,/aria-hidden="true" focusable="false"/);
 assert.match(html,/class="character-close-icon"/);
 assert.match(html,/data-character-close aria-label="Tutup kamus karakter"/);
 assert.match(html,/styles\.css\?v=20261117-cidict-v2/);
 assert.match(html,/app\.js\?v=20261117-cidict-v2/);
 assert.match(css,/\.reader-pager-arrow,\s*\.reader-desktop-step,\s*\.character-inspector-close\s*\{[\s\S]*?place-items:center;[\s\S]*?padding:0;[\s\S]*?line-height:0;/);
 assert.match(css,/\.reader-step-icon,\s*\.character-close-icon\s*\{[\s\S]*?display:block;/);
});
