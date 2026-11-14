# Asal teks Hanzi Ru Classics dan batas kewenangan sumber

Teks Hanzi dalam JSON proyek **bukan salinan Hanzi dari PDF MATAKIN 2011**. Pada tahap impor awal, teks berasal dari `hanzhaodeng/chinese-ancient-text` dan dikonversi dari simplified ke tradisional dengan ICU Hans–Hant. Konversi mekanis dapat salah pada karakter yang ambigu; contohnya `云` 'berkata' tidak identik secara semantik dengan `雲` 'awan'. Identitas korpus awal ini adalah **provenance historis**, bukan edisi utama yang harus diikuti apa pun hasilnya.

Pembanding klasik **tetap** adalah 朱熹《四書章句集註》, transkripsi 欽定四庫全書 (WYG), `kanripo/KR1h0015`, *commit* `84c6b2c5093c57ae5d41c60a73c02323d2420ef0`. Laporan 965 pasal: [audit Zhu Xi](audits/zhu-xi-2026-11-13.md). Sebelum menyimpulkan sebuah karakter salah, pemeriksa harus membaca kalimat lengkap, membedakan varian tradisional/simplified dari karakter berbeda, melihat tata bahasa dan terjemahan Indonesia MATAKIN, dan mencatat penjelasan sumber.

Cetakan fisik **MATAKIN 2012** adalah saksi penulisan primer **hanya** pada bagian yang terfoto. Cetakan menaruh simplified dalam kurung setelah bentuk tradisional; simplified bukan teks tambahan pada naskah tradisional. Ketika belum ada foto, gunakan sumber Indonesia 2011 dan analisis Hanzi yang terverifikasi kontekstual, tanpa klaim 'terbukti sama dengan cetakan 2012'.

Lihat [standar sumber v2.0](source-policy.md) dan [registri sumber](../sources/source-registry.json). Jangan mengganti teks MATAKIN karena teks Legge atau Zhu Xi berbeda; komentar Zhu Xi harus dipisahkan dari teks asli.
