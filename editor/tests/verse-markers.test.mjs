import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {splitIndonesia}=require('../verse-markers.js');
const chapter=JSON.parse(readFileSync(new URL('../../sishu/chapters/mengzi/01.json',import.meta.url),'utf8'));

test('Mengzi IA pasal 1 has six explicitly numbered Indonesian ayat',()=>{
  const passage=chapter.passages.find(p=>p.id==='sishu.mengzi.01.01');
  const original=passage.translation_indonesian;
  const verses=splitIndonesia(original);
  assert.deepEqual(verses.map(v=>v.number),[1,2,3,4,5,6]);
  assert.match(verses[0].text,/menemui Raja Hui/);
  assert.match(verses[1].text,/Raja bertanya/);
  assert.match(verses[5].text,/Untuk apa bertanya tentang keuntungan/);
  assert.equal(passage.translation_indonesian,original);
});

test('the source references and paragraph markers are not mistaken for ayat',()=>{
  const verses=splitIndonesia('Awal kalimat. (2) Kedua (AB. X:23). (3) Ketiga');
  assert.equal(verses.length,3);
  assert.match(verses[1].text,/\(AB\. X:23\)/);
  assert.equal(splitIndonesia('Ayat tunggal tanpa penanda tambahan.'),null);
  assert.equal(splitIndonesia('Pertama (2) Kedua (4) Keempat'),null);
  assert.equal(splitIndonesia('Pertama (3) Ketiga'),null);
});
