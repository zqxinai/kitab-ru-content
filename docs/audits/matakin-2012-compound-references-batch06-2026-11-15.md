# Ru Classics — Audit rujukan gabungan batch 06

**Tanggal:** 15 November 2026 WIB. **Hasil:** 8 kelompok gabungan baru / 18 segmen tercatat, terdiri atas **6 siap ditampilkan** dan **2 perlu review**. Data asal MATAKIN 2011 **tidak diubah**.


## Klarifikasi resmi dari pemilik cetakan, 15 November 2026

**Koreksi terhadap penilaian awal dalam laporan ini:** tanda `/N` pada rujukan menunjukkan **ayat ke-N dari pasal yang ditunjuk**, bukan nomor yang ambigu. Dengan demikian `Bc IIA:7/5` berarti **Mengzi II A pasal 7 ayat 5**; `IIA:2/19` dan `IIA:2/28` berarti **Mengzi II A pasal 2 ayat 19 dan ayat 28**. Penanda ayat 5, 19, dan 28 sudah ditemukan berurutan pada teks MATAKIN 2011 digital. Metadata kini menyimpan `subverse_number` dan bukti `verified-in-2011-transcript`, sedangkan `subverse_target_id` masih `null` hanya karena **tautan langsung ke ayat belum memiliki kontrak navigasi yang teruji**, bukan karena arti `/N` diragukan.

**Makna rujukan silang:** pasal/ayat yang dirujuk mempunyai **keterkaitan isi atau ajaran**, tidak harus sama kalimatnya. Karena itu, hubungan ini dicatat sebagai `reference_intent: "content-related"` dan `verbatim_match_required: false`. Keterkaitan isi diterima berdasarkan otoritas MATAKIN tanpa pemeriksaan tematik ulang; teks berbeda bukan discrepancy.


## Keputusan editorial

Semua singkatan yang sudah dikonfirmasi tetap berlaku: **SS = Sabda Suci/Lun Yu**, **AB = Ajaran Besar/Da Xue**, **BC = Bingcu/Mengzi**, **TS = Tengah Sempurna/Zhong Yong**. Pada gabungan rujukan, setiap komponen memiliki `book_id` sendiri. Komponen seperti `Bc. IIA:2/19` mempunyai `target_passage_ids = ["sishu.mengzi.03.02"]`, tetapi **`subverse_target_id = null`**: nomor ayat `/19` sudah terkonfirmasi dan penanda Ayat 19 ada pada teks 2011, tetapi deep-link belum diuji. Teks `/19`, `/28`, dan `/5` tetap dipertahankan pada tampilan.

Nama kitab lengkap yang digunakan mengikuti **konvensi** MATAKIN 2012; bukan berarti ejaan, jarak, atau tanda bacanya sudah diperiksa kata demi kata pada halaman cetak yang belum terfoto. ID pasal tujuan yang ada di repositori bukan bukti bahwa kedua kalimat adalah kutipan identik. Tidak ada tautan tunggal yang dikarang dari rujukan gabungan berisi beberapa target.

## Delapan kelompok batch 06

| No. | ID sumber | Teks rujukan PDF MATAKIN 2011 | Keputusan | Pasal tujuan dalam metadata |
| ---: | --- | --- | --- | --- |
| 1 | `sishu.lunyu.03.07` | `(T.S. XIII: 5; Bc IIA: 7/5)` | Tampilan lengkap | zhongyong: `sishu.zhongyong.14.05`; mengzi: `sishu.mengzi.03.07` |
| 2 | `sishu.lunyu.03.09` | `(T.S. XXVII: 5; S.S. II:23)` | Tampilan lengkap | zhongyong: `sishu.zhongyong.28.05`; lunyu: `sishu.lunyu.02.23` |
| 3 | `sishu.lunyu.07.02` | `(S.S. IX: 16; Bc. IIA: 2/19)` | Tampilan lengkap | lunyu: `sishu.lunyu.09.16`; mengzi: `sishu.mengzi.03.02` |
| 4 | `sishu.lunyu.07.13` | `(T.S. XV: 3; S.S. X: 7)` | Tampilan lengkap | zhongyong: `sishu.zhongyong.16.03`; lunyu: `sishu.lunyu.10.07` |
| 5 | `sishu.lunyu.09.09` | `(S.S. XVIII 5; Bc. IIA: 2/28)` | Tampilan lengkap | lunyu: `sishu.lunyu.18.05`; mengzi: `sishu.mengzi.03.02` |
| 6 | `sishu.lunyu.09.29` | `(S.S. XIV: 28; T.S. XIX: 10)` | Tampilan lengkap | lunyu: `sishu.lunyu.14.28`; zhongyong: `sishu.zhongyong.20.10` |
| 7 | `sishu.lunyu.07.23` | `(S.S. III: 24; IX: 5)` | Tetap sumber (review) | lunyu: `sishu.lunyu.03.24`; lunyu: `sishu.lunyu.09.05` |
| 8 | `sishu.lunyu.09.05` | `(S.S. III: 24; VII ": 23; XIV: 36; Bc. IB: 16)` | Tetap sumber (review) | lunyu: `sishu.lunyu.03.24`; lunyu: `sishu.lunyu.07.23`; lunyu: `sishu.lunyu.14.36`; mengzi: `sishu.mengzi.02.16` |

### Dua kasus yang belum boleh dinormalisasi

1. **Lun Yu VII:23:** `(S.S. III: 24; IX: 5)` — `IX:5` mewarisi penanda kitab `S.S.`; kandidat target tersedia; hanya kepastian penyalinan dan penomoran tampilan yang ditahan untuk review.
2. **Lun Yu IX:5:** `(S.S. III: 24; VII ": 23; XIV: 36; Bc. IB: 16)` — ada tanda `"` yang mencurigakan dalam `VII ": 23`. Bentuk tersebut tetap utuh; tidak diperbaiki berdasarkan dugaan OCR.

## Perubahan sistem

- [Registri metadata batch 06](../../sources/references/matakin-compound-batch02.json) dengan 8 kelompok dan 18 segmen.
- [Lapisan tampilan pembaca/editor](../../ru-classics/reference-overlay.js): **6** pengganti persis baru, total **75** rujukan tertangani. Dua rujukan yang belum diverifikasi tidak masuk overlay.
- [Audit seluruh pasal](../../tools/audit_matakin_references.cjs): dua registri digabung dengan pengamanan kunci ganda `passage_id::source`, sehingga inventaris 965 pasal kini mengandung **15 kelompok rujukan gabungan terurai** (**12 tampilan siap, 3 review saja**), dengan keseluruhan **34 segmen**.
- [Tes audit](../../tests/matakin-reference-audit.test.cjs) mengunci angka 15/12/3 serta status notasi `/19`; [tes overlay](../../tests/matakin-reference-overlay.test.cjs) mengunci 75 catatan, pemetaan kitab, target yang eksis, `subverse_target_id: null`, dan sumber 2011 yang tidak berubah.
- [Tes smoke pembaca](../../ru-classics/tests/smoke.cjs) memeriksa gabungan TS + BC, TS + SS, SS + BC dan dua kutipan sumber yang tetap belum dinormalisasi.
- Workflow validasi editor dan audit rujukan turut mengawasi perubahan berkas registri kedua.

## Posisi keseluruhan

Dari **497 pola rujukan** yang terdeteksi pada pemindaian heuristik seluruh 965 pasal, sudah **75 catatan overlay** yang ditangani (termasuk 12 kelompok gabungan dengan tampilan baru). Angka 497 adalah hasil deteksi pola, bukan jumlah kesalahan, dan status **Draft/Perlu Review** teks tidak berubah. Audit berikutnya berfokus pada rujukan dengan tanda pemisah tidak biasa, atau singkatan kitab yang diwariskan antarsemen; jika bukti belum cukup, pertahankan sumber asli dan catat kandidat sebagai metadata.

**Tidak dikerjakan dalam batch ini:** perubahan Hanzi, pinyin, penerjemahan Legge, nomor ayat sumber, persetujuan Final, maupun pembuatan APK.
