'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const edition=read('sishu/editions/matakin-2012-chapters.json');
const manifest=read('sishu/manifest.json');
const totals={daxue:11,zhongyong:33,lunyu:20,mengzi:14};
const roman=n=>{let text='';for(const [v,c] of [[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]){while(n>=v){text+=c;n-=v}}return text};

test('MATAKIN 2012 contents preserve every chapter and its printed numbering',()=>{
  assert.equal(edition.schema,'ru-classics.edition-chapters.v1');
  assert.match(edition.edition,/MATAKIN.*2012/);
  assert.equal(edition.chapters.length,78);
  const ids=new Set(edition.chapters.map(c=>c.id));
  assert.equal(ids.size,78);
  assert.equal(manifest.chapters.length,78);
  assert.deepEqual([...ids].sort(),manifest.chapters.map(c=>c.id).sort());
  for(const [book,total] of Object.entries(totals)){
    const rows=edition.chapters.filter(c=>c.id.startsWith('sishu.'+book+'.'));
    assert.equal(rows.length,total,book);
    rows.forEach((row,i)=>{
      assert.equal(row.id,'sishu.'+book+'.'+String(i+1).padStart(2,'0'));
      assert(Number.isInteger(row.page)&&row.page>0);
      if(i)assert(row.page>=rows[i-1].page,'Pages must be nondecreasing: '+book);
      const expected=book==='daxue'||book==='zhongyong'?
        (i===0?'Bab Utama':'Bab '+roman(i)):
        book==='lunyu'?'Jilid '+roman(i+1):
        'Jilid '+roman(Math.floor(i/2)+1)+' '+(i%2?'B':'A');
      assert.equal(row.label,expected,row.id);
    });
  }
});

test('Printed MATAKIN 2012 titles agree with source chapter metadata; no renumbering of IDs',()=>{
  for(const entry of manifest.chapters){
    const current=read(entry.path);
    const printed=edition.chapters.find(c=>c.id===entry.id);
    assert(printed,entry.id);
    // Preserve printed word spacing; capitalization is not an editorial discrepancy.
    const canon=s=>s.toLocaleLowerCase('id-ID');
    const raw=canon(current.title.split(' · ')[0]
      .replace(/^Jilid ([IVXLCDM]+)([AB])\b/,'Jilid $1 $2'));
    const expected=canon(printed.label==='Bab Utama'?'Bab Utama':printed.label+' — '+printed.name);
    assert.equal(raw,expected,entry.id);
    assert.equal(current.id,entry.id);
    assert.equal(current.passages.length,entry.passages);
  }
});

test('MATAKIN page references and book structure are explicit',()=>{
  assert.deepEqual(edition.front_matter.map(x=>[x.book,x.page]),
    [['daxue',2],['zhongyong',34]]);
  const find=id=>edition.chapters.find(c=>c.id===id);
  assert.equal(find('sishu.daxue.01').page,3);
  assert.equal(find('sishu.daxue.06').label,'Bab V');
  assert.equal(find('sishu.zhongyong.26').label,'Bab XXV');
  assert.equal(find('sishu.zhongyong.29').name,'Hukum Yang Di dalam Jalan Suci');
  assert.equal(find('sishu.lunyu.14').page,285);
  assert.equal(find('sishu.mengzi.09').label,'Jilid V A');
  assert.equal(find('sishu.mengzi.14').label,'Jilid VII B');
});
