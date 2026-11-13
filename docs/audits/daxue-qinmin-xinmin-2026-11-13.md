# Audit bacaan Da Xue Bab Utama:1 — 親民 / 新民

Tanggal: 13 November 2026. ID internal: `sishu.daxue.01.01`.

## Acuan proyek dan keterbatasan bukti
- Edisi utama proyek **Si Shu MATAKIN 2012**. Namun **foto Hanzi cetakan 2012 untuk ayat spesifik ini belum diverifikasi ulang** dalam sesi ini; karena itu jangan memberi label *telah dicocokkan langsung ke foto 2012*.
- PDF MATAKIN 2011 mendasari terjemahan Indonesia saat ini. Kalimat yang dipertahankan secara identik: **“mengasihi rakyat”**; hanzi proyek saat audit `大學之道，在明明德，在親民，在止於至善。` dengan `親` pinyin `qīn`, tidak berubah.
- Dalam Zhu Xi, 《四書章句集註》 欽定四庫全書 WYG `KR1h0015_000.txt`, halaman digital `KR1h0015_WYG_000-7a`, [sumber dipatok pada `84c6b2c5093c57ae5d41c60a73c02323d2420ef0`](https://github.com/kanripo/KR1h0015/blob/84c6b2c5093c57ae5d41c60a73c02323d2420ef0/KR1h0015_000.txt), **teks utama masih menulis `親民`**, sedangkan komentar menyatakan `程子曰親當作新`: Chengzi mengusulkan `新民`. Jadi bukan kasus perbedaan Hanzi utama MATAKIN versus Zhu Xi.
- James Legge pada alignment `legge-daxue-text-01`, sumber [Online Library of Liberty](https://oll.libertyfund.org/title/2270), menggunakan **“to renovate the people”**. Pilihan ini sesuai dengan interpretasi `新民`; bukan terjemahan harfiah dari `親民` yang MATAKIN terjemahkan sebagai “mengasihi rakyat”.

## Keputusan editorial
| Unsur | Bacaan utama proyek | Bacaan/tafsir pembanding |
| --- | --- | --- |
| Hanzi | `親民` | `新民` menurut usulan Chengzi dalam komentar Zhu Xi |
| Pinyin | `qīn mín` | `xīn mín` |
| Terjemahan Indonesia | MATAKIN: “mengasihi rakyat” | Makna pembanding: “memperbarui rakyat” |
| Terjemahan Inggris | James Legge: “to renovate the people” (tetap verbatim) | Sejalan dengan tafsir `新民`, bukan kesepadanan literal `親民` |
| Status | **Review**, tidak Final | **Review**, tidak Final |

Keputusan: **pertahankan `親民`** serta semua terjemahan sumber; tambah `editorial_annotations` berjenis `interpretive_comparison` setelah paragraf utama. Catatan secara eksplisit memisahkan komentar Chengzi/Zhu Xi dari teks Da Xue, dan mengaitkan pilihan makna Legge tanpa mengubah satu kata pun dari bahasa Inggris. `dist/sishu-english-alignment.json` hanya menambah konteks pada `review_note`: `hanzi_span`, `english_segments`, URL, status, dan provenance tidak berubah.

## Kontrak non-looping
- Baca ulang pasal hanya jika bukti foto Hanzi MATAKIN 2012 baru tersedia atau ada hasil tes yang gagal.
- `tests/daxue-qinmin-xinmin-variant.test.js` menjaga checksum FNV-1a UTF-16 Indonesia (`e27ea699`), Hanzi (`1255a235`), Inggris Legge (`455a0be1`), satu anotasi varian, dist 78 bab/965 pasal, dan registry Final kosong.
- `editor/tests/daxue-qinmin-smoke.mjs` menguji satu kartu catatan yang terpisah dari Ruby, serta memastikan kedua terjemahan ditampilkan sesuai sumbernya.
- Jangan mengklaim perbedaan interpretasi sebagai kesalahan terjemahan MATAKIN; jangan tandai Final otomatis.
