import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const read = path => readFileSync(path, 'utf8');
const html = read('editor/index.html');
const script = read('editor/app.js');
const css = read('editor/style.css');
const catalog = JSON.parse(read('catalog.json'));
const content = JSON.parse(read('dist/sishu-content.json'));
const packageBytes = readFileSync('dist/sishu-content.json');
const actualSha256 = createHash('sha256').update(packageBytes).digest('hex');
const recordedSha256 = read('dist/sishu-content.sha256').trim();
const report = JSON.parse(read('dist/build-report.json'));
const alignment = JSON.parse(read('dist/sishu-english-alignment.json'));
const sishuCatalog = catalog.collections.find(c => c.id === 'sishu');
assert(sishuCatalog, 'Si Shu catalog entry missing');
assert.match(recordedSha256, /^[a-f0-9]{64}  sishu-content\.json$/);
assert.equal(recordedSha256.slice(0,64), actualSha256, 'Checksum file differs from JSON bytes');
assert.equal(report.sha256, actualSha256, 'Build report checksum differs from JSON bytes');
assert.equal(sishuCatalog.sha256, actualSha256, 'Catalog checksum differs from JSON bytes');
assert.equal(report.bytes, packageBytes.length, 'Build report byte count differs');


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

assert.equal(english, report.english_passages, 'Build report embedded English count stale');
assert.equal(sishuCatalog.english_passages, english, 'Catalog embedded English count stale');
assert.equal(sishuCatalog.total_passages, total, 'Catalog passage count stale');
assert.equal(alignment.schema, 'kitab-ru.english-alignment.v1');
const allIds = new Set(ids);
const covered = new Set(content.chapters.flatMap(ch =>
  ch.passages.filter(p => typeof p.translation_english === 'string' && p.translation_english.trim()).map(p => p.id)));
for (const entry of alignment.entries || []) {
  if (!Array.isArray(entry.indonesian_passage_ids) || !Array.isArray(entry.english_segments)) continue;
  if (!entry.english_segments.some(segment => typeof segment.text === 'string' && segment.text.trim())) continue;
  for (const id of entry.indonesian_passage_ids) {
    assert(allIds.has(id), 'English alignment refers to unknown passage: ' + id);
    covered.add(id);
  }
}
assert.equal(sishuCatalog.english_editor_passages, covered.size, 'Editor English coverage stale');
assert.equal(sishuCatalog.english_editor_unmapped, total-covered.size, 'Editor English missing count stale');
assert.equal(sishuCatalog.english_editor_alignment_drafts, covered.size-english,
  'Mapped-only English passage count stale');
console.log('PASS: editor controls, 4 books, 78 chapters, 965 passages; '+english+
  ' bundled English and '+covered.size+' English in editor. SHA-256 and catalog counts agree.');

