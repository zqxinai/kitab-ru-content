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
    const pattern = new RegExp('(^|[^\\p{L}])(' + escaped(legacy) + ')(?=$|[^\\p{L}])', 'giu');
    const previous = new RegExp(escaped(modern) + '\\s*-\\s*$', 'iu');
    return text.replace(pattern, (match, prefix, token, start, source) => {
      if (previous.test(source.slice(0, start + prefix.length))) return match;
      return prefix + modern + ' - ' + token;
    });
  }
  function normalize(text, passageId) {
    if (typeof text !== 'string') return text;
    // Tidak menghapus seruan "Siancai!" di tengah Lun Yu XII:11.
    let result = passageId === 'sishu.mengzi.14.38'
      ? text.replace(/\s+SIANCAI\s*$/, '')
      : text;
    result = result.replace(/\bYao\s*\(\s*Giau\s*\)/g, 'Yao - Giau');
    // 禹 (Yu) has the one-letter legacy name 'I': replace only verified name contexts.
    result = result.replace(/\bRaja I(?=$|[^\p{L}])/gu, 'Raja Yu - I');
    result = result.replace(/(\bseperti )I(?=\s+dan\s+(?:Koo Yau|Gao Yao))/gu, '$1Yu - I');
    result = pair(result, 'Giau', 'Yao');
    for (const [legacy, modern] of PAIRS) result = pair(result, legacy, modern);
    return result;
  }
  root.RuReading = Object.freeze({ normalize, pairs: PAIRS });
  if (typeof module !== 'undefined' && module.exports) module.exports = root.RuReading;
})(typeof window !== 'undefined' ? window : globalThis);
