# Kolasi foto MATAKIN 2012 — Zhong Yong XII:3, XXIV:3, XXV:4 (14 November 2026)

## Metode dan identitas
Saksi primer adalah **foto-foto halaman buku Si Shu MATAKIN edisi 2012** yang diberikan pemilik buku. Buku `Tengah Sempurna` sama dengan **Zhong Yong (中庸)**. Nomor bab dan ayat di bawah mengikuti **MATAKIN**, bukan angka indeks internal dalam path JSON. Nomor halaman cetak merupakan alamat bukti, **bukan** pagination editor/website.

| Pasal cetak MATAKIN | ID internal | Foto yang diterima | Hasil pembacaan dan status |
| --- | --- | --- | --- |
| **XII:3** — Jalan Suci itu Satya dan Tepasarira | `sishu.zhongyong.13.03` | Halaman **47–48** (header `BAB XII: 3–4`) | **Foto tambahan halaman 47** memperlihatkan `忠恕違道不遠，施諸己而不願` dengan pinyin `shī zhū jǐ` untuk `施諸己`. Halaman 48 melanjutkan kalimat dan memuat terjemahan. Bentuk cetak **己 (jǐ)** sama dengan data aplikasi; beda `已` pada WYG **bukan alasan mengganti**. **Kasus ditutup tanpa mengubah teks.** |
| **XXIV:3** — Iman dan Jalan Suci | `sishu.zhongyong.25.03` | Halaman **76** | Cetakan tampak memuat `自成己` dan `成己，仁也`, ber-pinyin **jǐ**; aplikasi sudah memakai `己` pada dua bagian ini. Pada `而…也` pinyin cetak **yǐ**; grafem mirip `己/已` pada foto, tetapi bentuk `已` di aplikasi didukung fungsi `而已` (*hanya*) dan dibedakan dari `己` (*diri*). **Tidak dilakukan perubahan Hanzi**. |
| **XXV:4** — Keabadian | `sishu.zhongyong.26.04` | Halaman **78** | Foto memuat `博厚配地，高明配天，悠久無疆。` (博 dan 久 jelas). **Seluruh aksara sudah sesuai**, tetapi tanda baca JSON berbeda dan Ruby `地` keliru ber-pinyin `de`. **Tanda baca serta pinyin `de → dì` dikoreksi** sesuai foto cetakan. |

## Koreksi tepat
Pasal `sishu.zhongyong.26.04`:
- **Sebelum:** `博厚，配地。高明，配天。悠久，無疆。`
- **Sesudah:** `博厚配地，高明配天，悠久無疆。`
- Komit perubahan tanda baca: `fac47d3041a3b6562c208d6958ed0b0d4f4513f4`.
- Komit koreksi pinyin `地` pada `配地`: `de → dì`, `0ebac7f2c5de83a4810fddd9f20af33b44c8e544`.
- Yang berubah **tanda baca dan satu token pinyin (`地`)**; aksara Hanzi, Indonesia MATAKIN, status `unverified-draft`, ID, dan urutan pasal tidak diubah.
- Penjagaan regresi ditambahkan ke `tests/zhongyong-matakin-2012-interpretation.test.js`.

## Perbandingan klasik
Zhu Xi 《四書章句集註》 WYG, sumber Kanripo `KR1h0015_016.txt` pada commit `84c6b2c5093c57ae5d41c60a73c02323d2420ef0`, memakai `施諸已`, `自成已`, dan `成已仁也` dalam transkripsi digital. Itu varian saksi digital yang dibandingkan, **bukan alasan otomatis untuk mengganti `己` pada MATAKIN 2012** ketika artinya diri sendiri. Teks cetak MATAKIN tetap prioritas.

## Status
- **XXIV:3:** pemakaian `己` untuk diri sendiri dan pinyin foto dikonfirmasi, pertahankan data.
- **XXV:4:** Hanzi sudah sesuai; tanda baca dan pinyin `地` telah dikoreksi.
- **XII:3:** **ditutup** berdasarkan foto halaman 47–48: `施諸己`, pinyin `jǐ`, dan makna 'diri sendiri' telah sesuai dengan aplikasi. Tidak ada perubahan Hanzi, pinyin, terjemahan, atau status Final.
- Verifikasi pasal spesifik ini **bukan** pengesahan seluruh 129 pasal Zhong Yong/965 pasal Si Shu. Status editorial Final tetap harus melalui review resmi; status CI harus dicek tersendiri, tidak diasumsikan lulus.
