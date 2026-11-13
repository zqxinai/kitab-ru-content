# Pemetaan Pasal MATAKIN ↔ James Legge

Editor membaca `dist/sishu-english-alignment.json` untuk padanan eksplisit berdasarkan rentang Hanzi. Berkas ini tidak mengganti penomoran MATAKIN ataupun James Legge.

Satu entri dapat menghubungkan banyak `indonesian_passage_ids` dengan banyak `english_segments`, dan satu pasal Indonesia dapat muncul di lebih dari satu entri untuk pemetaan parsial. Gunakan ID passage stabil yang sudah ada di `dist/sishu-content.json`.

## Struktur entri

```json
{
  "id": "unique-alignment-id",
  "indonesian_passage_ids": ["existing-passage-id"],
  "english_segments": [
    {
      "legge_ref": "Legge edition book/chapter/section reference",
      "text": "Exact source text, verified against cited edition"
    }
  ],
  "hanzi_span": "Full matching traditional Hanzi for the unit",
  "source_url": "Direct source/scan URL",
  "status": "draft",
  "review_note": "Where the two passage boundaries differ"
}
```

Status `draft` berarti belum diverifikasi; hanya `verified` setelah pemeriksa mencocokkan **seluruh** cakupan Hanzi, memeriksa urutan, dan mengonfirmasi kutipan/sumber Inggris. Jangan mengisi status verified otomatis hanya karena nomor pasal sama. Jangan menggandakan segmen Inggris yang sama pada satu pembacaan; jika ada pemetaan parsial, pecah menjadi unit Hanzi paling kecil yang sah.

## Tahapan migrasi

1. Pertahankan 246 terjemahan Inggris Lun Yu yang sudah ada sebagai **draf** dan jangan menandainya verified otomatis.
2. Ambil teks Inggris dari edisi James Legge yang jelas sumber dan hak penggunaannya.
3. Bangun indeks unit sumber Inggris per kitab, lalu cocokkan rentang Hanzi dengan teks Indonesia.
4. Masukkan entri pemetaan satu per satu atau dalam batch teruji; audit missing/duplicate/out-of-order.
5. Setelah seluruh 965 pasal diperiksa, baru naikkan status kelengkapan katalog dan paket.

## Impor Lun Yu batch 1 — 13 November 2026

Teks Inggris diambil dari edisi James Legge melalui Project Gutenberg:

- [The Analects of Confucius, terjemahan Inggris saja (#3330)](https://www.gutenberg.org/ebooks/3330).
- [The Chinese Classics: Confucian Analects, Hanzi dan Inggris (#4094)](https://www.gutenberg.org/ebooks/4094).

Impor ini **tidak** sekadar menyamakan nomor pasal. Awal Hanzi dalam edisi dwibahasa Legge dipasangkan dengan seluruh ID pasal di bab MATAKIN menggunakan kemiripan karakter pertama (hingga 12 karakter), margin terhadap kandidat kedua, keunikan bab sumber Inggris, serta pengecekan batas pasal selanjutnya. Entitas yang melibatkan penggabungan atau pemisahan bab, bab ganda, urutan tak jelas, atau kutipan hilang **tidak dipaksakan** dan ditandai belum tersedia. Semua hasil baru berstatus `draft`.

Jumlah entri tambahan:
| Bab Lun Yu | Pasal Inggris draf baru |
| --- | ---: |
| V | 22 |
| VI | 26 |
| VII | 33 |
| IX | 27 |
| X | 11 |
| XI | 22 |
| XIV | 37 |
| XV | 38 |
| **Total** | **216** |

Saat ini tersedia **602 dari 965 pasal** dalam tampilan editor: 246 teks Inggris dalam paket utama, 216 Lun Yu baru melalui peta padanan, 11 Da Xue, dan **seluruh 129 Zhong Yong**. Sebanyak **363 pasal** belum tersedia. Jumlah ini mencakup gabungan paket dasar dan overlay pemetaan; `dist/sishu-content.json` tetap memuat 246 terjemahan Inggris langsung, sedangkan `catalog.json` mencatat gabungannya. Jangan menganggap 602 sebagai jumlah pasal yang telah di-review final; registry pengesahan masih kosong.

Pemetaan dengan pasal pecah/gabung memerlukan pemeriksaan lanjutan yang mempertahankan referensi Legge dan MATAKIN masing-masing. Lihat `docs/editorial-finalization.md` untuk alur persetujuan.

## Batch Zhong Yong — 33 bab / 129 pasal

- **64 unit sumber Inggris James Legge** beserta Hanzi sumber telah disimpan dalam `sources/legge/zhongyong-confuciuspedia.json`. Sumber yang menyebutkan penerjemah James Legge: https://confuciuspedia.com/lib/the-doctrine-of-the-mean/amp/ .
- Peta `dist/sishu-english-alignment.json` berisi **60 entri** yang mengaitkan seluruh **129 pasal MATAKIN** dengan 64 unit tersebut. Setiap unit sumber Inggris terpakai tepat satu kali dan tidak ada ID pasal yang terduplikasi.
- Penyelarasan otomatis menggunakan karakter Hanzi yang dinormalisasi, bukan kesamaan nomor pasal; nilai kemiripan minimum 96% pada pasal sumber yang digabung secara berurutan.
- Alat yang bisa dijalankan ulang: `node tools/import_legge_zhongyong.js`. Kamus OpenCC untuk konversi aksara sederhana ke tradisional tersimpan di `tools/dictionaries/OpenCC-STCharacters.txt` dengan atribusi lisensi Apache-2.0 kepada OpenCC.
- Pemeriksaan regresi otomatis: `node --test tests/zhongyong-coverage.test.js`.
- Semua hasil tetap **draf**, belum berstatus final. Naskah Inggris pada situs sekunder tetap memerlukan pengecekan ke edisi cetak/teks primer Legge, termasuk transliterasi dan tanda baca sebelum disetujui.
- Pada kasus satu unit sumber Inggris mencakup beberapa pasal MATAKIN, teks Inggris ditautkan sebagai satu kelompok sesuai sumber alih-alih dipotong dan dikarang ulang.

## Batch Mengzi 1 — bab 1–3 (32 pasal)

- 32 pasal Mengzi (7 + 16 + 9) dipadankan **satu-satu setelah pemeriksaan awal Hanzi**, tanpa mengganti nomor dan teks Indonesia.
- Sumber transkripsi dwibahasa yang mengatribusikan terjemahan kepada James Legge: [alexamies/chinesenotes.com](https://github.com/alexamies/chinesenotes.com/tree/main/corpus/mengzi). Snapshot unit dengan SHA berkas sumber tersimpan di `sources/legge/mengzi-chinesenotes-01-03.json`.
- Kecocokan awal 20 Hanzi minimal 90% setelah normalisasi konservatif; rasio panjang Hanzi minimal 83%. **Belum** membuktikan kesesuaian setiap kata/ayat, sehingga semuanya `draft`.
- Katalog sekarang **634/965 draf Inggris**, **331 belum tersedia** (semuanya Mengzi bab selanjutnya). Tidak ada pengesahan final otomatis.
- Pengujian: `node --test tests/mengzi-coverage.test.js` beserta audit editorial sebelumnya.
