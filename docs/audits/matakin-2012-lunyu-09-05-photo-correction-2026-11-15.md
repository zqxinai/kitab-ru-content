# Koreksi rujukan Lun Yu IX:5 berdasarkan foto MATAKIN 2012

**Tanggal bukti:** 15 November 2026 WIB  
**Jenis bukti:** foto halaman fisik *Sabda Suci (Lun Yu)* MATAKIN 2012, disediakan pengguna dalam percakapan Ru Classics.  
**Sumber unggahan:** `WhatsApp Image 2026-11-15 at 10.39.05.jpeg` (foto pengguna; berkas biner tidak disimpan di repositori melalui perubahan ini).

## Apa yang terbaca dan dikoreksi

Pada akhir ayat (3) Lun Yu IX:5, foto menunjukkan bentuk rujukan tercetak dengan pasangan nama Mandarin–Hokkian:

`(Lun Yu - Lun Gi III.24; VII.23; XIV.36; Meng Zi - Bing Cu I B.16)`

Dalam terjemahan Indonesia digital MATAKIN 2011 (berkas `sishu/chapters/lunyu/09.json`, ID `sishu.lunyu.09.05`) tertulis:

`(S.S. III: 24; VII ": 23; XIV: 36; Bc. IB: 16)`

**Discrepancy nyata:** `VII ": 23` adalah salah penyalinan; berdasarkan foto **VII.23** adalah rujukan ke **Sabda Suci / Lun Yu VII:23** tanpa tanda petik.

## Keputusan editorial dan implementasi

- `translation_indonesian` MATAKIN 2011 tetap asli, **tidak ditimpa**. Koreksi hanya dilakukan sebagai tampilan ketika kombinasi ID pasal dan rujukan lama tepat cocok.
- **Tampilan Ru Classics:** `(Sabda Suci — Lun Yu III:24; Lun Yu VII:23; Lun Yu XIV:36; Mengzi — Bing Cu I B:16)`.
- Nama lengkap pada tampilan adalah normalisasi editorial, bukan klaim bahwa spasi/tanda bacanya identik dengan foto. Bentuk cetak yang teramati juga dicatat terpisah dalam `printed_2012_citation`.
- [Metadata rujukan](../../sources/references/matakin-compound-batch02.json) sekarang `display_status: "display-ready"`, `printed_2012_attested: true` khusus referensi IX:5, `printed_2012_display_verbatim: false`, dan memuat informasi `witness`.
- Semua **empat tujuan pasal** ada dalam data: `sishu.lunyu.03.24`, `sishu.lunyu.07.23`, `sishu.lunyu.14.36`, `sishu.mengzi.02.16`.
- Keterkaitan isi diterima berdasarkan otoritas **MATAKIN**, tanpa audit ulang ajarannya.
- Referensi gabungan tetap tidak diberi satu tautan pasal buatan; pemetaan target per segmen disimpan untuk navigasi yang aman pada masa datang.
- Cakupan koreksi terbatas **Lun Yu IX:5**. Jangan melakukan replace global `VII ":23` pada kitab lain tanpa bukti.

## Akibat pada progres dan tes

Sebelumnya 91 overlay; setelah koreksi IX:5 menjadi **92**. Tiga registri rujukan gabungan tetap memuat **29 kelompok** tetapi seluruhnya **29 display-ready / 0 review-only**. Pemindaian 965 pasal terhadap 497 pola tidak berubah jumlahnya, karena data sumber 2011 tidak dimodifikasi. Test `tests/matakin-reference-overlay.test.cjs` mengunci keberadaan bukti foto dan teks sumber 2011 yang tetap apa adanya; `tests/matakin-reference-audit.test.cjs` memastikan semua kelompok gabungan siap tampil; `ru-classics/tests/smoke.cjs` mengecek koreksi pada pembaca langsung.

**Catatan provenance:** sumber teks foto diberikan dalam percakapan dan identitas berkas dicatat pada metadata; untuk menyimpan foto ke repo secara permanen diperlukan pengunggahan aset biner terpisah. Tidak dibuat klaim bahwa foto telah diunggah ke GitHub.
