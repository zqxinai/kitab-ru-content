/* Ru Classics: ejaan bacaan Pinyin - Hokkian tanpa menimpa teks MATAKIN. */
(function (root) {
  'use strict';
  const PAIRS = Object.freeze([
    ['Sing Thong', 'Cheng Tang'],
    ['Sing-thong', 'Cheng Tang'], // 湯, Lun Yu XII:22
    ['Liuhe Hwi', 'Liu Xiahui'], // 柳下惠
    ['Siok-cee', 'Shu Qi'], // 叔齊
    ['Hwan-thi', 'Fan Chi'], // 樊遲
    ['Cu-he', 'Zixia'], // 子夏
    ['Cong Bun-tiong', 'Zang Wenzhong'], // 臧文仲
    ['Ciu Jiem', 'Zhou Ren'], // 周任
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
  // Kolasi khusus berdasarkan Hanzi. Satu ejaan Hokkian bisa mewakili
  // aksara berbeda: Chien => 晉 (Jin) atau 秦 (Qin); Swan => 僎 atau 宣.
  const CONTEXTUAL = Object.freeze({
    'sishu.mengzi.01.05': [
      ['Dahulu, Negeri Cien', 'Dahulu, Negeri Jin - Cien'], // 晉國
      ['di barat dikalahkan oleh Negeri Jin - Chien', 'di barat dikalahkan oleh Negeri Qin - Chien'], // 西喪地於秦
      ['serangan Negeri Jin - Chien dan Cho', 'serangan Negeri Qin - Chien dan Chu - Cho'] // 秦楚
    ],
    'sishu.mengzi.01.07': [
      ['Pangeran Hwan', 'Pangeran Huan - Hwan'], // 齊桓
      ['Pangeran Bun dari Negeri Cien', 'Pangeran Wen - Bun dari Negeri Jin - Cien'], // 晉文
      ['seperti Chien dan Cho', 'seperti Qin - Chien dan Chu - Cho'], // 秦楚
      ['Negeri Coo', 'Negeri Zou - Coo'] // 鄒
    ],
    'sishu.mengzi.06.05': [
      ['Pangeran Kat', 'Pangeran Ge - Kat'], // 葛伯
      ['dan Cho menyerbunya', 'dan Chu - Cho menyerbunya'] // 齊楚
    ],
    'sishu.lunyu.17.05': [
      ['Kong-son Hut-jiau', 'Gongshan Furao - Kong-son Hut-jiau'], // 公山弗擾
      ['Negara Ciu Timur', 'Negara Zhou Timur - Ciu Timur'] // 東周
    ],
    'sishu.lunyu.17.10': [
      ['Ciulam', 'Zhou Nan - Ciulam'],
      ['Ciu-lam', 'Zhou Nan - Ciu-lam'], // 周南
      ['Tiau-lam', 'Shao Nan - Tiau-lam'],
      ['Tiaulam', 'Shao Nan - Tiaulam'] // 召南
    ],
    'sishu.lunyu.14.18': [
      ['Pembesar Swan', 'Pembesar Zhuan - Swan'] // 僎, MOE Taiwan zhuàn
    ],
    'sishu.mengzi.10.09': [
      ['Rajamuda Swan', 'Rajamuda Xuan - Swan'] // 齊宣王
    ],
    'sishu.lunyu.13.07': [
      ['dan Wee seperti', 'dan Wei - Wee seperti'] // 魯衛
    ],
    'sishu.mengzi.09.08': [
      ['Negeri Lu - Lo dan Wee', 'Negeri Lu - Lo dan Wei - Wee'] // 魯衛
    ]
  });

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
    // Perubahan spesifik pasal selalu dikerjakan sebelum alias umum.
    for (const [source, replacement] of CONTEXTUAL[passageId] || []) {
      if (result.includes(source)) result = result.split(source).join(replacement);
    }

    // Pulihkan spasi pecah-barisan PDF pada nama Hokkian yang sama.
    result = result.replace(/\bI-\s+ien\b/g, 'I-ien');
    result = result.replace(/\bTiong-\s+hut\b/g, 'Tiong-hut');
    result = result.replace(/\bYao\s*\(\s*Giau\s*\)/g, 'Yao - Giau');
    result = result.replace(/\bGuan Zhong\s*\(\s*Kwan Tiong\s*\)/g, 'Guan Zhong - Kwan Tiong');
    result = result.replace(/\bZisi\s*\(\s*Cusu\s*\)/g, 'Zisi - Cusu');
    result = result.replace(/\bMingde\s*\(\s*Bing Tik\s*\)/g, 'Mingde - Bing Tik'); // 明德
    result = result.replace(/\bKanggao\s*\(\s*Khong-koo\s*\)/g, 'Kanggao - Khong-koo'); // 康誥
    result = result.replace(/\bTaijia\s*\(\s*Thai Kak\s*\)/g, 'Taijia - Thai Kak'); // 太甲
    result = result.replace(/\bShangdi\s*\(\s*Siang Tee\s*\)/gi, 'Shangdi - Siang Tee'); // 上帝
    result = result.replace(/\bYouzi\s*\(\s*Yucu\s*\)/g, 'Youzi - Yucu'); // 有子
    result = result.replace(/\bNegeri Ciu\b/g, 'Negeri Zhou - Ciu'); // 周
    result = result.replace(/\bKitab Kerajaan Cho\b/g, 'Kitab Kerajaan Chu - Cho'); // 楚書
    result = result.replace(/\bPangeran Wee\b/g, 'Pangeran Wei - Wee'); // 衛君
    result = result.replace(/\bdari Bu-ting\b/g, 'dari Wu Ding - Bu-ting'); // 武丁

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
  root.RuReading = Object.freeze({ normalize, pairs: PAIRS, contextual: CONTEXTUAL });
  if (typeof module !== 'undefined' && module.exports) module.exports = root.RuReading;
})(typeof window !== 'undefined' ? window : globalThis);
