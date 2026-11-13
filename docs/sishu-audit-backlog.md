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

## Pencegahan looping

Bekerja maksimal **10 pasal per batch**; setiap item memiliki ID stabil, hash/sumber, kasus, keputusan, alasan, status reviewer. Hanya buka ulang jika sumber atau versi naskah berubah. Jangan menerapkan ralat karakter pada Hanzi tanpa memperbarui anotasi Ruby, pinyin, paket distribusi dan hash katalog sekaligus. Jangan menandai bahasa Indonesia atau Inggris sebagai `Final` otomatis. Lihat [audit varian](sishu-textual-variants.md).
