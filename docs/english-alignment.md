# Pemetaan Pasal Indonesia MATAKIN ↔ James Legge

Editor membaca `dist/sishu-english-alignment.json` untuk padanan eksplisit berdasarkan rentang Hanzi proyek, yang **bukan** bagian dari PDF MATAKIN. Asal Hanzi ada di [`docs/hanzi-provenance.md`](hanzi-provenance.md). Berkas ini tidak mengganti penomoran MATAKIN ataupun James Legge.

Satu entri dapat menghubungkan banyak `indonesian_passage_ids` dengan banyak `english_segments`, dan satu pasal Indonesia dapat muncul di lebih dari satu entri untuk pemetaan parsial. Gunakan ID passage stabil yang sudah ada di `dist/sishu-content.json`.

## Struktur entri

```json
{
  "id": "unique-alignment-id",
  "indonesian_passage_ids": ["existing-passage-id"],
  "english_segments": [
    {
      "legge_ref": "Legge edition book/chapter/section reference",
      "text": "Exact source text, verified against cited edition"
    }
  ],
  "hanzi_span": "Full matching traditional Hanzi for the unit",
  "source_url": "Direct source/scan URL",
  "status": "draft",
  "review_note": "Where the two passage boundaries differ"
}
```

Status `draft` berarti belum diverifikasi; hanya `verified` setelah pemeriksa mencocokkan **seluruh** cakupan Hanzi, memeriksa urutan, dan mengonfirmasi kutipan/sumber Inggris. Jangan mengisi status verified otomatis hanya karena nomor pasal sama. Jangan menggandakan segmen Inggris yang sama pada satu pembacaan; jika ada pemetaan parsial, pecah menjadi unit Hanzi paling kecil yang sah.

## Tahapan migrasi

1. Pertahankan 246 terjemahan Inggris Lun Yu yang sudah ada sebagai **draf** dan jangan menandainya verified otomatis.
2. Ambil teks Inggris dari edisi James Legge yang jelas sumber dan hak penggunaannya.
3. Bangun indeks unit sumber Inggris per kitab, lalu cocokkan rentang Hanzi dengan teks Indonesia.
4. Masukkan entri pemetaan satu per satu atau dalam batch teruji; audit missing/duplicate/out-of-order.
5. Setelah seluruh 965 pasal diperiksa, baru naikkan status kelengkapan katalog dan paket.

## Impor Lun Yu batch 1 — 13 November 2026

Teks Inggris diambil dari edisi James Legge melalui Project Gutenberg:

- [The Analects of Confucius, terjemahan Inggris saja (#3330)](https://www.gutenberg.org/ebooks/3330).
- [The Chinese Classics: Confucian Analects, Hanzi dan Inggris (#4094)](https://www.gutenberg.org/ebooks/4094).

Impor ini **tidak** sekadar menyamakan nomor pasal. Awal Hanzi dalam edisi dwibahasa Legge dipasangkan dengan seluruh ID pasal di bab MATAKIN menggunakan kemiripan karakter pertama (hingga 12 karakter), margin terhadap kandidat kedua, keunikan bab sumber Inggris, serta pengecekan batas pasal selanjutnya. Entitas yang melibatkan penggabungan atau pemisahan bab, bab ganda, urutan tak jelas, atau kutipan hilang **tidak dipaksakan** dan ditandai belum tersedia. Semua hasil baru berstatus `draft`.

Jumlah entri tambahan:
| Bab Lun Yu | Pasal Inggris draf baru |
| --- | ---: |
| V | 22 |
| VI | 26 |
| VII | 33 |
| IX | 27 |
| X | 11 |
| XI | 22 |
| XIV | 37 |
| XV | 38 |
| **Total** | **216** |

Setelah batch Zhong Yong tersedia **602 dari 965 pasal** dalam tampilan editor: 246 teks Inggris dalam paket utama, 216 Lun Yu baru melalui peta padanan, 11 Da Xue, dan **seluruh 129 Zhong Yong**. Sebanyak **363 pasal** belum tersedia. Jumlah ini mencakup gabungan paket dasar dan overlay pemetaan; `dist/sishu-content.json` tetap memuat 246 terjemahan Inggris langsung, sedangkan `catalog.json` mencatat gabungannya. Jangan menganggap 602 sebagai jumlah pasal yang telah di-review final; registry pengesahan masih kosong.

Pemetaan dengan pasal pecah/gabung memerlukan pemeriksaan lanjutan yang mempertahankan referensi Legge dan MATAKIN masing-masing. Lihat `docs/editorial-finalization.md` untuk alur persetujuan.

## Batch Zhong Yong — 33 bab / 129 pasal

- **64 unit sumber Inggris James Legge** beserta Hanzi sumber telah disimpan dalam `sources/legge/zhongyong-confuciuspedia.json`. Sumber yang menyebutkan penerjemah James Legge: https://confuciuspedia.com/lib/the-doctrine-of-the-mean/amp/ .
- Peta `dist/sishu-english-alignment.json` berisi **60 entri** yang mengaitkan seluruh **129 pasal MATAKIN** dengan 64 unit tersebut. Setiap unit sumber Inggris terpakai tepat satu kali dan tidak ada ID pasal yang terduplikasi.
- Penyelarasan otomatis menggunakan karakter Hanzi yang dinormalisasi, bukan kesamaan nomor pasal; nilai kemiripan minimum 96% pada pasal sumber yang digabung secara berurutan.
- Alat yang bisa dijalankan ulang: `node tools/import_legge_zhongyong.js`. Kamus OpenCC untuk konversi aksara sederhana ke tradisional tersimpan di `tools/dictionaries/OpenCC-STCharacters.txt` dengan atribusi lisensi Apache-2.0 kepada OpenCC.
- Pemeriksaan regresi otomatis: `node --test tests/zhongyong-coverage.test.js`.
- Semua hasil tetap **draf**, belum berstatus final. Naskah Inggris pada situs sekunder tetap memerlukan pengecekan ke edisi cetak/teks primer Legge, termasuk transliterasi dan tanda baca sebelum disetujui.
- Pada kasus satu unit sumber Inggris mencakup beberapa pasal MATAKIN, teks Inggris ditautkan sebagai satu kelompok sesuai sumber alih-alih dipotong dan dikarang ulang.

## Batch Mengzi 1 — bab 1–3 (32 pasal)

- 32 pasal Mengzi (7 + 16 + 9) dipadankan **satu-satu setelah pemeriksaan awal Hanzi**, tanpa mengganti nomor dan teks Indonesia.
- Sumber transkripsi dwibahasa yang mengatribusikan terjemahan kepada James Legge: [alexamies/chinesenotes.com](https://github.com/alexamies/chinesenotes.com/tree/main/corpus/mengzi). Snapshot unit dengan SHA berkas sumber tersimpan di `sources/legge/mengzi-chinesenotes-01-03.json`.
- Kecocokan awal 20 Hanzi minimal 90% setelah normalisasi konservatif; rasio panjang Hanzi minimal 83%. **Belum** membuktikan kesesuaian setiap kata/ayat, sehingga semuanya `draft`.
- Katalog sekarang **634/965 draf Inggris**, **331 belum tersedia** (semuanya Mengzi bab selanjutnya). Tidak ada pengesahan final otomatis.
- Pengujian: `node --test tests/mengzi-coverage.test.js` beserta audit editorial sebelumnya.

## Batch Mengzi 2 — bab 13–14 (82 pasal)

- 82 pasal mendapat draf Inggris Legge: 45 pada bab 13 dan 37 pada bab 14. Dua pasal terakhir masing-masing bab **ditahan** karena transkripsi sumber menyisipkan materi/metadata yang tidak cocok dengan rentang Hanzi yang digunakan proyek (rasio di bawah 95%).
- Source snapshot dengan SHA blob dan transkripsi Hanzi/Inggris: `sources/legge/mengzi-chinesenotes-13-14.json`. Pemetaan hanya dibuat bila batas pasal teridentifikasi unik, urut, rasio panjang Hanzi >=95%, dan terjemahan tidak kosong.
- **Status tetap draf dan perlu review**, belum pengesahan; perbandingan lengkap terhadap James Legge edisi primer belum dilaksanakan.
- Cakupan kumulatif: **716 dari 965 pasal**, belum tersedia **249** (Da Xue 53, Lun Yu 50, Mengzi 146). Total pasal Mengzi yang memiliki Inggris kini 114 dari 260.
- Pengujian tambahan: `node --test tests/mengzi-coverage-13-14.test.js`.

### Koreksi metadata sumber Mengzi 1–3

Tiga catatan `English translation: Legge 1861` di akhir transkripsi bab 1–3 dipisahkan dari teks ayat Inggris. Metadata atribusi tetap tercatat sebagai `source_footer_attribution` dalam snapshot masing-masing bab, bukan sebagai terjemahan yang dibaca. Jumlah dan ID pasal tidak berubah; seluruhnya tetap draf.

## Batch Mengzi 3 — bab 4–12 (118 pasal)

- Menambahkan **118 draf** Inggris yang dirangkai dari unit sumber James Legge berurutan, dengan pemeriksaan seluruh Hanzi minimal **95%** kesamaan karakter. Cakupan per bab: 4:13, 5:0, 6:8, 7:26, 8:31, 9:7, 10:2, 11:18, 12:13.
- Snapshot sumber, rentang unit, SHA commit sumber, dan daftar alasan pasal yang belum dipetakan: `sources/legge/mengzi-chinesenotes-04-12.json`; commit sumber `5d2e867ecfb33e16a6aed392c6b8b8cde3896030` (*pinned*).
- Penggabungan hanya dari unit sumber berurutan yang cocok dengan Hanzi pasal Indonesia; teks Inggris tidak dikarang ulang dan tidak mengganti Hanzi, pinyin, atau teks Indonesia.
- **28 pasal Mengzi** masih belum tersedia. Seluruh bab 5 perlu pemetaan manual karena batas/urutan transkripsi sumber tidak cocok secara memadai. Bagian meragukan sengaja dikecualikan.
- Total saat ini: **834/965** draf Inggris di editor: Da Xue 11, Lun Yu 462, Zhong Yong 129, Mengzi 232. **131 belum tersedia**: Da Xue 53, Lun Yu 50, Mengzi 28.
- Semua `draft` / *needs review*. Tidak ada perubahan status Final. Regresi: `node --test tests/mengzi-coverage-04-12.test.js`.

## Batch kecil 10 pasal Mengzi — 13 November 2026

- Menambahkan tepat **10 pasal Inggris** draf: `sishu.mengzi.08.24`; `sishu.mengzi.10.02`, `10.04`–`10.09`; `sishu.mengzi.11.05`; dan `sishu.mengzi.12.02`.
- Pembaca sumber kini mengenali baris Hanzi yang dimulai tanda kutip Tionghoa. Tanpa pembenahan ini, banyak kalimat Hanzinya sebelumnya salah masuk bagian Inggris sehingga perbandingan gagal. Tidak ada rekonstruksi teks Inggris dari AI.
- Memakai source commit immutable `5d2e867ecfb33e16a6aed392c6b8b8cde3896030` dan snapshot audit `sources/legge/mengzi-chinesenotes-10-passages-batch-02.json` dengan rentang unit sumber, Hanzi pembanding, teks Inggris asli, dan persentase kecocokan.
- Kesesuaian Hanzi lengkap **99,17–100%** setelah normalisasi aksara; pembaca tetap harus meninjau perbedaan karakter/edisi, terutama nama dan variasi transkripsi. Bab 10 Mengzi kini lengkap sebagai draf Inggris (9/9 pasal).
- Total editor **844/965** berisi draf Inggris: Da Xue 11, Lun Yu 462, Zhong Yong 129, Mengzi 242. **121 masih kosong**: Da Xue 53, Lun Yu 50, Mengzi 18.
- Kesepuluh teks masih `draft` / `needs_review`. **Tidak ada status Final otomatis**; Indonesia, Hanzi, pinyin, dan registry pengesahan tidak diubah. Android offline akan disinkronkan sebagai pekerjaan terpisah setelah batch konten.

## Batch kecil Mengzi 03 — 13 November 2026 (10 pasal)

- Draf baru: `sishu.mengzi.04.04`, `05.01–05.05`, `06.03`, `06.09`, `13.46`, `14.38`. Kelima pasal Bab 5 sekarang tersedia sebagai **draf**, bukan Final.
- Teks Inggris James Legge dikutip dari `alexamies/chinesenotes.com` pada commit sumber tetap `5d2e867ecfb33e16a6aed392c6b8b8cde3896030`; snapshot sumber `sources/legge/mengzi-chinesenotes-10-passages-batch-03.json` menyimpan rentang unit, Hanzi rujukan, teks Inggris, dan catatan variasi.
- Kesesuaian Hanzi sumber terhadap seluruh rentang pasal MATAKIN berkisar **96,70%–100%** setelah normalisasi sederhana. Perbedaan aksara, transmisi teks, dan atribusi sumber masih **harus diperiksa secara manual**.
- Cakupan editor menjadi **854/965 draf Inggris (88,5%)**, tersisa **111**: Da Xue 53, Lun Yu 50, Mengzi 8. Tidak mengubah teks Indonesia, Hanzi, pinyin, status Final, maupun aset Android.
- Pengujian regresi: `node --test tests/mengzi-coverage-batch-03.test.js`.

## Batch kecil Mengzi 04 — 13 November 2026 (4 pasal)

- Menambah **empat draf** Inggris yang dicocokkan pada keseluruhan Hanzi: `sishu.mengzi.09.05`, `11.03`, `12.01`, dan `12.13`. Tidak ada status Final yang diberikan.
- Snapshot sumber: `sources/legge/mengzi-chinesenotes-4-passages-batch-04.json`, pada commit tetap `5d2e867ecfb33e16a6aed392c6b8b8cde3896030`. Pemeriksaan mencakup seluruh paragraf yang dipisahkan dalam edisi Inggris James Legge, termasuk baris Hanzi yang diawali tanda kutip.
- Kesesuaian Hanzi lengkap berkisar **96,77–99,71%** menurut kesamaan edit karakter setelah penghilangan tanda baca (tanpa mengubah teks sumber). Perbedaan aksara dan kesetiaan terjemahan masih perlu pemeriksaan manual; karena itu tetap `draft`.
- Ketersediaan Inggris editor kini **858/965 (88,9%)**, tersisa **107**: Da Xue 53, Lun Yu 50, Mengzi 4. Mengzi 256/260 tersedia sebagai draf.
- Sisa Mengzi yang sengaja **belum dipaksakan**: `07.23` (忌 ↔ 患), `07.25` (variasi 哺 ↔ 餔), `08.17` (祥 ↔ 詳), `09.07` (rentang Hanzi sumber tidak lengkap). Perbedaan ini membutuhkan pemeriksaan filologis.
- Naskah Indonesia, Hanzi, pinyin, registry Final dan paket offline Android tetap tidak berubah.
- Tes: `node --test tests/mengzi-coverage-batch-04.test.js`.

## Batch kecil Lun Yu 05 — 13 November 2026 (10 pasal)

- Draf Inggris James Legge ditambahkan pada **10 pasal Lun Yu Bab X**: 10:10, 10:12–16, 10:19–20, serta 10:22–23. Kesepuluhnya `draft` dan membutuhkan pemeriksaan editorial sebelum `final`.
- Sumber independen: James Legge, `The Chinese Classics, Vol. I: Confucian Analects` (edisi dwibahasa), Project Gutenberg eBook **#4094**, https://www.gutenberg.org/cache/epub/4094/pg4094-images.html . Snapshot teks dan rentang baris: `sources/legge/lunyu-b05-gutenberg-4094.json`.
- Nomor **pasal Indonesia MATAKIN tidak disamakan** dengan nomor Chapter/Section edisi Legge. Contoh: pasal Indonesia 10:10 = Book X, Chapter VIII, section 9 pada Legge; pasal 10:23 = Book X, Chapter XV, sections 2–3 (teks Inggris digabung tepat mengikuti edisi).
- Seluruh Hanzi sumber per pasal cocok pada rentang lengkap setelah hanya menghapus tanda baca; bahasa Inggris disalin sebagai draf tanpa membuat versi AI baru. Variasi pemenggalan dan redaksi tetap perlu peninjauan manusia.
- Cakupan editor kini **868/965 (89,9%)**: Da Xue 11/64, Zhong Yong 129/129, Lun Yu 472/512, Mengzi 256/260. Sebanyak **97 belum tersedia**: Da Xue 53, Lun Yu 40, Mengzi 4.
- Tidak mengubah teks Hanzi, pinyin, terjemahan Indonesia MATAKIN, registry `Final`, atau paket Android offline. `dist/sishu-content.json` masih mempunyai 246 Inggris yang tertanam; 622 tambahan tersedia melalui peta padanan editor.
- Uji: `node --test tests/lunyu-batch-05.test.js`.


## Batch kecil Lun Yu 06 — 13 November 2026 (10 pasal)

- Draf baru: `07.09`, `07.10`, `07.18`, `07.29`, `07.30`, `10.09`, `10.11`, `11.02`, `15.22`, `15.37` pada kitab Lun Yu.
- Teks Inggris James Legge berasal dari Project Gutenberg #4094; snapshot `sources/legge/lunyu-b06-gutenberg-4094.json` menyimpan petikan, rentang Hanzi dan nomor baris sumber.
- Sepuluh bagian cocok 100% berdasarkan seluruh karakter Hanzi setelah mengabaikan tanda baca. Legge VII.IX §§1–2 dipadankan terpisah dengan MATAKIN 07.09–07.10; Legge VII.XXVIII–XXIX dengan MATAKIN 07.29–07.30; Legge X.VIII §§8,10 dengan MATAKIN 10.09 dan 10.11.
- **Koreksi atribusi sumber (13 Nov 2026):** Empat karakter di `09.26`, `10.24`, `11.03`, `14.33` merupakan Hanzi dari korpus **hanzhaodeng/chinese-ancient-text**, bukan Hanzi yang dicetak MATAKIN. Korpus sumber masing-masing memuat 帅 (→ 帥), 客, 季路, dan 曰; Legge memiliki 師, 容, 李路, dan 子曰. Semua perbedaan dicatat sebagai **perbedaan korpus sumber**, bukan kesalahan MATAKIN. Lihat [audit asal Hanzi](hanzi-provenance.md).
- Cakupan editor kini **878/965 draf Inggris**, **87 tersisa**: Da Xue 53, Lun Yu 30, Mengzi 4. Jumlah persetujuan Final tetap 0; terjemahan Indonesia/Hanzi/pinyin dan paket Android tidak diubah.
- Pengujian regresi baru: `node --test tests/lunyu-batch-06.test.js`. Pengujian batch sebelumnya mempertahankan nilai batas minimal historis agar tambahan baru tidak memicu pengulangan perbaikan angka.

## Batch editorial varian 07 — 13 November 2026

- **Tujuh draf Inggris baru:** Mengzi `07.23`, `07.25`, `08.17`; Lun Yu `09.26`, `10.24`, `11.03`, `14.33`.
- Pencocokan teks dilakukan pada **seluruh pasal**, memeriksa sumber Legge Inggris dan konteks Indonesia. Perbedaan 1–2 karakter Hanzi dicatat per pasal dalam `review_note`, bukan diabaikan demi angka kecocokan 100%.
- Sumber terarsip: `sources/legge/mengzi-variants-b05-chinesenotes.json` (teks dwibahasa dari commit sumber `5d2e867ecf...`) dan `sources/legge/lunyu-b07-gutenberg-4094.json` (Legge Project Gutenberg #4094 dengan nomor baris).
- **Mengzi 09.07 belum ditandai lengkap** karena Hanzi proyek menyisipkan komentar Zhu Xi `林氏曰` dan `愚謂` ke tubuh pasal. Pemisahan teks dan regenerasi Ruby/pinyin/paket sumber diperlukan sebelum pemetaan Inggris dapat disahkan.
- Catatan perbedaan, rekomendasi Da Xue `親民/新民` dan backlog pinyin/nama: [audit perbedaan](sishu-textual-variants.md) dan [backlog](sishu-audit-backlog.md).
- Cakupan terkini **885/965 draf Inggris**, tersisa **80** (Da Xue 53, Lun Yu 26, Mengzi 1). Semuanya **Perlu Review**; jumlah Final tetap 0. Teks Indonesia, Hanzi, pinyin dan aset Android **tidak berubah**.
- Tes regresi: `node --test tests/textual-variants-b07.test.js`; semua versi batch sebelumnya tetap diperiksa sebagai batas minimum historis.


## Batch khusus Mengzi IX:7 — 14 November 2026

- Setelah kontaminasi komentar `林氏曰` dan `愚謂` dipisah dari teks utama dalam audit sebelumnya, Hanzi proyek untuk `sishu.mengzi.09.07` kembali dicocokkan terhadap sumber dwibahasa James Legge yang dipin ke commit `5d2e867ecfb33e16a6aed392c6b8b8cde3896030`.
- Dua unit sumber berurutan 32–33 (baris 103–104, 106–107 pada `corpus/mengzi/mengzi009.txt`) meliputi seluruh pasal tanpa komentar Zhu Xi tambahan. Kesamaan setelah mengabaikan tanda baca: **339 dari 340 Hanzi (99,71%)**. Satu varian adalah `系` dalam Ru Classics vs `繫` pada transkripsi sumber; Hanzi MATAKIN tetap dipertahankan.
- Salinan sumber dan provenance: `sources/legge/mengzi-09-07-chinesenotes.json`; peta Inggris: `legge-mengzi-09-07`. Terjemahan Inggris ditampilkan sebagai **Draft**, tidak diubah atau diterjemahkan ulang oleh AI.
- Cakupan editor meningkat dari **885 menjadi 886 dari 965 pasal**. Mengzi kini **260/260 draf Inggris**, tetapi belum satu pun disahkan Final. Tersisa **79 pasal**: Da Xue 53 dan Lun Yu 26.
- Tes regresi `tests/mengzi-09-07-english.test.js` menjaga pasangan lengkap, provenance, perbedaan grafem, pemisahan komentar, dan ketiadaan status Final. Pemeriksaan terhadap cetakan utama James Legge dan approval reviewer tetap pekerjaan berikutnya.


## Batch kecil Da Xue 08 — 14 November 2026 (10 pasal)

- Draf Inggris James Legge untuk `sishu.daxue.03.01–03.04`, `04.01–04.05`, dan `05.01`: **10 pasal baru**; hanya overlay peta Inggris, tidak mengubah Hanzi, pinyin, Indonesia MATAKIN, pembagian pasal, status editorial, atau sumber Android.
- Ref Legge yang benar mengikuti **Commentary of Tsang Chapters II §§1–4, III §§1–5, IV §1**, berbeda dari nomor bab MATAKIN (III–V). Perbandingan seluruh teks Hanzi diambil dari paket kerja dan sumber dwibahasa. Penyesuaian Hans/Hant dipakai hanya untuk kalkulasi kemiripan, tidak diterapkan ke naskah MATAKIN.
- Bukti tersimpan: `sources/legge/daxue-b08-10-passages.json`; transkripsi Inggris James Legge https://tianmu.org/good-work-library/confucian/general-texts/the-great-learning-james-legge; Hanzi pembanding https://confuciuspedia.com/lib/the-great-learning/; pembanding lain https://xinxingren.gen.nz/classics/%E5%A4%A7%E5%AD%B8_Great_Learning.html; arsip karya Legge https://oll.libertyfund.org/title/2270.
- Kasus `04.01`: sumber dwibahasa memakai `惟` sedangkan Hanzi proyek `維`. Kasus `04.04`: perbedaan `喧/諠` dan `恂慄/恂栗` terdokumentasi; jangan ganti aksara yang telah diaudit dari foto MATAKIN 2012. `03.01` hanya berbeda tanda buku `《盤銘》` vs `盤銘`.
- Cakupan editor naik menjadi **896/965 (92,85%)**: Da Xue 21/64, Zhong Yong 129/129, Lun Yu 486/512, Mengzi 260/260. **69 belum tersedia**: Da Xue 43, Lun Yu 26. Final editorial **0**; semua 10 tetap `draft` dan memerlukan verifikasi terhadap cetakan Legge primer sebelum disetujui.
- Regresi tambahan: `node --test tests/daxue-batch-08.test.js`, terintegrasi ke `editorial-review.yml`, memeriksa angka cakupan, ID unik, kesamaan snapshot Inggris, status Draft, posisi sumber, dan varian Hanzi yang tidak diubah.

## Da Xue batch 09 — 10 draf Inggris tambahan (14 November 2026)

Dari 21 menjadi **31/64** pasal Da Xue yang tersedia dalam editor. Pasal yang ditambahkan berstatus **Draft**: **VII:1–4 (4 pasal), VIII:1–3 (3 pasal), IX:1–3 (3 pasal)**. Sumber James Legge adalah [Tianmu, The Great Learning](https://tianmu.org/good-work-library/confucian/general-texts/the-great-learning-james-legge), dengan referensi paragraf yang tercatat di `sources/legge/daxue-b09-10-passages.json`. Validasi yang dapat diulang berada dalam `tests/daxue-batch-09.test.js`.

- **Da Xue IX:1** mencakup dua paragraf dalam transkripsi Legge; keduanya ditautkan ke satu ID MATAKIN tanpa menggandakan pasal.
- **Da Xue VI:1** sengaja tetap belum dipetakan karena teks pasal proyek mencakup penjelasan Zhu Xi tambahan yang melampaui satu unit Legge; perlu pemisahan sumber versus anotasi sebelum diterjemahkan.
- Teks Indonesia MATAKIN, Hanzi, pinyin, dan registry status Final **tidak diubah**. Pencocokan belum berarti persetujuan editorial.
- Progres terkini: **906/965 draf Inggris** (246 tertanam, 660 via alignment), **59 belum tersedia**; Da Xue 31/64, Lun Yu 486/512, Zhong Yong 129/129, Mengzi 260/260. Status Final: 0.

## Da Xue batch 10 — 10 draf Inggris tambahan (14 November 2026)

Batch baru menambahkan sepuluh pasal **Da Xue X:1–9 dan XI:1**, seluruhnya berstatus **Draft**. Sumber Inggris: [The Great Learning — James Legge (Tianmu)](https://tianmu.org/good-work-library/confucian/general-texts/the-great-learning-james-legge), baris 77–90, yang dicatat per-unit dalam `sources/legge/daxue-b10-10-passages.json`. Pembanding Hanzi: [Confuciuspedia](https://confuciuspedia.com/lib/the-great-learning/); perbedaan sumber tidak dijadikan alasan mengubah teks MATAKIN.

- Da Xue X:4 memakai dua paragraf Inggris Legge, tetapi **satu** ID pasal MATAKIN.
- Da Xue XI:1 juga memakai dua paragraf Legge, termasuk uraian mengenai **絜矩之道**, dalam satu ID MATAKIN.
- Da Xue X:1 mencatat perbedaan grafem **悌 / 弟** dari transkripsi pembanding. Naskah proyek tetap **悌**.
- Da Xue X:5 dan X:9 yang sama-sama membahas keterkaitan negara dan keluarga tetap memiliki dua padanan Inggris berbeda sesuai kalimat Hanzi masing-masing.
- Da Xue VI:1 tetap **belum dipetakan** karena teks pasal memuat penjelasan Zhu Xi tambahan; pemisahan naskah dan anotasi harus dikaji sebelum dipublikasikan.
- Pengujian `tests/daxue-batch-10.test.js` mengunci ID, teks Hanzi persis, sumber Inggris, status Draft, dan batas pasal dua paragraf. Teks Hanzi, pinyin, Indonesia MATAKIN, dan registry Final tidak disentuh.

**Ketersediaan Inggris editor kini 916/965** (246 tertanam + 670 dari alignment), **49 belum tersedia**. Per kitab: Da Xue 41/64; Lun Yu 486/512; Zhong Yong 129/129; Mengzi 260/260. Seluruhnya masih Draft; Final editorial 0.


## Da Xue batch 11 — 10 draf Inggris tambahan (14 November 2026)

- Menambah **Da Xue XI:3–12** sebagai **Draft** dari transkripsi James Legge di [Tianmu](https://tianmu.org/good-work-library/confucian/general-texts/the-great-learning-james-legge), baris HTML 92–105. Hanzi pembanding mengikuti [Confuciuspedia](https://confuciuspedia.com/lib/the-great-learning/), dengan rentang sumber dan catatan pada `sources/legge/daxue-b11-10-passages.json`.
- Penomoran MATAKIN XI:3–12 terkait dengan *Commentary of Tsang* Chapter X §§3–12 berdasarkan rentang Hanzi, bukan kesamaan nomor bab. Normalisasi Hans/Hant hanya untuk perbandingan, bukan pengubahan kitab.
- **XI:5** mencatat varian `儀鑒` (proyek) dan `仪监` (sumber pembanding), serta Legge menerjemahkan `上帝` sebagai `God`; MATAKIN Indonesia tetap sebagai rujukan dan tidak diganti. **XI:12** mencatat interpretasi `善` menjadi `good men` dalam Legge.
- **XI:2 ditahan** karena teks Legge digital tentang arah kanan/kiri perlu diteliti lagi. **VI:1 ditahan** karena teks dan komentar Zhu Xi belum dipisah dengan benar.
- `tests/daxue-batch-11.test.js` melindungi kesetiaan sumber, ID, status draf, provenance, dan kasus sengaja ditahan; angka tes batch 10 menjadi batas minimum historis.
- **Ketersediaan draf Inggris: 926/965** (246 tertanam, 680 lewat overlay), **39 belum tersedia** (Da Xue 13, Lun Yu 26); **Final editorial 0**. Hanzi, pinyin, Indonesia MATAKIN dan paket Android offline tidak diubah.


## Da Xue batch 12 — 10 draf Inggris tambahan (14 November 2026)

- Tambahkan **Da Xue XI:13–22** memakai terjemahan public-domain James Legge melalui [Tianmu](https://tianmu.org/good-work-library/confucian/general-texts/the-great-learning-james-legge), referensi baris 107–120. Snapshot per pasal `sources/legge/daxue-b12-10-passages.json` menjaga isi Inggris, Hanzi proyek utuh, batas paragraf dan perbedaan edisi.
- XI:14 memakai dua paragraf Legge sebagai **satu** pasal, dengan catatan `媢疾` dalam transkripsi banding vs `媢嫉` pada naskah proyek. XI:16 mencatat `命` proyek yang berkaitan dengan perbedaan bacaan `慢` pada tafsir 'disrespectful'; jangan memperbaiki sebelum foto MATAKIN/saksi asal diverifikasi.
- XI:22 juga mempertahankan dua paragraf Legge pada satu pasal, termasuk kesimpulan `國不以利為利，以義為利`; tidak membuat versi Inggris sendiri.
- **936/965 draf Inggris**, tersisa **29** (Da Xue 3 dan Lun Yu 26). **Final 0**. Hanzi, pinyin, Indonesia MATAKIN dan aset offline tidak diubah. Tes `node --test tests/daxue-batch-12.test.js` terhubung ke CI.


## Lun Yu batch 13 — 10 draf Inggris Gutenberg (14 November 2026)

- Pemetaan baru: `05.01`, `05.02`, `05.08`, `05.09`, `05.25`, `05.26`, `06.01`, `06.02`, `06.04`, `06.05`; semua Draft. Teks Legge bersumber dari [Gutenberg #3330](https://www.gutenberg.org/ebooks/3330) dan Hanzi pembanding dari [Gutenberg #4094](https://www.gutenberg.org/ebooks/4094). Snapshot `sources/legge/lunyu-b13-gutenberg-3330-4094.json` menyimpan sumber, ID dan bukti pemenggalan.
- Legge V.I §§1–2 terpisah ke MATAKIN V:1–2; V.VII §§1–4 ke V:8; V.VIII §§1–3 ke V:9; V.XXIV dan V.XXV ke MATAKIN V:25–26. EBook #3330 mengulang label CHAP VII untuk bab ordinal VIII, sedangkan #4094 mencetak VIII; tidak diartikan sebagai pasal ganda.
- Legge VI.I §§1,2–4 ke MATAKIN VI:1–2; VI.III §§1–2,3–4 ke VI:4–5. Perbedaan 縲絏/縲紲 dan 蔽/敝 dicatat sebagai varian korpus, tanpa mengubah Hanzi MATAKIN.
- Cakupan sekarang **946/965**, **19 tersisa** (Da Xue 3, Lun Yu 16). Status Final **0**, tidak mengubah terjemahan Indonesia, pinyin, naskah primer, atau Android offline. Regresi `tests/lunyu-batch-13.test.js` menjaga batas sumber.


## Lun Yu batch 14 — 10 draf Inggris tambahan (14 November 2026)

- Peta Inggris baru `09.06`, `09.07`, `09.24`, `10.08`, `10.18`, `10.25`, `11.25`, `14.01`, `14.26`, `14.37`, sumber public-domain James Legge [Gutenberg Inggris #3330](https://www.gutenberg.org/ebooks/3330) dan [Hanzi dwibahasa #4094](https://www.gutenberg.org/ebooks/4094). Snapshot `sources/legge/lunyu-b14-gutenberg-3330-4094.json` menyimpan segmen dan rasio Hanzi.
- MATAKIN XIV:1 merupakan gabungan Legge XIV.I + XIV.II; XIV:26 gabungan Legge XIV.XXVII + XIV.XXVIII; XIV:37 gabungan Legge XIV.XXXIX + XIV.XL. Dua segmen sumber tetap terpisah dalam masing-masing alignment; **jangan mengarang segmen gabungan**.
- Untuk buku X, X:8 memakai hanya Legge X.VIII §§1–7; X:18 memakai X.XIII §§1–2; X:25 memakai X.XVI §§2–5. XIX? Tidak menambahkan seksi tetangga. Varian 太/大 pada IX:6 dan 姜/薑 pada X:8 dicatat tanpa koreksi otomatis.
- **956/965 draf Inggris**, tersisa **9** (Da Xue 3, Lun Yu 6); Final **0**. Pengujian `tests/lunyu-batch-14.test.js` menjaga Hanzi utuh, banyak segmen, provenance, dan status Draft.


## Lun Yu batch 15 — enam draf terakhir (14 November 2026)

- Tambah MATAKIN `XI:26`, `XIV:32`, `XIV:43`, `XIV:44`, `XV:1`, dan `XV:2`, bersumber James Legge [Gutenberg #3330](https://www.gutenberg.org/ebooks/3330) serta Hanzi dwibahasa [#4094](https://www.gutenberg.org/ebooks/4094). Salinan segmen ada di `sources/legge/lunyu-b15-gutenberg-3330-4094.json`.
- XI:26 mencakup seluruh 12 seksi sumber. Dalam teks dwibahasa, penjelasan grafem `曾(上析、下日、與晰同)` tidak disalin sebagai ayat. XIV:32 memiliki varian 棲/栖. XIV:43–44 dibedakan berdasarkan unit dan Hanzi, meskipun digitalisasi Legge menggandakan label CHAP XLVI.
- MATAKIN XV:1 hanya Legge XV.I §1 sedangkan XV:2 menggunakan §§2–3. Tidak ada penerjemahan ulang AI atau perubahan teks kitab MATAKIN.
- **962/965 draf Inggris**, seluruh 512 Lun Yu kini tersedia sebagai Draft. Tersisa tiga pasal Da Xue VI:1, XI:2, XI:23; Final **0**. Pengujian `tests/lunyu-batch-15.test.js` memeriksa semua unit dan perbedaannya.


## Da Xue batch 16 — tiga pasal Inggris terakhir, dari Legge cetak (14 November 2026)

- Sumber untuk tiga pasal terakhir: terjemahan James Legge dalam [scan dwibahasa Four Books](https://upload.wikimedia.org/wikipedia/commons/6/62/NLC416-09jh001536-29469_%E8%8F%AF%E8%8B%B1%E5%B0%8D%E7%85%A7%E5%9B%9B%E6%9B%B8.pdf). Data disimpan pada `sources/legge/daxue-b16-last-three-printed.json` dan dipetakan tanpa mengubah Hanzi, pinyin, ataupun isi MATAKIN.
- `sishu.daxue.06.01` memakai **dua unit Inggris terpisah**: teks diterima `此謂知本，此謂知之至也` dan pelengkap Zhu Xi tentang `格物致知`. Rujukan cetak halaman 7–8. Kolom `textual_sections` dan `editorial_annotations` yang sudah ada tetap memisahkan kedua lapisan dari teks pokok.
- `sishu.daxue.11.02` memakai **Legge cetak halaman 16–17**, yang mencakup enam pasangan arah utuh. Transkripsi Tianmu yang sebelumnya diperiksa kehilangan pasangan kanan-ke-kiri serta mencampur arah pada klausa lain. Bukti pelengkap ditemukan pada [Prolegomena Legge](https://www.gutenberg.org/files/3100/3100-h/3100-h.htm). Karena itu sumber cetak lebih dapat dipertanggungjawabkan; teks Hanzi tidak perlu diganti.
- `sishu.daxue.11.23` memakai teks Legge halaman 21–22. **Audit sumber penting:** `translation_indonesian` proyek untuk pasal tersebut secara keliru mengikutsertakan `Zhong Yong ... KATA PENGANTAR CU-HI ... TENGAH SEMPURNA BAB UTAMA` setelah `(Bc. IA:1).`. Sambungan itu bukan bagian Da Xue XI:23 dan kata pengantar Zhong Yong sudah disimpan dalam `sishu/manifest.json` sebagai entri `sishu.zhongyong.preface`. Pembersihan batas teks Indonesia harus dikerjakan terpisah dengan audit preservasi; tidak dimasukkan ke terjemahan Inggris.
- Hasil: **965/965 pasal memiliki draf Inggris** (246 bawaan + 719 overlay); **0 tidak tersedia**. Ini **bukan pengesahan editorial Final**, yang tetap 0. Tes `tests/daxue-complete-batch-16.test.js` memeriksa sumber dan kasus khusus. Tes historis batch 10–12 direvisi agar menguji keberadaan pemetaan yang kini sah, bukan memaksa pasal tetap kosong.
