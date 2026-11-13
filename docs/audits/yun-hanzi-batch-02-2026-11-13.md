# Koreksi kontekstual 雲 → 云 — batch 02 (13 November 2026)

## Sumber dan ruang lingkup

**10 karakter di 10 pasal** diperbaiki berdasarkan kalimat asli dan Zhu Xi, 《四書章句集註》, 欽定四庫全書 (Kanseki Repository WYG), sumber digital [kanripo/KR1h0015 @ 84c6b2c5093c57ae5d41c60a73c02323d2420ef0](https://github.com/kanripo/KR1h0015/tree/84c6b2c5093c57ae5d41c60a73c02323d2420ef0). Nomor halaman di bawah adalah penanda saksi digital WYG, **bukan** halaman PDF MATAKIN.

| ID pasal MATAKIN internal | Bentuk salah → benar | Saksi digital WYG | Konteks |
| --- | --- | --- | --- |
| `sishu.zhongyong.26.09` | 雲 → 云 | `KR1h0015_016.txt`, `KR1h0015_WYG_016-58b` | `詩云` |
| `sishu.lunyu.07.19` | 雲 → 云 | `KR1h0015_004.txt`, `KR1h0015_WYG_004-5b` | `云爾` |
| `sishu.lunyu.07.34` | 雲 → 云 | `KR1h0015_004.txt`, `KR1h0015_WYG_004-9a` | `謂云爾` |
| `sishu.lunyu.14.40` | 雲 → 云 | `KR1h0015_006.txt`, `KR1h0015_WYG_006-38a` | `《書》云` |
| `sishu.lunyu.19.23` | 雲 → 云 | `KR1h0015_009.txt`, `KR1h0015_WYG_009-5a` | `夫子之云` |
| `sishu.mengzi.04.02` | 雲 → 云 | `KR1h0015_011.txt`, `KR1h0015_WYG_011-18a` | `云爾` |
| `sishu.mengzi.05.03` | 雲 → 云 | `KR1h0015_012.txt`, `KR1h0015_WYG_012-4a` | `詩云` |
| `sishu.mengzi.06.05` | 雲 → 云 | `KR1h0015_012.txt`, `KR1h0015_WYG_012-20b` | `不行王政云爾` |
| `sishu.mengzi.07.02` | 雲 → 云 | `KR1h0015_013.txt`, `KR1h0015_WYG_013-3b` | `詩云` |
| `sishu.mengzi.07.09` | 雲 → 云 | `KR1h0015_013.txt`, `KR1h0015_WYG_013-7b` | `詩云` |

## Keputusan dan jaminan
- Di semua kasus tersebut, `云` berarti *mengatakan, menyebut, demikianlah*, bukan `雲` (awan). Pinyin **yún** sama; yang diubah hanya aksara Hanzi dan pembuangan metadata simplified `modern:"云"` yang tidak relevan.
- Hanya satu karakter dalam setiap pasal yang dibetulkan; kasus Mengzi `05.03` telah memiliki dua `云` yang benar, jadi total menjadi tiga. Tidak ada penggantian global.
- Pertahankan awan yang sah: Lun Yu `07.16` 浮雲; Mengzi `01.06` 作雲, `02.11` 望雲霓, `09.04` 雲漢. Batch 01 yang sudah selesai (Lun Yu `17.11` enam dan `19.03` satu) tidak diproses ulang.
- Terjemahan Indonesia MATAKIN, Inggris, nomor pasal, ID, status editorial, serta anotasi komentar tidak berubah. Checksum terjemahan Indonesia dicatat dalam `tests/yun-hanzi-batch-02.test.js`.
- Setelah commit, `tools/build_sishu.py` harus membangun ulang `dist/sishu-content.json` secara deterministik; GitHub Actions menguji kecocokan data bab–paket.

## Sisa kandidat
Menurut audit awal 24 karakter, sesudah batch 01 (7) dan batch 02 (10) tersisa **7 karakter pada 4 pasal Mengzi**: `08.24` (1), `10.03` (3), `10.07` (2), `13.39` (1). Periksa ulang sebelum patch berikutnya. Audit seluruh 965 pasal belum dinyatakan pengesahan filologis.

## Sinkronisasi pemetaan Hanzi–Inggris

Pemeriksaan CI pertama setelah perbaikan menemukan sembilan entri `dist/sishu-english-alignment.json` dengan `hanzi_span` yang masih berisi bentuk lama `雲`. Seluruh sembilan rentang kini mengikuti teks pasal `云`, tanpa mengubah `english_segments`, kutipan James Legge, `source_hanzi_transcription` (bukti transkripsi asal), `status`, atau `source_url`. Pasal `sishu.lunyu.19.23` tidak memiliki mismatch alignment tersebut. Pengujian regresi menegaskan sembilan span sesuai data bab pada tingkat aksara Hanzi.

Entri yang disinkronkan: `legge-lunyu-07-18`, `legge-lunyu-07-33`, `legge-lunyu-14-43`, `legge-zhongyong-26-07`, `legge-mengzi-04-02`, `legge-mengzi-06-05`, `legge-mengzi-07-02`, `legge-mengzi-07-09`, `legge-mengzi-b03-05-03`.
