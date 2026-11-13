import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = (path) => readFileSync(path, 'utf8');
const html = read('editor/index.html');
const script = read('editor/app.js');
const css = read('editor/style.css');
const catalog = JSON.parse(read('catalog.json'));
execFileSync(process.execPath, ['--check', 'editor/app.js']);

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const uniqueIds = new Set(htmlIds);
assert.equal(uniqueIds.size, htmlIds.length, 'Duplicate IDs in editor HTML');
for (const match of script.matchAll(/\$\('([^']+)'\)/g)) {
  assert(uniqueIds.has(match[1]), 'Missing element referenced in JS: ' + match[1]);
}

for (const id of ['translationInput', 'englishInput', 'prefaceBodyEn',
  'prefaceTitleEn', 'chapterTitleEnInput', 'catalogTitleEn',
  'catalogDescriptionEn', 'previewEn', 'previewId']) {
  assert(uniqueIds.has(id), 'Missing bilingual editor input: ' + id);
}

assert.equal(catalog.schema, 'kitab-ru.catalog.v1');
assert(Array.isArray(catalog.collections));
const ids = catalog.collections.map(x => x.id);
assert.equal(new Set(ids).size, ids.length);
for (const item of catalog.collections) {
  assert(item.title && item.title_en && item.hanzi, 'Missing bilingual catalog metadata: ' + item.id);
  assert(['coming_soon', 'draft', 'available'].includes(item.status));
  if (item.status === 'available') {
    assert(/^https:\/\//.test(item.package_url));
    assert(/^[0-9a-f]{64}$/.test(item.sha256));
  }
}
for (const id of ['sishu', 'yijing', 'shujing', 'shijing', 'liji', 'chunqiu']) {
  assert(ids.includes(id), 'Missing catalog collection: ' + id);
}
assert(css.includes('@media(max-width:780px)'), 'Responsive layout missing');
assert(html.includes('app.js') && html.includes('style.css'), 'Editor assets missing');
assert(read('index.html').includes('./editor/'), 'Pages entry point missing');
console.log('Kitab Ru Editor structural checks passed: ' + htmlIds.length +
  ' HTML IDs and ' + catalog.collections.length + ' catalog entries.');
