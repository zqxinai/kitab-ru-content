# Bukti foto MATAKIN 2012 — Zhong Yong Bab IX:1–2 (14 November 2026)

## Saksi primer yang tersedia
Foto buku cetak *Si Shu* MATAKIN edisi 2012 yang dikirim pengguna pada percakapan Ru Classics, halaman cetak **42**, menampilkan **BAB IX. Keperwiraan**, Hanzi/pinyin, serta terjemahan Indonesia. Foto diperiksa langsung pada batch ini, bukan disimpulkan dari nama file PDF 2011. Nomor halaman adalah lokasi bukti cetak, bukan nomor pasal untuk aplikasi.

| Komponen | MATAKIN 2012 terbaca | Data sebelum batch | Keputusan |
| --- | --- | --- | --- |
| IX:1 | `子路問強。` | Sama | Pertahankan |
| IX:2 — pertanyaan | `南方之強與？北方之強與？抑而強與？` | Dua pemisah pertama koma | Ubah dua koma menjadi `？` |
| IX:2 — pinyin tiga `與` | **yǔ, yǔ, yǔ** | yú, yú, yú | Kembalikan bacaan cetak MATAKIN **yǔ** pada tiga Ruby |
| IX:2 — `強` | `強(强)`, qiáng | Sudah `強`, qiáng | Pertahankan |

## Pembedaan varian dengan kesalahan
Zhu Xi dalam 《四書章句集註》 WYG menandai `與平聲` untuk partikel tanya; Kamus Kementerian Pendidikan Taiwan juga mendukung pembacaan klasik **yú**. Bacaan ini disimpan dalam `editorial_annotations`, **bukan** lagi dijadikan bacaan utama yang mengalahkan cetakan MATAKIN. Perubahan sebelumnya `yǔ→yú` dibuat saat foto belum diperiksa, dan sekarang direkonsiliasi terhadap saksi primer yang langsung terlihat. Terjemahan Inggris James Legge tetap pembanding, bukan penentu Hanzi/pinyin MATAKIN.

## Perubahan repositori
- `sishu/chapters/zhongyong/10.json`: **3 token pinyin** dan **2 tanda baca**; catatan interpretatif diperbarui menjadi varian yang telah dibandingkan dengan cetakan, tanpa mengesahkan Final otomatis.
- `tests/zhongyong-ix-pinyin-variant.test.js` dan `editor/tests/zhongyong-ix-pinyin-smoke.mjs`: pemeriksaan regresi mengikuti kesaksian foto dan tetap memeriksa anotasi klasik.
- Teks Indonesia MATAKIN, Hanzi utama, ID `sishu.zhongyong.10.01/02`, dan status `unverified-draft` tidak diubah.
- Build paket `dist/sishu-content.json` dikelola `tools/build_sishu.py` melalui GitHub Actions; **jangan mengklaim paket terbaru dan CI lulus sebelum diperiksa**.

## Cakupan dan batas
Putusan di atas menutup **discrepancy tertentu** pada Zhong Yong IX:1–2; tidak berarti semua 129 pasal Zhong Yong, atau 965 pasal Si Shu, sudah disertifikasi filologis. Perbedaan penomoran **Bab IX MATAKIN** dengan **nomor pembagian teks klasik 10** adalah metadata pemetaan, bukan salah teks. Penomoran halaman cetak juga bukan identitas pasal.
