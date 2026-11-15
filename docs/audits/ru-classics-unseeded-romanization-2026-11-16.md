# Audit Ru Classics 16 November 2026 — nama yang luput dari kamus Hokkian

## Status dan pokok temuan

Audit ini merupakan koreksi atas klaim penyelesaian pada 15 November.
Dua pemindai lama mengembalikan nol kandidat karena cara pencariannya
bermula dari nama yang **sudah dikenal** atau pola khusus nama bergelar.
**Nol kandidat tidak sama dengan semua istilah sudah dipasangkan**.

Pemindai ketiga, `tools/audit_unseeded_hokkian.cjs`, membaca
`translation_indonesian` dari seluruh 78 bab / 965 pasal, menerapkan
`RuReading.normalize()`, lalu mencari bentuk yang kemungkinan belum diberi
Pinyin **tanpa menggunakan kosakata nama yang sebelumnya dipasangkan**.
Semua hasil mentah disimpan sebagai artefak CI agar pengecualian dapat
diperiksa kembali. Kode ini **tidak** menulis atau mengubah isi kitab.

Temuan awal 16 November:
- 123 bentuk bertanda hubung, 32 nama potensial sebelum kata kerja, serta
  24 istilah dalam tanda kurung. Angka ini adalah **kandidat**, bukan
  jumlah kesalahan, dan mencakup kata biasa seperti `Kitab-Kitab`.
- Beberapa nama nyata yang sebelumnya luput: `Siau-lian` (少連),
  `Gi-tiong` (虞仲), `I-iet` (夷逸), `Tiang-chi` (長沮),
  `Kiat-lik` (桀溺), `Hwan-twee` (桓魋), dan banyak nama lain.
- Temuan kritis: `Cu-tiang` di Lun Yu XVIII:8 adalah **朱張 Zhu Zhang**,
  bukan **子張 Zizhang** seperti di pasal lain. Menggunakan alias
  global tanpa konteks dapat menghasilkan tokoh yang salah.

## Perbaikan

Overlay `ru-classics/reading-normalization.js` ditambah pasangan Hanzi–
Pinyin–Hokkian untuk nama pribadi, nama geografis, gelar, rujukan kitab,
istilah, dan variasi OCR yang dapat diperiksa dari Hanzi pasal.
`sishu/chapters/**` tetap tidak diubah.

Contoh terverifikasi:

| Pasal dan Hanzi | Bacaan hasil |
|---|---|
| Lun Yu XVIII:8 少連, 虞仲, 夷逸, 朱張 | Shao Lian – Siau-lian; Yu Zhong – Gi-tiong; Yi Yi – I-iet; Zhu Zhang – Cu-tiang |
| Lun Yu XVIII:6 長沮, 桀溺, 孔丘 | Chang Ju – Tiang-chi; Jie Ni – Kiat-lik; Kong Qiu – Khong Khiu |
| Lun Yu VII:23 桓魋 | Huan Tui – Hwan-twee |
| Lun Yu XIV:25 蘧伯玉 | Qu Boyu – Ki Pik-giok |
| Lun Yu XI:3 冉伯牛 | Ran Boniu – Jiam Pik-giu |
| Lun Yu VI:10 伯牛 | Bo Niu – Pik-Giu |
| Mengzi II A:2 北宮黝, 孟施捨 | Beigong You – Pak-kiong Yu; Meng Shishe – Bing See-sia |
| Mengzi VI A:7 易牙, 子都 | Yi Ya – Ik-ge; Zi Du – Cu-to |
| Mengzi V A:3 象, 共工, 幽州, 三苗, 三危, 鯀 | Xiang – Chiang; Gong Gong – Kiong-kong; Youzhou – Yu-ciu; Sanmiao – Sambiau; Sanwei – Sam-gwi; Gun – Kun |
| Mengzi VI B:6 王豹, 綿駒 | Wang Bao – Ong-pa; Mian Ju – Bian-ki |

Pemeriksaan regresi menemukan dan mencegah setidaknya tiga jenis
kesalahan baru selama penerapan:
1. `Cu-tiang` mengacu dua tokoh berbeda; perlu pengecualian per pasal.
2. `三苗 Sanmiao` dan `三危 Sanwei` **sudah** punya alias di kamus lama;
   aturan tambahan yang menimbulkan `Sanwei – San Wei – …` dibuang.
3. `沈猶行 Shenyou Xing` tidak boleh dipisah oleh alias pendek
   `沈猶 Shenyou`; nama pendek dipasangkan hanya pada frasa kontekstual.

## Bukti otomatis terakhir

**GitHub Actions sebelum penggabungan**, workflow *Ru Classics — audit
normalisasi 965 pasal*, run
`43745678091`:
- 965 pasal (78 bab) terbaca lengkap.
- **370 pasal mempunyai tampilan normalisasi yang berbeda** dari arsip;
  angka ini bukan total pasal yang telah diverifikasi terhadap cetakan
  MATAKIN 2012.
- **53 tes lulus, 0 gagal**; pembacaan antarmuka `smoke` juga lolos.
- Pemindai nama/gelar/tempat lama: nol kandidat.
- Pemindai kamus legacy kedua: nol kandidat dari seed-nya.
- Pemindai ketiga tanpa seed (dengan `--strict`): **41 bentuk hubung,
  26 pola sebelum kata kerja, 19 bentuk dalam kurung** setelah koreksi.
  Dari daftar tersebut, **0 belum ditinjau menurut ledger klasifikasi
  eksplisit**. Sebanyak 40 bentuk hubung diklasifikasikan sebagai kata
  Indonesia (contoh `Kata-katamu`, `Hati-hatilah`), dan satu bentuk
  `Si-kingIII` adalah **rujukan Shi Jing yang perlu pembenahan format
  tersendiri**, bukan nama orang.

Artefak mentah dan keputusan klasifikasi **tidak disembunyikan**. Keduanya
tercatat pada `audit/reports/unseen-hokkian-candidates.json` yang
dihasilkan dan diunggah dalam workflow. Jika istilah baru tidak cocok
dengan ledger yang sudah ditinjau, menjalankan scanner dengan `--strict`
membuat GitHub Actions gagal, bukan menganggapnya bersih.

## Batas finalisasi

**Selesai dalam ruang lingkup pemeriksaan ini:** seluruh 965 pasal
dianalisis oleh tiga pemindai, semua kandidat yang terdeteksi dalam pola
audit telah dipasangkan atau diklasifikasikan secara eksplisit, overlay
tidak mengubah arsip terjemahan, dan tes otomatis lulus.

**Belum dapat dinyatakan selesai 100% secara filologis:** pembandingan
setiap kata dengan cetakan fisik MATAKIN 2012. Ejaan Hokkian tanpa
tanda hubung dan nama yang tidak sesuai pola *before-verb*, bila tidak
dikenali oleh scanner, mungkin masih luput. Status editorial tidak
diubah menjadi Final secara massal. Tidak ada klaim bahwa 370 pasal
merupakan 370 pasal yang disertifikasi.

**Isu terpisah:** `sishu.daxue.03.03` menampilkan `(Si-kingIII.1.1.1)`
dari teks sumber; penulisan dan navigasi rujukan kitab di luar Si Shu
perlu audit referensi tersendiri.

Repo: `zqxinai/kitab-ru-content`, PR #50,
`fix/ru-classics-unseen-hokkian-audit-20261116`.
