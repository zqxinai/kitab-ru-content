# Audit konteks perbedaan naskah Si Shu — 13 November 2026

Status: keputusan kerja bersumber, **belum disahkan Final**. Hanzi proyek berasal dari `hanzhaodeng/chinese-ancient-text` dengan konversi ICU Hans-Hant, bukan dari PDF terjemahan MATAKIN; lihat [provenance](hanzi-provenance.md).

## Hasil per pasal

| ID | Hanzi proyek / pembanding | Keputusan dan alasannya |
| --- | --- | --- |
| `sishu.mengzi.07.23` | 忌 / 患 | **Usul ralat ke 患**: artinya kekurangan/cacat seseorang; sesuai Indonesia “Cacatnya orang”, Legge “evil of men” dan sumber Mengzi klasik. |
| `sishu.mengzi.07.25` | 哺啜 / 餔啜 | **Usul edisi 餔啜** (dua kemunculan); bermakna makan/minum, didukung teks `孟子註疏`. |
| `sishu.mengzi.08.17` | 不祥 / 不詳 | **Pertahankan 不祥** karena berarti “tidak membawa berkah”, sesuai Indonesia dan Legge Inggris “inauspicious”; `孟子註疏` juga memakai 祥. |
| `sishu.mengzi.09.07` | 林氏曰 dan 愚謂 menyatu di Hanzi | **Masalah batas teks-komentar, bukan varian aksara**: kedua frasa merupakan komentar Zhu Xi yang tersisip dalam teks utama. **Jangan tandai Inggris lengkap** sebelum komentar dipisahkan dan Ruby/pinyin serta paket dibangun ulang. |
| `sishu.lunyu.09.26` | 帥 / 師 | **Pertahankan 帥** dari sumber awal 帅; konteks “panglima” dan Legge Inggris “commander” mendukungnya. |
| `sishu.lunyu.10.24` | 客 / 容 | **Catat sebagai varian**; jangan ganti diam-diam. Kedua bacaan memiliki dasar tekstual, makna tata krama formal masih sesuai. |
| `sishu.lunyu.11.03` | 季路 / 李路 | **Pertahankan 季路**, nama murid Kongzi; Legge Inggris menulis “Chi Lu”. |
| `sishu.lunyu.14.33` | 曰 / 子曰 | **Usulkan penambahan 子 dalam patch sumber terpisah**, karena Legge dan terjemahan Indonesia “Nabi bersabda” mendukung 子曰. |

### Mengzi 09.07 — cakupan yang perlu dipisah

Pada `sishu/chapters/mengzi/09.json`, pasal 09.07 memuat ucapan Mengzi dan kutipan `伊訓曰`, tetapi mencampurkan komentar penafsir `林氏曰：“以堯舜之道要湯者...` serta `愚謂此語亦猶前章...`. Sumber awal JSON juga memuatnya; bukan kesalahan pengimporan GitHub. Edisi `四書章句集注` menegaskan kedua segmen merupakan komentar setelah teks utama. Draf Inggris Legge dari `mengzi009.txt` memuat dialog Mengzi beserta kutipan `伊訓` tanpa komentar tersebut.

**Patch nanti:** tempatkan komentar sebagai metadata anotasi beratribusi, bersihkan `ruby_paragraphs` pasal, periksa kutipan `伊訓`, bangun ulang `dist/sishu-content.json` dan hash katalog, validasi pinyin serta teks Indonesia, baru petakan Inggris. Hindari membuang komentar sumber tanpa jejak.

### Da Xue 01.01 — 親民 / 新民

**Pertahankan 親民** sebagai Hanzi dasar proyek: cocok dengan terjemahan MATAKIN “mengasihi rakyat”. **新民** adalah bacaan/penafsiran yang dikemukakan dalam tradisi Zhu Xi dengan makna “memperbarui rakyat”; tampilkan sebagai catatan varian. Inggris Legge di proyek berbunyi “to renovate the people”, sehingga sekalipun cocok nomor pasalnya, makna Inggris mengikuti bacaan 新民. Ini harus diperjelas dalam review sebelum Final, tanpa merekayasa teks Legge.

### Sumber pemeriksaan

- Sumber awal: https://github.com/hanzhaodeng/chinese-ancient-text
- Legge Lun Yu #4094: https://www.gutenberg.org/cache/epub/4094/pg4094-images.html
- Legge Mengzi pinned: https://github.com/alexamies/chinesenotes.com/tree/5d2e867ecfb33e16a6aed392c6b8b8cde3896030/corpus/mengzi
- Mengzi 註疏 untuk 餔啜: https://zh.wikisource.org/zh-hant/孟子註疏/卷07
- Mengzi 註疏 untuk 不祥: https://zh.wikisource.org/zh-hant/孟子註疏/卷08
- Zhu Xi Mengzi Wan Zhang: https://ctext.org/si-shu-zhang-ju-ji-zhu/wan-zhang-zhang-ju-shang/zh
- Metode kerja dan asal JSON: https://drive.google.com/file/d/1M_fWS_E8-naI6gOj8X114q0Fl2-EeS5b/view

Tabel ini adalah **audit**, bukan persetujuan publikasi. Tidak boleh menganggap semua masalah selesai hanya karena terjemahan Inggris bisa dipasangkan secara semantik.
