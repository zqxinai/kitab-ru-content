# Ru Classics — Audit kelengkapan draf Si Shu (14 November 2026)

## Hasil yang diverifikasi
- **78 bab, 965 pasal** sesuai paket `dist/sishu-content.json`.
- **965/965 memiliki draf Inggris**: 246 `translation_english` tertanam, 719 ID melalui 650 entri `dist/sishu-english-alignment.json`.
- **0 ID pasal ganda**, **0 pemetaan ganda**, **0 pasal tidak terpetakan**, **0 pemetaan tanpa URL**, **0 segmen Inggris kosong**, dan **0 rentang Hanzi pemetaan yang tidak cocok** berdasarkan pembandingan teks proyek setelah mengabaikan whitespace.
- Registry `dist/sishu-review-status.json` masih memiliki **0 persetujuan Final**, sehingga angka 100% berarti *ketersediaan draf*, bukan verifikasi akhir.
- Da Xue XI:23 telah diperbaiki pada PR #31: pengantar Zhong Yong tidak lagi bercampur dengan terjemahan ayat. Snapshot pra-perbaikan tersedia di `sources/matakin/daxue-11-23-preface-overflow-20261114.json`.
- Commit validasi paket terakhir sebelum audit ini: `2248b0718fb5f3f894d024df1b95022ead94ec7e`; laporan ini tidak menyatakan teks Inggris telah dibandingkan dengan seluruh halaman cetak primer.

## Batasan dan kelanjutan editorial
- Validasi struktural tidak membuktikan bahwa setiap padanan Legge tepat secara semantik atau varian Hanzi identik dengan buku MATAKIN **2012**.
- Contoh discrepancy yang telah dikenal dan **tetap memerlukan keputusan reviewer**: Da Xue I:1 `親民/新民`; Da Xue IV:4 `喧/諠`; Da Xue XI:5 `鑒/監`; Da Xue XI:16 `命/慢`; Mengzi IX:7 `系/繫`; dan masalah batas pasal pada transkripsi Lun Yu.
- Tidak mengubah otomatis Hanzi, pinyin, terjemahan Indonesia MATAKIN, atribusi komentar Zhu Xi, atau status Final.
- Tahap berikutnya bukan mengulang penambahan draf. Gunakan dashboard `/audit/` dan workflow `docs/editorial-finalization.md` untuk pemeriksaan **maksimal 10 pasal per batch**, pencatatan bukti, review manusia, dan persetujuan Final yang terlacak.

## Pemeriksaan berulang
`node --test tests/english-full-draft-coverage.test.js` memvalidasi cakupan, ID, status Draft, URL sumber, pemetaan Hanzi dan batas XI:23. Tes ini sengaja **tidak mengunci Final=0** agar persetujuan editorial di kemudian hari dapat direkam dengan bukti.
