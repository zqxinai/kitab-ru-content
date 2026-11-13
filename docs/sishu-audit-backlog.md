# Backlog editorial Si Shu — 13 November 2026

Sumber [00 - INDEX AUDIT](https://drive.google.com/file/d/1ZkWMwg565eRKV_9zKqjXGCPxOtzeQ6Ub/view) (Google Drive): **1.059 catatan pemeriksaan otomatis**, terdiri dari Da Xue 56, Zhong Yong 86, Lun Yu 418, dan Mengzi 499. Angka ini **bukan 1.059 kesalahan terbukti**; beberapa catatan merujuk pasal yang sama.

| Prioritas | Jenis dan contoh | Kriteria selesai |
| --- | --- | --- |
| P0 | **Kontaminasi komentar dalam naskah**: Mengzi 09.07 林氏曰 / 愚謂 | Komentar dipisah beratribusi, Ruby+pinyin dan dist dibangun ulang, tes valid |
| P1 | **Varian Hanzi berdampak makna**: Mengzi 07.23, 07.25, 08.17; Lun Yu 09.26, 10.24, 11.03, 14.33 | Sumber awal + edisi pembanding + terjemahan Indonesia dicatat, keputusan eksplisit per ID |
| P1 | **Pinyin polifonik**: 樂、說、行、長、朝、重 | Audit bacaan per konteks dan nama; hindari salah pembacaan hasil ICU otomatis |
| P1 | **Nama tokoh dan romanisasi** | Glosarium tunggal Hanzi–pinyin–ejaan Indonesia/Hokkian, jangan ulang koreksi yang telah disetujui |
| P2 | **Artefak ekstraksi PDF**: baris judul BAB pada Da Xue | Cocokkan terhadap PDF terbitan, bukan tebak dari naskah JSON |
| P2 | **Batas pasal antar-edisi**: Da Xue IV/V, Zhong Yong XXV/XXXII, Lun Yu X:25–27, Mengzi IA:7 | Many-to-many alignment, nomor Indonesia tetap, tidak menggandakan terjemahan |
| P3 | **Perbedaan tafsir**: Da Xue 親民 / 新民 | Varian sumber ditampilkan terpisah dari terjemahan, pengesahan manual |

**Status terbaru (13 November 2026):** empat pasal yang sudah memiliki catatan foto MATAKIN 2012 (`mengzi.07.23`, `mengzi.07.25`, `lunyu.10.24`, `lunyu.14.33`) sudah masuk batch koreksi tersendiri; jangan dibuka ulang kecuali bukti cetakan baru muncul atau pengujian gagal. `mengzi.07.24` dipertahankan; pasal lain dalam prioritas P1 tetap dinilai satu per satu. Seluruh persetujuan terjemahan Final tetap manual.

**Batch pembuktian cetakan MATAKIN 2012 (13 November 2026):** Lun Yu IV:19, XVII:13, dan XIV:1 sudah dibetulkan berdasarkan rekaman bukti foto dan dibandingkan dengan Zhu Xi WYG. [Audit lanjutan](audits/matakin-2012-lunyu-glyphs-batch-02-2026-11-13.md). Pasal ini tidak dibuka ulang tanpa bukti baru atau gagal tes; nomor halaman XVII:13 tidak diketahui.

**Da Xue Bab V:1 diselesaikan pada batch khusus (13 November 2026):** 2 aksara yang tercatat pada foto MATAKIN 2012 dikoreksi; pengantar dan pelengkap Zhu Xi sekarang beratribusi serta terpisah di editor. [Audit dan tes](audits/daxue-bab-v-matakin-2012-2026-11-13.md). Hanya buka ulang dengan bukti baru atau hasil tes gagal.

**Zhong Yong Bab XXV:2 sudah dianalisis (13 November 2026):** Hanzi dan terjemahan MATAKIN dipertahankan; 2 pinyin 徵 dikoreksi dari zhǐ menjadi zhēng berdasarkan kamus MOE Taiwan (bukan klaim pinyin foto 2012). Tafsir Zhu Xi dicatat terpisah dari terjemahan utama dalam editor. [Audit dan sumber](audits/zhongyong-xxv-02-matakin-2012-2026-11-13.md). Jangan ulang tanpa bukti baru atau regresi gagal.

**Da Xue Bab Utama:1 — varian `親民/新民` dicatat (13 November 2026):** `親民` dan terjemahan Indonesia MATAKIN dipertahankan. Usulan Chengzi `新民` dalam komentar Zhu Xi dan pilihan Inggris Legge ditampilkan sebagai perbandingan tanpa dianggap padanan literal. [Audit khusus](audits/daxue-qinmin-xinmin-2026-11-13.md). **Foto teks Hanzi MATAKIN 2012 pada ayat ini masih perlu diverifikasi apabila tersedia**; tidak boleh dicatat sebagai koreksi edisi 2012 yang telah dibuktikan.

**Audit tiga pasal tanpa koreksi (13 November 2026):** `mengzi.08.17` tetap 不祥 (tidak membawa berkah), `lunyu.09.26` tetap 帥 (panglima), `lunyu.11.03` tetap 季路 (nama murid); ketiganya cocok dengan perbandingan WYG dan Indonesia MATAKIN yang ada. Belum ada bukti foto 2012 yang mengharuskan ralat tiga bacaan tersebut. **Lun Yu XIV:39** juga kini memuat catatan perbedaan 己/已 berdasarkan rekaman foto cetakan hlm. 305–306 dengan Zhu Xi WYG sebagai pembanding sekunder. [Audit](audits/lunyu-14-39-jiyi-matakin-2012-2026-11-13.md). Jangan membuka ulang empat pasal tanpa bukti baru atau regresi gagal.

## Pencegahan looping

Bekerja maksimal **10 pasal per batch**; setiap item memiliki ID stabil, hash/sumber, kasus, keputusan, alasan, status reviewer. Hanya buka ulang jika sumber atau versi naskah berubah. Jangan menerapkan ralat karakter pada Hanzi tanpa memperbarui anotasi Ruby, pinyin, paket distribusi dan hash katalog sekaligus. Jangan menandai bahasa Indonesia atau Inggris sebagai `Final` otomatis. Lihat [audit varian](sishu-textual-variants.md).
