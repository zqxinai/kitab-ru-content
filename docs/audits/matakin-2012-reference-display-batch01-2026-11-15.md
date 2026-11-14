# Ru Classics — Batch 01 penulisan rujukan dengan nama kitab (MATAKIN 2012)

**Tanggal:** 15 November 2026 WIB. **Status:** diterapkan sebagai **lapisan tampilan editorial**, **bukan** perubahan teks MATAKIN 2011 dan **bukan** klaim transkripsi persis 2012.

## Kebijakan

PDF MATAKIN 2011 tetap acuan dasar terjemahan Indonesia. Cetakan MATAKIN 2012 yang dimiliki secara fisik memakai nama kitab dalam kutipan, termasuk jika merujuk ke kitab yang sama. Ejaan panjang yang ditampilkan di bawah adalah bentuk **normalisasi editorial menurut kaidah 2012**; untuk memastikan ejaan dan tanda baca sama persis dengan halaman cetak 2012 diperlukan bukti foto lokasi bersangkutan. Semua sumber `translation_indonesian` disimpan utuh.

Modul [`ru-classics/reference-overlay.js`](../../ru-classics/reference-overlay.js) menerapkan penggantian hanya bila **ID pasal dan teks singkatan persis cocok**, dalam pembaca web dan ruang editor. Kolom sunting editor tetap mengambil teks sumber PDF 2011. Sumber buku non-Si Shu tidak dipaksa, rujukan ambigu tidak disentuh. Tidak ada hyperlink subayat yang dibuat hanya berdasarkan nomor.

## Batch 10 rujukan

| Pasal asal | Rujukan sumber 2011 | Penyajian editorial | Target kitab/pasal (ada dalam data) |
| --- | --- | --- | --- |
| Lun Yu XVIII:2 | `(S.S. XV: 14)` | `(Sabda Suci — Lun Yu XV:14)` | `sishu.lunyu.15.14` |
| Lun Yu XVIII:3 | `(S.S. II: 5)` | `(Sabda Suci — Lun Yu II:5)` | `sishu.lunyu.02.05` |
| Lun Yu XVIII:5 | `(S.S. IX: 9)` | `(Sabda Suci — Lun Yu IX:9)` | `sishu.lunyu.09.09` |
| Lun Yu XVIII:6 | `(S.S. XIV: 39)` | `(Sabda Suci — Lun Yu XIV:39)` | `sishu.lunyu.14.39` |
| Lun Yu XVIII:8 | `(S.S. V:23)` | `(Sabda Suci — Lun Yu V:23)` | `sishu.lunyu.05.23` |
| Da Xue IV:1 | `(SS XII: 13)` | `(Sabda Suci — Lun Yu XII:13)` | `sishu.lunyu.12.13` |
| Da Xue X:15 | `(S.S.IV 3)` | `(Sabda Suci — Lun Yu IV:3)` | `sishu.lunyu.04.03` |
| Da Xue X:18 | `(S.S. XIII: 26)` | `(Sabda Suci — Lun Yu XIII:26)` | `sishu.lunyu.13.26` |
| Da Xue X:23 | `(Bc. IA:1)` | `(Mengzi — Bing Cu I A:1)` | `sishu.mengzi.01.01` |
| Mengzi I A:1 | `(AB. X:23)` | `(Ajaran Besar — Da Xue X:23)` | `sishu.daxue.11.23` |

**Catatan penomoran:** Da Xue X:15, X:18, dan X:23 tersimpan dalam file internal `sishu.daxue.11` karena `index 01` adalah Bab Utama. Demikian pula `sishu.daxue.05.01` bersesuaian dengan Da Xue Bab IV:1.

## Gerbang regresi

- [`tests/matakin-reference-overlay.test.cjs`](../../tests/matakin-reference-overlay.test.cjs): 10 referensi dengan source ID, reference string, dan target pasal nyata; sumber tidak diubah, nomor ayat dan rujukan lain tidak diubah, tidak ada penggantian lintas pasal.
- [`ru-classics/tests/smoke.cjs`](../../ru-classics/tests/smoke.cjs): tampilan pembaca menampilkan nama kitab lengkap tanpa menampilkan singkatan asal pada pasal yang cocok.
- [`ru-classics/tests/subverses.cjs`](../../ru-classics/tests/subverses.cjs): pemisahan ayat tetap berjalan meskipun tampilan rujukan diperluas.
- Workflow editor, audit rujukan, dan deploy Pages ditambahkan pemeriksaan terkait.

**Batas batch:** 10 dari 234 rujukan singkatan dalam inventaris awal. Belum berarti 224 sisanya pasti dapat diganti otomatis; tiap ID perlu diverifikasi secara tersendiri. Status semua pasal tetap Draft/Perlu Review. Sumber Hanzi dan Inggris Legge tidak diubah.
