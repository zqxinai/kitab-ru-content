# Ru Classics — Standar Referensi dan Kolasi MATAKIN / Zhu Xi / James Legge v2.0

**Status:** kebijakan editorial dasar, bukan pengesahan otomatis seluruh isi kitab. **Ditetapkan:** 14 November 2026.

## Keputusan sumber yang tidak boleh berganti tanpa alasan

1. **MATAKIN 2011** (PDF yang disediakan pemilik) tetap sumber dasar terjemahan Indonesia dan batas ayat yang dapat dibaca. PDF ini tidak memiliki seluruh Hanzi dan pinyin cetakan 2012.
2. **MATAKIN 2012** (buku fisik, foto bertahap) mengendalikan **apa yang benar-benar tercetak** pada lokasi yang sudah dapat dibuktikan: penamaan bab, nomor pasal dan ayat, Hanzi tradisional, tambahan simplified dalam kurung, pinyin cetak, pasangan Mandarin–Hokkian, dan rujukan kitab lengkap. Bukti foto belum mencakup seluruh 965 pasal.
3. **Hanzi proyek berasal dari korpus digital awal**; **朱熹《四書章句集註》** dalam edisi **欽定四庫全書** dari Kanripo *commit* `84c6b2c5093c57ae5d41c60a73c02323d2420ef0` adalah **pembanding klasik utama yang tetap**. Tidak boleh memaksakan semua aksara menjadi sama dengan WYG jika edisi MATAKIN atau konteks mendukung varian.
4. **James Legge**: identitas edisi Inggris yang dipakai sebagai acuan editorial ialah ***The Chinese Classics***, **Vol. I, edisi kedua revisi 1893** untuk Lun Yu, Da Xue, Zhong Yong; serta **Vol. II, edisi kedua revisi 1895** untuk Mengzi. Situs seperti Gutenberg, Tianmu, Confuciuspedia, ChineseNotes bukan penerjemah baru, tetapi **saksi transkripsi digital**. Kesetiaan masing-masing salinan terhadap volume cetak tersebut **masih perlu dikolasi** dan tidak boleh diasumsikan.
5. **Status setiap pasal/ayat** tetap Draft/Perlu Review sampai pemeriksa menyetujui, terlepas dari angka 965/965 draf Inggris.

## Singkatan kitab yang sudah dikonfirmasi pemilik MATAKIN 2012

| Singkatan | Nama kitab (penulisan lengkap) | Hanzi dan pinyin | ID internal |
| --- | --- | --- | --- |
| `SS`, `S.S.` | Sabda Suci / Lun Yu | 論語 — Lún Yǔ | `lunyu` |
| `AB`, `A.B.` | Ajaran Besar / Da Xue | 大學 — Dà Xué | `daxue` |
| `BC`, `B.C.`, `Bc.` | Bingcu / Mengzi | 孟子 — Mèng Zǐ | `mengzi` |
| `TS`, `T.S.` | Tengah Sempurna / Zhong Yong | 中庸 — Zhōng Yōng | `zhongyong` |

Kapitalisasi dan tanda titik adalah varian ejaan singkatan. Identitas **kitab** sudah dipastikan, tetapi nomor bab/pasal/ayat, batas rujukan campuran, dan tulisan persis pada foto 2012 tetap harus diverifikasi terpisah. Rujukan tingkat bab (misalnya `(T.S. VIII)`) **tidak boleh** memperoleh tautan pasal rekaan. `II.5.4.4` yang tanpa nama kitab tidak otomatis menunjuk kitab sumber.

Normalisasi nama lengkap untuk pembaca/editor berasal dari [overlay rujukan ber-ID](../ru-classics/reference-overlay.js); `translation_indonesian` berbasis PDF 2011 tetap identik. Kebijakan ini hanya menyatakan format penyajian sesuai 2012, bukan menyatakan setiap nama/penulisan hasil overlay sudah ditranskripsi kata per kata dari foto cetakan.

## Makna dan otoritas rujukan silang MATAKIN — keputusan final

Rujukan silang yang tercantum dalam **sumber otoritatif MATAKIN** diterima sebagai penanda keterkaitan isi/ajaran antar-pasal atau antar-ayat. **Tidak perlu menilai, mengaudit, membuktikan kembali, atau menyetujui ulang ketepatan hubungan ajarannya.** Rujukan itu **bukan** klaim bahwa kedua pasal mengandung kutipan verbatim. Tidak adanya kesamaan kalimat bukan discrepancy.

Kebijakan pelaksanaan audit **hanya** mencakup: (1) kesetiaan penyalinan penanda rujukan dari MATAKIN, (2) identitas kitab SS/AB/BC/TS, (3) angka bab, pasal, dan ayat yang ditunjuk, (4) keberadaan tujuan pada dataset dan pemetaan ke ID internal, serta (5) keamanan penggantian tampilan dan navigasi. Jangan menciptakan daftar *perlu review hubungan ajaran*.

**Notasi:** `Kitab Bab:Pasal/Ayat` bermakna `/N` adalah **Ayat N dalam pasal rujukan**, sesuai konfirmasi pemilik buku tanggal 15 November 2026. Contoh `Bc IIA:7/5` = Mengzi II A pasal 7 ayat 5; `IIA:2/19` dan `IIA:2/28` = Mengzi II A pasal 2 ayat 19 dan 28. Ketiga penanda ayat itu ditemukan berurutan pada naskah MATAKIN 2011 digital. Ketersediaan nomor ayat berbeda dari ketersediaan *deep link* yang dapat dipakai.

Pada metadata, `reference_intent: "content-related"` dan `verbatim_match_required: false` berlaku, dengan `reference_authority: "MATAKIN"` dan `relationship_review_required: false`. Status `review-only` **hanya untuk masalah teknis yang belum tuntas**, misalnya nomor ambigu, salah baca tanda baca, sumber belum terfoto, atau penentuan tautan/ayat yang belum dapat dibuktikan. Status itu **bukan** permintaan mengaudit hubungan teologis/filosofis.

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
