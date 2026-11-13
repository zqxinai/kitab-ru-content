# Kolasi langsung foto MATAKIN 2012 — Da Xue III:4 dan VI:2

**Tanggal**: 14 November 2026 WIB. Sumber utama: foto asli buku Si Shu cetakan MATAKIN 2012 yang dikirim pemilik buku, bukan rekonstruksi Zhu Xi/WYG.

## Penomoran yang pasti

- Halaman 9–10: **Da Xue BAB III:4 — Puncak Kebaikan** = `sishu.daxue.04.04` (angka 04 pertama adalah *indeks internal*). Tidak ada **Bab IV:4** dalam foto; **BAB IV. Pangkal dan Ujung** mulai halaman 11 dengan pasal 1.
- Halaman 14: **Da Xue BAB VI:2 — Mengimankan Tekad** = `sishu.daxue.07.02`.
- Halaman 77: **Zhong Yong XXV:2** berisi `徵`, pinyin `zhēng`, sudah sesuai proyek.
- Nomor halaman cetak tidak dimaknai sebagai pagination aplikasi.

## Kolasi dan keputusan tepat per karakter

| Ayat | Frasa Ru Classics yang benar menurut cetakan | Aksi |
| --- | --- | --- |
| Da Xue III:4 | `瑟兮僴兮` | Pertahankan `僴`, jangan paksa varian `僩` Zhu Xi |
| Da Xue III:4 | `赫兮喧兮` (dua kali, kutipan dan penjelasan) | Pertahankan **喧** (口), bukan `諠` |
| Da Xue III:4 | `終不可諠兮` (dua kali, kutipan dan penjelasan) | Gunakan **諠** (言), bukan `喧`; dua koreksi telah masuk `main` secara terpisah |
| Da Xue VI:2 | `小人閒居` | Gunakan **閒** (門/月), bukan `閑`; sudah diperbaiki di `main` |
| Da Xue VI:2 | `揜其不善` | Gunakan **揜** (扌/弇), bukan `掩`; koreksi pada audit ini |
| Da Xue VI:2 | `人之視己` | Pertahankan **己**; jangan mengganti dengan `已` |

Pinyin pada karakter yang diperiksa dipertahankan: `喧`/`諠` = `xuān`, `閒` = `xián`, `揜` = `yǎn`, dan `己` = `jǐ`.

## Keutuhan konten dan regresi

- `sishu.daxue.04.04`: hash FNV-1a UTF-16 terjemahan Indonesia = `97efc54f`.
- `sishu.daxue.07.02`: hash FNV-1a UTF-16 terjemahan Indonesia = `a21836db`.
- Hanya glyph cetakan yang terverifikasi yang diubah; Indonesia MATAKIN, Inggris Legge, identitas ayat, urutan, dan status draf **tidak** diubah.
- Pengujian ditambahkan ke `tests/matakin-2012-verified-glyphs.test.js`; mengecek kedua pasal, dua glyph mirip dengan jumlah yang tepat, hash terjemahan, dan sinkronisasi `dist` setelah `tools/build_sishu.py`.
- Distribusi website/editor berasal dari `dist/sishu-content.json` yang akan dibangun oleh workflow terpisah setelah sumber masuk `main`. Jangan klaim tayang sebelum build/Pages benar-benar diverifikasi.

## Batas foto terbaru — tetap terbuka

**Da Xue X:14** (ID `sishu.daxue.11.14`): foto saat ini menampilkan paragraf terjemahan Indonesia, bukan seluruh Hanzi X:14. Karena itu perbedaan `一介臣` / `一个臣`, `若己有之` / `若巳有之`, `實能容之` / `寔能容之`, `媢嫉` / `媢疾` belum diputuskan berdasarkan cetakan.

Audit matriks otomatis Zhu Xi yang menemukan kategori *significant* **tidak** berarti semua perbedaan adalah salah. Untuk Ru Classics, MATAKIN 2012 tetap acuan primer, WYG pembanding untuk Hanzi, dan Legge acuan terjemahan Inggris saja.
