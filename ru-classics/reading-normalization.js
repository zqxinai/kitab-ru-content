/* Ru Classics: ejaan bacaan Pinyin - Hokkian tanpa menimpa teks MATAKIN. */
(function (root) {
  'use strict';
  const PAIRS = Object.freeze([
    ['Sing Thong', 'Cheng Tang'],
    ['Koo Yau', 'Gao Yao'],
    ['I- ien', 'Yi Yin'],
    ['I-ien', 'Yi Yin'],
    ['Lai-cu', 'Lai Zhu'],
    ['Thai-kong Bong', 'Taigong Wang'],
    ['San Gi-sing', 'San Yisheng'],
    ['Khiem Tiang', 'Qin Zhang'],
    ['Sun-i Khun', 'Chunyu Kun'], // 淳於髡, Mengzi IV A:17
    ['Kong-sun Thio', 'Gongsun Chou'], // 公孫醜, Mengzi II A:1
    ['Cing See', 'Zeng Xi'], // 曾西; distinct Hanzi from 曾皙 (Cing Sik)
    ['Yancu', 'Yanzi'], // 晏子
    ['Cing Sik', 'Zeng Xi'],
    ['Bok Phi', 'Mu Pi'],
    ['Pik-tat', 'Bo Da'],
    // 伯適/伯适 ('Pik-kwat') intentionally held for contextual shi/kuo review.
    ['Tiong-tut', 'Zhong Tu'],
    ['Tiong-hut', 'Zhong Hu'],
    ['Siok-ya', 'Shu Ye'],
    ['Siok-he', 'Shu Xia'],
    ['Kwi-swi', 'Ji Sui'],
    ['Kwi-wa', 'Ji Gua'],
    ['Siau-tong', 'Xiaotong'],
    ['Kwa Siau-kun', 'Gua Xiaojun'],
    ['Kun Hu-jien', 'Jun Furen'],
    ['Hu-jien', 'Furen'],
    ['Sun', 'Shun'],
    ['Banciang', 'Wan Zhang'],
    ['Cutiang', 'Zizhang'],
    ['Khiu', 'Qiu'],
    ['Pik-i', 'Boyi'],
    ['Liu-he Hwi', 'Liu Xiahui'],
    ['Khongcu', 'Kongzi'],
    ['Bingcu', 'Mengzi'],
    ['Kuncu', 'Junzi'],
    ['Cingcu', 'Zengzi'],
    ['Cusu', 'Zisi'],
    ['Thiacu', 'Chengzi'],
    ['Thai Hak', 'Da Xue'],
    ['Tiong Yong', 'Zhong Yong'],
    ['Lun Gi', 'Lun Yu'],
    ['Su King', 'Shu Jing']
  ]);
  function escaped(value) {
    return value.replace(/[\^$.*+?()[\]{}|\\]/g, '\\$&');
  }
  function pair(text, legacy, modern) {
    const pattern = new RegExp('(^|[^\\p{L}-])(' + escaped(legacy) + ')(?=$|[^\\p{L}-])', 'giu');
    const previous = new RegExp(escaped(modern) + '\\s*-\\s*$', 'iu');
    return text.replace(pattern, (match, prefix, token, start, source) => {
      const preceding = source.slice(0, start + prefix.length);
      if (legacy === 'Hu-jien' && /\bKun\s*$/iu.test(preceding)) return match;
      if (previous.test(preceding)) return match;
      return prefix + modern + ' - ' + token;
    });
  }
  function normalize(text, passageId) {
    if (typeof text !== 'string') return text;
    // Tidak menghapus seruan "Siancai!" di tengah Lun Yu XII:11.
    let result = passageId === 'sishu.mengzi.14.38'
      ? text.replace(/\s+SIANCAI\s*$/, '')
      : text;
    // Pulihkan spasi pecah-barisan PDF pada nama Hokkian yang sama.
    result = result.replace(/\bI-\s+ien\b/g, 'I-ien');
    result = result.replace(/\bTiong-\s+hut\b/g, 'Tiong-hut');
    result = result.replace(/\bYao\s*\(\s*Giau\s*\)/g, 'Yao - Giau');
    result = result.replace(/\bGuan Zhong\s*\(\s*Kwan Tiong\s*\)/g, 'Guan Zhong - Kwan Tiong');
    result = result.replace(/\bZi Lu\s*-\s*Zi Lu\s*-\s*Cu Lo\b/g, 'Zi Lu - Cu Lo');
    result = result.replace(/\bRaja Wu\s*-\s*Bu-ting\b/g, 'Raja Wu Ding - Bu-ting');
    // 禹 (Yu) has the one-letter legacy name 'I': replace only verified name contexts.
    result = result.replace(/\bRaja I(?=$|[^\p{L}-])/gu, 'Raja Yu - I');
    // Nama diri dan istilah dengan Hanzi yang telah dikolasi dalam pasal terkait.
    result = result.replace(/\bNegeri Tien\b/g, 'Negeri Chen - Tien'); // 陳
    result = result.replace(/\bDinasti Ien\b/g, 'Dinasti Yin - Ien'); // 殷
    result = result.replace(/\bsuku bangsa Tik\b/g, 'suku bangsa Di - Tik'); // 狄
    result = result.replace(/\bsuku bangsa I\b/g, 'suku bangsa Yi - I'); // 夷
    result = result.replace(/\bPangeran Ciu\b/g, 'Pangeran Zhou - Ciu'); // 周公
    result = result.replace(/(\bseperti )I(?=\s+dan\s+(?:Koo Yau|Gao Yao))/gu, '$1Yu - I');
    result = pair(result, 'Giau', 'Yao');
    for (const [legacy, modern] of PAIRS) result = pair(result, legacy, modern);
    return result;
  }
  root.RuReading = Object.freeze({ normalize, pairs: PAIRS });
  if (typeof module !== 'undefined' && module.exports) module.exports = root.RuReading;
})(typeof window !== 'undefined' ? window : globalThis);
