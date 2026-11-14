# Ru Classics — Standar Referensi dan Kolasi MATAKIN / Zhu Xi / James Legge v2.0

**Status:** kebijakan editorial dasar, bukan pengesahan otomatis seluruh isi kitab. **Ditetapkan:** 14 November 2026.

## Keputusan sumber yang tidak boleh berganti tanpa alasan

1. **MATAKIN 2011** (PDF yang disediakan pemilik) tetap sumber dasar terjemahan Indonesia dan batas ayat yang dapat dibaca. PDF ini tidak memiliki seluruh Hanzi dan pinyin cetakan 2012.
2. **MATAKIN 2012** (buku fisik, foto bertahap) mengendalikan **apa yang benar-benar tercetak** pada lokasi yang sudah dapat dibuktikan: penamaan bab, nomor pasal dan ayat, Hanzi tradisional, tambahan simplified dalam kurung, pinyin cetak, pasangan Mandarin–Hokkian, dan rujukan kitab lengkap. Bukti foto belum mencakup seluruh 965 pasal.
3. **Hanzi proyek berasal dari korpus digital awal**; **朱熹《四書章句集註》** dalam edisi **欽定四庫全書** dari Kanripo *commit* `84c6b2c5093c57ae5d41c60a73c02323d2420ef0` adalah **pembanding klasik utama yang tetap**. Tidak boleh memaksakan semua aksara menjadi sama dengan WYG jika edisi MATAKIN atau konteks mendukung varian.
4. **James Legge**: identitas edisi Inggris yang dipakai sebagai acuan editorial ialah ***The Chinese Classics***, **Vol. I, edisi kedua revisi 1893** untuk Lun Yu, Da Xue, Zhong Yong; serta **Vol. II, edisi kedua revisi 1895** untuk Mengzi. Situs seperti Gutenberg, Tianmu, Confuciuspedia, ChineseNotes bukan penerjemah baru, tetapi **saksi transkripsi digital**. Kesetiaan masing-masing salinan terhadap volume cetak tersebut **masih perlu dikolasi** dan tidak boleh diasumsikan.
5. **Status setiap pasal/ayat** tetap Draft/Perlu Review sampai pemeriksa menyetujui, terlepas dari angka 965/965 draf Inggris.

## Pemeriksaan sebelum menyatakan sebuah karakter salah

- Bandingkan frase lengkap, fungsi tata bahasa klasik, konteks terjemahan Indonesia, dan identitas tokoh/nama diri.
- Pisahkan **tradisional vs simplified** yang setara, **varian historis**, **kesalahan bentuk karakter**, **polifon pinyin**, **varian teks bermakna**, dan **salah batas teks/komentar**. Jangan gunakan replace global untuk karakter ambigu.
- Perhatikan bahwa simplified dalam **tanda kurung** pada cetakan 2012 ialah informasi tambahan, **bukan** dua karakter dalam naskah tradisional utama.
- Pinyin cetak dan pinyin yang dianjurkan berdasarkan konteks adalah **dua fakta terpisah** jika berbeda; simpan keduanya beserta alasan.
- Pertahankan transliterasi Mandarin dan Hokkian berpasangan dalam terjemahan sesuai pola MATAKIN 2012, tetapi jangan mengarang foto/sumber yang belum tersedia.
- Rujukan dalam kitab yang sama ditulis dengan **nama kitab lengkap**, sesuai 2012; jangan salah mengenali tanda kurung referensi sebagai penanda ayat.
- Pecah pasal menjadi subayat **hanya jika batasnya dapat dibuktikan**; jangan menganggap paragraf Hanzi atau unit Legge selalu sama dengan ayat MATAKIN.

## Kapan sumber pembanding alternatif boleh dibuka?

Hanya jika: sumber yang terkunci **tidak memuat bagian yang dicari**, digitalisasi terbukti **terpotong/keliru**, **cakupan pasal berbeda**, atau terdapat **varian substantif yang belum dapat dijelaskan**. Sumber alternatif dicatat sebagai *witness* tambahan dan **tidak secara otomatis mengganti** edisi yang sudah dipilih. Keputusan revisi mencatat sumber, halaman/pasal, frasa sebelum–sesudah, konteks, dan uji regresi. Kasus yang sudah lolos audit tidak dibuka lagi tanpa bukti baru atau kegagalan tes.

## Penjagaan teknis

**Registri mesin:** [`sources/source-registry.json`](../sources/source-registry.json) adalah identitas bibliografi dan peran tiap sumber. Snapshot dan hasil batch historis tetap dipertahankan. **Registri bukan pengganti teks kitab.**

**Pengujian:** `node --test tests/source-provenance.test.js` memeriksa bahwa keempat kitab terpetakan ke volume Inggris yang benar, dokumen saksi digital benar-benar tersedia dalam repo, dan metadata manifest tidak kembali menyamakan Mengzi dengan Vol. I.

**Penting:** seluruh draf Legge yang sudah ada *tidak* ditulis ulang akibat perubahan sumber. Koleksi dipertahankan; perbaikan berikutnya hanya berdasarkan kasus yang terbukti.

## Referensi bibliografi tetap

- [Legge, The Chinese Classics, Vol. I, Oxford 1893](https://ignca.gov.in/Asi_data/28599.pdf).
- [Legge, The Chinese Classics, Vol. II, Oxford 1895 — katalog BnF](https://catalogue.bnf.fr/ark:/12148/cb33299473g).
- [Kanripo `KR1h0015`, commit WYG terpilih](https://github.com/kanripo/KR1h0015/tree/84c6b2c5093c57ae5d41c60a73c02323d2420ef0).
- [Dokumentasi audit Inggris lama](english-alignment.md) tetap berguna sebagai jejak batch, bukan otoritas yang mengalahkan kebijakan ini.
