# Audit satu per satu rujukan Ru Classics — 16 November 2026

**Ruang lingkup:** seluruh 78 bab dan 965 pasal, dibandingkan dengan sumber `translation_indonesian` dan keluaran tiga lapisan parser rujukan pembaca. **Ini audit teknis metadata tujuan dan kemudahan navigasi**, bukan penilaian ulang keterkaitan ajaran yang ditetapkan MATAKIN dan bukan kolasi lengkap cetakan fisik MATAKIN 2012.

## Rekap hasil terverifikasi

GitHub Actions: [Audit lengkap per kemunculan, run #43758379584](https://github.com/zqxinai/kitab-ru-content/actions/runs/43758379584) — **17 tes lulus, 0 gagal**. Artefak `matakin-reference-audit-every-occurrence` berisi **tiga versi daftar 498 kemunculan**: CSV (untuk spreadsheet), JSON (beserta konteks dan nomor offset), serta Markdown (tabel seluruh rujukan). Setiap baris diberi nomor unik dan ID pasal asal.

| Kategori temuan | Jumlah |
| --- | ---: |
| Rujukan Si Shu sudah bertaut ke pasal atau ayat tersedia | **307** |
| Rujukan Si Shu dikenali, namun belum bertaut | **21** |
| Rujukan bertaut sebagian (termasuk sumber eksternal yang wajar belum bertaut) | **5** |
| Asal kitab belum bisa dipastikan dari ejaan rujukan | **106** |
| Rujukan menyebut kitab di luar Si Shu, belum ada target lokal | **59** |
| **Total tiap kemunculan** | **498** |

Menurut sumber: **Ajaran Besar / Da Xue 27**, **Tengah Sempurna / Zhong Yong 40**, **Sabda Suci / Lun Yu 206**, **Mengzi / Bing Cu 225**.

Inventaris lama pada 15 November pernah melaporkan 489, tetapi **pemindaian sumber yang berjalan saat audit ini mendeteksi 497**, ditambah **satu** kemunculan dari rentang tanda kurung yang diperluas. Jumlah baru ini berasal dari dataset dan skrip pada commit audit terbaru, bukan klaim bahwa hanya 498 rujukan yang tercetak di seluruh buku 2012.

## Daftar lengkap 21 rujukan Si Shu yang belum memiliki tujuan klik

Urutan mempertahankan nomor baris dalam artefak terperinci. **Nomor tidak dinormalisasi berdasarkan dugaan OCR.**

| Baris | Pasal asal | Rujukan arsip | Diagnosis awal |
| ---: | --- | --- | --- |
| 45 | `sishu.lunyu.02.11` | `(T.S. XXV1:6)` | Karakter `1` bercampur angka Romawi; perlu foto/konfirmasi |
| 89 | `sishu.lunyu.05.08` | `(T.S. VIII)` | Menunjuk bab, tidak mencantumkan pasal |
| 103 | `sishu.lunyu.06.26` | `(Bc.VA: 3/4)` | Periksa target Mengzi V A:3 dan keberadaan ayat 4 |
| 104 | `sishu.lunyu.06.27` | `(S.S. IX: II )` | `II` pada posisi nomor pasal belum jelas |
| 130 | `sishu.lunyu.09.08` | `(T.S. V)` | Menunjuk bab saja |
| 145 | `sishu.lunyu.10.20` | `(Bc. VB. 8/9)` | Periksa target Mengzi V B:8 dan keberadaan ayat 9 |
| 156 | `sishu.lunyu.12.13` | `(A.B. IV )` | Menunjuk bab saja |
| 161 | `sishu.lunyu.12.20` | `(T.S. VIII)` | Menunjuk bab saja |
| 178 | `sishu.lunyu.14.02` | `(S.S. IV: 9, 1 1)` | Deret dua nomor dengan spasi OCR janggal |
| 183 | `sishu.lunyu.14.10` | `(S.S. 1:15)` | Penulisan `1` sebagai bab ambigu dengan `I` |
| 215 | `sishu.lunyu.17.17` | `(S.S. l: 3)` | Huruf kecil `l` berpotensi tertukar `I` |
| 218 | `sishu.lunyu.18.01` | `(Mengzi - Bingcu IIA: 1/8)` | Nama kitab benar tetapi format alias tidak dikenali parser |
| 249 | `sishu.mengzi.02.05` | `(T.S. XVII)` | Menunjuk bab saja |
| 270 | `sishu.mengzi.03.02` | `(TS.XXIX- XXXI;SS 23-25)` | Rentang bab/pasal; pecahan tidak aman ditebak |
| 283 | `sishu.mengzi.03.07` | `(SS.III:7.16)` | Titik mungkin memisah pasal dan ayat; perlu periksa |
| 301 | `sishu.mengzi.05.02` | `(SS XIX.17:11.5)` | Rangkaian nomor tidak mengikuti pola parser |
| 345 | `sishu.mengzi.07.12` | `(TS.XIX)` | Menunjuk bab saja |
| 348 | `sishu.mengzi.07.13` | `(IVA:7/4;SS.XIII:10-12)` | Gabungan Mengzi tanpa label dan rentang Sabda Suci |
| 360 | `sishu.mengzi.08.10` | `(TS.X,XII SS VII: 21)` | Separator antar-buku tidak jelas |
| 422 | `sishu.mengzi.13.14` | `(S.S. 11:3)` | Dua angka `1` atau angka Romawi `II` perlu bukti |
| 454 | `sishu.mengzi.14.37` | `( S.S. XVIII:13 )` | Periksa pasal tujuan dan jumlah pasal di Lun Yu XVIII |

## Lima rujukan bertaut sebagian

| Baris | Pasal | Rujukan | Bagian sudah bertaut |
| ---: | --- | --- | --- |
| 15 | Da Xue `10.03` | `(S.S. XX: 1.5;11:2)` | Lun Yu XX:1 ayat 5; angka `11:2` belum bisa diputuskan |
| 26 | Da Xue `11.22` | `(Shi Jing - Si King I.15.1.8.;SS XI:17)` | Lun Yu XI:17; Shi Jing berada di luar cakupan tautan |
| 78 | Lun Yu `04.15` | `(A.B. X 1,2; T.S. XII S.S. VI: 30; XII: 2; XV: 3)` | Da Xue X:1 dan X:2; bagian lain perlu diurai |
| 151 | Lun Yu `11.06` | `(S.S. V: 2; Shi Jing - Si King III: 3.2.5)` | Lun Yu V:2; Shi Jing berada di luar cakupan tautan |
| 285 | Mengzi `03.09` | `(SS.XV:14; XVIII: 2.8)` | Lun Yu XV:14; `XVIII: 2.8` belum dibaca aman |

**Perhatian:** Dua kasus yang mengandung `Shi Jing` tidak otomatis menjadi kesalahan. Buku luar memang belum ditautkan karena konten dan ID ayatnya tidak tersedia dalam Ru Classics.

## 106 rujukan tanpa asal kitab pasti

Masih ada **106 entri per kemunculan**, dengan distribusi **Da Xue 11, Zhong Yong 15, Mengzi 80**; tidak ditemukan pada Lun Yu dengan klasifikasi ini. Contoh:

- `sishu.daxue.04.01`: `(IV.3.3.4)`
- `sishu.daxue.04.02`: `(II.8.6.2)`
- `sishu.daxue.11.04`: `(11.4.7.1 )`
- `sishu.mengzi.01.05`: `(VII. B:4,2)`
- `sishu.mengzi.01.07`: `(II.5.4.4)`
- `sishu.mengzi.02.03`: `(1II.B.5)`
- `sishu.mengzi.02.11`: `(VII B.4/3)`
- `sishu.mengzi.03.06`: `(I A:7.4- 6)`

Sebagian adalah kandidat Mengzi dengan ejaan yang rusak, tetapi angka empat komponen yang tidak menyebut kitab **tidak boleh otomatis dinyatakan Mengzi**, karena dapat menunjuk Shi Jing atau sumber lain. Daftar **seluruh 106** berikut teks tepatnya dapat difilter dari kolom `status = asal-belum-pasti` pada CSV.

## 59 rujukan menuju kitab di luar Si Shu

Contoh:
- Da Xue `02.01`: `(Shu Jing - Su King V.9.1)`
- Da Xue `03.03`: `(Si-kingIII.1.1.1)` — nama Shi Jing dapat dikenali meski spasi hilang.
- Lun Yu `14.34`: `(Lee Ki XXIX: 12)` — Li Ji.
- Lun Yu `20.01`: `(Shu Jing - Su King II.2)`

Ke-59 catatan **belum menjadi tautan internal**, bukan berarti identitas kitab selalu salah. Memperbaiki format penulisannya dan menyediakan navigasi ke kitab luar adalah dua pekerjaan berbeda.

## Kebijakan tindak lanjut

1. Terus pertahankan teks MATAKIN 2011 asli; tampilkan nama kitab lengkap dalam overlay.
2. Validasi ID pasal tujuan dan ayat sebelum mengaktifkan tautan. **Garis miring `/N` berarti ayat**, sesuai aturan MATAKIN.
3. Terima hubungan isi antar-ayat yang sudah ditetapkan MATAKIN tanpa menilai ulang ajarannya.
4. Jangan mengganti simbol OCR `1`, `I`, `l`, `11`, atau `II` tanpa konteks atau foto cetakan yang membuktikan.
5. Status audit **teknis** tidak menaikkan status persetujuan editor menjadi Final.

**Laporan lengkap per kemunculan:** GitHub Actions [run #43758379584](https://github.com/zqxinai/kitab-ru-content/actions/runs/43758379584), artefak `matakin-reference-audit-every-occurrence`; berisi CSV, JSON dan Markdown lengkap (498 baris, termasuk 307 rujukan yang telah tertaut), dengan offset dan konteks sumber pada JSON/CSV. File artefak GitHub Actions memiliki masa retensi dan tidak dimaksudkan sebagai pengganti dokumentasi permanen ini.
