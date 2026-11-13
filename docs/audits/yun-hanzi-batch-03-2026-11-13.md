# Koreksi kontekstual 雲 → 云 — batch 03 (13 November 2026)

## Cakupan
**Tujuh karakter pada empat pasal Mengzi** diperiksa terhadap Zhu Xi, 《四書章句集註》, 欽定四庫全書 WYG di Kanseki Repository, [commit sumber dipatok 84c6b2c5093c57ae5d41c60a73c02323d2420ef0](https://github.com/kanripo/KR1h0015/tree/84c6b2c5093c57ae5d41c60a73c02323d2420ef0).

| ID pasal MATAKIN | 雲 → 云 | Saksi halaman digital WYG | Teks yang diperiksa |
| --- | ---: | --- | --- |
| `sishu.mengzi.08.24` | 1 | `KR1h0015_013.txt` — `KR1h0015_WYG_013-23b` | `薄乎云爾` |
| `sishu.mengzi.10.03` | 3 | `KR1h0015_014.txt` — `KR1h0015_WYG_014-19a` | `入云則入，坐云則坐，食云則食` |
| `sishu.mengzi.10.07` | 2 | `KR1h0015_014.txt` — `KR1h0015_WYG_014-25a` | `曰事之云乎，豈曰友之云乎` |
| `sishu.mengzi.13.39` | 1 | `KR1h0015_016.txt` — `KR1h0015_WYG_016-14a` | `姑徐徐云爾` |

Konteks: `sishu.mengzi.08.24`: ‘曰薄乎云爾’ bermakna ‘hanya menyebut ringan’; `sishu.mengzi.10.03`: ucapan 亥唐: ‘masuk’/‘duduk’/‘makan’ ketika diminta; `sishu.mengzi.10.07`: dua 云 dalam kutipan ucapan 子思; 詩云 ketiga sejak awal sudah benar; `sishu.mengzi.13.39`: 云爾 merupakan penutup ucapan. Semua 云 bermakna *mengatakan/menyebut*; pinyin di konteks ini tetap **yún**. Empat ejaan 雲 yang memang merujuk awan adalah 浮雲 (Lun Yu VII:16), 作雲 (Mengzi I:6), 望雲霓 (Mengzi II:11), dan 雲漢 (Mengzi IX:4), seluruhnya dipertahankan.

## Perubahan terkontrol
- Perbaikan dilakukan pada token `ruby_paragraphs` terpilih di empat pasal, mengubah `traditional:"雲"` menjadi `traditional:"云"` dan menghapus `modern:"云"` yang tadinya diturunkan dari konversi bentuk aksara; pinyin, urutan, konteks, dan paragraf tidak berubah.
- Empat `hanzi_span` yang mereferensikan pasal tersebut di `dist/sishu-english-alignment.json` ikut diselaraskan. Teks Inggris, sumber asli `source_hanzi_transcription`, URL, status `draft`, dan data provenance tidak diubah.
- `sources/legge/*` adalah snapshot historis **tidak boleh diedit**. Dua tes cakupan Mengzi memakai daftar eksplisit per pasal untuk mengenali hanya perbaikan ini dan tetap membandingkan bahasa Inggris terhadap snapshot aslinya.
- Terjemahan Indonesia MATAKIN, identitas/nomor pasal, catatan, dan status Final tidak disentuh. Teks Indonesia dijaga dengan FNV-1a UTF-16 dalam `tests/yun-hanzi-batch-03.test.js`.
- Pipeline `tools/build_sishu.py` tetap menjadi satu-satunya jalur pembangkitan `dist/sishu-content.json`; pengujian memastikan 965 pasal utuh dan 4 雲 yang benar.

## Rekap seluruh tiga batch
- Batch 01: **7 karakter / 2 pasal** (Lun Yu XVII:11 dan XIX:3).
- [Batch 02](yun-hanzi-batch-02-2026-11-13.md): **10 karakter / 10 pasal**.
- Batch 03: **7 karakter / 4 pasal**.
- **Total: 24 karakter pada 16 pasal** dari daftar semantik 雲/云 hasil audit awal selesai diperbaiki. Angka ini **bukan** bukti pemeriksaan filologis seluruh 965 pasal selesai.

## Pelaporan validasi
Hasil pengujian yang sebenarnya adalah hasil GitHub Actions pada commit perbaikan. Jangan menyatakan Final atau diterbitkan jika workflow CI/build/deploy belum sukses.
