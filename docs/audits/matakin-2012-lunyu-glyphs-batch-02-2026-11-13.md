# Audit dan koreksi Lun Yu berdasarkan MATAKIN 2012 — batch 02, 13 November 2026

## Hierarki sumber dan bukti
**Acuan utama adalah cetakan Si Shu MATAKIN 2012.** Foto tidak diperiksa ulang dalam sesi ini; pembacaan dan halaman merujuk pada dokumentasi bukti foto sebelumnya di [audit varian](../sishu-textual-variants.md). MATAKIN 2011 digunakan untuk terjemahan Indonesia; Zhu Xi 《四書章句集註》 edisi WYG hanya pembanding Hanzi; James Legge hanya pembanding terjemahan Inggris. Penetapan edisi utama tidak berpindah ke Zhu Xi.

| Pasal | Halaman cetak MATAKIN 2012 | Koreksi | Pinyin | Pembanding Zhu Xi WYG |
| --- | --- | --- | --- | --- |
| Lun Yu IV:19 (`sishu.lunyu.04.19`) | 138 | `游` → `遊` ×2 | yóu → yóu | `KR1h0015_002.txt / WYG_002-13b` |
| Lun Yu XVII:13 (`sishu.lunyu.17.13`) | tidak terlihat pada foto | `愿` → `原` ×1 | yuàn → yuán | `KR1h0015_008.txt / WYG_008-5a` |
| Lun Yu XIV:1 (`sishu.lunyu.14.01`) | 285 | `谷` → `穀` ×2 | gǔ → gǔ | `KR1h0015_006.txt / WYG_006-28a` |

Snapshot Zhu Xi WYG terpatok pada [Kanripo KR1h0015, `84c6b2c5093c57ae5d41c60a73c02323d2420ef0`](https://github.com/kanripo/KR1h0015/tree/84c6b2c5093c57ae5d41c60a73c02323d2420ef0).

## Keputusan editorial
1. **Lun Yu IV:19 (hlm. 138):** MATAKIN 2012 menampilkan `遊(游)` dua kali; tampilkan `遊` sebagai tradisional dan simpan `游` untuk bentuk sederhana. Pinyin `yóu` tetap. 
2. **Lun Yu XVII:13:** MATAKIN 2012 menampilkan `鄉(乡)原` dan pinyin `yuán` pada 原, bukan `鄉愿`. `愿` merupakan varian naskah yang sah dalam tradisi komentar, bukan pembenaran untuk mengganti acuan utama. **Nomor halaman foto tidak terlihat, tidak diisi.**
3. **Lun Yu XIV:1 (hlm. 285):** MATAKIN 2012 menampilkan `穀(谷)` dua kali dalam pengertian gaji/tunjangan. Simpan `谷` sebagai bentuk sederhana dan pinyin `gǔ`.

**Total:** tiga pasal, lima perbaikan token Hanzi, satu perbaikan pinyin. Teks Indonesia MATAKIN, nomor pasal, urutan, dan status `Final` tidak berubah. Ketiga pasal belum memiliki alignment Inggris pada waktu audit, sehingga tidak dibuat terjemahan Legge maupun entri yang tidak didukung sumber; jika alignment baru ditambahkan di kemudian hari harus cocok dengan teks terkoreksi.

Test `tests/matakin-2012-lunyu-glyphs-batch-02.test.js` mengunci hash terjemahan Indonesia, teks Hanzi, anotasi pinyin dan kesesuaian `dist`; menjalankan test setelah build merupakan syarat rilis. Pengesahan seluruh 965 pasal per karakter tidak otomatis dianggap selesai oleh batch ini.
