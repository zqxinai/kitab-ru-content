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

## Audit susulan yang berhasil dicocokkan dengan Hanzi (19 pasangan tambahan)

Diperiksa setelah inventaris awal dipersempit. Semuanya hanya berlaku pada pasal asal,
tidak dijadikan substitusi fonetik global.

| Pasal asal | Hanzi sumber | Teks MATAKIN | Tampilan tambahan |
|---|---|---|---|
| Mengzi II A:1 | 微子 | Bicu | Weizi – Bicu |
| Mengzi II A:1 | 微仲 | Bitiong | Weizhong – Bitiong |
| Mengzi II A:1 | 箕子 | Kicu | Jizi – Kicu |
| Mengzi VI A:6 | 微子啓 | Bicu Khee | Weizi Qi – Bicu Khee |
| Mengzi IV B:29 | 顏回 | Gan Hwee | Yan Hui – Gan Hwee |
| Mengzi IV B:29 | 顏子 | Gancu | Yanzi – Gancu |
| Lun Yu XI:19 | 回 | Gan Hwee | Yan Hui – Gan Hwee |
| Lun Yu V:24 | 微生高 | Bising Koo | Weisheng Gao – Bising Koo |
| Lun Yu V:21 | 寧武子 | Ling Bucu | Ning Wuzi – Ling Bucu |
| Mengzi III A:2 | 然友 | Jian Yu | Ran You – Jian Yu |
| Mengzi VI A:9 | 弈秋 | Phok Chiu | Yi Qiu – Phok Chiu |
| Mengzi VII B:29 | 盆成括 | Phunsing Kwat | Pencheng Kuo – Phunsing Kwat |
| Lun Yu XI:2 | 蔡 | Chai (negara) | Cai – Chai |
| Lun Yu XI:18 | 柴 / 高柴 | Koo Chai | Gao Chai – Koo Chai |
| Lun Yu XI:18 | 參 / 曾參 | Cing Cham | Zeng Shen – Cing Cham |
| Lun Yu XI:18 | 師 / 顓孫師 | Cwansun Su | Zhuansun Shi – Cwansun Su |
| Lun Yu XVII:7 | 佛肸 | Piet Hiet | Bi Xi – Piet Hiet |
| Lun Yu V:25 | 左丘明 | Coo Khiubing | Zuoqiu Ming – Coo Khiubing |
| Lun Yu VII:14 | 韶 | lagu Siau | lagu Shao – Siau |

**Sumber pendukung untuk bentuk nama yang disingkat dalam Hanzi pasal:**
anotasi Zhu Xi pada Lun Yu XI menjelaskan bahwa `柴` adalah murid
bermarga 高 (*Gao Chai*), `參` adalah Zengzi (*Zeng Shen*),
dan `師` adalah murid Zhuansun Shi; lihat
<https://zh.wikisource.org/zh-hant/%E5%9B%9B%E6%9B%B8%E7%AB%A0%E5%8F%A5%E9%9B%86%E8%A8%BB_%28%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC%29/%E8%AB%96%E8%AA%9E%E5%8D%B706>.
Untuk `佛肸`, kamus Kementerian Pendidikan Taiwan mencatat
`bì xì` (ditampilkan tanpa nada sebagai **Bi Xi**), lihat
<https://dict.revised.moe.edu.tw/dictView.jsp?ID=17837&q=1&word=%E4%BD%9B>.

**Identitas yang sengaja dipisah:**
- `Cai – Chai` (蔡, negara) **bukan** `Gao Chai – Koo Chai` (柴, murid).
- `Ran You – Jian Yu` (然友) **bukan** `Ran You – Jiam Yu` (冉有).
  Pinyin tanpa nada dapat identik meskipun Hanzi dan tokoh berbeda.
- `Weizi – Bicu` (微子) dan `Weizi Qi – Bicu Khee` (微子啓) tidak
  dijadikan satu alias global, supaya nama lengkap tidak rusak.

Tes baru `tests/ru-classics-reading-singleword-batch02-extra.test.js`
mencocokkan kesembilan belas pasangan dengan Hanzi pasal, menjaga
idempotensi, dan mencegah penyamaan nama/negara.

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

## Hasil CI pada batch 2

Pada commit `a1a8753bd90c3715c7781a7e6b63e874449ded54`,
workflow **Ru Classics — audit normalisasi 965 pasal** (run
[43790611642](https://github.com/zqxinai/kitab-ru-content/actions/runs/43790611642))
mencatat:
- **62 tes lulus, 0 gagal**, seluruh **965 pasal** tercakup.
- **674** kandidat ortografi tersisa pada **474** pasal setelah
  pemisahan false positive dan koreksi yang dapat dibuktikan.
- **161** istilah Indonesia yang benar-benar ditemukan di sumber
  diklasifikasikan sebagai bahasa Indonesia, **bukan nama Hokkian**.
- **2.792 kemunculan** sudah berada di dalam pasangan Pinyin–Hokkian
  yang sebelumnya terhitung salah sebagai calon kekurangan Pinyin.

Dari 896 kandidat pada scan lama menjadi 674 sekarang: **222 selisih
istilah dalam inventaris**. Selisih ini **bukan 222 kesalahan yang sudah
dibetulkan**; perubahan hasil berasal dari metode deteksi yang lebih
tepat dan koreksi Hanzi yang terbatas. Ke-674 kandidat yang tersisa
tetap memerlukan pengelompokan lanjut. Jangan menganggap mereka
semuanya nama dan jangan menyebut 965 pasal sudah final filologis.

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
