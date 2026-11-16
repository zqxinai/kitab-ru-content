# Audit tambahan nama satu kata Hokkian–Pinyin — 16 November 2026

## Temuan pemicu

Pada tampilan **Sabda Suci / Lun Yu XVIII:1**, terjemahan Indonesia MATAKIN 2011 menampilkan `Bicu`, `Kicu`, `Pikan` tanpa pembacaan Mandarin. Pemindai lama sebelumnya memberi hasil **0 kandidat**, tetapi pemeriksaan tersebut berbasis kamus nama yang sudah diketahui dan sejumlah pola sangat spesifik, sehingga nama ini justru luput.

Kecocokan dibuktikan terhadap teks Hanzi yang kini tersimpan di repo (`sishu/chapters/lunyu/18.json`):
- `微子去之` → **Weizi – Bicu**, bukan mengganti Bicu;
- `箕子為之奴` → **Jizi – Kicu**;
- `比乾諫而死` → **Bi Gan – Pikan**.

## Koreksi lain dari pemindaian lanjutan

| Hanzi pasal | Pasal | Nama bacaan yang ditambahkan |
|---|---|---|
| 仲弓 | Lun Yu XI:3 | Zhonggong – Tiong Kiong |
| 回 | Zhong Yong VIII:1 | Hui – Hwee |
| 羿 | Mengzi IV B:24; VI A:20 | Yi – Gee |
| 許子 | Mengzi III A:4 | Xu Zi – Hicu |
| 桀、紂 | Da Xue IX:4; Mengzi IV A:9 | Jie – Kiat; Zhou – Tiu |
| 稷 | Lun Yu XIV:5; Mengzi IV B:29 | Ji – Cik |
| 跖 | Mengzi VII A:25; III B:10 | Zhi – Cik; **berbeda dari 稷 Ji** |
| 楊朱、墨翟 | Mengzi III B:9 | Yang Zhu – Yangcu; Mo Di – Bik Tik |
| 楊子 | Mengzi VII A:26 | Yangzi – Yangcu |
| 求 | Lun Yu V:8; VI:8 | Qiu – Kiu pada konteks tidak berpasangan |
| 赤 | Lun Yu V:8; VI:4 | Chi – Chik |
| 顏淵 | Lun Yu IX:21 | Yan Yuan – Gan Hwee |
| 顏路 | Lun Yu XI:8 | Yan Lu – Gan Lo |
| 曾皙 | Lun Yu XI:26 | Zeng Xi – Cing Sik |
| 季子 | Mengzi VI B:5 | Jizi – Kwicu; **bukan 孟季子** |
| 時子 | Mengzi II B:10 | Shizi – Sicu |
| 孔文子 | Lun Yu V:15 | Kong Wenzi – Khong Buncu |

Yang dibaca adalah **Hanzi tersimpan di repositori**. Tidak diklaim bahwa seluruh 965 pasal telah dikolasi baris demi baris dengan cetakan fisik MATAKIN 2012.

## Perubahan metode audit

Ditambahkan `tools/audit_ru_singleword_names.cjs`, yang memindai semua **965 pasal / 78 bab** tanpa bergantung pada daftar nama bertanda hubung. Hasil berupa artefak `audit/reports/ru-single-word-name-candidates.json` berisi istilah, frekuensi, ID pasal, potongan teks dan Hanzi.

Jalankan melalui GitHub Actions *Ru Classics — audit normalisasi 965 pasal*, langkah *Independent single-word name discovery*.

**Hasil inventaris awal:** **902 kata kandidat** dari **731 pasal**. Jumlah ini **BUKAN** 902 nama yang dipastikan salah: banyak merupakan kosakata biasa yang memakai kapitalisasi MATAKIN (`Dapat`, `Bijaksana`, `Sanjak`) atau Pinyin yang sudah tersedia (`Zengzi`, `Yao`, `Junzi`). **Daftar kandidat belum habis ditinjau secara manual.** Belum boleh menyatakan semua nama telah dinormalisasi sempurna.

Regresi baru mencakup contoh tangkapan layar, pembedaan homograf **Cik**, pengujian Hanzi per pasal, dan kewajiban bahwa `normalize(normalize(text)) === normalize(text)` di seluruh 965 pasal. Semua asli `translation_indonesian` tetap tidak diubah.

## Prinsip perbaikan berkelanjutan

1. Pasangkan Pinyin–Hokkian menurut **Hanzi di pasal bersangkutan**, bukan fonetik Hokkian saja.
2. Nama homograf (misalnya `Cik`) tidak dijadikan aturan global tanpa bukti semua pemakaian merujuk karakter yang sama.
3. Simpan daftar kandidat mentah beserta konteks; jangan menampilkan hasil '0 kandidat' seolah sudah membuktikan setiap nama bersih.
4. Pengujian reader harus membuka **Lun Yu XVIII:1** dan menemukan ketiga pasangan yang sebelumnya hilang.

PR #53: https://github.com/zqxinai/kitab-ru-content/pull/53.
