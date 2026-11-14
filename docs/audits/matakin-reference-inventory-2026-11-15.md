# Ru Classics — Inventaris rujukan MATAKIN 2011 menuju format 2012

**Tanggal evaluasi:** 15 November 2026 WIB (hasil GitHub Actions 14 November 2026 UTC). **Status:** inventaris teknis read-only, **bukan** koreksi naskah dan **bukan** pengesahan Final.

## Prinsip editorial

- Terjemahan MATAKIN PDF 2011 tetap sumber dasar lengkap yang tersedia. Cetakan fisik 2012, dalam batas foto yang telah diterima, menetapkan konvensi: nama kitab harus disebutkan dalam rujukan, termasuk bila rujukan menuju kitab yang sama.
- Jangan menebak nama kitab dari angka Romawi semata. Sistem penomoran kitab lain, khususnya Shi Jing, dapat memiliki empat komponen; `(II.5.4.4)` tidak boleh otomatis diberi awalan *Mengzi*.
- Bentuk `(2)`, `(3)` yang menjadi penanda subayat **bukan** rujukan. Hanzi/pinyin serta teks Indonesia tak boleh diubah oleh audit ini.
- Varian nama Hokkian dan Mandarin harus dipetakan tanpa mengarang wording cetakan 2012 yang tidak didokumentasikan.
- Sejak keputusan [standar sumber v2.0](../source-policy.md), hasil ini menjadi backlog koreksi rujukan, bukan normalisasi global otomatis.

## Hasil pemindaian 965 pasal

Berdasarkan run [Audit MATAKIN cross-references #43624526006](https://github.com/zqxinai/kitab-ru-content/actions/runs/43624526006), semua 78 bab / **965 pasal** telah dipindai, dan **489 pola rujukan dalam tanda kurung** terdeteksi oleh aturan saat ini. Kategori berikut adalah **heuristik**, bukan keputusan filologis:

| Kategori | Jumlah | Tindak lanjut |
| --- | ---: | --- |
| `abbreviated-book` | **234** | Singkatan `S.S.`, `SS`, `AB.`, `Bc.` dan sejenisnya telah menunjukkan kitab yang dituju; cek formatting 2012 per contoh, baru perluas nama dalam lapisan presentasi/metadata |
| `possible-same-book` | **55** | Rujukan gaya Mengzi berjilid A/B seperti `III. A.3.10`; validasi nomor bab, pasal dan ayat sebelum mencantumkan nama kitab |
| `ambiguous-unlabeled` | **142** | Tidak dapat dipastikan; hindari pelengkapan otomatis, terutama bentuk empat komponen seperti `II.5.4.4` |
| `explicit-book` | **56** | Sudah menyebut nama kitab, tidak perlu normalisasi buta; dapat diperiksa ejaan dan penomorannya secara terpisah |
| `explicit-plus-abbreviation` | **2** | Rujukan majemuk mencampurkan nama kitab lengkap dan singkatan; periksa setiap subrujukan sebelum menulis ulang |
| **Total pola yang terdeteksi** | **489** | Jumlah ini bukan klaim semua rujukan yang ada dan bukan jumlah kesalahan terbukti |

## Kasus pilot yang teridentifikasi

1. `sishu.lunyu.18.06`: `(S.S. XIV: 39)` — singkatan pasti menunjuk Sabda Suci / Lun Yu, namun ejaan cetakan 2012 untuk rujukan ini belum terfoto.
2. `sishu.mengzi.01.01`: `(AB. X:23)` — singkatan untuk Ajaran Besar / Da Xue; jangan pakai nama Mengzi hanya karena pengutipannya berada di Mengzi.
3. `sishu.mengzi.01.03`: `(III. A.3.10)` — kandidat rujukan ke Mengzi berjilid A; verifikasi pasal dan subayat.
4. `sishu.mengzi.01.07`: `(II.5.4.4)` — belum diketahui kitab yang dituju; tidak akan diubah otomatis.
5. `sishu.daxue.07.04`: `(Bc. VIIA: 21. 4)` — singkatan Bing Cu/Mengzi sudah dikenali oleh parser terbaru, bukan rujukan internal Da Xue.
6. `sishu.daxue.03.03`: `(Si-kingIII.1.1.1)` — nama kitab lama Si King sudah dikenali sebagai rujukan bernama Shi Jing, meski spasinya tidak konsisten.

## Implementasi pemeriksaan

- Skrip: [`tools/audit_matakin_references.cjs`](../../tools/audit_matakin_references.cjs).
- Regresi: [`tests/matakin-reference-audit.test.cjs`](../../tests/matakin-reference-audit.test.cjs), mengunci klasifikasi contoh `S.S.`, `AB.`, `Bc.`, `Si-king`, rujukan berhuruf A/B dan rujukan ambigu.
- Workflow: [`.github/workflows/matakin-reference-audit.yml`](../../.github/workflows/matakin-reference-audit.yml), menghasilkan artefak `matakin-reference-review.json` berisi hasil per ID pasal, kutipan konteks, kategori dan offset dalam string sumber.
- Pengujian workflow terakhir: **lulus 4/4**. Artefak GitHub Actions dapat diunduh dari run terkait selama retensi 30 hari.
- **Tidak ada teks ayat dan referensi yang diam-diam diganti**. Penyelarasan ke format cetakan 2012 dilakukan sebagai langkah editorial terpisah setelah review referen.

## Keputusan berikutnya

Prioritaskan rujukan yang kitabnya sudah diketahui dan cocok dengan sumber, mulai dari singkatan `S.S.` (Lun Yu), `AB.` (Da Xue), dan `Bc.` (Mengzi); simpan bentuk sumber 2011, tampilkan format lengkap sebagai lapisan edisi 2012. Rujukan yang tidak dapat diidentifikasi harus menunggu pemeriksaan kontekstual atau bukti cetakan, bukan ditebak dari singkatan maupun angka.
