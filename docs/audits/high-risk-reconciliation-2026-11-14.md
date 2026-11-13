# Rekonsiliasi delapan kandidat high-risk awal — 14 November 2026

> **Pembaruan berdasarkan foto cetak MATAKIN 2012 (14 November):** Bukti [tiga foto Zhong Yong](zhongyong-photos-xii-xxiv-xxv-2026-11-14.md) menegaskan bentuk `己` untuk diri sendiri pada XXIV:3 dan Hanzi XXV:4; tanda baca XXV:4 telah disesuaikan. **XII:3 masih terbuka** karena foto halaman 48 tidak memperlihatkan awal Hanzi `施諸己/已`; perlu halaman 47. Catatan kandidat di bawah adalah status sebelum pembaruan ini dan tidak boleh ditafsirkan sebagai permintaan foto berulang untuk XXIV:3/XXV:4.


## Metode
Matriks `docs/audits/zhu-xi-wyg-965.json` memuat delapan kasus `high_risk` dari **penyaringan otomatis awal** sebelum koreksi. Kategori itu berarti kandidat harus diperiksa manual, bukan kesalahan pasti. Teks kini dicek di `sishu/chapters/**/*.json`, dengan saksi Zhu Xi WYG Kanseki `84c6b2c5093c57ae5d41c60a73c02323d2420ef0` dan bukti foto MATAKIN 2012 bila tersedia. Nomor bab ditulis menurut **MATAKIN**, ID internal dicantumkan terpisah.

| Kandidat | ID internal | Hasil data kini | Putusan tahap ini |
| --- | --- | --- | --- |
| Zhong Yong IX:1 — Keperwiraan | `zhongyong.10.01` | `子路問強。` | Foto MATAKIN 2012 hlm. 42 sesuai; `強/强` adalah bentuk glyph; **tidak perlu koreksi** |
| Zhong Yong IX:2 | `zhongyong.10.02` | `南方之強與？北方之強與？抑而強與？`; tiga **yǔ** | Foto MATAKIN 2012 hlm. 42 **membuktikan koreksi** pinyin (3) dan tanda baca (2). `yú` disimpan sebagai alternatif klasik, bukan bacaan utama. Lihat [audit foto](zhongyong-ix-matakin-photo-2026-11-14.md) |
| Zhong Yong XXV:2 — Keabadian | `zhongyong.26.02` | `不息則久，久則徵。` dan lanjutannya | `徵`/pinyin `zhēng` dipertahankan; catatan foto 2012 dan pembanding WYG sudah ada. `久/乆`, `遠/逺` merupakan varian glyph WYG |
| Zhong Yong XXV:4 | `zhongyong.26.04` | `博厚，配地。高明，配天。悠久，無疆。` | WYG mempunyai `愽厚配地高明配天悠乆無疆`; perbedaan `博/愽` dan `久/乆` tidak membuktikan perubahan makna. **Bacaan tepat MATAKIN 2012 belum diperiksa dengan foto** |
| Lun Yu IV:19 | `lunyu.04.19` | `父母在，不遠遊，遊必有方。` | Dua `遊` sudah dikoreksi menurut foto MATAKIN 2012; jangan ulang |
| Lun Yu X:24 | `lunyu.10.24` | `寢不尸，居不容。` | `尸` dan `容` cocok dengan bukti foto 2012; koreksi sudah selesai |
| Lun Yu XVII:11 | `lunyu.17.11` | `禮云禮云，玉帛云乎哉？樂云樂云，鐘鼓云乎哉？` | Enam `云` mengikuti kata *mengatakan* pada Zhu Xi; cetakan MATAKIN `雲(云)` disimpan sebagai varian, bukan dihapus dari sejarah |
| Mengzi IX:7 | `mengzi.09.07` | Teks utama tidak lagi memuat `林氏曰` atau `愚謂`; ada **dua `commentary_annotations`** | Pemisahan teks dan komentar selesai; terjemahan MATAKIN tetap |

## Status hasil
- **8/8 kasus high-risk awal sudah ditelaah dan diberikan putusan operasional**, bukan disahkan `Final`.
- **7/8** dapat ditangani berdasarkan foto MATAKIN sebelumnya atau tindakan koreksi/penjelasan kontekstual terdokumentasi; **Zhong Yong XXV:4** masih membutuhkan bukti foto MATAKIN untuk menegaskan *bentuk cetak* (bukan karena ada dugaan kuat salah makna).
- Daftar high-risk bukan keseluruhan audit: terdapat kandidat `review`, `significant`, dan `minor` lain, sehingga tidak boleh dinyatakan bahwa seluruh 965 pasal selesai filologis.
- Foto terverifikasi Da Xue VI:2 menggunakan **`揜其不善`**, bukan `掩其不善`, sesuai revisi bukti foto pada commit lain. Nomor halaman cetak bukan kunci identitas pasal.
- Status `unverified-draft` dipertahankan untuk semua kasus di atas; tidak ada approval Final otomatis. Hasil CI/test perlu diverifikasi dari log eksekusi.

## Tahap berikutnya
Selanjutnya audit kasus yang belum pernah diputuskan berdasarkan prioritas **perbedaan bermakna**, bukan hanya skor kemiripan; minta foto MATAKIN 2012 hanya ketika pembandingan primer tidak cukup untuk memilih aksara/bacaan.
