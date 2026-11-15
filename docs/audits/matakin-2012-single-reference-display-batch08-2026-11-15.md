# Ru Classics — Audit rujukan tunggal MATAKIN batch 08

**Tanggal:** 15 November 2026 WIB  
**Cakupan:** 27 rujukan tunggal di **Zhong Yong** (13) dan **Mengzi** (14).  
**Hasil:** overlay tampilan Ru Classics naik dari **92 menjadi 119** catatan dengan kunci `passage_id + source`.

## Keputusan

- **Hubungan isi atau ajaran diterima dari MATAKIN tanpa pembuktian ulang**, sesuai keputusan pemilik cetakan. Pemeriksaan hanya menyangkut identitas kitab, nomor pasal, teks rujukan yang benar-benar muncul, keberadaan target, dan keselamatan tampilan.
- Sumber MATAKIN 2011 pada `translation_indonesian` **tidak diubah**. Setiap normalisasi mengubah hasil tampilan berdasarkan ID sumber dan teks kutipan lama yang persis, tanpa `replace` global.
- Penulisan nama buku lengkap di layar adalah **normalisasi editorial**. Hal itu **bukan** klaim bahwa penulisan lengkap dan tanda bacanya sudah sama kata demi kata dengan halaman cetak MATAKIN 2012 yang belum difoto.
- Rujukan tunggal ini memiliki satu `target_id` yang ada pada paket 965 pasal. `target_id` adalah metadata tujuan, bukan bukti navigasi hyperlink sudah diaktifkan. Rujukan multi-buku dan pemisahan subayat tidak disentuh dalam batch ini.
- Nomor bab cetak **Zhong Yong** diperhitungkan terhadap Bab Utama di penyimpanan internal: contoh `(T.S. XIX: 7)` merujuk `sishu.zhongyong.20.07`.

## Daftar 27 rujukan yang dinormalisasi

| No. | Lokasi asal | Teks sumber MATAKIN 2011 | Nama buku pada tampilan | ID tujuan dalam dataset |
| ---: | --- | --- | --- | --- |
| 1 | `sishu.zhongyong.03.01` | `(S.S. VI: 29)` | `(Sabda Suci — Lun Yu VI:29)` | `sishu.lunyu.06.29` |
| 2 | `sishu.zhongyong.06.01` | `(S.S. IX:8)` | `(Sabda Suci — Lun Yu IX:8)` | `sishu.lunyu.09.08` |
| 3 | `sishu.zhongyong.11.03` | `(Bc. IV B: 10)` | `(Mengzi — Bing Cu IV B:10)` | `sishu.mengzi.08.10` |
| 4 | `sishu.zhongyong.12.02` | `(S.S. XIV: 17)` | `(Sabda Suci — Lun Yu XIV:17)` | `sishu.lunyu.14.17` |
| 5 | `sishu.zhongyong.13.01` | `(Bc. IVB: 10)` | `(Mengzi — Bing Cu IV B:10)` | `sishu.mengzi.08.10` |
| 6 | `sishu.zhongyong.14.05` | `(S.S. III: 7)` | `(Sabda Suci — Lun Yu III:7)` | `sishu.lunyu.03.07` |
| 7 | `sishu.zhongyong.16.03` | `(S.S. VII:13)` | `(Sabda Suci — Lun Yu VII:13)` | `sishu.lunyu.07.13` |
| 8 | `sishu.zhongyong.19.06` | `(S.S. III:10)` | `(Sabda Suci — Lun Yu III:10)` | `sishu.lunyu.03.10` |
| 9 | `sishu.zhongyong.20.01` | `(S.S. II:19)` | `(Sabda Suci — Lun Yu II:19)` | `sishu.lunyu.02.19` |
| 10 | `sishu.zhongyong.20.09` | `(S.S. XIII: 9)` | `(Sabda Suci — Lun Yu XIII:9)` | `sishu.lunyu.13.09` |
| 11 | `sishu.zhongyong.20.10` | `(S.S. IX:29)` | `(Sabda Suci — Lun Yu IX:29)` | `sishu.lunyu.09.29` |
| 12 | `sishu.zhongyong.27.06` | `(S.S. II: 11)` | `(Sabda Suci — Lun Yu II:11)` | `sishu.lunyu.02.11` |
| 13 | `sishu.zhongyong.29.04` | `(T.S. XIX: 7)` | `(Tengah Sempurna — Zhong Yong XIX:7)` | `sishu.zhongyong.20.07` |
| 14 | `sishu.mengzi.03.01` | `(SS. XVIII:1)` | `(Sabda Suci — Lun Yu XVIII:1)` | `sishu.lunyu.18.01` |
| 15 | `sishu.mengzi.03.01` | `(SS.III.21)` | `(Sabda Suci — Lun Yu III:21)` | `sishu.lunyu.03.21` |
| 16 | `sishu.mengzi.03.02` | `(SS.XI.3)` | `(Sabda Suci — Lun Yu XI:3)` | `sishu.lunyu.11.03` |
| 17 | `sishu.mengzi.03.02` | `(SS. VII: 2)` | `(Sabda Suci — Lun Yu VII:2)` | `sishu.lunyu.07.02` |
| 18 | `sishu.mengzi.03.02` | `(SS.VII.26)` | `(Sabda Suci — Lun Yu VII:26)` | `sishu.lunyu.07.26` |
| 19 | `sishu.mengzi.03.02` | `(SS.XII:22)` | `(Sabda Suci — Lun Yu XII:22)` | `sishu.lunyu.12.22` |
| 20 | `sishu.mengzi.03.02` | `(S S.IX: 9)` | `(Sabda Suci — Lun Yu IX:9)` | `sishu.lunyu.09.09` |
| 21 | `sishu.mengzi.03.07` | `(SS.IV:1)` | `(Sabda Suci — Lun Yu IV:1)` | `sishu.lunyu.04.01` |
| 22 | `sishu.mengzi.04.02` | `(S.S. XVII:20)` | `(Sabda Suci — Lun Yu XVII:20)` | `sishu.lunyu.17.20` |
| 23 | `sishu.mengzi.04.09` | `(SS VII:5)` | `(Sabda Suci — Lun Yu VII:5)` | `sishu.lunyu.07.05` |
| 24 | `sishu.mengzi.04.13` | `(S.S.XIV:35)` | `(Sabda Suci — Lun Yu XIV:35)` | `sishu.lunyu.14.35` |
| 25 | `sishu.mengzi.04.13` | `(S.S.IX:5)` | `(Sabda Suci — Lun Yu IX:5)` | `sishu.lunyu.09.05` |
| 26 | `sishu.mengzi.05.03` | `(S.S.XVII:1)` | `(Sabda Suci — Lun Yu XVII:1)` | `sishu.lunyu.17.01` |
| 27 | `sishu.mengzi.02.07` | `(SS XIII.24)` | `(Sabda Suci — Lun Yu XIII:24)` | `sishu.lunyu.13.24` |

## Pemeriksaan yang dijalankan

- [`tests/matakin-reference-overlay.test.cjs`](../../tests/matakin-reference-overlay.test.cjs) mengunci jumlah **119**, keberadaan sumber dan target pada **965 pasal** yang diperiksa, teks rujukan sumber persis satu kali, tidak ada pola ganda, metadata otoritas MATAKIN, tidak ada klaim redaksi cetak 2012, serta keluaran tampilan yang idempoten.
- Lima rujukan berbeda yang muncul dalam satu pasal `sishu.mengzi.03.02` diuji agar tidak saling tertimpa.
- [`ru-classics/tests/smoke.cjs`](../../ru-classics/tests/smoke.cjs) mengunjungi contoh Zhong Yong XIX:10, Zhong Yong XXVIII:4, Mengzi II A:2, dan Mengzi II B:13 untuk memastikan nama buku lengkap muncul di halaman pembaca.
- Kedua workflow `Validate Kitab Ru Editor` dan `Audit MATAKIN cross-references` sekarang juga mengawasi perubahan [`sources/references/matakin-single-batch08.json`](../../sources/references/matakin-single-batch08.json).
- Lulus: [validasi editor](https://github.com/zqxinai/kitab-ru-content/actions/runs/43674011131), [audit MATAKIN](https://github.com/zqxinai/kitab-ru-content/actions/runs/43674011173), dan [publikasi halaman](https://github.com/zqxinai/kitab-ru-content/actions/runs/43674046644).

## Yang tidak diubah

Tidak ada modifikasi terhadap transkripsi asli bahasa Indonesia, Hanzi, pinyin, terjemahan Inggris James Legge, nomor ayat, status persetujuan Final/Perlu Review, maupun paket Android. Rujukan yang memakai separator tidak lazim atau mengandung beberapa sumber kitab belum dinormalisasi otomatis.

**Prioritas selanjutnya:** penyelesaian singkatan dengan format nomor yang tidak biasa, kemudian peningkatan navigasi ke pasal/ayat target menggunakan metadata yang sudah diuji. Tidak perlu menilai ulang keterkaitan ajaran yang ditetapkan MATAKIN.
