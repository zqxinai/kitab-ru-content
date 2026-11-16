'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');

const bundle=JSON.parse(fs.readFileSync(path.join(__dirname,'../../ru-classics/data/sishu.json'),'utf8'));
const nodes={
 main:{innerHTML:''},
 toast:{textContent:'',classList:{add(){},remove(){}}},
 'settings-dialog':{showModal(){this.open=true;},close(){this.open=false;}},
 'about-dialog':{showModal(){this.open=true;}},
 'privacy-dialog':{showModal(){this.open=true;}},
 'theme-options':{innerHTML:''},
 'reading-options':{innerHTML:''},
 'ui-language':{value:'id'},
 'font-hanzi':{value:'32'},'font-hanzi-label':{textContent:''},
 'font-pinyin':{value:'14'},'font-pinyin-label':{textContent:''},
 'font-latin':{value:'17'},'font-latin-label':{textContent:''},
 'search-results':{innerHTML:''}
};
const inspectorFields={};
const inspector={
  hidden:true,style:{},offsetHeight:350,ariaModal:'false',
  classList:{toggle(){},remove(){}},
  setAttribute(name,value){this[name]=value;},
  querySelector(selector){
    if(selector==='[data-character-close]')return {focus(){}};
    const match=selector.match(/^\\[data-inspector="([^"]+)"\\]$/);
    if(!match)return null;
    return inspectorFields[match[1]]??={textContent:''};
  }
};
nodes['character-inspector']=inspector;
nodes['character-inspector-backdrop']={hidden:true};
const handlers={};
const doc={
 body:{dataset:{},style:{values:{},setProperty(key,value){this.values[key]=value;}}},
 documentElement:{lang:'id',setAttribute(key,value){if(key==='lang')this.lang=value;}},
 getElementById(id){return nodes[id]||null;},
 querySelector(){return {content:''};},
 querySelectorAll(){return [];},
 addEventListener(type,fn){handlers[type]??=[];handlers[type].push(fn);}
};
let hash='#home';
const location={get hash(){return hash;},set hash(v){hash=v;}};
const page={addEventListener(){},dispatchEvent(){},scrollTo(){}};
const store={};
const localStorage={getItem(k){return store[k]||null;},setItem(k,value){store[k]=value;}};
const context={document:doc,window:page,location,localStorage,console,Event,clearTimeout,setTimeout,
 fetch:async()=>({ok:true,json:async()=>bundle})};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../reading-normalization.js'),'utf8'),context,{filename:'reading-normalization.js'});
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../reference-overlay.js'),'utf8'),context,{filename:'reference-overlay.js'});
for(const name of ['reference-links.js','same-book-references.js','book-references.js','reading-layout.js','subverses.js','hanzi-layout.js','character-dictionary.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../'+name),'utf8'),context,{filename:name});
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),context,{filename:'app.js'});
function click(dataset){
  const target={
    dataset,
    hasAttribute(name){return name==='data-ayat-select'&&Object.hasOwn(dataset,'ayatSelect')||
      name==='data-hanzi-char'&&Object.hasOwn(dataset,'hanziChar')||
      name==='data-character-close'&&Object.hasOwn(dataset,'characterClose')||
      name==='data-character-find'&&Object.hasOwn(dataset,'characterFind');},
    setAttribute(name,value){this[name]=value;},
    getBoundingClientRect(){return {left:70,bottom:90};},
    closest(selector){return selector==='.hanzi-clause'?{dataset:{sourceClause:'大學之道，'}}:this;},
    focus(){}
  };
  handlers.click[0]({target});
  return target;
}
function change(id,value,dataset={}){handlers.change[0]({target:{id,value,dataset}});}
function visibleText(html){return html.replace(/<[^>]+>/g,'');}
setTimeout(()=>{
 try{
  assert.equal(doc.body.dataset.theme,'paper','Theme default should be Paper');
  click({action:'settings'});
  assert.equal(nodes['settings-dialog'].open,true);
  for(const key of ['hanzi','pinyin','indo','english'])
    assert.ok(nodes['reading-options'].innerHTML.includes('data-setting="'+key+'"'),'Reading toggle missing '+key);
  assert.equal(nodes['ui-language'].value,'id');
  assert.equal(nodes['font-hanzi-label'].textContent,'32 px');
  assert.equal(nodes['font-pinyin-label'].textContent,'14 px');
  assert.equal(nodes['font-latin-label'].textContent,'17 px');
  click({sizeKey:'hanziSize',sizeStep:'2'});
  click({sizeKey:'pinyinSize',sizeStep:'1'});
  click({sizeKey:'latinSize',sizeStep:'1'});
  assert.equal(doc.body.style.values['--hanzi-size'],'34px');
  assert.equal(doc.body.style.values['--pinyin-size'],'15px');
  assert.equal(doc.body.style.values['--latin-size'],'18px');
  assert.equal(JSON.parse(store.ru_classics_web_v1).settings.pinyinSize,15,'Pinyin size should persist');
  click({action:'reset-fonts'});
  assert.equal(nodes['font-hanzi-label'].textContent,'32 px');
  assert.equal(nodes['font-pinyin-label'].textContent,'14 px');
  assert.equal(nodes['font-latin-label'].textContent,'17 px');
  change('ui-language','en');
  assert.equal(doc.documentElement.lang,'en','UI language should update independently');
  assert.ok(nodes['reading-options'].innerHTML.includes('ID · Indonesian'),'Reader labels should localize');
  assert.equal(JSON.parse(store.ru_classics_web_v1).uiLanguage,'en');
  change('ui-language','id');
  assert.equal(doc.documentElement.lang,'id');
  click({action:'privacy'});
  assert.equal(nodes['privacy-dialog'].open,true);
  assert.equal(nodes['settings-dialog'].open,false);

  assert.match(nodes.main.innerHTML,/Kitab Yang Empat/);
  assert.match(nodes.main.innerHTML,/Da Xue/);
  assert.match(nodes.main.innerHTML,/Mengzi/);
  click({book:'daxue'});
  assert.doesNotMatch(nodes.main.innerHTML,/Daftar bab/,'Redundant chapter list heading must be removed');
  assert.match(nodes.main.innerHTML,/data-expand-chapter="sishu\.daxue\.01"[^>]*aria-expanded="true"/,
    'First chapter accordion should open by default');
  assert.match(nodes.main.innerHTML,/data-passage="sishu\.daxue\.01\.07"/,
    'Chapter accordion should expose directly navigable numbered passages');
  assert.match(nodes.main.innerHTML,/id="chapter-passages-sishu\.daxue\.02" hidden/,
    'Other chapters should remain collapsed');
  click({chapter:'sishu.daxue.01'});
  assert.match(nodes.main.innerHTML,/Bab Utama/);
  click({passage:'sishu.daxue.01.01'});
  assert.match(nodes.main.innerHTML,/class="reading-paragraph"/,'Translations must be presented in paragraphs');
  assert.match(nodes.main.innerHTML,/class="translation-prose" lang="en"/,'English translation should have readable paragraph layout');
  assert.match(nodes.main.innerHTML,/class="reader-chapter-card"/,'Compact chapter picker should lead the reading page');
  assert.match(nodes.main.innerHTML,/class="reader-translation-stack"/,'Translations should have their own grouped panels');
  assert.match(nodes.main.innerHTML,/id="reader-translation-indo"/,'Indonesian MATAKIN panel must be distinct');
  assert.match(nodes.main.innerHTML,/id="reader-translation-en"/,'English Legge panel must be distinct');
  assert.match(nodes.main.innerHTML,/class="reader-pager"/,'Passage navigation belongs in the bottom reader area');
  assert.match(nodes.main.innerHTML,/class="reader-language-tools"/,'Quick reading-language controls must be available');
  assert.match(nodes.main.innerHTML,/data-setting="pinyin"/,'Ruby Pinyin toggle must be present');

  assert.doesNotMatch(nodes.main.innerHTML,/class="reader-jump"/,'Old four-column top navigation must be absent');
  assert.ok(nodes.main.innerHTML.indexOf('id="jump-chapter"')<nodes.main.innerHTML.indexOf('class="paper-page reader-page'),
    'Chapter navigation must appear before reading content');
  assert.ok(nodes.main.innerHTML.indexOf('id="jump-passage"')>nodes.main.innerHTML.indexOf('id="reader-translation-en"'),
    'Passage selector must appear below translations');

  
  assert.match(nodes.main.innerHTML,/Terjemahan Indonesia \(MATAKIN\)/);
  assert.match(nodes.main.innerHTML,/James Legge/);
  assert.match(nodes.main.innerHTML,/<ruby>/);
  assert.match(nodes.main.innerHTML,/<ruby>學<rt>xué<\/rt><\/ruby><span class="modern"[^>]*>（学）<\/span>/,
    '2012 script convention must keep simplified glyph after ruby');
  assert.doesNotMatch(nodes.main.innerHTML,/<ruby>學<span class="modern">/,
    'Pinyin must align with traditional Hanzi, not traditional plus simplified');
  assert.match(nodes.main.innerHTML,/Catatan pribadi/);
  assert.match(nodes.main.innerHTML,/Ayat atau pasal berikutnya/,'Reader arrows now navigate ayat before adjacent passages');
  assert.match(nodes.main.innerHTML,/id="desktop-jump-ayat"/,'Desktop must offer a verse selector');
  // Clicking a Hanzi opens the dictionary without changing the displayed passage.
  assert.match(nodes.main.innerHTML,/data-hanzi-char="學"/,'Every Ruby character must be a dictionary trigger');
  const originalReader=nodes.main.innerHTML;
  const hanziTrigger=click({hanziChar:'學',hanziPinyin:'xué',hanziModern:'学'});
  assert.equal(inspector.hidden,false);
  assert.equal(inspectorFields.hanzi.textContent,'學');
  assert.equal(inspectorFields.pinyin.textContent,'xué');
  assert.equal(inspectorFields.simplified.textContent,'学');
  assert.ok(inspectorFields.gloss.textContent.includes('belajar'));
  assert.equal(inspectorFields['source-clause'].textContent,'大學之道，');
  assert.equal(nodes.main.innerHTML,originalReader,'dictionary must not modify MATAKIN passage DOM');
  click({characterClose:''});
  assert.equal(inspector.hidden,true);
  assert.equal(hanziTrigger['aria-expanded'],'false');
  click({hanziChar:'龜',hanziPinyin:'',hanziModern:''});
  assert.match(inspectorFields.gloss.textContent,/belum tersedia/);
  click({characterFind:''});
  assert.equal(inspector.hidden,true);
  assert.equal(location.hash,'search');
  assert.match(nodes.main.innerHTML,/Ketik Hanzi, pinyin, atau terjemahan/);
  click({passage:'sishu.daxue.01.01'});
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.18'});
  click({passage:'sishu.lunyu.18.01'});
  for(const name of ['Weizi - Bicu','Jizi - Kicu','Bi Gan - Pikan'])
    assert.ok(visibleText(nodes.main.innerHTML).includes(name),'Lun Yu XVIII:1 missing '+name);
  click({passage:'sishu.lunyu.18.06'});
  assert.match(nodes.main.innerHTML,/Lunyu - Sabda Suci XIV:39/,'Full readable book name should display');
  assert.doesNotMatch(nodes.main.innerHTML,/\(S\.S\. XIV: 39\)/,'Old abbreviated citation should not display');
  assert.match(nodes.main.innerHTML,/class="reference-link" data-passage="sishu\.lunyu\.14\.39"/,
    'Verified single reference should render as a target passage button');
  click({passage:'sishu.lunyu.14.39'});
  assert.match(nodes.main.innerHTML,/Pasal 39/,'Reference button must open the correct target passage');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.05'});
  click({passage:'sishu.lunyu.05.08'});
  assert.match(nodes.main.innerHTML,/Zhongyong - Tengah Sempurna Bab VIII/,
    'Owner-confirmed TS is displayed as book name without inventing a verse');
  assert.match(nodes.main.innerHTML,/Lunyu - Sabda Suci II:6/,
    'Batch 02 SS normalized while TS remains separate');
  assert.match(nodes.main.innerHTML,/Lunyu - Sabda Suci VI:4/,
    'Second reference in one passage remains independently normalized');
  assert.doesNotMatch(nodes.main.innerHTML,/\\(T\\.S\\. VIII\\)/,
    'Legacy T.S. VIII should not display to reader');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.16'});
  click({passage:'sishu.lunyu.16.09'});
  assert.match(nodes.main.innerHTML,/Zhongyong - Tengah Sempurna XIX:9/,
    '2012-style TS reference should be rendered in Lun Yu XVI:9');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.12'});
  click({passage:'sishu.lunyu.12.13'});
  assert.match(nodes.main.innerHTML,/Daxue - Ajaran Besar IV/,
    'Chapter-only A.B. IV should not invent a verse');
  click({passage:'sishu.lunyu.12.22'});
  assert.match(nodes.main.innerHTML,/Mengzi - Bingcu VII A:46/,
    'BC should resolve to Mengzi while preserving chapter/verse numbers');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.02'});
  click({passage:'sishu.lunyu.02.03'});
  assert.match(nodes.main.innerHTML,/Mengzi - Bingcu VII A:3/,
    'Batch 04 BC target should preserve the printed book and passage numbering');
  click({passage:'sishu.lunyu.02.05'});
  assert.match(nodes.main.innerHTML,/Lunyu - Sabda Suci VI:22/,
    'Batch 04 SS citation with dot separator should render in canonical form');
  assert.ok(visibleText(nodes.main.innerHTML).includes('(Lunyu - Sabda Suci I:9; Lun Yu III:1,2; Lun Yu XIX:5; Mengzi - Bingcu III A:2)'),
    'Compound references should retain distinct book and pasal numbers after normalization');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.03'});
  click({passage:'sishu.lunyu.03.14'});
  assert.match(nodes.main.innerHTML,/Zhongyong - Tengah Sempurna XXVII:5/,
    'Batch 04 TS reference should map only the displayed book title');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.04'});
  click({passage:'sishu.lunyu.04.03'});
  assert.match(nodes.main.innerHTML,/Daxue - Ajaran Besar X:15/,
    'Batch 04 A.B. should show Da Xue by printed chapter numbering');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.09'});
  click({passage:'sishu.lunyu.09.08'});
  assert.match(nodes.main.innerHTML,/Zhongyong - Tengah Sempurna V/,
    'Batch 04 chapter-only TS reference should not invent a verse');
  // Compound citation batch: preserve each source's book without collapsing targets.
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.02'});
  click({passage:'sishu.lunyu.02.19'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Zhongyong - Tengah Sempurna XIX:1; Lunyu - Sabda Suci III:21'),
    'Compound TS + SS book names are missing');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.05'});
  click({passage:'sishu.lunyu.05.16'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci XIV:9; Mengzi - Bingcu IV B:2'),
    'Compound SS + BC book names are missing');
  click({passage:'sishu.lunyu.05.23'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Mengzi - Bingcu II A:2; Lunyu - Sabda Suci VII:15'),
    'Compound BC + SS book names are missing');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.02'});
  click({passage:'sishu.lunyu.02.05'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('(Lunyu - Sabda Suci I:9; Lun Yu III:1,2; Lun Yu XIX:5; Mengzi - Bingcu III A:2)'),
    'Promoted inherited-book reference should use approved full names');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.03'});
  click({passage:'sishu.lunyu.03.07'});
  assert.match(nodes.main.innerHTML,/data-passage="sishu\.mengzi\.03\.07" data-ref-ayat="5"/,
    'MATAKIN slash /5 should be a verified ayat-level navigation control');
  assert.match(nodes.main.innerHTML,/data-passage="sishu\.zhongyong\.14\.05"/,
    'Both sides of the compound citation must have independent targets');
  change('chapter-passage','sishu.mengzi.03.07');
  for(const id of ['jump-book','jump-chapter','jump-passage','jump-ayat'])
    assert.ok(nodes.main.innerHTML.includes('id="'+id+'"'),'Missing dropdown '+id);
  change('jump-ayat','5');
  assert.equal(location.hash,'read=sishu.mengzi.03.07&ayat=5');
  assert.match(nodes.main.innerHTML,/english-alignment-note/);
  assert.doesNotMatch(nodes.main.innerHTML,/english-reading-section/,'Legge paragraphs are not MATAKIN ayat');
  click({passage:'sishu.mengzi.03.07',refAyat:'5'});
  assert.equal(location.hash,'read=sishu.mengzi.03.07&ayat=5');
  assert.match(nodes.main.innerHTML,/translation-verse ayat-active" data-ayat="5"/,
    'Ayat-level deep link must select the referenced numbered ayat');
  click({book:'mengzi'});
  click({chapter:'sishu.mengzi.03'});
  assert.match(nodes.main.innerHTML,/class="chapter-ayat-label"/,
    'Chapter must expose an numbered ayat dropdown');
  assert.match(nodes.main.innerHTML,/data-ayat-for="sishu.mengzi.03.07"/,
    'Each chapter ayat dropdown must retain its original passage ID');
  click({passage:'sishu.mengzi.03.07',refAyat:'5'});
  assert.match(nodes.main.innerHTML,/translation-verse ayat-active" data-ayat="5"/);
  click({passage:'sishu.mengzi.03.01'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Gongsun Chou - Kong-sun Thio'),
    'Pinyin–Hokkian display overlay should render known personal name');
  click({book:'lunyu'});click({chapter:'sishu.lunyu.03'});click({passage:'sishu.lunyu.03.07'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Zhongyong - Tengah Sempurna XIII:5; Mengzi - Bingcu II A:7/5'),
    'Batch 06 multi-book citation must display both books and preserve /5');
  click({passage:'sishu.lunyu.03.09'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Zhongyong - Tengah Sempurna XXVII:5; Lunyu - Sabda Suci II:23'),
    'Batch 06 TS and SS reference normalization missing');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.07'});
  click({passage:'sishu.lunyu.07.02'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci IX:16; Mengzi - Bingcu II A:2/19'),
    'Batch 06 BC subverse notation must be retained as source text');
  click({passage:'sishu.lunyu.07.23'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('(Lunyu - Sabda Suci III:24; Lun Yu IX:5)'),
    'Inherited SS second citation must show confirmed full book name');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.09'});
  click({passage:'sishu.lunyu.09.29'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci XIV:28; Zhongyong - Tengah Sempurna XIX:10'),
    'Batch 06 SS plus TS normalization missing');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.05'});
  click({passage:'sishu.lunyu.05.02'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci VI:1,2; Lun Yu XI:5'),
    'Two pasal VI:1,2 and XI:5 remain legible');
  click({passage:'sishu.lunyu.05.04'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci I:10; Lun Yu II:12,13'),
    'Comma-separated pasal targets should be preserved');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.14'});
  click({passage:'sishu.lunyu.14.01'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci VIII:13; Mengzi - Bingcu VII A:6,7'),
    'Mixed books and comma-separated Mengzi pasal should display');
  click({passage:'sishu.lunyu.14.36'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci VII:23; Lun Yu IX:5; Mengzi - Bingcu I B:16'),
    'Two inherited SS and one BC references should retain all numbers');
  click({book:'lunyu'});
  click({chapter:'sishu.lunyu.09'});
  click({passage:'sishu.lunyu.09.05'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci III:24; Lun Yu VII:23; Lun Yu XIV:36; Mengzi - Bingcu I B:16'),
    'MATAKIN 2012 photographed citation must correct the displayed VII:23 numbering');
  assert.ok(!visibleText(nodes.main.innerHTML).includes('VII &quot;: 23'),
    'Spurious quote in original 2011 transcription must not leak into reader display');
  // Batch 08: book names also normalize in Zhong Yong and Mengzi.
  click({book:'zhongyong'});
  click({chapter:'sishu.zhongyong.20'});
  click({passage:'sishu.zhongyong.20.10'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci IX:29'),
    'Zhong Yong XIX:10 reference to Lun Yu IX:29 should display');
  click({book:'zhongyong'});
  click({chapter:'sishu.zhongyong.29'});
  click({passage:'sishu.zhongyong.29.04'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Zhongyong - Tengah Sempurna XIX:7'),
    'Zhong Yong self-reference must retain printed XIX numbering');
  click({book:'mengzi'});
  click({chapter:'sishu.mengzi.03'});
  click({passage:'sishu.mengzi.03.02'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci XI:3'),
    'Mengzi IIA:2 first single-book reference missing');
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci VII:26'),
    'Mengzi IIA:2 second single-book reference missing');
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci IX:9'),
    'Mengzi IIA:2 space-separated abbreviation missing');
  click({book:'mengzi'});
  click({chapter:'sishu.mengzi.04'});
  click({passage:'sishu.mengzi.04.13'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci XIV:35'),
    'Mengzi IIB:13 first reference missing');
  assert.ok(visibleText(nodes.main.innerHTML).includes('Lunyu - Sabda Suci IX:5'),
    'Mengzi IIB:13 second reference missing');
  // The reader must pair Pinyin-Hokkian consistently, including search excerpts.
  click({nav:'search'});
  handlers.input[0]({target:{id:'search-input',value:'Kong-sun Thio'}});
  assert.match(nodes['search-results'].innerHTML,/class="excerpt">[^<]*Gongsun Chou - Kong-sun Thio/,
    'Search excerpt must use the non-destructive Pinyin-Hokkian reading overlay');
  // Selected ayat stays identified even when the Indonesian view is hidden.
  click({passage:'sishu.mengzi.01.01'});
  change('jump-ayat','3');
  assert.match(nodes.main.innerHTML,/class="hanzi-verse ayat-active" data-ayat="3"/);
  assert.match(nodes.main.innerHTML,/Pasal 1 · Ayat 3 dipilih/);
  click({toggle:'indo'});
  assert.match(nodes.main.innerHTML,/class="hanzi-verse ayat-active" data-ayat="3"/);
  assert.match(nodes.main.innerHTML,/Pasal 1 · Ayat 3 dipilih/);
  // Mengzi III.A.3.10 is a same-book reference to passage III A:3 Ayat 10.
  click({book:'mengzi'});click({chapter:'sishu.mengzi.01'});click({passage:'sishu.mengzi.01.03'});
  click({toggle:'indo'}); // Restore Indonesian from preceding display-options test.
  assert.ok(visibleText(nodes.main.innerHTML).includes('Mengzi - Bingcu III A:3/10'));
  assert.match(nodes.main.innerHTML,/data-passage="sishu\.mengzi\.05\.03" data-ref-ayat="10"/);
  click({passage:'sishu.mengzi.05.03',refAyat:'10'});
  assert.equal(location.hash,'read=sishu.mengzi.05.03&ayat=10');
  assert.match(nodes.main.innerHTML,/Pasal 3 · Ayat 10 dipilih/);
  assert.match(nodes.main.innerHTML,/Nomor ayat mengikuti MATAKIN/);
  assert.doesNotMatch(nodes.main.innerHTML,/english-reading-section/);
  assert.doesNotMatch(nodes.main.innerHTML,/english-reading-index/);
  // Screenshot regression: names without a ruler title must be Pinyin-Hokkian
  // in the actual rendered ayat, not only in the normalization helper.
  click({book:'mengzi'});click({chapter:'sishu.mengzi.10'});click({passage:'sishu.mengzi.10.03'});
  const actualNames=visibleText(nodes.main.innerHTML);
  for(const name of [
    'Meng Xianzi - Bing Hiancu', 'Yuezheng Qiu - Gak-cing Kiu',
    'Mu Zhong - Bok Tiong', 'Meng Xianzi - Hiancu',
    'Yan Ban - Gan Puan','Wang Shun - Ong Sun',
    'Chang Xi - Tiang Siet','Hai Tang - Hai Tong'
  ])assert.ok(actualNames.includes(name),'Reader must pair person '+name);
  assert.ok(actualNames.includes('Negeri Bi - Pi'),'Reader must pair 費 place name');
  assert.ok(actualNames.includes('Negeri Jin - Cien'),'Reader must pair 晉 place name');
  click({passage:'sishu.mengzi.02.14'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Gunung Qishan - Ki'),
    '岐山 is Qishan, not 箕山 Jishan');
  click({passage:'sishu.mengzi.09.06'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('Gunung Jishan - Ki'),
    '箕山 is Jishan, not 岐山 Qishan');
  click({passage:'sishu.mengzi.12.05'});
  assert.ok(visibleText(nodes.main.innerHTML).includes('kota Zou - Co'),
    '鄒 place names need Pinyin, even without Negeri title');

  // From Zhong Yong, each inherited S.S. citation opens its Lun Yu target.
  click({book:'zhongyong'});click({chapter:'sishu.zhongyong.09'});click({passage:'sishu.zhongyong.09.01'});
  assert.match(nodes.main.innerHTML,/data-passage="sishu\.lunyu\.05\.08"/);
  assert.match(nodes.main.innerHTML,/data-passage="sishu\.lunyu\.12\.20"/);
  assert.ok(visibleText(nodes.main.innerHTML).includes('Sabda Suci — Lun Yu V:8; Lun Yu XII:20'));
  click({passage:'sishu.lunyu.12.20'});
  assert.equal(location.hash,'read=sishu.lunyu.12.20');
  // From Lun Yu, A.B. leads to Da Xue; T.S. leads to Zhong Yong.
  click({book:'lunyu'});click({chapter:'sishu.lunyu.15'});click({passage:'sishu.lunyu.15.24'});
  assert.match(nodes.main.innerHTML,/data-passage="sishu\.daxue\.10\.04"/);
  click({book:'lunyu'});click({chapter:'sishu.lunyu.12'});click({passage:'sishu.lunyu.12.16'});
  assert.match(nodes.main.innerHTML,/data-passage="sishu\.zhongyong\.10\.03"/);
  // From Da Xue, two S.S. references each open their own pasal.
  click({book:'daxue'});click({chapter:'sishu.daxue.10'});click({passage:'sishu.daxue.10.04'});
  assert.match(nodes.main.innerHTML,/data-passage="sishu\.lunyu\.05\.12"/);
  assert.match(nodes.main.innerHTML,/data-passage="sishu\.lunyu\.15\.24"/);
  console.log('Ru Classics smoke test passed: Paper, 4 books, chapter, reader, Ruby, Indonesian, English');
 }catch(e){console.error(e);process.exitCode=1;}
},0);