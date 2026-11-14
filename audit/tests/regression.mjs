// node audit/tests/regression.mjs — source invariants and dashboard wiring
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const text=path=>readFileSync(resolve(root,path),'utf8');
const json=path=>JSON.parse(text(path));
const bundle=json('dist/sishu-content.json');
const registry=json('dist/sishu-review-status.json');
const alignment=json('dist/sishu-english-alignment.json');
const edition=json('sishu/editions/matakin-2012-chapters.json');
const catalog=json('catalog.json');
const html=text('audit/index.html');
const script=text('audit/app.js');
assert.equal(bundle.schema,'ru-classics.content.v1');
assert.equal(bundle.collection,'sishu');
assert.equal(alignment.schema,'kitab-ru.english-alignment.v1');
assert.equal(registry.schema,'kitab-ru.review-status.v1');
assert.equal(edition.schema,'ru-classics.edition-chapters.v1');
assert.equal(catalog.schema,'kitab-ru.catalog.v1');
const chapters=bundle.chapters;
const all=chapters.flatMap(ch=>(ch.passages||[]).map(p=>({ch,p})));
const ids=new Set(all.map(x=>x.p.id));
assert.equal(all.length,965,'baseline Si Shu harus tetap 965');
assert.equal(ids.size,965,'ID pasal harus unik');
assert.equal(chapters.length,78,'baseline bab Si Shu harus tetap 78');
assert.deepEqual(bundle.books,['daxue','zhongyong','lunyu','mengzi']);
for(const {p} of all){
 assert(p.id&&typeof p.translation_indonesian==='string','teks Indonesia wajib tersedia');
 assert(Array.isArray(p.ruby_paragraphs),'token Hanzi harus disediakan sebagai array');
 for(const row of p.ruby_paragraphs)assert(Array.isArray(row),'paragraf Hanzi harus berupa array token');
}
for(const entry of registry.entries||[]){
 assert(ids.has(entry.passage_id),'registry tidak boleh berisi pasal yang tidak ada');
 if(entry.english==='final'||entry.indonesian==='final'){
   assert(entry.reviewed_by&&entry.reviewed_at&&Number.isInteger(entry.source_issue)&&entry.source_issue>0,
     'status Final butuh reviewer, waktu dan issue asal');
   assert(typeof entry.hanzi_span==='string','status Final harus mengunci snapshot Hanzi');
 }
}
for(const e of edition.chapters||[])assert(chapters.some(c=>c.id===e.id),'metadata edisi mengacu ke bab yang dikenal');
for(const e of alignment.entries||[])for(const id of e.indonesian_passage_ids||[])assert(ids.has(id),'alignment mengacu ke ID pasal yang ada');
new vm.Script(script,{filename:'audit/app.js'});
const htmlIds=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
const usedIds=[...script.matchAll(/\$\('([a-zA-Z0-9]+)'\)/g)].map(x=>x[1]);
for(const id of new Set(usedIds))assert(htmlIds.has(id),'Elemen HTML tidak ditemukan: '+id);
assert(script.includes('slice(S.batch*10,S.batch*10+10)'), 'kelompok maksimal 10 pasal');
assert(script.includes("r.english_text===r.english") || script.includes('v.english_text===r.english'),'Final harus cocok dengan teks Inggris');
assert(script.includes('reviewed_at'),'Final memerlukan provenance pemeriksaan');
assert(script.includes('proposed-final'),'approval lokal tidak boleh langsung Final resmi');
assert(script.includes('fingerprint'),'ekspor persetujuan harus menyimpan fingerprint');
assert(!script.includes('fetch('+"'https://api.github.com"+'/repos/'), 'dashboard tidak boleh menulis lewat token API');
console.log('Audit regression lulus: '+all.length+' pasal / '+chapters.length+' bab / '+(edition.chapters||[]).length+' metadata bab.');
