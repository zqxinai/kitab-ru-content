# Ru Classics — Batch 03: normalisasi rujukan bernama kitab (tanpa mengubah MATAKIN 2011)

**Tanggal:** 15 November 2026 WIB. **Cakupan:** 13 tambahan setelah batch 01 (10) dan 02 (11). **Total:** 34 lokasi rujukan yang ditangani overlay.

## Prinsip dan keterbatasan

- SS = Sabda Suci / Lun Yu, AB = Ajaran Besar / Da Xue, BC = Bingcu / Mengzi, TS = Tengah Sempurna / Zhong Yong, sesuai konfirmasi pemilik buku cetak 2012.
- Pemetaan ID tujuan di bawah dikonfirmasi **ada** pada naskah digital. Keberadaan target dan kesamaan tema **bukan jaminan** rujukan tersebut mengutip teks persis sama; hubungan berupa perbandingan gagasan ditandai sebagai belum bersertifikat.
- Penulisan nama kitab lengkap adalah **konvensi presentasi** mengikuti 2012, **bukan** transkripsi ejaan persis dari foto halaman 2012 yang belum diberikan.
- Rujukan yang hanya menyebut **bab** tetap ditampilkan tanpa target pasal, dan **tidak boleh** diberi hyperlink pasal rekaan.
- Semua `translation_indonesian`, Hanzi, pinyin, English James Legge, dan status persetujuan editor **tetap**.

## 13 rujukan baru

| ID sumber | Rujukan cetakan 2011 | Tampilan normalisasi | ID pasal tujuan yang ada |
| --- | --- | --- | --- |
| `sishu.lunyu.05.12` | `(A.B. IX: 4)` | `(Ajaran Besar — Da Xue IX:4)` | `sishu.daxue.10.04` |
| `sishu.lunyu.05.25` | `(S.S. I: 3)` | `(Sabda Suci — Lun Yu I:3)` | `sishu.lunyu.01.03` |
| `sishu.lunyu.10.21` | `(S.S. III: 15)` | `(Sabda Suci — Lun Yu III:15)` | `sishu.lunyu.03.15` |
| `sishu.lunyu.10.25` | `(S.S. IX: 10)` | `(Sabda Suci — Lun Yu IX:10)` | `sishu.lunyu.09.10` |
| `sishu.lunyu.16.09` | `(T.S. XIX: 9)` | `(Tengah Sempurna — Zhong Yong XIX:9)` | `sishu.zhongyong.20.09` |
| `sishu.lunyu.16.12` | `(S.S. XII: 10)` | `(Sabda Suci — Lun Yu XII:10)` | `sishu.lunyu.12.10` |
| `sishu.lunyu.12.10` | `(S.S. XVI: 12)` | `(Sabda Suci — Lun Yu XVI:12)` | `sishu.lunyu.16.12` |
| `sishu.lunyu.12.14` | `(S.S. XIII: 3)` | `(Sabda Suci — Lun Yu XIII:3)` | `sishu.lunyu.13.03` |
| `sishu.lunyu.12.16` | `(T.S. IX: 3)` | `(Tengah Sempurna — Zhong Yong IX:3)` | `sishu.zhongyong.10.03` |
| `sishu.zhongyong.10.03` | `(S.S. XII:16)` | `(Sabda Suci — Lun Yu XII:16)` | `sishu.lunyu.12.16` |
| `sishu.lunyu.12.22` | `(Bc. VIIA: 46)` | `(Mengzi — Bing Cu VII A:46)` | `sishu.mengzi.13.46` |
| `sishu.lunyu.12.13` | `(A.B. IV )` | `(Ajaran Besar — Da Xue IV)` | **Tidak ditautkan — rujukan bab** |
| `sishu.lunyu.12.20` | `(T.S. VIII)` | `(Tengah Sempurna — Zhong Yong VIII)` | **Tidak ditautkan — rujukan bab** |

**Penting:** pada bab yang menghitung *Bab Utama* sebagai bagian tersendiri, ID data adalah satu lebih tinggi daripada nomor bab tercetak (contoh Da Xue IX:4 = `sishu.daxue.10.04`, Zhong Yong XIX:9 = `sishu.zhongyong.20.09`). Nomor cetak tidak boleh diganti dengan ID internal.

## Penilaian konteks yang belum disamakan

- Lun Yu X:21 dan Lun Yu III:15: narasi masuk ke *Bio Besar* dan menanyakan segala sesuatu adalah paralel yang jelas.
- Lun Yu X:25 dan Lun Yu IX:10: penghormatan kepada orang berkabung/orang berkostum upacara adalah paralel yang kuat.
- Lun Yu XVI:9 dan Zhong Yong XIX:9: keduanya membedakan tingkatan belajar dan pengetahuan; tema cocok, kalimat bukan kutipan identik.
- Lun Yu XII:14 → XIII:3, Lun Yu XII:16 → Zhong Yong IX:3, dan Zhong Yong IX:3 → Lun Yu XII:16: rujukan tercetak dapat menunjuk hubungan ajaran, tetapi **tidak dinyatakan sebagai kutipan kata-demi-kata**.
- Lun Yu XII:13 → Da Xue IV dan Lun Yu XII:20 → Zhong Yong VIII hanya rujukan bab, tanpa pasal.

## Pengujian dan reproduksi

`ru-classics/reference-overlay.js` mengandung 34 catatan ID + pola persis; `tests/matakin-reference-overlay.test.cjs` memeriksa cakupan dan bahwa sumber Indonesia sama persis, target pasal ada atau secara eksplisit null, dan rujukan lain/penanda subayat tidak terubah. `ru-classics/tests/smoke.cjs` membuka contoh TS/AB/BC di pembaca. GitHub Actions: `Audit MATAKIN cross-references`, `Validate Kitab Ru Editor`, dan `Publish Kitab Ru Editor (GitHub Pages)`.

**Tindak lanjut:** sisa referensi didahulukan menurut identitas dan tingkat kepastian. Tidak ada alasan untuk mencari ulang definisi SS/AB/BC/TS, tidak ada penggantian massal referensi numerik anonim, dan tidak ada klaim status Final hanya karena tampilan rujukan sudah rapi.
