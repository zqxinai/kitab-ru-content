import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = path => readFileSync(path, 'utf8');
const html = read('editor/index.html');
const script = read('editor/app.js');
const css = read('editor/style.css');
const catalog = JSON.parse(read('catalog.json'));
const content = JSON.parse(read('dist/sishu-content.json'));

execFileSync(process.execPath,['--check','editor/app.js']);
const htmlIds=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(htmlIds).size,htmlIds.length,'Duplicate HTML IDs');
const expected=new Set(htmlIds);
for(const match of script.matchAll(/\$\('([^']+)'\)/g)){
  assert(expected.has(match[1]),'Missing interface element: '+match[1]);
}
for(const id of [
  'searchInput','bookList','chapterList','passageList','hanziText',
  'indonesianText','englishText','editIndonesian','editEnglish','editReason',
  'editButton','saveDraft','submitProposal','draftCount'
]){
  assert(expected.has(id),'Missing editorial control: '+id);
}
assert(script.includes("const SOURCE='../dist/sishu-content.json'"),
  'Editor must auto-load source from its own repository');
assert(!html.includes('importInput'),'No JSON file import step for editors');
assert(!html.includes('exportButton'),'No JSON download step for editors');
assert(script.includes("'/issues/new?title='"),'Correction submission link missing');
assert(html.includes('Riwayat usulan'),'Reviewer history link missing');
assert(css.includes('@media(max-width:760px)'),'Mobile layout missing');
assert(read('index.html').includes('./editor/'),'Site entry point missing');

assert.equal(catalog.schema,'kitab-ru.catalog.v1');
assert.equal(new Set(catalog.collections.map(c=>c.id)).size,catalog.collections.length);
for(const id of ['sishu','yijing','shujing','shijing','liji','chunqiu']){
  assert(catalog.collections.some(c=>c.id===id),'Catalog collection missing: '+id);
}
assert.equal(content.schema,'ru-classics.content.v1');
assert.equal(content.collection,'sishu');
assert.equal(content.books.length,4,'Si Shu must contain four books');
assert.equal(content.chapters.length,78,'Si Shu must contain 78 chapters');
const total=content.chapters.reduce((sum,ch)=>sum+ch.passages.length,0);
assert.equal(total,965,'Si Shu must contain 965 passages');
const ids=content.chapters.flatMap(ch=>ch.passages.map(p=>p.id));
assert.equal(new Set(ids).size,ids.length,'Duplicate passage IDs');
for(const chapter of content.chapters){
  for(const passage of chapter.passages){
    assert(passage.translation_indonesian,'Indonesian translation missing: '+passage.id);
    assert(Array.isArray(passage.ruby_paragraphs),'Hanzi passage missing: '+passage.id);
  }
}
const english=content.chapters.reduce((sum,ch)=>
  sum+ch.passages.filter(p=>typeof p.translation_english==='string'&&p.translation_english.trim()).length,0);
console.log('PASS: editor controls, 4 books, 78 chapters, 965 passages, '+english+' English drafts.');
