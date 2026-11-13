# Audit Da Xue — penyelesaian empat kandidat significant terakhir (14 November 2026)

## Identitas dan bukti
Keempat pasal termasuk **Da Xue MATAKIN Bab X — Teratur Negara Damai Dunia**, yaitu X:11–14; ID internal `sishu.daxue.11.11`–`11.14`. Metadata `sishu/chapters/daxue/11.json` menyebut `source_file: 01 - Da Xue 大學/11 - Bab X - Teratur Negara Damai Dunia.md`. Angka pertama ID internal **bukan nomor bab cetak**.

Pembanding primer untuk pemeriksaan ini adalah konten lengkap `kanripo/KR1h0015/KR1h0015_000.txt` pada commit `84c6b2c5093c57ae5d41c60a73c02323d2420ef0`, bukan hanya `witness_excerpt` dari matriks otomatis lama. Foto MATAKIN 2012 untuk keempat pasal ini belum diperiksa pada batch ini.

| Pasal MATAKIN / ID | Ru Classics | Zhu Xi WYG lengkap (petikan) | Penilaian |
| --- | --- | --- | --- |
| X:11 / `11.11` | `惟命不於常` | `惟命不于常` | `於/于`: perbedaan ortografi; jangan ubah otomatis |
| X:12 / `11.12` | `楚國無以為寶，惟善以為寶` | `楚國無以為寳惟善以為寳` | `寶/寳`: varian glyph; **dua 寳 muncul lengkap** di sumber |
| X:13 / `11.13` | `亡人無以為寶，仁親以為寶` | `亡人無以為寳仁親以為寳` | `寶/寳`: varian glyph; **dua 寳 muncul lengkap** di sumber |
| X:14 / `11.14` | `一介臣`, `若己有之`, `實能容之`, `媢嫉` | `一个臣`, `若巳有之`, `寔能容之`, `媢疾` | Varian tekstual/grafis; tetap **open** untuk kolasi cetakan MATAKIN dan konteks; jangan normalisasi otomatis |

## Temuan penyaringan semu
Matriks `docs/audits/zhu-xi-wyg-965.json` mencatat `witness_span_length:13` untuk X:12 dan X:13, padahal `project_hanzi_length:14`. Verifikasi teks sumber lengkap membuktikan **kata penutup 寳 tidak hilang** pada kedua kalimat. Ini adalah keterbatasan *span selection* algoritme, bukan kekurangan teks Zhu Xi atau Ru Classics.

Pada bagian komentar untuk X:14 sumber WYG secara eksplisit menjelaskan `个古賀反書作介`, yakni aksara `介` dipakai pada sumber Shu Jing. Itu bukti varian, bukan dasar mengganti bentuk MATAKIN tanpa bukti cetak.

## Status
- Seluruh **17 kandidat kelas significant Da Xue** yang terdaftar dalam matriks awal sudah masuk laporan tiga batch (7 + 6 + 4). Ini **bukan** pernyataan bahwa seluruh pasal Da Xue telah diaudit secara final.
- Terbuka untuk saksi MATAKIN: **III:4 (`04.04`), VI:2 (`07.02`), X:14 (`11.14`)**; IV:1 (`05.01`) tidak termasuk kasus ini, jangan tertukar dengan ID `04.01`.
- Tidak ada perubahan Hanzi, pinyin, Indonesia MATAKIN, `dist`, atau status Final. Belum menjalankan test/CI pada batch dokumentasi.
- Perbedaan nomor halaman cetak dan pagination aplikasi **bukan discrepancy**.

## Pembaruan setelah pemeriksaan foto MATAKIN 2012 (14 November)

Foto langsung halaman 9–10 dan 14 kini menutup **III:4 (`04.04`)** serta **VI:2 (`07.02`)**. Cetakan **membedakan 喧** pada `赫兮喧兮` dan **諠** pada `終不可諠兮`, bukan memakai 諠 pada keempat kemunculan. Selain itu VI:2 berbunyi `閒居`, `揜其不善`, serta `視己`. Perincian dan tes di [laporan bukti foto](daxue-2012-photo-confirmed-2026-11-14.md). **X:14 (`11.14`) masih terbuka** sampai foto Hanzi-nya tersedia; daftar terbuka sebelumnya merupakan status historis sebelum foto diperiksa.
