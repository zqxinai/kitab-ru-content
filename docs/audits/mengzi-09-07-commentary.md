# Perbaikan naskah Mengzi V A:7 (ID 09.07) — 13 November 2026

Status: **patch pada cabang review**, belum disahkan sebagai terjemahan Final.

## Masalah terbukti
Berdasarkan foto Si Shu MATAKIN cetakan 2012 hlm. 730, setelah pernyataan tentang cara Yi Yin bertemu Raja Tang, terjemahan Indonesia langsung dilanjutkan ke kutipan dari 《伊訓》. Namun data Hanzi sebelumnya menyisipkan dua komentar: `林氏曰` (komentar yang dikutip dalam Zhu Xi) dan `愚謂` (komentar Zhu Xi) di `ruby_paragraphs` seolah bagian ucapan Mengzi.

Saksi tekstual: Zhu Xi, 《四書章句集註》, 四庫全書本 WYG, `KR1h0015_014.txt`, penanda `KR1h0015_WYG_014-10b`, Kanripo pinned `84c6b2c5093c57ae5d41c60a73c02323d2420ef0`.

## Keputusan
1. Potong **hanya** rentang dua komentar dari rangkaian Hanzi/pinyin utama, dari `林氏曰` hingga akhir `愚謂…之意。`.
2. Simpan kedua rentang secara **utuh**, berurutan, dalam `commentary_annotations` dengan `attribution`, identitas sumber, penanda halaman dan immutable commit. Catatan itu merupakan komentar, **bukan** bagian dasar Mengzi.
3. Perbaiki `末聞以割烹也` menjadi `未聞以割烹也` dan pinyin `mò` menjadi `wèi` pada karakter tersebut, sesuai MATAKIN 2012 dan teks Zhu Xi. Tidak mengubah kutipan `《伊訓》`.
4. Pertahankan `translation_indonesian`, ID pasal, nomor MATAKIN, status review, dan jumlah total pasal. Belum memasukkan draf Legge pada pasal ini; pemetaan Inggris menunggu pemeriksaan terpisah.

## Pembuktian dan pengujian
- Rekonstruksi mekanis dari teks utama pascaperbaikan + dua komentar historis + pembalikan `未→末` menghasilkan rangkaian Hanzi lama **identik**, tanpa kehilangan segmen.
- Terjemahan Indonesia tetap 2.943 code unit UTF-16, checksum FNV-1a UTF-16 `7ebb66c0` (regresi terhadap isi sebelum patch).
- Regresi `tests/mengzi-commentary-09-07.test.js` menguji pemisahan, atribusi, pinyin, kutipan 《伊訓》, dist, dan status Final.
- `tests/textual-variants-b07.test.js` disesuaikan agar tidak lagi mengharapkan komentar tercampur dalam naskah utama.
- Workflow `editorial-review.yml` mengeksekusi tes baru setelah membangun ulang paket deterministik. Paket resmi dibangun ulang saat patch masuk `main`.

**Batasan:** penambahan anotasi sebagai metadata tidak otomatis membuktikan tampilan khusus komentar sudah tersedia di semua antarmuka. Teks bahasa Inggris belum dimasukkan dan belum ada persetujuan Final.
