# Audit tahap 2 — Batch 2 (14 November 2026): polifoni Hanzi klasik

## Ringkasan koreksi yang didukung kamus dan konteks
Setelah batch 1 (176 token 地/與), seluruh 965 pasal dipindai ulang untuk karakter multibacaan. Kesalahan baru muncul karena pinyin di sejumlah aksara mengikuti pembacaan default, bukan fungsi kata dalam teks klasik. Batch ini memperbaiki **253 token** pada **lima kelompok lain + konstruksi 為**:

| Aksara/konstruksi | Perubahan | Banyak | Dasar |
| --- | --- | ---: | --- |
| 曾 | `céng → zēng` | **59** | Mencakup nama 曾子、曾皙、曾西 dan adverbia klasik “ternyata/bahkan”, bukan aspek kala lampau `céng` |
| 率 | `lǜ → shuài` | **15** | 率性, 率獸, 率土 dan arti mengikuti/memimpin. **彀率** tetap `lǜ` (standar/ukuran) |
| 薄 | `báo → bó` | **14** | Bacaan sastra klasik 薄冰, 薄稅, 薄責, 薄夫 |
| 便 | `biàn → pián` | **5** | 便便、便辟、便佞、便嬖; masing-masing tepat sesuai entri Kementerian Pendidikan Taiwan |
| 朝 | `cháo → zhāo` | **11** | Morning-context only: 朝聞道, 一朝, 朝暮, 來朝走馬, 朝不食, 朝，將視朝. **50 lainnya tidak diganti otomatis** |
| 為 | `wèi → wéi` | **149** | Hanya 以為 (106), 為政 (17), 為仁 (12), 為善 (9), 無為 (5), sesuai fungsi “menjadi/melakukan/merupakan”, bukan preposisi “untuk” |

Rujukan kamus otoritatif:
- [為 wèi/wéi](https://dict.revised.moe.edu.tw/dictView.jsp?ID=11400)
- [以為 yǐ wéi](https://dict.revised.moe.edu.tw/dictView.jsp?ID=150872)
- [為政 wéi zhèng](https://dict.revised.moe.edu.tw/dictView.jsp?ID=160776)
- [曾子 zēng zǐ](https://dict.revised.moe.edu.tw/dictView.jsp?ID=139078)
- [率性 shuài xìng](https://dict.revised.moe.edu.tw/dictView.jsp?ID=134108)
- [薄 bó](https://dict.revised.moe.edu.tw/dictView.jsp?ID=214)
- [便便 pián pián](https://dict.revised.moe.edu.tw/dictView.jsp?ID=25362)
- [便辟 pián pì](https://dict.revised.moe.edu.tw/dictView.jsp?ID=25361)
- [便佞 pián nìng](https://dict.revised.moe.edu.tw/dictView.jsp?ID=25363)
- [便嬖 pián bì](https://dict.revised.moe.edu.tw/dictView.jsp?ID=25360)

## Cakupan, tata kelola, dan pekerjaan belum selesai
- Pembetulan **hanya** pada atribut `pinyin` sumber bab. Tidak ada penggantian Hanzi, teks MATAKIN 2011/2012, terjemahan Inggris Legge, komentar historis, atau status Final.
- Pengujian `tests/contextual-pinyin-polyphones-batch2.test.js` mengunci 59 曾, 16 率 (15 shuài + 1 lǜ), 14 薄, 5 便, 11 bacaan 朝 pagi, dan 149 為 yang memiliki bukti sintaksis kuat.
- Dari total 739 karakter 為 pada snapshot, **590 contoh di luar lima pola pasti belum disertifikasi**; masih perlu tinjauan kontekstual per pasal. Sama halnya polifoni 樂、好、惡、長、王、中、處、數、間、行 dan pemakaian 朝 lainnya. Jangan tafsirkan token yang belum diubah sebagai pinyin sudah benar.
- Daftar lengkap seluruh 965 pasal berada dalam `docs/audits/master-stage2-register-2026-11-14.json`. Ini **register penyaringan dan bukti**, bukan catatan bahwa 965 pasal sudah diperiksa manual dan final. Sebanyak **912 pasal hanya tercatat sebagai screened machine**, 44 preliminarily reviewed, 8 operationally reviewed, dan 1 Da Xue X:14 membutuhkan foto MATAKIN.
- Pencarian pola komentar `愚謂`, `林氏曰`, `朱子曰`, `程子曰`, `朱氏曰`, dan `註曰` pada teks utama menghasilkan **nol kecocokan**. Dua `又曰` muncul sebagai dialog kitab, tidak otomatis komentar.
- CI dan build diterbitkan hanya setelah tes lulus; `dist/sishu-content.json` diregenerasi melalui workflow Build Si Shu sesudah merge ke main.

## Keputusan penting
Selesai **batch koreksi pasti** bukan berarti **selesai audit leksikal atau filologis menyeluruh**. Pengakuan editorial Final tetap memerlukan bukti MATAKIN 2012 per pasal, bila perbedaannya bermakna. Foto halaman cetak yang sudah dikonfirmasi tidak diminta ulang; nomor halaman situs bukan identitas bab MATAKIN.
