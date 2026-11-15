# Audit Ru Classics — Rujukan gabungan, batch 05

**Tanggal:** 15 November 2026 WIB. **Cakupan:** tujuh kelompok rujukan gabungan dari terjemahan MATAKIN 2011; enam dapat ditampilkan dengan identitas kitab yang jelas dan satu ditahan karena pembagian rujukan kompleks memerlukan review. **Tidak ada perubahan teks naskah.**


## Klarifikasi resmi dari pemilik cetakan, 15 November 2026

Rujukan silang pada MATAKIN menyatakan **keterkaitan isi** antara pasal/ayat, **bukan kewajiban bahwa kalimatnya sama**. Jika nomor memakai garis miring `Pasal/Ayat`, bagian setelah `/` adalah **ayat dalam pasal rujukan**. Contohnya `Bc IIA:7/5` menunjuk Mengzi II A pasal 7 ayat 5; penanda ayatnya ditemukan pada naskah digital MATAKIN 2011.

Perbedaan bunyi kedua pasal bukan otomatis kesalahan kolasi. Identitas kitab dan nomor yang benar perlu dibedakan dari penilaian hubungan isi, sedangkan tautan ayat baru boleh dibuat setelah kontrak navigasi dipastikan.


## Hasil inti

- [Registri rujukan terurai](../../sources/references/matakin-compound-batch01.json) menyimpan **7 kelompok / 16 segmen**, urutan, ejaan asli, kitab yang dituju, ID pasal tujuan, serta status kolasi.
- **Enam kelompok** dengan dua referensi lintas kitab masing-masing telah disajikan dalam [overlay pembaca/editor](../../ru-classics/reference-overlay.js) menggunakan nama lengkap, bukan mengubah terjemahan MATAKIN 2011. Total overlay kini **69** catatan: sebelumnya 63.
- **Satu kelompok kompleks** pada `sishu.lunyu.02.05`: `(S.S. I:9; III: 1,2; XIX:5; Bc. IIIA: 2)`. Segmentasinya direkam menjadi **4 segmen sumber**, yang merujuk ke lima kandidat pasal; tampilan asli tetap dipertahankan karena pewarisan SS dan tanda koma `1,2` memerlukan pemeriksaan batas nomor dan ayat secara hati-hati.
- Tujuan yang disimpan adalah **ID pasal yang ada di proyek**, bukan klaim bahwa seluruh isi teks identik dengan kutipan; `subverse_target_id` **null** sampai ada bukti ayat. Tidak ada hyperlink target majemuk dibuat otomatis.
- SS = Lun Yu; AB = Da Xue; BC = Mengzi; TS = Zhong Yong; identitas kitab dipastikan pemilik buku, bukan hasil tebak dari angka Romawi.
- Penampilan nama kitab sesuai kaidah MATAKIN 2012 adalah **normalisasi editorial**, **bukan** transkripsi kata demi kata dari halaman edisi 2012 yang tidak tersedia sebagai foto.

## Inventaris 7 kelompok

| No. | ID sumber | Rujukan 2011 | Pemisahan dan pasal tujuan yang ada | Keputusan |
| ---: | --- | --- | --- | --- |
| 1 | `sishu.lunyu.02.19` | `(T.S. XIX: 1; S.S. III: 21)` | T.S. XIX: 1 → zhongyong (`sishu.zhongyong.20.01`); S.S. III: 21 → lunyu (`sishu.lunyu.03.21`) | Tampil dengan nama kitab lengkap |
| 2 | `sishu.lunyu.07.05` | `(T.S. XVII: 3; S.S. VIII: 11)` | T.S. XVII: 3 → zhongyong (`sishu.zhongyong.18.03`); S.S. VIII: 11 → lunyu (`sishu.lunyu.08.11`) | Tampil dengan nama kitab lengkap |
| 3 | `sishu.lunyu.07.21` | `(S.S. XI: 12; T.S. X: 1)` | S.S. XI: 12 → lunyu (`sishu.lunyu.11.12`); T.S. X: 1 → zhongyong (`sishu.zhongyong.11.01`) | Tampil dengan nama kitab lengkap |
| 4 | `sishu.lunyu.05.16` | `(S.S. XIV: 9; Bc. IV B.2)` | S.S. XIV: 9 → lunyu (`sishu.lunyu.14.09`); Bc. IV B.2 → mengzi (`sishu.mengzi.08.02`) | Tampil dengan nama kitab lengkap |
| 5 | `sishu.lunyu.05.22` | `(S.S. XV: 2; Bc. VII B: 37)` | S.S. XV: 2 → lunyu (`sishu.lunyu.15.02`); Bc. VII B: 37 → mengzi (`sishu.mengzi.14.37`) | Tampil dengan nama kitab lengkap |
| 6 | `sishu.lunyu.05.23` | `(Bc. II. A: 2; S.S. VII: 15)` | Bc. II. A: 2 → mengzi (`sishu.mengzi.03.02`); S.S. VII: 15 → lunyu (`sishu.lunyu.07.15`) | Tampil dengan nama kitab lengkap |
| 7 | `sishu.lunyu.02.05` | `(S.S. I:9; III: 1,2; XIX:5; Bc. IIIA: 2)` | S.S. I:9 → lunyu (`sishu.lunyu.01.09`); III: 1,2 → lunyu (`sishu.lunyu.03.01`, `sishu.lunyu.03.02`); XIX:5 → lunyu (`sishu.lunyu.19.05`); Bc. IIIA: 2 → mengzi (`sishu.mengzi.05.02`) | Ditahan untuk review |

## Perbedaan *segmentasi*, *tautan*, dan *kesetiaan teks*

1. **Segmentasi:** memahami bahwa `(T.S. XIX: 1; S.S. III: 21)` mengandung dua rujukan dengan kitab tujuan yang berbeda, bukan satu target.
2. **Resolusi pasal:** ID `sishu.zhongyong.20.01` dan `sishu.lunyu.03.21` ada pada naskah. Ini membuktikan target alamat, bukan kebenaran semantik hubungan keduanya.
3. **Resolusi ayat:** rujukan seperti `Bc. II. A: 2` menunjuk ke pasal panjang yang dapat memiliki banyak ayat internal; bila memakai `Pasal/Ayat`, angka setelah garis miring adalah ayat yang ditunjuk. Pisahkan verifikasi penanda ayat dari pembuatan deep-link.
4. **Validasi cetakan:** untuk menegaskan tanda baca/ejaan sama persis dengan MATAKIN 2012 diperlukan foto bagian relevan; normalisasi yang sudah berfungsi di web tidak mengklaim itu.

## Pengujian otomatis

- [`tests/matakin-reference-overlay.test.cjs`](../../tests/matakin-reference-overlay.test.cjs) memastikan 69 overlay tertaut ke sumber ID dan kutipan persis, memvalidasi tujuh kelompok metadata dan 16 segmennya, serta memastikan segmen ambigu tidak memperoleh penggantian layar.
- [`tools/audit_matakin_references.cjs`](../../tools/audit_matakin_references.cjs) sekarang menggabungkan rekaman terurai ke **inventaris pemindaian 965 pasal** dengan status `segmentation_status` dan `segments`, tanpa mengubah terjemahan.
- [`tests/matakin-reference-audit.test.cjs`](../../tests/matakin-reference-audit.test.cjs) mengunci hasil **7 kelompok = 6 siap + 1 review**, dengan pasal target yang benar.
- [`ru-classics/tests/smoke.cjs`](../../ru-classics/tests/smoke.cjs) mengecek halaman pembaca untuk gabungan TS+SS, SS+BC, BC+SS, dan memastikan rujukan `S.S. I:9; III: 1,2; XIX:5; Bc. IIIA:2` tetap utuh.
- **Catatan:** penambahan metadata ini tidak membuat seluruh rujukan majemuk lain otomatis aman. Yang belum dipisah dalam inventaris sebelumnya tetap harus ditinjau.

## Antrian kerja

Selanjutnya ambil kelompok lain dari inventaris awal, prioritaskan yang pemisah `; ` dan singkatan kitabnya eksplisit. Kelompok yang angka ayatnya tidak jelas, rujukan saling mewarisi singkatan, atau teks bermasalah jangan dipaksa normalisasi otomatis. Pertahankan status Draft/Perlu Review untuk terjemahan Inggris, Hanzi, dan seluruh pasal sampai ada persetujuan manual.
