# Audit enam foto Si Shu MATAKIN cetakan 2012 — 14 November 2026

Status: **pemeriksaan selesai untuk bagian foto yang terlihat dan koreksi sumber terdokumentasi telah diterapkan**. Setiap perbedaan perlu diuji dan paket `dist` serta indeks Legge disinkronkan sebelum diterbitkan. Semua status tetap Draft/Perlu Review, bukan Final.

## Prinsip
- Sumber primer yang diperiksa: enam foto cetakan MATAKIN 2012 dari pemilik buku, urut sesuai pesan 14 November 2026. Jangan memperkirakan bagian yang terpotong.
- Pembanding: `sishu/chapters/{daxue,zhongyong,lunyu,mengzi}/*.json` pada `main`, bukan halaman web yang mungkin memakai paket lama.
- Pertahankan teks terjemahan 2011 sebagai saksi tersendiri. Perubahan perumusan Indonesia antara 2011 dan 2012 jangan disembunyikan sebagai typo.
- Bedakan pasal (unit lama: total 965) dari **subayat** (mis. Mengzi IA:1 ayat 1–6). Jangan menyimpulkan batas ayat Hanzi dari jumlah paragraf.

## Register foto, kolasi dan keputusan

### Foto 1 — Da Xue X:12–13, halaman cetak 27 (`411439.jpg`)
- `sishu.daxue.11.12`: Hanzi `《楚書》曰：“楚國無以為寶，惟善以為寶。”` cocok (bentuk sederhana dicantumkan dalam kurung oleh cetakan); pinyin inti cocok. Terjemahan proyek menyebut **Kitab Kerajaan Cho** sedangkan foto **Chu - Cho**, dan terdapat tanda kutip tunggal salah tempat setelah kata `memandang'` pada proyek. Ini adalah discrepancy nyata romanisasi/karakter tanda baca.
- `sishu.daxue.11.13`: Hanzi `舅犯曰：“亡人無以為寶，仁親以為寶。”` cocok. Cetakan memakai nama **Jiu Fan - Kiu Hwan**; terjemahan proyek hanya **Kiu-hwan**.
- **Tambahan yang sebelumnya belum dicatat:** foto yang sama ternyata menampilkan **teks Hanzi pasal X:14 cukup lengkap** walaupun terjemahan Indonesia X:14 belum muncul. `sishu.daxue.11.14`: cetakan `若有壹（一）個（个）臣` (yī gè chén), sedangkan proyek `若有一介臣` (yī jiè chén). Ini **perbedaan tekstual otoritatif edisi**, bukan typo remeh. Bagian `若己有之`, `實能容之` (dua kali) dan `媢嫉` tampak sama dengan data sumber; jangan ralat bagian yang cocok. Foto hanya mengesahkan Hanzi X:14 yang terlihat; tidak mengesahkan terjemahan X:14.

### Foto 2 — Lun Yu XVIII:11 (`image-1794665206168.jpg`)
- `sishu.lunyu.18.11`: cetakan mencetak **伯适**, pinyin **bó guā**; proyek menyimpan **伯適**, pinyin **bó shì**. **Salah identifikasi karakter homograf/varian**. `适` ialah karakter tersendiri yang dibaca `guā` (juga `kuò`) dalam nama klasik. Rujukan tambahan: kamus varian MOE Taiwan `https://dict.variants.moe.edu.tw/dictView.jsp?ID=72889`; juga `https://ctext.org/lunyu-zhushu/wei-zi`.
- Hanzi tujuh nama lainnya cocok dalam cakupan foto.
- Semua delapan nama pada terjemahan cetak 2012 dipasangkan Mandarin–Hokkian: **Bo Da - Pik Tat**, **Bo Gua - Pik Khwat**, **Zhong Tu - Tiong Tut**, **Zhong Hu - Tiong Hut**, **Shu Ye - Siok Ya**, **Shu Xia - Siok He**, **Ji Sui - Kwi Si**, **Ji Gua - Kwi Wa**. Proyek memuat Hokkian saja untuk mayoritas nama; beda romanisasi yang harus dikolasi, bukan koreksi lepas konteks.

### Foto 3 — Da Xue Bab Utama:1–2 (`image-1794665242092.jpg`)
- `sishu.daxue.01.01`: foto **親（亲）民** dengan pinyin **qīn mín**, sesuai sumber. Catatan `editorial_annotations[0].reading_variants.project_main.basis` dan `edition_caveat` sekarang sudah ketinggalan karena menyebut foto 2012 belum diverifikasi. Teks utama `親民` **benar** dan tidak boleh diganti otomatis dengan `新民`; catatan Chengzi/Zhu Xi tetap dipisah.
- `sishu.daxue.01.02`: Hanzi dan pinyin dalam foto cocok secara tekstual dengan proyek. Punctuation serta penulisan `Da Xue/Thai Hak` yang ditambahkan dalam terjemahan proyek merupakan editorial; jangan diperlakukan sebagai huruf Hanzi hilang.

### Foto 4 — Mengzi VB:8.2 dan awal 9.1 (`image-1794665636995.jpg`)
- `sishu.mengzi.10.08`: isi ayat **8.2** pada foto cocok dengan bagian Indonesia `(2)` yang sudah tersimpan di `translation_indonesian`. Namun objek pasal masih menjadi satu unit; belum ada model ID subayat Hanzi–pinyin–Indonesia–Inggris yang dapat diaudit terpisah.
- `sishu.mengzi.10.09`: foto memulai **9.1** dengan pasangan **Xuan - Swan** untuk 齊宣王; proyek Indonesia hanya menggunakan **Swan**, tanpa Xuan. Potongan foto menunjukkan Hanzi awal pasal sampai `則易位`; jangan mengklaim bagian sesudahnya diverifikasi.

### Foto 5 — Da Xue X:5 dan awal X:6 (`411446.jpg`)
- `sishu.daxue.11.05`: Hanzi foto jelas mencetak **儀監（监）於（于）殷**, pinyin `yí jiàn yú yīn`; proyek **儀鑒於殷**. Varian **監 vs 鑒** kini memiliki bukti foto dan harus dicatat dengan pembedaan dari Zhu Xi/WYG. Jika menyelaraskan MATAKIN 2012, gunakan `監` dan pertahankan `jiàn`.
- Cetakan Indonesia memakai **Shi Jing - Si King**, **Yin - Ien**, dan **Tian - Thian Yang Maha Tinggi**; terjemahan proyek menghilangkan beberapa pasangan Mandarin–Hokkian serta memakai **Tuhan Yang Maha Tinggi — Shangdi (Siang Tee)**. Perbedaan ini **substantif**; perlu keputusan saksi teks, jangan diam-diam mengatakan 2011 dan 2012 identik.
- `sishu.daxue.11.06`: Hanzi awal `是故君子先慎乎德，有德此有人…` cocok; romanisasi `Jun Zi - Kun Cu` pada foto berbeda secara tata tulis dengan `Junzi - Kuncu` proyek, tidak membuktikan salah teks Hanzi.
- **X:7 tidak terlihat pada foto**, walaupun judul kepala halaman mencantumkan rentang 'X:5–7'. Tidak diverifikasi.

### Foto 6 — Zhong Yong XIII:3–4 (`411450.jpg`, gambar perlu diputar untuk dibaca)
- `sishu.zhongyong.14.03`: Hanzi/pinyin yang terlihat cocok. Foto menyebut **Tian - Thian** pada kalimat terakhir, tetapi proyek menyebut **Tuhan YME**. Ini bukan salah OCR; perbedaan sumber/versi Indonesia yang perlu diperlakukan sebagai discrepancy.
- `sishu.zhongyong.14.04`: Hanzi sama `故君子居易以俟命，小人行險以徼幸。`, tetapi pinyin proyek `俟/qí` salah konteks; MATAKIN **`俟/sì`**. Kamus resmi MOE Taiwan merekam `俟命 = sì mìng` pada kutipan Zhong Yong: `https://dict.revised.moe.edu.tw/dictView.jsp?ID=143818`.
- Foto 2012 menyebut **Jun Zi - Kun Cu** dan **Xiao Ren - Siau Jien**; proyek mengganti nama kedua menjadi uraian **seorang rendah budi**, sehingga romanisasi sumber hilang.
- **Nomor yang benar ialah Bab XIII (indeks internal 14)**. File `sishu/editions/matakin-2012-chapters.json` dan judul sumber sudah benar; jangan keliru memberi label Bab XIV.

## Prioritas tindak lanjut (belum dikerjakan dalam audit ini)
1. Perbaiki karakter/pinyin terverifikasi: `伯適/shì→伯适/guā`; `俟/qí→俟/sì`; `儀鑒→儀監`; `若有一介臣→若有壹個臣` sesuai foto, dengan provenance varian WYG/edisi Zhu Xi disimpan terpisah.
2. Perbarui catatan `親民` yang menyebut foto 2012 belum tersedia; jangan ubah ayat utama.
3. Tandai discrepancy terjemahan/romanisasi 2011 vs 2012 untuk keputusan editorial; jangan mengganti teks 2011 tanpa menandai sumber versi.
4. Sebelum publikasi, sinkronkan `dist/sishu-content.json`, indeks `dist/sishu-english-alignment.json` dan hash referensi turunan yang terdampak; uji pipeline website/editor/Android. **Tidak** ada status Final otomatis.
5. Audit subayat keseluruhan secara terpisah. Penanda dalam `translation_indonesian` belum menjamin alignment Hanzi/Inggris per ayat.

Audit ini tidak memutihkan perbedaan pada bagian yang terpotong dan tidak mengulang perkara lama yang sudah cocok.

## Implementasi hasil audit (batch langsung sesudah verifikasi)

- Perbaikan Hanzi/ruby: Lun Yu XVIII:11 `伯适 guā`; Da Xue X:5 `儀監 jiàn`; Da Xue X:14 `壹個 yī gè`; Zhong Yong XIII:4 `俟 sì`.
- Pasangan pinyin–Hokkian dilengkapi hanya pada ayat yang ditampilkan foto: Lun Yu XVIII:11, Da Xue X:5–6 dan X:12–13, Zhong Yong XIII:3–4, serta Mengzi VB:9.1. Redaksi 2012 yang dipakai berbeda dari beberapa redaksi Indonesia berbasis PDF 2011; versi lama tetap dapat ditelusuri melalui riwayat Git dan dokumen audit ini.
- Metadata `親民` di Bab Utama:1 diperbarui: foto 2012 tersedia dan mendukung bacaan proyek, tidak mengubah komentar Chengzi maupun status Draft.
- Penyelarasan `dist/sishu-english-alignment.json` pada Da Xue X:5/X:14 mengikuti Hanzi proyek terbaru; transkrip/snapshot sumber Legge tidak diubah. Pengujian historis memastikan bentuk lama tetap dicatat sebagai saksi berbeda.
- `tests/matakin-2012-six-photos.test.js` menegakkan pembacaan, romanisasi, batas bukti foto, ketakterubahan ID/struktur 78 bab dan 965 pasal, serta status belum Final.
- Pemberlakuan pada website/APK memerlukan build, CI, dan verifikasi deploy terpisah. Jangan klaim sukses dari commit sumber saja.
