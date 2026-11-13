# Audit foto cetakan MATAKIN 2012 — Da Xue III:4 dan VI:2

Tanggal: 14 November 2026 WIB. Sumber utama: foto buku fisik *Si Shu* MATAKIN 2012 yang dikirim pemilik buku. Pembanding WYG/Zhu Xi tetap bahan bantu, **tidak** mengatasi bukti cetakan MATAKIN.

## Identitas cetakan, jangan tertukar dengan indeks data

- Halaman cetak **9–10**: Da Xue **Bab III:4 — Puncak Kebaikan**, ID internal `sishu.daxue.04.04`. Bukan Bab IV:4; Bab IV "Pangkal dan Ujung" baru mulai di halaman **11**.
- Halaman cetak **14**: Da Xue **Bab VI:2 — Mengimankan Tekad**, ID internal `sishu.daxue.07.02`.
- Halaman cetak **77**: Zhong Yong XXV:2 `徵` telah sesuai paket, tidak disentuh.
- Nomor halaman cetak berbeda dari pagination UI/website bukan discrepancy.

## Temuan yang dibuktikan foto

| Ayat cetak (ID internal) | Sebelum | Terlihat di cetakan 2012 | Tindakan |
| --- | --- | --- | --- |
| III:4 (`04.04`) | `喧`, 4 kemunculan | `諠` dalam `赫兮諠兮` dan `終不可諠兮` serta penjelasan pengulangannya, halaman 9–10 | Ganti empat token `喧` → `諠`, pinyin `xuān` tetap |
| VI:2 (`07.02`) | `閑居` | `閒居`, halaman 14 | Ganti `閑` → `閒`, pinyin `xián` tetap |
| VI:2 (`07.02`) | `掩其不善` | `揜其不善`, halaman 14 | Ganti `掩` → `揜`, pinyin `yǎn` tetap |
| VI:2 (`07.02`) | `人之視己` | `人之視己`, halaman 14 | Sudah sesuai; **jangan** mengganti `己` menjadi `已` |

Pada III:4, `瑟兮僴兮` juga sesuai foto, tidak diganti dengan aksara edisi pembanding. Koreksi menjaga pilihan aksara di cetakan, bukan melakukan normalisasi otomatis.

## Batas perubahan

- Tepat **6 aksara/token** diperbaiki di **2 pasal**; tidak ada nomor, ID, terjemahan MATAKIN, terjemahan Inggris, atau status editorial yang sengaja diubah.
- Hash FNV-1a UTF-16 atas terjemahan Indonesia (sebelum/sesudah): III:4 `97efc54f`, VI:2 `a21836db`.
- Pada snapshot alignment Inggris (`dist/sishu-english-alignment.json`), tidak terdapat entri yang menunjuk ke kedua ID tersebut saat diperiksa. Paket distribusi dibangun dari `sishu/chapters/**` melalui `tools/build_sishu.py`; workflow `build-sishu.yml` menerbitkan hasil build setelah perubahan sumber digabung ke `main`.
- Pengujian regresi ditambahkan pada `tests/matakin-2012-verified-glyphs.test.js`. Hasil CI dicatat terpisah setelah dijalankan.

## Yang masih perlu foto

**Da Xue X:14** (`sishu.daxue.11.14`): foto yang tersedia memperlihatkan terjemahan Indonesia, tetapi bukan seluruh Hanzi ayat X:14. Oleh karena itu `一介臣`, `若己有之`, `實能容之`, dan `媢嫉` tetap berstatus perlu kolasi, bukan dinyatakan salah atau sudah selesai.

## Sumber otoritas

1. Foto MATAKIN 2012 dari pemilik buku: halaman 9–10 (Bab III:4), 11 (awal Bab IV), 14 (Bab VI:1–2), 77 (Zhong Yong XXV:1–3).
2. `sishu/chapters/daxue/04.json`, `07.json`; identitas `sishu/editions/matakin-2012-chapters.json`.
3. Catatan pemilahan sebelumnya: `daxue-significant-review-b02-2026-11-14.md` dan `b03`.
