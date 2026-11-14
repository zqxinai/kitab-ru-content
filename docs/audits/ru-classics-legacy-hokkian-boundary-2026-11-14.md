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

## Lanjutan kolasi lintas-kitab — sesi kedua
Pemeriksaan otomatis ulang pada 965 pasal menemukan 65 istilah kandidat yang perlu ditelusuri. Banyak kemunculan adalah komponen **pasangan yang sudah benar** (mis. Thong di Sing Thong, Hwi di Liuhe Hwi), sehingga angka kandidat tidak boleh dianggap sebagai jumlah kesalahan. Setelah aturan tampilan tambahan, lebih dari 160 pasal mendapat perbaikan format; jumlah tepat mengikuti log CI setiap commit.

### Pembuktian identitas berlainan — tidak boleh replace global
1. Mengzi 梁惠王上 §5 / ID sishu.mengzi.01.05:
   - 晉國 = Jin; MATAKIN menuliskan "Negeri Cien" (tetap tersimpan).
   - 西喪地於秦七百里 = kalah di barat dari **Qin**, tetapi sumber Indonesia menggunakan "Negeri Jin - Chien". **Display** mengganti hanya kemunculan Qin di pasal tersebut.
   - 秦楚 = Qin dan Chu, termasuk rujukan tentara. Nama Chien/Cho harus diputuskan berdasarkan Hanzi.
   - Paralel sumber primer: https://ctext.org/mengzi/liang-hui-wang-i.
2. Mengzi 梁惠王上 §7 / ID sishu.mengzi.01.07: 晉文 = Duke Wen dari Jin (Cien); 秦楚 pada bagian lain adalah Qin/Chu; 鄒 = Zou (Coo). Tidak menerapkan satu Pinyin ke semua "Cien" atau "Chien".
3. Lun Yu XIV:18 / ID sishu.lunyu.14.18: 僎 = **Zhuan - Swan**; kamus MOE Taiwan: https://dict.revised.moe.edu.tw/dictView.jsp?ID=8121&la=0&powerMode=0.
4. Mengzi X:9 / ID sishu.mengzi.10.09: 宣 dari 齊宣王 = **Xuan - Swan**. Jadi Swan tidak boleh dinormalisasi ke satu nama untuk semua pasal.
5. Mengzi IV A:17 / ID sishu.mengzi.07.17: 淳於髡 = Chunyu Kun - Sun-i Khun. Mendeteksi "Sun" di dalam nama majemuk sebagai "Shun" adalah kesalahan: batas nama majemuk sekarang dilindungi.
6. Lun Yu XI:13 / ID sishu.lunyu.11.13: "Zi Lu - Zi Lu - Cu Lo" adalah pasangan ganda; dipadatkan menjadi "Zi Lu - Cu Lo" pada display.

### Istilah lain yang sudah memiliki padanan Hanzi jelas
- Da Xue: 明德 Mingde - Bing Tik; 康誥 Kanggao - Khong-koo; 太甲 Taijia - Thai Kak; 上帝 Shangdi - Siang Tee.
- Lun Yu: 有子 Youzi - Yucu; 柳下惠 Liu Xiahui - Liuhe Hwi; 叔齊 Shu Qi - Siok-cee; 樊遲 Fan Chi - Hwan-thi; 子夏 Zixia - Cu-he; 臧文仲 Zang Wenzhong - Cong Bun-tiong; 周任 Zhou Ren - Ciu Jiem.
- Penamaan tokoh/negara/kumpulan sajak yang memiliki romanisasi beragam telah dibuat **pasage-scoped** di tabel CONTEXTUAL, dan setiap entri diuji terhadap kalimat yang benar-benar ada pada sumber.

### Status yang sengaja tetap Review
- Da Xue XI:14: "Pangeran Chien" terkait kutipan **秦誓 (Qin Shi)**. Penamaan orang versus judul kitab merupakan masalah sumber/terjemahan, bukan alias bunyi biasa. Jangan mengubah klaim MATAKIN tanpa foto/saksi 2012.
- Lun Yu XVIII:11: 伯適/伯适 "Pik-kwat" menunggu keputusan bacaan konteks.
- Istilah ritual dan tokoh yang belum memiliki kesepadanan Hanzi yang jelas tetap tidak diganti global.
- Deteksi kalimat penutup (bukan hanya pola kapital) memerlukan kolasi editorial; uji otomatis tidak dapat menyimpulkan seluruh 965 pasal telah bebas sisipan.

### Kaitan dengan APK Android
Repositori Flutter Android yang terpisah adalah zqxinai/Ru-Classics. Rancangan penerapan overlay ke paket Android tanpa menimpa sumber MATAKIN disiapkan di https://github.com/zqxinai/Ru-Classics/pull/7. Sumber overlay dipatok ke commit spesifik PR #38 untuk uji CI dan belum menjadi persetujuan/publikasi.

## Penelitian lanjut nama 伯適 / 伯适 (Lun Yu XVIII:11)
- Sumber klasik Zhu Xi dalam *Si Shu Zhang Ju Ji Zhu* memakai grafem **伯适** pada daftar delapan orang bijak: https://zh.wikisource.org/wiki/%E5%9B%9B%E6%9B%B8%E7%AB%A0%E5%8F%A5%E9%9B%86%E8%A8%BB/%E8%AB%96%E8%AA%9E%E9%9B%86%E6%B3%A8%E5%8D%B7%E4%B9%9D.
- *Kangxi Zidian* pada 适 mengutip **古活切，音括**, serta menyebut **周八士伯适** secara eksplisit. Ini bukti kuat bahwa bacaan nama klasik adalah **kuò**, bukan sekadar pembacaan umum **shì** dari 適. Lihat: https://ctext.org/dictionary.pl?char=%E9%80%82&if=gb&remap=gb.
- Situs romanisasi modern juga menuliskan 伯适 (音 kuò). Ini bukan bukti primer, melainkan konfirmasi tambahan: https://www.sohu.com/a/669407957_121124743.
- Naskah JSON saat ini menuliskan **伯適** dengan ruby **shì**; ejaan Hokkian MATAKIN **Pik-kwat** turut menyarankan bunyi klasik kuò. Kandidat display: **Bo Kuo - Pik-kwat**, dan kandidat ruby **伯 bó、適 kuò** untuk konteks khusus ini.
- **Keputusan editorial sementara: perlu Review** sebelum penggantian ruby sumber, karena varian grafem 适/適 dan pinyin yang benar-benar dicetak dalam edisi MATAKIN 2012 belum dikolasi dengan foto. Tidak mengganti istilah tersebut secara global ataupun menyatakan semua 適 dibaca kuò.
- Catat dua data ketika foto tersedia: `printed_pinyin` dari MATAKIN dan `contextual_pinyin` berdasar komentar leksikal klasik; apabila berbeda, berikan alasan yang terlacak.

## Sesi 3: audit nama yang berdampak pada makna negara/tokoh (13 November UTC–14 November WIB)

Audit berikut menggunakan **Hanzi per pasal sebagai pemeriksa padanan**, sedangkan bahasa Indonesia MATAKIN disimpan utuh di arsip. GitHub Actions [reading audit #43598446506](https://github.com/zqxinai/kitab-ru-content/actions/runs/43598446506) lulus **6 tes / 0 gagal**; pemindaian 78 bab/965 pasal mendeteksi **184 pasal** yang berbeda hanya pada lapisan tampilan.

### Koreksi baru terverifikasi
- **Mengzi V B:9**, `sishu.mengzi.09.09`: dalam Hanzi `百里奚…秦穆公…晉人…虞…虢`, sehingga `Negeri Jin - Chien` yang merujuk Qin pada beberapa kalimat harus ditampilkan **Qin - Chien**. Sebaliknya `utusan Negeri Cien` yang merujuk 晉 ditampilkan **Jin - Cien**. `Pik-li Hee` = **Baili Xi**, `Kiong Ciki` = **Gong Zhiqi**, `Bok` pada `秦穆公` = **Mu**. Ini kasus nyata *satu ejaan lama tidak boleh otomatis dipasangkan ke satu nama modern di seluruh pasal*. Ejaan asli tetap tersedia dalam `translation_indonesian`.
- **Mengzi II A:2**, `sishu.mengzi.04.02`: `晉楚之富` = **Jin/Chu**, dan `公孫醜` = **Gongsun Chou**. Sumber lama `Kong- sun Thio` mengandung pecahan OCR yang harus dipulihkan menjadi **Kong-sun Thio**, agar suku `sun` tidak keliru dikira `舜 Shun`.
- **Mengzi III B:3**, `sishu.mengzi.06.03`: `周霄` = **Zhou Xiao - Ciu Siau**.
- **Mengzi III B:6**, `sishu.mengzi.06.06`: `戴不勝` = **Dai Busheng - Tai Put-sing** dan `薛居州` = **Xue Juzhou - Siat Ki-ciu**. Kesepadanan lain dipilih hanya di konteks Hanzi 齊/楚/莊岳 yang bersangkutan.
- **Mengzi V B:2**, `sishu.mengzi.10.02`: daftar gelar `天子、公、侯、伯、子、男` = **Tianzi, Gong, Hou, Bo, Zi, Nan**; ejaan Hokkian dan padanan gelar Inggris sumber tetap dipertahankan di tampilan.
- **Mengzi VI A:8**, `sishu.mengzi.11.08`: `良心` = **Liangxin - Liang Siem** dalam keterangan hati nurani.
- **Lun Yu II:9**, `sishu.lunyu.02.09`: `回` = **Hui - Hwee**; sebutan sumber `Gan Yan` dibiarkan di dalam tanda kurung, bukan diam-diam disamakan dengan kata yang tidak tercantum pada ayat.

### Interpretasi inventaris yang tepat
Pemindaian menemukan beberapa kelompok kata yang tampak belum berpasangan, tetapi jumlah kelompok tersebut **bukan jumlah kesalahan yang terbukti**. Misalnya `Thong` adalah komponen nama **Sing Thong**, `Hwi` ada dalam **Liuhe Hwi**, `Cee` juga menjadi bagian **Siok-cee**, dan `Sun` bisa menjadi bagian nama **Sun-i Khun** atau nama keluarga lain, bukan 舜. `Siancai!` di tengah dialog tetap sah. Inventaris dipakai sebagai **antrian bukti**, bukan sebagai dasar penggantian global.

### Kasus untuk keputusan editor berikutnya
1. **Da Xue XI:14**: judul Hanzi adalah `《秦誓》` (Qin Shi), sedangkan kalimat MATAKIN mengawali kutipannya dengan "maklumat Pangeran Chien". Ini merupakan kemungkinan perbedaan interpretasi sumber/terjemahan, **bukan sekadar pasangan pinyin**. Butuh kolasi edisi cetak MATAKIN 2012 sebelum mengganti tampilan atau memberi catatan koreksi.
2. **Lun Yu XVIII:11**, `伯適/伯适`: indikasi bacaan nama klasik `Bo Kuo - Pik-kwat` kuat dari Kangxi, tetapi ruby dataset `shì` dan foto cetak MATAKIN 2012 masih perlu ditetapkan sebagai dua lapisan bukti. Tetap Review.
3. **Mengzi**, nama `Bun`, `Ciu`, `Chien`, `Cho` yang berdiri sendiri memerlukan pemastian kalimat/Hanzi terkait; tidak boleh semua diproses secara global.

Catatan versi APK: [PR Android #7](https://github.com/zqxinai/Ru-Classics/pull/7) sekarang menyiapkan **Alpha 0.2.5** dengan normalizer di-pin ke commit `ece3240e07991f45ee5bb43bde055da95c534887`, yang menjalani pengujian di atas. Proses build APK dan uji fisik **terpisah** dari audit filologis; keberhasilan build tidak mengubah status editorial menjadi Final.
