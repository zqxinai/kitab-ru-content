# Audit konteks perbedaan naskah Si Shu — 13 November 2026

Status: keputusan kerja bersumber, **belum disahkan Final**. Hanzi proyek berasal dari `hanzhaodeng/chinese-ancient-text` dengan konversi ICU Hans-Hant, bukan dari PDF terjemahan MATAKIN; lihat [provenance](hanzi-provenance.md).

## Hasil per pasal

| ID | Hanzi proyek / pembanding | Keputusan dan alasannya |
| --- | --- | --- |
| `sishu.mengzi.07.23` (MATAKIN 2012 **IV A:23.1**, hlm. **655**) | **Proyek: 忌 / MATAKIN cetak: 患 / Zhu Xi WYG: 患** | **TERKONFIRMASI DARI FOTO CETAKAN MATAKIN 2012**: teks `孟子曰：人之患，在好為人師。` tercetak di atas terjemahan “Cacatnya orang itu ialah hanya ingin menggurui orang.” Pilihan 患 sesuai aksara cetak, konteks, dan terjemahan. Perbaikan `忌` → `患` di `sishu/chapters/mengzi/07.json` serta pinyin jì → huàn, dist dan hash **belum diterapkan**; status Final masih menunggu validasi build dan reviewer. |
| `sishu.mengzi.07.25` (MATAKIN 2012 **IV A:25.1**, hlm. **656**) | **Proyek: 哺啜 / MATAKIN cetak: 餔啜 / Zhu Xi WYG: 餔啜** | **TERKONFIRMASI DARI FOTO CETAKAN MATAKIN 2012**: Hanzi pasal memuat `徒餔啜也` dan `而以餔啜也` (dua kali 餔), di atas terjemahan “sekedar mendapat makan dan minum”. Perbaikan `哺` → `餔` pada **dua kemunculan** di `sishu/chapters/mengzi/07.json` beserta pinyin bǔ → bū dan pembaruan dist/hash **belum diterapkan**; status Final masih menunggu validasi build dan reviewer. |
| `sishu.mengzi.08.17` | 不祥 / 不詳 | **Pertahankan 不祥** karena berarti “tidak membawa berkah”, sesuai Indonesia dan Legge Inggris “inauspicious”; `孟子註疏` juga memakai 祥. |
| `sishu.mengzi.09.07` | 林氏曰 dan 愚謂 menyatu di Hanzi | **Masalah batas teks-komentar, bukan varian aksara**: kedua frasa merupakan komentar Zhu Xi yang tersisip dalam teks utama. **Jangan tandai Inggris lengkap** sebelum komentar dipisahkan dan Ruby/pinyin serta paket dibangun ulang. |
| `sishu.lunyu.09.26` | 帥 / 師 | **Pertahankan 帥** dari sumber awal 帅; konteks “panglima” dan Legge Inggris “commander” mendukungnya. |
| `sishu.lunyu.10.24` (MATAKIN 2012 **Jilid X:24**, hlm. **226**) | **Proyek: 寢不屍，居不客 / MATAKIN cetak: 寢不尸，居不容 / Zhu Xi WYG: 寢不尸，居不容** | **TERKONFIRMASI DARI FOTO MATAKIN 2012**: teks `寢不尸，居不容。` dan terjemahan “Pada waktu tidur tidak terlentang seperti mayat. Pada waktu di rumah tidak bersikap dinas.” Karakter `屍` → `尸`, `客` → `容` dan pinyin terkait perlu disinkronkan ke sumber, dist/hash; koreksi naskah aplikasi **belum diterapkan**, status Final masih menunggu persetujuan. |
| `sishu.lunyu.11.03` | 季路 / 李路 | **Pertahankan 季路**, nama murid Kongzi; Legge Inggris menulis “Chi Lu”. |
| `sishu.lunyu.14.33` (MATAKIN 2012 **Jilid XIV:33**, hlm. **302**) | **Proyek: 曰：驥不稱其力，稱其德也 / MATAKIN cetak: 子曰：驥不稱其力，稱其德也 / Zhu Xi WYG: 子曰：驥不稱其力，稱其德也** | **TERKONFIRMASI DARI FOTO MATAKIN 2012**: karakter 子 tercetak di awal pasal, sesuai “Nabi bersabda”. Tambahkan `子` dan anotasi pinyin `zǐ` di awal `sishu/chapters/lunyu/14.json`, lalu bangun ulang dist/hash; **belum diterapkan pada isi aplikasi** dan status Final tetap menunggu validasi build/reviewer. Bentuk simplified yang ditampilkan buku dalam tanda kurung bukan redaksi berbeda. |

### Lun Yu XVII:11 — konfirmasi foto MATAKIN 2012 hlm. 350 (13 November 2026)

**Teramati langsung dari foto:** cetakan MATAKIN menampilkan pasangan aksara tradisional dengan simplified dalam tanda kurung, termasuk `禮(礼) 雲(云) 禮(礼) 雲(云)` dan kemunculan `雲(云)` lain pada pasal yang sama (total enam). `Ru Classics` saat ini memakai `雲` pada keenam posisi; teks utama Zhu Xi WYG memakai `云`. Terjemahan MATAKIN menggunakan makna **berkata/menyebut**.

**Keputusan editorial disetujui pengguna (13 November 2026, setelah pembahasan foto):** gunakan `云` pada **keenam kemunculan** Lun Yu XVII:11 untuk tampilan teks klasik Ru Classics, dengan ejaan cetak MATAKIN 2012 `雲(云)` dicatat sebagai varian transkripsi; jangan diam-diam mengubah arsip verbatim foto/cetakan. `云` merupakan karakter klasik mandiri untuk *berkata/menyebut*, sedangkan `雲` bermakna *awan*; kedua bentuk menjadi `云` dalam simplified. Pinyin tetap `yún`. Bukti cetak tidak membuktikan penyebab ejaan tersebut (kemungkinan konversi adalah hipotesis). **Perubahan isi sumber, Ruby, dist/hash belum dilakukan; status Final terjemahan tetap perlu verifikasi tersendiri.**

### Lun Yu XVII:13 — foto MATAKIN 2012 (13 November 2026)

**Discrepancy #6 telah dikonfirmasi dari foto cetakan MATAKIN 2012:** teks utama berbunyi `子曰：鄉(乡)原，德之賊(贼)也！`, dengan pinyin `yuán` di atas `原`. Dalam Ru Classics (`sishu.lunyu.17.13`) tercantum `子曰：鄉愿，德之賊也。`; pada Zhu Xi WYG tercantum `鄉原`. Kedua bacaan `原/愿` dikenal sebagai varian tekstual; jangan disalahartikan sebagai perbedaan tafsir teologis. **Keputusan:** untuk teks Hanzi utama proyek selaraskan `愿` → `原` dan pinyin `yuàn` → `yuán`, sedangkan transkripsi cetak MATAKIN 2012 dan jejak sumber tetap dijaga. Koreksi data sumber/Ruby/dist belum dilakukan; status Final tidak berubah. Nomor halaman foto tidak terlihat dan tidak diisi berdasarkan perkiraan.

### Mengzi V A:7.8–7.9 — foto MATAKIN 2012 hlm. 730 (13 November 2026)

**Discrepancy #7 terkonfirmasi dari foto cetak.** MATAKIN 2012 menampilkan ayat **7.8** (`吾聞其以堯舜之道要湯，未聞以割烹也。`) kemudian langsung **7.9** (`《伊訓》曰：天誅造攻自牧宮，朕載自亳。`) tanpa `林氏曰` maupun `愚謂` di antaranya. Dalam `sishu/chapters/mengzi/09.json`, dua komentar penafsir tersebut tercampur di `ruby_paragraphs` sebelum kutipan `伊訓曰`. Teks klasik Mengzi dan komentar Zhu Xi harus disimpan dalam lapisan berbeda; pindahkan kedua komentar ke anotasi beratribusi, **jangan hapus riwayat sumber**. Pertahankan terjemahan Indonesia MATAKIN apa adanya.

**Discrepancy karakter tambahan ditemukan pada foto yang sama:** teks Ru Classics pada **V A:7.8** menulis `末聞以割烹也` (末, mò), sementara MATAKIN 2012 dan naskah Mengzi klasik menulis `未聞以割烹也` (未, wèi). Maknanya “belum pernah mendengar”; usulan koreksi `末` → `未` dengan pinyin yang konsisten. Sebagian transkripsi daring lain memang memakai `末`, sehingga perbedaan literal sumber tetap dicatat; di tampilan berbasis MATAKIN, utamakan `未`.

**Status implementasi:** temuan ini baru dicatat di audit. Perbaikan pada JSON sumber, Ruby/pinyin, `dist`, indeks/hash, dan pengujian regresi **belum diterapkan**, demikian pula belum ada pengesahan Final. Rujukan pekerjaan: [issue #13](https://github.com/zqxinai/kitab-ru-content/issues/13).

### Lun Yu IV:19 — foto MATAKIN 2012 hlm. 138 (13 November 2026)

**Discrepancy #9 terkonfirmasi dari foto:** MATAKIN 2012 mencetak `子曰：父母在，不遠(远)遊(游)，遊(游)必有方。` (karakter **遊** sebagai teks Hanzi tradisional utama, bentuk **游** dalam kurung). Teks utama Zhu Xi WYG menggunakan `遊` untuk kedua kemunculan, sedangkan `sishu.lunyu.04.19` dalam proyek menulis `游` dua kali. Pilihan **遊** selaras dengan cetakan MATAKIN dan Zhu Xi; konteks berarti bepergian/mengembara. Untuk tampilan tradisional lakukan `游` → `遊` sebanyak dua kali dan jangan ubah pinyin `yóu`; bentuk simplified `游` tetap disediakan. Ini **perbedaan bentuk/ortografi**, bukan perubahan teologis. Data sumber, Ruby, dist dan indeks/hash belum diperbarui; status Final pasal tetap memerlukan validasi tersendiri.

### Lun Yu XIV:39 — foto MATAKIN 2012 hlm. 305–306, telaah 己/已 (13 November 2026)

**Discrepancy #10, data cetak terkonfirmasi:** pada hlm. 306 cetakan MATAKIN menulis `莫己知也，斯己而已矣`, dengan pinyin `mò jǐ zhī` dan `sī jǐ ér yǐ yǐ`. Data Ru Classics `sishu.lunyu.14.39` juga menulis **己** pada dua posisi itu. Hasil penyaringan WYG sebelumnya memberi `莫已知也斯已而已矣`, sehingga ini adalah perbedaan transkripsi/penyuntingan yang tidak boleh langsung dianggap ralat wajib.

**Komentar Zhu Xi (beberapa transkripsi digital seperti CText):** `莫己之己，音紀，餘音以`, yakni 己 pada `莫己` dibaca *jǐ*, sementara huruf berikutnya yang relevan dibaca *yǐ*. Ini memberi dasar penafsiran `斯已` = *berhenti*, sesuai terjemahan MATAKIN “mengapakah tidak dihentikan saja?”. **Tradisi komentar lebih tua** (misalnya `論語集解`) membaca `斯己` terkait *diri sendiri*/*tetap berpegang pada diri sendiri*; terdapat perdebatan nyata (bukan otomatis salah ketik). Kajian Fan Haidong, `《論語》故訓考辨二則`, 香港大學中文學院《中國語言文學研究集刊》2(2), Desember 2025, hlm. 81 dst., secara khusus membahas perbedaan ini.

**Keputusan konservatif:** pertahankan teks Hanzi **己** dua kali pada Ru Classics sesuai cetakan MATAKIN, simpan sebagai varian edisi dan buat catatan filologis; **jangan mengganti seluruh 己 menjadi 已**. Pinyin kedua 己 dalam cetakan berlabel *jǐ*, sedangkan pembacaan Zhu Xi mengarah *yǐ*: tandai sebagai perbedaan bacaan (bukan otomatis “Final” pada pinyin). Terjemahan Indonesia MATAKIN tidak diubah. Tidak ada perubahan JSON sumber, Ruby, dist atau hash dari keputusan ini.

**Referensi:** https://ctext.org/si-shu-zhang-ju-ji-zhu/xian-wen-di-shi-si ; https://ehipassa.org/classics/lun/14/ ; https://web.chinese.hku.hk/upload/page/43/self/jclls-v2-n2-202512180951.pdf .

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
