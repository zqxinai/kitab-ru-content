'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const alignment=read('dist/sishu-english-alignment.json');
const splits=read('dist/sishu-english-passage-splits.json');
const bundle=read('dist/sishu-content.json');
const multi=alignment.entries.filter(x=>x.indonesian_passage_ids.length>1);
const byEntry=new Map(splits.entries.map(x=>[x.alignment_id,x]));
const allIds=bundle.chapters.flatMap(c=>c.passages.map(p=>p.id));

test('24 shared Zhong Yong Legge units split into 93 unique, non-repeated passage excerpts',()=>{
  assert.equal(splits.schema,'kitab-ru.english-passage-splits.v1');
  assert.equal(multi.length,24,'Unexpected count of shared source units; update split coverage before releasing');
  assert.equal(splits.entries.length,24,'An extra or missing split record');
  assert.equal(byEntry.size,multi.length,'Duplicate alignment split record');
  const used=new Set();
  for(const entry of multi){
    assert.equal(entry.english_segments.length,1,entry.id);
    const item=byEntry.get(entry.id);
    assert.ok(item,entry.id+' has no safe split');
    const ids=entry.indonesian_passage_ids;
    assert.deepEqual(Object.keys(item.passage_texts),ids,'Unexpected verse order '+entry.id);
    const pieces=ids.map(id=>{
      assert.ok(allIds.includes(id),id);
      assert.ok(!used.has(id),'Duplicate verse split: '+id);
      used.add(id);
      const part=item.passage_texts[id];
      assert.equal(typeof part,'string');
      assert.ok(part.trim().length>10,'Empty/implausibly short excerpt: '+id);
      return part;
    });
    assert.equal(pieces.join(''),entry.english_segments[0].text,
      'Splits must reconstitute Legge source exactly, without omitting or duplicating text: '+entry.id);
  }
  assert.equal(used.size,93);
  assert.ok([...used].every(id=>id.startsWith('sishu.zhongyong.')));
});
test('Zhong Yong Bab Utama I:1 and I:2 contain disjoint English passages',()=>{
  const item=byEntry.get('legge-zhongyong-01-01').passage_texts;
  assert.match(item['sishu.zhongyong.01.01'],/^What Heaven has conferred/);
  assert.doesNotMatch(item['sishu.zhongyong.01.01'],/The path may not be left/);
  assert.match(item['sishu.zhongyong.01.02'].trim(),/^The path may not be left/);
  assert.doesNotMatch(item['sishu.zhongyong.01.02'],/What Heaven has conferred/);
});
test('All 965 English drafts remain available with only one assigned excerpt per verse',()=>{
  const english=new Map();
  for(const chapter of bundle.chapters)for(const p of chapter.passages){
    if(p.translation_english)english.set(p.id,p.translation_english);
  }
  for(const entry of alignment.entries){
    for(const id of entry.indonesian_passage_ids){
      assert.ok(!english.has(id),'Source repeated into verse '+id);
      const source=entry.indonesian_passage_ids.length>1
        ? byEntry.get(entry.id)?.passage_texts[id]
        : entry.english_segments.map(s=>s.text).join('\n\n');
      assert.ok(source?.trim(),'No unique English excerpt for '+id);
      english.set(id,source.trim());
    }
  }
  assert.equal(english.size,965);
  assert.equal(new Set(english.keys()).size,965);
});
