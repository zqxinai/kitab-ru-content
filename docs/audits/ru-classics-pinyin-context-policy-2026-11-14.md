# Kebijakan audit pinyin Ru Classics — konteks kata lebih penting daripada penyalinan mekanis (14 November 2026)

## Tujuan
MATAKIN adalah **acuan utama urutan kitab, penamaan/penomoran bab dan pasal, teks terjemahan Indonesia, serta saksi cetak Hanzi**. Akan tetapi, pinyin **tidak dinyatakan benar hanya karena tercetak di MATAKIN**. Pinyin harus ditetapkan berdasarkan makna dan fungsi aksara dalam kalimat yang sebenarnya, dibantu sumber bahasa Tionghoa klasik dan kamus Mandarin yang dapat ditelusuri.

## Urutan pemeriksaan wajib
1. Tetapkan **Hanzi yang dimaksud** dengan konteks kalimat; bedakan karakter mirip (mis. `己` jǐ 'diri sendiri' vs `已` yǐ 'sudah/telah').
2. Identifikasi fungsi kata dalam struktur kalimat (nomina, verba, partikel, nama diri, pemakaian klasik), terutama **多音字** / karakter multibacaan.
3. Cari bacaan sesuai makna dalam kamus otoritatif Mandarin (mis. [Kementerian Pendidikan Taiwan](https://dict.revised.moe.edu.tw/dictView.jsp?ID=11608&la=0&powerMode=0)); catatan bacaan yang dijelaskan pengulas klasik, seperti `與平聲` dari Zhu Xi, merupakan bukti tambahan.
4. Cocokkan dengan pinyin **yang benar-benar tercetak** pada foto MATAKIN 2012. Catat dua nilai jika ada perbedaan: `printed_pinyin` dan `contextual_pinyin`, alasan gramatikal, beserta bukti sumber.
5. **Bacaan utama aplikasi** harus mengikuti hasil verifikasi linguistik yang cukup kuat. Jika bukti bertentangan atau masih lemah, **tandai Review**, jangan menebak ataupun mengesahkan Final.
6. **Jangan mengubah** Hanzi MATAKIN, terjemahan Indonesia, atau varian sumber historis hanya untuk menyesuaikan pinyin. Jangan normalisasi aksara dan pinyin secara global. Buat tes regresi pada setiap koreksi terbukti.

## Contoh keputusan berbukti
| Kasus | Bentuk | Makna/fungsi | Bacaan utama | Foto/saksi | Putusan |
| --- | --- | --- | --- | --- | --- |
| Zhong Yong MATAKIN IX:2, `南方之強與？` | `與` | Partikel tanya yang sepadan dengan `歟` | **yú** | MATAKIN 2012 halaman 42 mencetak **yǔ** | Catat bacaan cetak **yǔ** sebagai varian yang tidak dipakai untuk bacaan utama, lihat komentar Zhu Xi `與平聲` dan kamus Taiwan |
| Zhong Yong MATAKIN XXV:4, `配地` | `地` | Nomina 'bumi', bukan partikel struktural `的/地` | **dì** | MATAKIN 2012 halaman 78 mencetak **dì** | Koreksi `de → dì` |
| Zhong Yong MATAKIN XXIV:3, `自成己`, `而已` | `己/已` | 'diri sendiri' vs 'hanya/saja' | **jǐ/yǐ** | MATAKIN 2012 halaman 76 | Pertahankan keduanya menurut konteks |

## Pelaporan
Untuk setiap ketidaksesuaian pinyin, simpan sekurang-kurangnya `passage_id`, frasa Hanzi, nilai pinyin yang tersimpan, bacaan cetak (bila terkonfirmasi), bacaan kontekstual yang dianjurkan, dasar makna/gramatika, pranala kamus/saksi, keputusan, status tes, dan apakah anotasi pembaca diperlukan.

**Penting:** Audit pinyin berskala seluruh 965 pasal belum selesai; kebijakan ini tidak mengesahkan semua token pinyin menjadi benar.
