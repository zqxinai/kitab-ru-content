# Audit Da Xue — enam kandidat signifikan lanjutan (14 November 2026)

## Cakupan
Pemeriksaan terhadap data pada `sishu/chapters/daxue/{04,06,07,11}.json` serta matriks lama `docs/audits/zhu-xi-wyg-965.json`. Saksi pembanding: Zhu Xi, 《四書章句集註》, 欽定四庫全書 WYG (`KR1h0015_000.txt`, commit sumber `84c6b2c5093c57ae5d41c60a73c02323d2420ef0`). Hasil ini **bukan verifikasi terhadap foto cetak MATAKIN 2012** untuk keenam pasal.

| ID internal | Penampakan Ru Classics | Cuplikan WYG yang relevan | Putusan |
| --- | --- | --- | --- |
| `sishu.daxue.04.04` | `瑟兮僴兮`, `終不可喧兮` | `瑟兮僩兮`, `終不可諠兮` | Perbedaan aksara pada kutipan Shijing; **open**, periksa cetakan MATAKIN serta konteks sebelum perubahan |
| `sishu.daxue.06.01` | `此謂知本...` + paragraf `所謂致知在格物者...` | sumber WYG menyajikan pengantar `取程子之意以補之曰` dan teks pelengkap | **Sudah dipisahkan** melalui `textual_sections` dan `editorial_annotations`; tidak dikoreksi lagi |
| `sishu.daxue.07.02` | `閑居`, `掩其不善`, `人之視己` | `閒居`, `揜其不善`, `人之視已` | **Open**: bedakan grafi dan transkripsi; jangan ubah tanpa foto MATAKIN |
| `sishu.daxue.11.04` | `維石岩岩` | `維石巖巖` | Varian bentuk `岩/巖`; tidak memaksa perubahan |
| `sishu.daxue.11.05` | `儀鑒於殷` | `儀監于殷` | Varian `鑒/監` dan `於/于`; pertahankan sambil menunggu saksi cetak |
| `sishu.daxue.11.08` | `外本內末` | `外本内末` | Varian bentuk `內/内`; bukan salah makna |

## Keputusan dan batasan
- Tidak ada perubahan pada Hanzi, pinyin, terjemahan Indonesia, status `Final`, urutan pasal, maupun berkas `dist`.
- `04.04` dan `07.02` tetap **terbuka** karena potensi pilihan aksara terkait kutipan/naskah, bukan hanya glyph; hasil pemeriksaan ini belum mengesahkannya sebagai benar atau salah.
- `06.01` tidak dibuka ulang: pemisahan teks utama dan komentar Zhu Xi sudah terdokumentasi pada data; verifikasi foto pernah dicatat dalam metadata, tetapi tidak dinyatakan diperiksa ulang pada batch ini.
- Kelas `significant` di matriks adalah *prioritas penyaringan*, bukan kesalahan yang pasti.
- Nomor halaman sumber digital atau cetakan bukan discrepancy identitas pasal aplikasi. MATAKIN tetap rujukan utama terjemahan Indonesia dan susunan bab/pasal.

## Validasi
Perubahan hanya menambahkan dokumen audit. CI/test suite tidak dijalankan pada pemeriksaan ini, sehingga tidak diklaim lulus.
