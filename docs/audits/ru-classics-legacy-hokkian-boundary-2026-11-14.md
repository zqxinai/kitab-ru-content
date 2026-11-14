# Audit Pinyin–Hokkian dan batas teks Si Shu — 14 November 2026

## Metode dan batas klaim
Pemindaian terprogram mencakup seluruh 78 berkas bab dan 965 pasal: Da Xue 64, Zhong Yong 129, Lun Yu 512, Mengzi 260. Pemeriksaan ini **bukan sertifikasi filologis manual seluruh nama**. MATAKIN tetap sumber utama terjemahan dan penomoran; Hanzi pasal digunakan untuk memastikan padanan Hanyu Pinyin, dan varian yang belum jelas harus berstatus Review.

## Kebijakan editorial
- Teks asli MATAKIN pada properti translation_indonesian tetap utuh; normalisasi hanya ditampilkan di pembaca serta pencarian.
- Format nama dan istilah adalah **Hanyu Pinyin - Hokkian**; ejaan Hokkian tidak dibuang.
- Jangan menghapus kata/kalimat di akhir hanya karena menyerupai catatan. Periksa kecocokannya dengan Hanzi dan struktur edisi.
- Jangan menormalisasi seluruh istilah satu suku kata atau karakter multibacaan tanpa konteks.

## Temuan batas pasal
- Mengzi VII B:38 (sishu.mengzi.14.38): penutup kapital SIANCAI setelah catatan (IIB:13) tidak ada dalam Hanzi yang berakhir dengan 則亦無有乎爾。; dikeluarkan dari **tampilan**, bukan dihapus dari arsip sumber.
- Lun Yu XII:11 (sishu.lunyu.12.11): “Siancai!” adalah bagian dialog dan tidak boleh dihapus.
- Da Xue XI:23: judul dan kata pengantar Zhong Yong yang sempat terbawa ekstraksi telah dipisahkan pada audit terdahulu; uji regresi tetap memantau.
- Da Xue VI:1: tanda kurung penutup adalah akhir kurung pengantar bab yang hilang, bukan sisipan dan tidak boleh dihapus.

## Pasangan nama dan istilah yang berlandaskan Hanzi
- Mengzi VII B:38: 堯 Yao - Giau; 舜 Shun - Sun; 湯 Cheng Tang - Sing Thong; 禹 Yu - I; 皋陶 Gao Yao - Koo Yau; 伊尹 Yi Yin - I-ien; 萊朱 Lai Zhu - Lai-cu; 太公望 Taigong Wang - Thai-kong Bong; 散宜生 San Yisheng - San Gi-sing.
- Mengzi VII B:37: 萬章 Wan Zhang - Banciang; 陳 Chen - Tien; 琴張 Qin Zhang - Khiem Tiang; 曾皙 Zeng Xi - Cing Sik; 牧皮 Mu Pi - Bok Phi.
- Mengzi VII B:4: 殷 Yin - Ien; 狄 Di - Tik; 夷 Yi - I (hanya untuk konteks dinasti dan suku bangsa).
- Lun Yu XVI:14: 夫人 Furen - Hu-jien; 君夫人 Jun Furen - Kun Hu-jien; 小童 Xiaotong - Siau-tong; 寡小君 Gua Xiaojun - Kwa Siau-kun.
- Lun Yu XVIII:11: 伯達 Bo Da - Pik-tat; 仲突 Zhong Tu - Tiong-tut; 仲忽 Zhong Hu - Tiong-hut; 叔夜 Shu Ye - Siok-ya; 叔夏 Shu Xia - Siok-he; 季隨 Ji Sui - Kwi-swi; 季騧 Ji Gua - Kwi-wa.

## Discrepancy yang tetap perlu keputusan
**Lun Yu XVIII:11:** Pik-kwat, Hanzi digital 伯適 atau 伯适 pada varian saksi. Ruby yang ada memberi shì, sementara bacaan nama lama kuò juga didukung kamus klasik. Tidak dipaksa menjadi salah satu bacaan sebelum kolasi varian grafis dan foto cetak MATAKIN 2012. Lihat https://ctext.org/dictionary.pl?char=%E9%80%82&if=gb dan https://ctext.org/lunyu-zhushu/wei-zi.

Nama atau ritual lain yang belum termuat sebagai pasangan terverifikasi tetap dalam antrian peninjauan; keberhasilan regresi 965 pasal **tidak membuktikan semua Hokkian selesai dinormalisasi**.

## Regresi dan publikasi
Pengujian seluruh pasal memeriksa jumlah 78/965, identitas unik, normalisasi yang idempoten, pelestarian sumber MATAKIN, dan penutup yang salah tempat. Pengujian antarmuka membangun data pembaca dan memverifikasi pasangan dalam Mengzi serta seruan Siancai dalam Lun Yu. Status: usulan dalam pull request, belum Final atau diterbitkan.