'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const reading = require('../ru-classics/reading-normalization.js');
const BASE = path.resolve(__dirname, '../sishu/chapters');
const EXPECTED = { daxue: [11, 64], zhongyong: [33, 129], lunyu: [20, 512], mengzi: [14, 260] };

test('Pinyin - Hokkian: existing pairs are neither removed nor doubled', () => {
  const before = 'Mengzi - Bingcu, Kongzi - Khongcu, Junzi - Kuncu, Shun - Sun.';
  assert.equal(reading.normalize(before, 'sample'), before);
  assert.equal(reading.normalize('Yao (Giau) dan Sun', 'sample'), 'Yao - Giau dan Shun - Sun');
  assert.equal(reading.normalize('Dari Sing Thong, I- ien dan Lai-cu', 'sample'), 'Dari Cheng Tang - Sing Thong, Yi Yin - I-ien dan Lai Zhu - Lai-cu');
  assert.equal(reading.normalize('Thai-kong Bong dan San Gi-sing', 'sample'), 'Taigong Wang - Thai-kong Bong dan San Yisheng - San Gi-sing');
  assert.equal(reading.normalize('Orang-orang seperti I dan Koo Yau', 'sample'), 'Orang-orang seperti Yu - I dan Gao Yao - Koo Yau');
  assert.equal(reading.normalize('Raja I dan Raja Wen - Bun', 'sample'), 'Raja Yu - I dan Raja Wen - Bun');
  assert.equal(reading.normalize('(IIB:13) Raja', 'sample'), '(IIB:13) Raja');
  assert.equal(reading.normalize('Khiem Tiang, Cing Sik dan Bok Phi', 'sample'), 'Qin Zhang - Khiem Tiang, Zeng Xi - Cing Sik dan Mu Pi - Bok Phi');
  assert.equal(reading.normalize('Negeri Tien, Dinasti Ien, suku bangsa Tik dan suku bangsa I', 'sample'), 'Negeri Chen - Tien, Dinasti Yin - Ien, suku bangsa Di - Tik dan suku bangsa Yi - I');
  assert.equal(reading.normalize('Kun Hu-jien, Hu-jien, Siau-tong, Kwa Siau-kun', 'sample'), 'Jun Furen - Kun Hu-jien, Furen - Hu-jien, Xiaotong - Siau-tong, Gua Xiaojun - Kwa Siau-kun');
  assert.equal(reading.normalize('Pik-tat, Pik-kwat, Tiong-tut, Tiong-hut, Siok-ya, Siok-he, Kwi-swi dan Kwi-wa', 'sample'), 'Bo Da - Pik-tat, Pik-kwat, Zhong Tu - Tiong-tut, Zhong Hu - Tiong-hut, Shu Ye - Siok-ya, Shu Xia - Siok-he, Ji Sui - Kwi-swi dan Ji Gua - Kwi-wa');

  assert.equal(reading.normalize('Sun-i Khun', 'sishu.mengzi.07.17'), 'Chunyu Kun - Sun-i Khun');
  assert.equal(reading.normalize('Kong-sun Thio', 'sishu.mengzi.03.01'), 'Gongsun Chou - Kong-sun Thio');
  assert.equal(reading.normalize('Zi Lu - Zi Lu - Cu Lo', 'sishu.lunyu.11.13'), 'Zi Lu - Cu Lo');
  assert.equal(reading.normalize('Raja Wu - Bu-ting', 'sishu.mengzi.03.01'), 'Raja Wu Ding - Bu-ting');
  assert.equal(reading.normalize('Guan Zhong (Kwan Tiong)', 'sishu.mengzi.03.01'), 'Guan Zhong - Kwan Tiong');
  assert.equal(reading.normalize('Zisi (Cusu)', 'sishu.mengzi.12.06'), 'Zisi - Cusu');
  assert.equal(reading.normalize('Zisi (Cu-su)', 'sishu.mengzi.04.11'), 'Zisi - Cu-su');
  assert.equal(reading.normalize('Wan Zhang (Ban-ciang)', 'sishu.mengzi.09.01'), 'Wan Zhang - Ban-ciang');
  assert.equal(reading.normalize('Wan Zhang (Ban Ciang)', 'sishu.mengzi.06.05'), 'Wan Zhang - Ban Ciang');
  assert.equal(reading.normalize('Agama Kebajikan (TIK KAU)', 'sishu.mengzi.07.06'), 'Agama Kebajikan (De Jiao - TIK KAU)');
  assert.equal(reading.normalize('Kiu (Jiamkiu), Chik (Kong-see Chik)', 'sishu.lunyu.05.08'),
    'Qiu - Kiu (Ran Qiu - Jiamkiu), Chi - Chik (Gongxi Chi - Kong-see Chik)');
  assert.equal(reading.normalize('Kiu (Jiamkiu)', 'sishu.lunyu.05.07'), 'Kiu (Jiamkiu)');


  assert.equal(reading.normalize('Mingde (Bing Tik)', 'sishu.daxue.01.01'), 'Mingde - Bing Tik');
  assert.equal(reading.normalize('Kanggao (Khong-koo), Taijia (Thai Kak)', 'sample'), 'Kanggao - Khong-koo, Taijia - Thai Kak');
  assert.equal(reading.normalize('Shangdi (SIANG TEE)', 'sishu.zhongyong.19.06'), 'Shangdi - Siang Tee');
  assert.equal(reading.normalize('Youzi (Yucu)', 'sishu.lunyu.01.02'), 'Youzi - Yucu');
  assert.equal(reading.normalize('Negeri Ciu dan Kitab Kerajaan Cho', 'sample'), 'Negeri Zhou - Ciu dan Kitab Kerajaan Chu - Cho');
  assert.equal(reading.normalize('Pangeran Wee', 'sishu.lunyu.13.03'), 'Pangeran Wei - Wee');
  assert.equal(reading.normalize('dari Bu-ting', 'sishu.mengzi.03.01'), 'dari Wu Ding - Bu-ting');
  assert.equal(reading.normalize('Hwan-thi, Cu-he, Liuhe Hwi, Siok-cee, Cong Bun-tiong dan Ciu Jiem', 'sample'),
    'Fan Chi - Hwan-thi, Zixia - Cu-he, Liu Xiahui - Liuhe Hwi, Shu Qi - Siok-cee, Zang Wenzhong - Cong Bun-tiong dan Zhou Ren - Ciu Jiem');

  assert.equal(reading.normalize('Tiong- hut', 'sishu.lunyu.18.11'), 'Zhong Hu - Tiong-hut');
  assert.equal(reading.normalize('Cing See dan Cing Sik', 'sample'), 'Zeng Xi - Cing See dan Zeng Xi - Cing Sik');

});

test('contextual aliases are grounded in their exact source verse', () => {
  for (const [id, rules] of Object.entries(reading.contextual)) {
    const [,book,chapter] = id.split('.');
    const chapterData = JSON.parse(fs.readFileSync(path.join(BASE,book,chapter.padStart(2,'0')+'.json'),'utf8'));
    const verse = chapterData.passages.find(x=>x.id===id);
    assert.ok(verse, 'known verse '+id);
    const display = reading.normalize(verse.translation_indonesian,id);
    for (const [source,replacement] of rules) {
      assert.ok(verse.translation_indonesian.includes(source),'exact source for '+id+': '+source);
      assert.ok(display.includes(replacement),'display replacement for '+id+': '+replacement);
    }
  }
  assert.match(reading.normalize('Negeri Jin - Chien', 'sishu.mengzi.01.05'), /Negeri Jin - Chien/,
    'out-of-context substring is not rewritten by heuristic');
  assert.equal(reading.normalize('Pembesar Swan', 'sishu.lunyu.14.18'), 'Pembesar Zhuan - Swan');
  assert.equal(reading.normalize('Rajamuda Swan', 'sishu.mengzi.10.09'), 'Rajamuda Xuan - Swan');
  assert.equal(reading.normalize('Rajamuda Swan', 'sishu.lunyu.14.18'), 'Rajamuda Swan');
});

test('Jin 晉 and Qin 秦, classical title ranks, and personal names retain their own Hanzi', () => {
  const read = id => {
    const [,book,chapter] = id.split('.');
    const data = JSON.parse(fs.readFileSync(path.join(BASE,book,chapter+'.json'),'utf8'));
    const passage = data.passages.find(p=>p.id===id);
    assert.ok(passage,id);
    return {
      source:passage.translation_indonesian,
      display:reading.normalize(passage.translation_indonesian,id),
      hanzi:passage.ruby_paragraphs.flat().map(t=>t.traditional||t.value||'').join('')
    };
  };
  const baili=read('sishu.mengzi.09.09');
  assert.match(baili.hanzi,/百里奚.*秦穆公.*晉人/);
  assert.match(baili.display,/Baili Xi - Pik-li Hee/);
  assert.match(baili.display,/Negeri Qin - Chien/);
  assert.match(baili.display,/Negeri Jin - Cien/);
  assert.match(baili.display,/Gong Zhiqi - Kiong Ciki/);
  assert.doesNotMatch(baili.display,/Negeri Jin - Chien/);
  assert.match(baili.source,/Negeri Jin - Chien/,'archived translation is not silently overwritten');
  const zin=read('sishu.mengzi.04.02');
  assert.match(zin.hanzi,/晉楚之富/);
  assert.match(zin.display,/Kekayaan Negeri Jin - Cien dan Chu - Cho/);
  const title=read('sishu.mengzi.10.02');
  assert.match(title.hanzi,/天子一位，公一位，侯一位，伯一位，子、男/);
  assert.match(title.display,/Tianzi - Thian-cu/);
  assert.match(title.display,/Gong - Kong \(Duke\)/);
  assert.match(title.display,/Hou - Ho \(Marquis\)/);
  assert.match(title.display,/Bo - Pik \(Earl\)/);
  assert.match(title.display,/Zi - Cu \(Count\)/);
  assert.match(title.display,/Nan - Lam \(Baron\)/);
  const wang=read('sishu.mengzi.06.06');
  assert.match(wang.hanzi,/戴不勝/);
  assert.match(wang.hanzi,/薛居州/);
  assert.match(wang.display,/Dai Busheng - Tai Put-sing/);
  assert.match(wang.display,/Xue Juzhou - Siat Ki-ciu/);
  const gan=read('sishu.lunyu.02.09');
  assert.match(gan.hanzi,/吾與回言終日/);
  assert.match(gan.display,/Hui - Hwee \(Gan Yan\)/);
  const unclear=read('sishu.daxue.11.14');
  assert.match(unclear.hanzi,/《秦誓》/);
  assert.match(unclear.display,/Pangeran Chien/,'translator phrasing awaits edition review');
  const bo=read('sishu.lunyu.18.11');
  assert.match(bo.display,/Pik-kwat/,'classical shi/kuo ambiguity remains review');
});

test('Yu (禹) is not confused with Yi (夷), Yi Yin (伊尹), or book-number notation', () => {
  const verse = id => {
    const [,book,chapter] = id.split('.');
    const data = JSON.parse(fs.readFileSync(path.join(BASE,book,chapter+'.json'),'utf8'));
    return data.passages.find(p=>p.id===id);
  };
  const source = verse('sishu.mengzi.09.06').translation_indonesian;
  const normalized = reading.normalize(source,'sishu.mengzi.09.06');
  assert.match(normalized,/Sun mengusulkan Yu - I kepada Tuhan YME/);
  assert.match(normalized,/Yu - I mengusulkan Ik kepada Tuhan YME/);
  assert.match(normalized,/Yi Yin - I-ien/);
  assert.match(normalized,/Shu Jing - Su King I\.I\.4/);
  assert.equal(reading.normalize(normalized,'sishu.mengzi.09.06'),normalized);
  const floods = reading.normalize(verse('sishu.mengzi.06.09').translation_indonesian,'sishu.mengzi.06.09');
  assert.match(floods,/Yu - I disuruhnya mengatasi/);
  assert.match(floods,/orang-orang I dan Tik/,'I (夷) must not be treated as Yu (禹)');
  const ponds = reading.normalize(verse('sishu.mengzi.05.04').translation_indonesian,'sishu.mengzi.05.04');
  assert.match(ponds,/Yu - I selama 8 tahun/);
  assert.match(ponds,/kebudayaan I'/,'cultural Yi (夷) must remain distinct');
});

test('only Mengzi VII B:38 drops extraneous terminal colophon; legitimate Siancai stays', () => {
  const tail = 'Mengapa tiada yang meneruskan ajaran Nya?" ( IIB:13 ). SIANCAI';
  assert.equal(reading.normalize(tail, 'sishu.mengzi.14.38'), 'Mengapa tiada yang meneruskan ajaran Nya?" ( IIB:13 ).');
  assert.equal(reading.normalize('Ia berkata, "Siancai! Sungguh tepat."', 'sishu.lunyu.12.11'),
    'Ia berkata, "Siancai! Sungguh tepat."');
  assert.equal(reading.normalize(tail, 'other'), tail);
});

test('entire source: 78 chapters, 965 unique verses, no lossy edits, stable display', () => {
  let chapterCount = 0;
  let passageCount = 0;
  let normalizedCount = 0;
  const ids = new Set();
  const perBook = {};
  for (const [book, [expectedChapters, expectedVerses]] of Object.entries(EXPECTED)) {
    const dir = path.join(BASE, book);
    const files = fs.readdirSync(dir).filter(name => /^\d{2}\.json$/.test(name)).sort();
    assert.equal(files.length, expectedChapters, book + ' chapter coverage');
    perBook[book] = 0;
    for (const name of files) {
      const chapter = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
      chapterCount++;
      for (const verse of chapter.passages) {
        passageCount++;
        perBook[book]++;
        assert.ok(!ids.has(verse.id), 'duplicate ' + verse.id);
        ids.add(verse.id);
        const source = verse.translation_indonesian;
        assert.ok(typeof source === 'string' && source.length > 0, verse.id);
        const output = reading.normalize(source, verse.id);
        assert.equal(reading.normalize(output, verse.id), output, 'idempotency ' + verse.id);
        assert.equal(verse.translation_indonesian, source, 'source immutable ' + verse.id);
        if (output !== source) normalizedCount++;
        assert.doesNotMatch(output, /(?:KATA PENGANTAR|BAB UTAMA|SIANCAI)\s*$/u, 'unexpected ending ' + verse.id);
        if (verse.id === 'sishu.daxue.11.23') {
          assert.ok(!output.includes('Zhong Yong - Tiong Yong'), 'previous chapter overflow');
        }
      }
    }
    assert.equal(perBook[book], expectedVerses, book + ' verse coverage');
  }
  assert.equal(chapterCount, 78);
  assert.equal(passageCount, 965);
  console.log('Audited all passages: ' + JSON.stringify({ chapterCount, passageCount, normalizedCount, perBook }));
});
