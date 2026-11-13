# Zhong Yong XXV:2 — tafsir 徵, perbedaan MATAKIN dan Zhu Xi

**Pasal di proyek:** `sishu.zhongyong.26.02`, Bab XXV (Keabadian), pasal 2 menurut penomoran MATAKIN 2012. **Tanggal:** 13 November 2026.

## Otoritas dan bukti
- **Acuan utama:** Si Shu MATAKIN cetakan 2012 berdasarkan [rekaman hasil pemeriksaan foto sebelumnya](../sishu-textual-variants.md). **Foto itu tidak diperiksa ulang pada tahap ini**, dan nomor halaman cetak tidak terlihat dalam rekaman. Bacaan `不息則久，久則徵，徵則悠遠…` telah sesuai, sehingga **Hanzi utama tidak diganti**.
- **Indonesia:** teks MATAKIN lengkap di `translation_indonesian` dipertahankan verbatim, checksum FNV-1a UTF-16 **`21af333f`**. MATAKIN menerjemahkan `久則徵` sebagai *“karena berlangsung lama Dia menghimpun banyak pengetahuan”*. Terjemahan ini **tidak dinyatakan salah maupun ditimpa oleh Zhu Xi**.
- **Pembanding filologis:** Zhu Xi, 《四書章句集註》, digital 欽定四庫全書 WYG, `KR1h0015_016.txt`, `KR1h0015_WYG_016-57b`, [pinned `84c6b2c5093c57ae5d41c60a73c02323d2420ef0`](https://github.com/kanripo/KR1h0015/blob/84c6b2c5093c57ae5d41c60a73c02323d2420ef0/KR1h0015_016.txt): `乆常於中也徵驗於外也` (ditranskripsi untuk penjelasan sebagai `久，常於中也；徵，驗於外也。`).
- **Bacaan pembanding:** Zhu Xi menafsirkan keberlangsungan/ketetapan batin yang lama sebagai sumber bukti atau akibat yang tampak ke luar. Ini menjelaskan `徵` sebagai *gejala, pembuktian, atau manifestasi*, bukan semata penumpukan pengetahuan. Dalam editor tersedia sebagai **catatan perbandingan**, bukan teks kitab/terjemahan utama.
- **Legge:** satu padanan many-to-one `legge-zhongyong-26-01` mengaitkan pasal ini dengan 26.01–26.05; `english_segments`, `hanzi_span`, provenance, dan status `draft` dipertahankan.

## Pinyin: pemeriksaan tambahan terpisah dari foto cetakan
Terdapat dua `徵` yang sebelumnya diberi `zhǐ`. Dalam konteks `久則徵，徵則悠遠` (*terbukti/menampakkan hasil*), bacaan kamus yang sesuai adalah **`zhēng`**, sedangkan **`zhǐ`** untuk nama nada musik di antara 五音 (宮、商、角、徵、羽). Rujukan leksikal: [Kementerian Pendidikan Taiwan, entri 徵](https://dict.revised.moe.edu.tw/dictView.jsp?ID=7943&la=0&powerMode=0). **Pinyin pada foto MATAKIN 2012 belum diperiksa langsung untuk kedua karakter ini**, sehingga ini dinyatakan sebagai normalisasi pinyin berdasarkan sumber leksikal eksternal, bukan klaim bacaan cetakan MATAKIN.

## Implementasi
- Pada satu pasal `sishu/chapters/zhongyong/26.json`: mengubah **dua pinyin** `zhǐ → zhēng` pada 徵, tanpa mengubah Hanzi tradisional `徵`, simplified `征`, struktur 2 paragraf, terjemahan Indonesia, ataupun ID.
- Menambahkan satu `editorial_annotations` berjenis `interpretive_comparison`, berjangkar `久則徵`, dengan sumber Zhu Xi, saksi halaman WYG, dan bukti kamus yang eksplisit.
- Editor menampilkan catatan **setelah** paragraf Hanzi sebagai kotak interpretasi pembanding, terpisah dari Ruby dan dari kartu terjemahan MATAKIN. Catatan ini bukan usulan perubahan terjemahan.
- Tidak ada otorisasi `Final` otomatis. Tidak mengubah padanan/teks Inggris Legge atau 965 passage IDs.

## Validasi
- `tests/zhongyong-matakin-2012-interpretation.test.js` memeriksa hash terjemahan MATAKIN, isi Hanzi, jumlah token pinyin yang dikoreksi, sumber teratribusi, alignment Inggris banyak-ke-satu, dan versi dist.
- `editor/tests/zhongyong-comparison-smoke.mjs` memeriksa navigasi ke pasal 2 dan tampilan catatan di luar paragraf Hanzi.
- Syarat rilis: build + CI editorial + tes UI + deploy GitHub Pages harus berhasil; jangan melaporkan sukses sebelum hasil nyata.
