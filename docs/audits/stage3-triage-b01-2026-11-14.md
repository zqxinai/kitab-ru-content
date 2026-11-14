# Ru Classics — Audit Editorial Tahap 3, triase batch 01 (14 November 2026)

## Tujuan dan batas
Tahap ini menertibkan status **yang sudah pernah diperiksa**, bukan melakukan verifikasi baru terhadap foto yang tidak tersedia atau menyatakan terjemahan telah Final. Maksimal **10 pasal** dalam satu batch. Semua keputusan di bawah ditelusuri ke laporan audit terdahulu; penomoran `sishu.daxue.11.14` ialah ID internal, sedangkan cetakan MATAKIN menyebut **Da Xue X:14**.

**Urutan otoritas:** MATAKIN Si Shu 2012 untuk penomoran, Hanzi cetak yang memiliki bukti, dan pinyin cetak yang disaksikan; MATAKIN 2011/PDF untuk terjemahan Indonesia yang tersedia; Zhu Xi/WYG untuk perbandingan tradisi teks dan anotasi; James Legge untuk teks Inggris. Pinyin menurut konteks dapat ditelaah secara linguistik, tetapi bacaan alternatif tidak boleh diam-diam diatributkan ke cetakan 2012.

## Triase 10 pasal (tanpa keputusan Final otomatis)

| ID internal | Referensi edisi / masalah | Temuan status yang dapat dipertahankan | Tindak lanjut |
| --- | --- | --- | --- |
| `sishu.daxue.01.01` | Da Xue Bab Utama:1 — `親民/新民` | Perbedaan bacaan/tafsir telah dicatat; terjemahan MATAKIN `親民` dipertahankan | Kolasi Hanzi foto cetakan 2012 jika tersedia; jangan memaksakan terjemahan Legge |
| `sishu.daxue.04.04` | Da Xue III:4 — `喧/諠` | Ditutup untuk glyph yang dibandingkan dengan foto hlm. 9–10: `赫兮喧兮` dan `終不可諠兮` | Pertahankan koreksi dan tes; jangan buka ulang tanpa bukti baru |
| `sishu.daxue.06.01` | Da Xue V:1 — bagian pelengkap Zhu Xi | Pemisahan komentar/pelengkap dan koreksi `惟/有` telah dikerjakan | Pertahankan atribusi, jangan masukkan komentar sebagai teks asli |
| `sishu.daxue.07.02` | Da Xue VI:2 — `閒/揜/己` | Ditutup untuk glyph berdasarkan foto hlm. 14; Indonesia tidak diubah | Jaga regresi tanpa membuka ulang kasus |
| `sishu.daxue.11.05` | Da Xue X:5 — `鑒/監` | Varian edisi sumber; tidak terbukti salah pada MATAKIN | Biarkan terbuka untuk saksi cetakan, tanpa normalisasi otomatis |
| `sishu.daxue.11.11` | Da Xue X:11 — `於/于` | Perbedaan ortografi dengan Zhu Xi WYG, bukan kehilangan pasal | Catat sebagai varian, tidak perlu ralat tanpa bukti cetak |
| `sishu.daxue.11.12` | Da Xue X:12 — `寶/寳` | Pemeriksaan naskah WYG lengkap menemukan dua `寳`; laporan span otomatis sebelumnya salah mendeteksi kekurangan | Klasifikasi sebagai *false positive*, pertahankan naskah MATAKIN |
| `sishu.daxue.11.13` | Da Xue X:13 — `寶/寳` | Sama seperti X:12: kedua `寳` ada di WYG; tidak terbukti ada teks hilang | Klasifikasi sebagai *false positive*, tidak mengubah Hanzi |
| `sishu.daxue.11.14` | Da Xue X:14 — `介/个`, `己/巳`, `實/寔`, `媢嫉/媢疾` | **Terbuka**: foto yang tercatat belum menampilkan seluruh Hanzi ayat | Bukti paling bernilai selanjutnya: foto Hanzi lengkap pasal X:14 |
| `sishu.mengzi.09.07` | Mengzi V A:7.8–7.9 — komentar `林氏曰`/`愚謂` dan `末/未` | Pemisahan komentar beratribusi dan koreksi karakter sudah terdokumentasi dan dites pada batch terdahulu | Jangan masukkan kembali komentar ke teks utama; Final tetap perlu keputusan tersendiri |

## Penyelarasan cakupan Inggris
- Naskah JSON langsung: **246 pasal Inggris tertanam** (istilah legacy `aligned_passages` pada manifest sengaja dipertahankan untuk validasi pembangun paket).
- Pemetaan Legge di `dist/sishu-english-alignment.json`: **719 ID pasal melalui 650 entri**.
- Total pasal dengan draf tersedia untuk editor: **965/965**, tanpa klaim seluruhnya selesai dikolasi; persetujuan `Final` tetap mengikuti registry review terpisah.
- Metadata `sishu/manifest.json` dan `catalog.json` kini membedakan angka tertanam dari total *draft coverage*. `tests/english-full-draft-coverage.test.js` ditambah pagar regresi untuk mencegah ketidaksinkronan.

## Hak distribusi dan gerbang publikasi
Pemilik proyek menyatakan izin MATAKIN **telah diperoleh** (juga tercatat pada `COPYRIGHT.md`). Pernyataan tersebut dicatat sebagai konfirmasi pemilik, bukan hasil pemeriksaan dokumen izin pada batch ini. Sebelum menyatakan seluruh penggunaan berizin untuk rilis publik, periksa dan arsipkan secara privat ketentuan tertulis mengenai media distribusi Android/website, atribusi, batas pemakaian dan hak perubahan. Jangan unggah dokumen izin berisi informasi pribadi ke GitHub publik.

**Izin distribusi ≠ persetujuan filologis `Final`.** Alpha dapat tetap digunakan untuk uji internal. Paket offline Android dan editor hanya diperbarui melalui build berulang dan pengecekan checksum setelah perubahan konten sumber.

## Bukti yang sudah ada, tidak perlu diulang
- [Kandidat penting Da Xue batch 03](daxue-significant-review-b03-2026-11-14.md)
- [Foto Da Xue III:4 dan VI:2](daxue-2012-photo-confirmed-2026-11-14.md)
- [Bukti Inggris 965/965](english-draft-complete-2026-11-14.md)
- [Provenance dan varian sumber](../sishu-textual-variants.md)
- [Aturan persetujuan Final](../editorial-finalization.md)
- [Issue editorial menyeluruh #33](https://github.com/zqxinai/kitab-ru-content/issues/33)

## Kriteria batch ini
- [x] 10 pasal prioritas ditriase dengan jejak laporan lama
- [x] Metadata membedakan 246 tertanam, 719 terpetakan dan 965 total draf
- [x] Tes kesesuaian metadata ditambahkan
- [ ] CI PR sukses serta paket `dist` terbaru dan checksum terbit setelah merge
- [ ] Kolasi foto Da Xue X:14
- [ ] Persetujuan Final per ayat oleh reviewer (tidak dilakukan otomatis)
