# Ru Classics — audit nama tunggal Hokkian–Pinyin, batch 2 (16 November 2026)

## Tujuan dan sumber

Kelanjutan dari PR #53 dan daftar 896 kandidat pada audit sebelumnya. Semua keputusan di batch ini memakai
Hanzi **dari pasal yang sama**, yang ada dalam `sishu/chapters/**/*.json`, serta terjemahan
MATAKIN yang **tidak diubah**. Daftar tanpa bukti Hanzi tidak otomatis dinormalisasi.

### Nama orang dan keluarga yang dipastikan

| Pasal | Hanzi sumber | Ejaan Hokkian MATAKIN | Tampilan dengan Pinyin |
|---|---|---|---|
| Lun Yu XI:3 | 季路 | Kwi Lo | Ji Lu – Kwi Lo |
| Lun Yu XIV:16–17 | 桓公 | Rajamuda/Raja muda Hwan | Rajamuda/Raja muda Huan – Hwan |
| Lun Yu XIV:16 | 召忽 | Tiau Hut | Shao Hu – Tiau Hut |
| Lun Yu XVI:1 | 季氏 | Keluarga Kwi | Keluarga Ji – Kwi |
| Mengzi I B:16 | 臧倉 | Cong Chong | Zang Cang – Cong Chong |
| Mengzi III B:9 | 楊朱 | Ajaran Yang Cu | Ajaran Yang Zhu – Yang Cu |

### Judul dan istilah klasik

| Pasal | Hanzi | Tampilan hasil |
|---|---|---|
| Mengzi III B:9 & IV B:21 | 春秋 | Chunqiu – Chun Chiu |
| Mengzi IV B:21 | 晉之乘 | Kitab Sheng – Sing |
| Mengzi IV B:21 | 楚之檮杌 | Kitab Taowu – Too Gut |

**Pembacaan 乘:** Nama kitab sejarah Jin **Shèng**, tidak boleh ditebak menjadi
*Chéng* berdasarkan pelafalan umum karakter 乘. Kamus resmi Kementerian
Pendidikan Taiwan secara khusus mencantumkan `晉乘楚杌` dengan
`jìn shèng chǔ wù`:
<https://dict.revised.moe.edu.tw/dictView.jsp?ID=94736&q=1&word=%E6%99%89>.
Rujukan konteks historis juga tersedia dalam teks Mengzi IV B:21 beserta
catatan Zhu Xi: <https://ruism.org/library/mencius/4B>.

## Perbaikan cara membaca inventaris

Skrip `tools/audit_ru_singleword_names.cjs` sebelumnya memberi **896 kandidat**
pada 728 pasal. Angka tersebut **bukan 896 kesalahan**: kata Indonesia dengan
huruf besar dan sisi Mandarin dari pasangan yang **sudah** ada (contohnya
`Junzi – Kuncu` dan `Yan Yuan – Gan Yan`) sering turut dihitung.

Batch 2 menambahkan:
1. Pemisahan 172 ejaan kata Indonesia yang jelas menjadi kelompok
   `reviewed_as_indonesian` (ini *daftar klasifikasi*, bukan klaim 172
   semuanya muncul di sumber), beserta contoh dan ID lokasi ketika muncul.
2. Pemeriksaan dua arah terhadap pasangan `Pinyin – Hokkian`. Yang sudah
   menjadi sisi Pinyin maupun sisi Hokkian tidak dihitung lagi sebagai
   nama tanpa pasangan.
3. Pencocokan case-sensitive untuk menghindari menghitung kata huruf
   kecil sebagai nama kapital.
4. Penambahan laporan `reviewed_as_indonesian`,
   `already_paired_occurrences`, dan daftar kandidat yang masih perlu
   diselidiki; semuanya dalam artefak JSON GitHub Actions.

**Interpretasi:** perubahan angka daftar kandidat mencerminkan perubahan
metodologi *dan* koreksi, sehingga tidak boleh dianggap sebagai jumlah
kesalahan yang diperbaiki satu per satu.

## Pengujian

- Tes baru `tests/ru-classics-reading-singleword-batch02.test.js` memverifikasi
  karakter Hanzi, keberadaan Pinyin–Hokkian, idempotensi, dan perlindungan
  istilah yang homonim agar tidak diberi substitusi global.
- Regresi pembaca meninjau 965 pasal, dan antarmuka pembaca tetap melalui
  uji smoke test.
- Nama/istilah yang belum dapat dipastikan dipertahankan untuk review, bukan
  diberi Pinyin berdasarkan kemiripan ejaan atau dipromosikan sebagai Final.

**Status editorial:** bukan sertifikasi 100% terhadap cetakan fisik MATAKIN
2012. Source `translation_indonesian`, Hanzi, dan terjemahan James Legge
tidak diubah. Seluruh perbaikan berada di `ru-classics/reading-normalization.js`.

PR implementasi: <https://github.com/zqxinai/kitab-ru-content/pull/54>.
