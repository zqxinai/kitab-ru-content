# Audit Zhong Yong Bab IX (Keperwiraan), MATAKIN dan Zhu Xi

> **Keputusan terbaru (14 November):** Pada bab IX:2, tiga `與` berfungsi sebagai partikel tanya, bacaan gramatikal **yú** menurut kamus MOE Taiwan serta catatan Zhu Xi `與平聲`. MATAKIN 2012 mencetak **yǔ**; dicatat secara eksplisit sebagai bacaan cetak. Aplikasi menggunakan **yú** untuk pinyin utama. Riwayat perubahan di bawah tidak boleh dipakai sebagai kebijakan terbaru. [Prinsip audit pinyin](ru-classics-pinyin-context-policy-2026-11-14.md).


> **PEMBARUAN setelah verifikasi foto MATAKIN 2012:** Catatan di bawah merupakan snapshot sebelum foto diperiksa dan tidak lagi menjadi keputusan utama. Foto halaman cetak 42 membuktikan tiga pinyin **yǔ** dan tiga tanda tanya. Ketiga Ruby telah dikembalikan ke **yǔ**, dua koma dipulihkan menjadi tanda tanya, sementara **yú** dipertahankan sebagai bacaan klasik pembanding dalam anotasi. Lihat [audit foto terbaru](zhongyong-ix-matakin-photo-2026-11-14.md). Jangan ulang koreksi lama tanpa bukti baru.

Tanggal: 14 November 2026 WIB. ID internal `sishu.zhongyong.10.01` dan `sishu.zhongyong.10.02`.

## Hierarki dan batas bukti
**Acuan utama Ru Classics adalah Si Shu MATAKIN 2012**, bukan Zhu Xi. Terjemahan Indonesia bersumber dari PDF MATAKIN 2011; seluruh teks dan penomoran MATAKIN tetap. **Foto Hanzi/pinyin MATAKIN 2012 untuk dua pasal ini belum dicocokkan langsung dalam batch ini**. Perubahan pinyin tiga 與 berdasarkan kamus leksikal resmi Taiwan dan komentar WYG merupakan usulan koreksi kontekstual yang masih menunggu perbandingan foto edisi 2012 sebelum Final.

Saksi pembanding: Zhu Xi 《四書章句集註》 WYG di Kanripo `KR1h0015_016.txt`, `KR1h0015_WYG_016-42a`, [commit 84c6b2c5093c57ae5d41c60a73c02323d2420ef0](https://github.com/kanripo/KR1h0015/blob/84c6b2c5093c57ae5d41c60a73c02323d2420ef0/KR1h0015_016.txt). Pembanding leksikal: [MOE Taiwan 與](https://dict.revised.moe.edu.tw/dictView.jsp?ID=11608&la=0&powerMode=0), pemakaian partikel tanya `yú`.

## Temuan
- **Bab IX:1** `子路問強。`: laporan penyaringan 965 ayat mengutip potongan `子路問` dan memberi skor high risk. Sumber WYG lengkap sebenarnya memuat `子路問强`. Perbedaan grafem `強/强`, bukan hilangnya karakter atau beda terjemahan. **Tidak ada perubahan pasal 1**.
- **Bab IX:2** `子曰：“南方之強與，北方之強與，抑而強與？`: ketiga `強` bermakna keperwiraan; varian `强` WYG tidak perlu mengganti tradisional MATAKIN. Tiga `與` sebagai partikel tanya mengikuti catatan `與平聲` dari Zhu Xi dan pembacaan leksikal **yú**; sebelumnya `yǔ` pada tiga Ruby.
- Pinyin baru pada **3 token** (`yǔ → yú`) **bukan klaim hasil pemeriksaan foto 2012**. Sebuah `editorial_annotations` beratribusi menampilkan dasar, peringatan, dan pinyin kontekstual di editor.
- Terjemahan Indonesia dan Inggris Legge, Hanzi tradisional/sederhana, nomor pasal, status draft, dan original source snapshot **tidak diubah**. Alignment Inggris Zhong Yong 10.02–10.05 tetap many-to-one. Keputusan foto MATAKIN 2012 menjadi gerbang Final.

Tes `tests/zhongyong-ix-pinyin-variant.test.js` menjaga hash Hanzi pasal 1 (`94cc5d74`), pasal 2 (`28ae75b5`), terjemahan Indonesia (`334154be`, `c6328bf9`), tiga pinyin `yú`, dan jumlah 78 bab/965 pasal. Smoke `editor/tests/zhongyong-ix-pinyin-smoke.mjs` memeriksa catatan dan Ruby pada editor.
