# Koreksi empat pasal berdasarkan bukti foto MATAKIN 2012 — 13 November 2026

## Kebijakan otoritas
- **Acuan primer untuk isi proyek Ru Classics:** foto/transkripsi cetakan Si Shu MATAKIN 2012 yang terdokumentasi. Foto asli **tidak diperiksa ulang dalam sesi ini**; bukti foto dan nomor halaman diteruskan dari [audit terdahulu](../sishu-textual-variants.md). Jika sumber foto kelak bertentangan, buka ulang pasal spesifik, bukan seluruh korpus.
- **Pembanding teks klasik:** Zhu Xi, 《四書章句集註》, 欽定四庫全書 WYG; [Kanripo snapshot 84c6b2c5093c57ae5d41c60a73c02323d2420ef0](https://github.com/kanripo/KR1h0015/tree/84c6b2c5093c57ae5d41c60a73c02323d2420ef0). Tidak boleh mengalahkan bacaan MATAKIN hanya karena berbeda.
- **Terjemahan Indonesia:** data MATAKIN tidak disentuh. **Terjemahan Inggris:** Legge tetap draft dan snapshot sumber tetap verbatim.
- **Bacaan pinyin ketika bukti pinyin cetakan tidak tersedia:** tandai sumber leksikal terpisah, bukan atribusi ke MATAKIN 2012.

| ID internal | Penamaan MATAKIN 2012 | Halaman cetak | Sebelum | Sesudah | Pinyin | Saksi WYG |
| --- | --- | ---: | --- | --- | --- | --- |
| `sishu.mengzi.07.23` | IV A:23.1 | 655 | 忌 | 患 | jì → huàn | `KR1h0015_013.txt`, `WYG_013-14a` |
| `sishu.mengzi.07.25` | IV A:25.1 | 656 | 哺啜 ×2 | 餔啜 ×2 | bǔ chuài → bū chuò | `KR1h0015_013.txt`, `WYG_013-14b` |
| `sishu.lunyu.10.24` | X:24 | 226 | 寢不屍，居不客 | 寢不尸，居不容 | kè → róng, shī tetap | `KR1h0015_005.txt`, `WYG_005-14a` |
| `sishu.lunyu.14.33` | XIV:33 | 302 | 曰：驥… | 子曰：驥… | tambah zǐ | `KR1h0015_006.txt`, `WYG_006-36a` |

### Konteks dan batasan
- Mengzi IV A:23.1: cetakan dan terjemahan "cacatnya orang" selaras dengan **患**, bukan 忌.
- Mengzi IV A:25.1: 餔啜 = makan dan minum. Pinyin **bū chuò** dari [kamus resmi Kementerian Pendidikan Taiwan](https://dict.revised.moe.edu.tw/dictView.jsp?ID=19902&la=1&powerMode=0), bukan hasil penyalinan langsung baris pinyin foto 2012. Dua kemunculan 啜 sebelumnya salah baca **chuài** dan dibetulkan ke **chuò**.
- Lun Yu X:24: penggunaan 尸 (bukan 屍) mengikuti cetakan yang didokumentasi. **容** bermakna tata sikap/kepantasan yang formal, sesuai terjemahan MATAKIN.
- Lun Yu XIV:33: subjek **子** pada pembuka diperlukan sesuai cetakan dan terjemahan "Nabi bersabda".
- Mengzi VII:24 ID internal (`sishu.mengzi.07.24`): dipertahankan tanpa koreksi; perbedaan 捨/舍 dan interpunksi tidak dinyatakan salah tanpa bukti MATAKIN 2012.
- Nama dan nomor pasal Indonesia tidak diubah. Metadata Final tidak diisi. Empat alignment Inggris menyesuaikan **hanya** `hanzi_span` dan `review_note`; `english_segments`, `source_hanzi_transcription`, URL dan `status` tetap sama.
- Tujuh record snapshot varian lama di `sources/legge` tetap verbatim; pengujian sekarang memisahkan kesesuaian arsip historis dan naskah utama yang telah dibetulkan. SHA dan output build akan diverifikasi melalui GitHub Actions, bukan diklaim sebelumnya.

### Pelaksanaan
- Berkas: tiga bab JSON, `dist/sishu-english-alignment.json`, dua tes regresi, dokumen ini dan catatan audit.
- Total: **6 karakter Hanzi** disesuaikan/ditambahkan (忌→患 1; 哺→餔 2; 屍→尸 1; 客→容 1; 子 baru 1), plus **6 anotasi pinyin** diperbaiki (termasuk dua 啜).
- Pengujian spesifik `tests/matakin-2012-verified-glyphs.test.js` memastikan teks Indonesia tidak berubah, sumber historis tetap utuh, empat mapping Inggris sinkron dan dist 78 bab/965 pasal.
