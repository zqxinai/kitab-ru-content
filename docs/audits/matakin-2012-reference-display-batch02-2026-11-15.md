# Ru Classics — Rujukan MATAKIN 2012, batch 02 dan konfirmasi SS/AB/BC/TS

**Tanggal:** 15 November 2026 WIB  
**Ruang lingkup:** tampilan editorial rujukan, bukan perubahan transkripsi Indonesia MATAKIN 2011.

## Aturan yang kini terkunci

Konfirmasi pemilik cetakan MATAKIN:

| Singkatan | Identitas kitab |
| --- | --- |
| `SS`, `S.S.` | Sabda Suci — Lun Yu (論語, Lún Yǔ) |
| `AB`, `A.B.` | Ajaran Besar — Da Xue (大學, Dà Xué) |
| `BC`, `B.C.`, `Bc.` | Bingcu / Mengzi (孟子, Mèng Zǐ) |
| `TS`, `T.S.` | Tengah Sempurna — Zhong Yong (中庸, Zhōng Yōng) |

Parser di [`tools/audit_matakin_references.cjs`](../../tools/audit_matakin_references.cjs) memakai identitas keempat kitab, **tanpa menebak** target untuk rujukan campuran (`S.S. ...; BC ...`) ataupun nomor tanpa penanda. Normalisasi hanya dilakukan berdasarkan **ID pasal + kutipan sumber persis**, untuk menghindari salah ubah isi yang mirip.

## Inventaris otomatis setelah empat singkatan terkunci

Run [GitHub Actions #43629679032](https://github.com/zqxinai/kitab-ru-content/actions/runs/43629679032) lulus dan memindai 965 pasal kembali. Algoritme baru menemukan **497 pola rujukan** (sebelumnya 489, tetapi angkanya tidak dapat dibandingkan sebagai perubahan isi karena metode klasifikasi telah diperluas): **251** singkatan kitab tunggal, **108** rujukan tanpa nama yang ambigu, **25** gabungan beberapa singkatan kitab, **55** rujukan kitab eksplisit, **3** campuran nama eksplisit dan singkatan, serta **55** kandidat rujukan sesama kitab. Ini adalah inventaris heuristik, **bukan** jumlah kesalahan cetakan.

## Batch baru: 10 rujukan pada pasal Lun Yu

| Sumber ID | Kutipan MATAKIN 2011 | Tampilan nama lengkap | Target passage ID (eksis) |
| --- | --- | --- | --- |
| `sishu.lunyu.05.07` | `(S.S. IX: 14)` | `(Sabda Suci — Lun Yu IX:14)` | `sishu.lunyu.09.14` |
| `sishu.lunyu.05.08` | `(S.S. II: 6)` | `(Sabda Suci — Lun Yu II:6)` | `sishu.lunyu.02.06` |
| `sishu.lunyu.05.08` | `(S.S. VI: 4)` | `(Sabda Suci — Lun Yu VI:4)` | `sishu.lunyu.06.04` |
| `sishu.lunyu.05.10` | `(S.S. III: 21)` | `(Sabda Suci — Lun Yu III:21)` | `sishu.lunyu.03.21` |
| `sishu.lunyu.06.04` | `(S.S. V: 8)` | `(Sabda Suci — Lun Yu V:8)` | `sishu.lunyu.05.08` |
| `sishu.lunyu.06.22` | `(S.S. II: 5)` | `(Sabda Suci — Lun Yu II:5)` | `sishu.lunyu.02.05` |
| `sishu.lunyu.06.30` | `(S.S. XIV: 42)` | `(Sabda Suci — Lun Yu XIV:42)` | `sishu.lunyu.14.42` |
| `sishu.lunyu.10.01` | `(S.S. III: 15)` | `(Sabda Suci — Lun Yu III:15)` | `sishu.lunyu.03.15` |
| `sishu.lunyu.10.07` | `(S.S. VII: 13)` | `(Sabda Suci — Lun Yu VII:13)` | `sishu.lunyu.07.13` |
| `sishu.lunyu.10.08` | `(S.S. IX: 16)` | `(Sabda Suci — Lun Yu IX:16)` | `sishu.lunyu.09.16` |

**TS khusus:** `sishu.lunyu.05.08` juga mengandung `(T.S. VIII)`. Identitas kitab pasti, sehingga ditampilkan sebagai `(Tengah Sempurna — Zhong Yong VIII)`. Namun, rujukan tersebut hanya menyebut **bab**, bukan pasal; karena itu **`target_id: null`**. Tidak ada hyperlink pasal yang dikarang.

## Pengamanan

- Sebelum: **10** catatan rujukan batch 01.
- Batch ini: **10** tambahan rujukan pasal yang tersedia, plus **1** rujukan tingkat bab TS tanpa tautan; total overlay kini **21** catatan persis.
- Sumber Indonesia, Hanzi, pinyin, teks Legge, pembagian ayat, dan pengesahan *Final* **tidak diubah**.
- Bukti keterbacaan bab/pasal target tercakup dalam `tests/matakin-reference-overlay.test.cjs`. Keberadaan pasal di aplikasi **tidak sama** dengan bukti bahwa redaksi kutipan persis sama dengan foto edisi 2012.
- Uji pemanggilan pembaca menggunakan `ru-classics/tests/smoke.cjs`. CI membaca modul sebelum aplikasi dirender dan memastikan dua rujukan S.S. ditangani secara independen dari rujukan TS di Lun Yu V:8.
- Ketika rujukan tidak mempunyai nama dan subayat yang dapat dibuktikan, biarkan tetap pada lapisan sumber 2011 hingga ditinjau manual.

Lanjutkan dari [batch 01](matakin-2012-reference-display-batch01-2026-11-15.md) tanpa membuka kembali pasal yang telah lulus kecuali ada bukti baru atau pengujian gagal.
