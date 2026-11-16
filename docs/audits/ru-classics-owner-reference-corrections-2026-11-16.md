# Koreksi rujukan berdasar konfirmasi cetakan MATAKIN 2012 — 16 November 2026

**Cakupan:** delapan kasus editorial yang dikonfirmasi pengguna, diterapkan sebagai **sembilan catatan overlay** karena rujukan ke Zhong Yong VIII muncul pada dua pasal. Data utama `translation_indonesian` MATAKIN 2011 tidak ditulis ulang.

| Pasal asal | Bentuk sumber yang dipertahankan | Tampilan yang disepakati | Navigasi dan status |
|---|---|---|---|
| Lun Yu II:11 | `(T.S. XXV1:6)` | Tengah Sempurna — Zhong Yong XXVI:6 | Tautan ke `sishu.zhongyong.27.06`; pengguna menegaskan XXVI (angka Romawi) |
| Lun Yu V:8 dan XII:20 | `(T.S. VIII)` | Tengah Sempurna — Zhong Yong Bab VIII | Tautan ke satu-satunya pasal dalam Bab VIII: `sishu.zhongyong.09.01`; label tetap menunjuk **bab**, bukan mengarang nomor pasal |
| Lun Yu VI:26 | `(Bc.VA: 3/4)` | Mengzi — Bing Cu V A:3/4 | **Tetap sesuai edisi cetak 2012, tetapi tidak ditautkan ke tujuan yang keliru.** Mengzi V A:3 tidak mempunyai ayat 4 pada data; kandidat paralel kuat: V A:2 ayat 4 dengan Hanzi `故君子可欺以其方，難罔以非其道`. Ini alternatif kajian, bukan perbaikan otomatis cetakan |
| Lun Yu XIV:10 | `(S.S. 1:15)` | Sabda Suci — Lun Yu I:15 | `sishu.lunyu.01.15`; `1` merupakan salah baca dari `I` |
| Lun Yu XVIII:1 | `(Mengzi - Bingcu IIA: 1/8)` | Mengzi — Bing Cu II A:1/8 | Tautan **langsung ke Ayat 8** dalam `sishu.mengzi.03.01`; pengguna membetulkan bahwa informasi sebelumnya mengenai ayat 5 adalah salah ketik. Tidak ada konflik nomor dan catatan konflik dihapus |
| Mengzi II A:2 ayat 26 | `(TS.XXIX- XXXI;SS 23-25)` | Tengah Sempurna — Zhong Yong Bab XXIX–XXXI; Sabda Suci — Lun Yu XIX:23,24,25 | Tiga pasal Lun Yu **ditautkan satu per satu**. Zhong Yong berupa rentang bab dan belum diarahkan ke pasal tertentu |
| Mengzi I A:7 ayat 9 | `(II.5.4.4)` | Shi Jing — Si King II.5.4.4 | Identitas kitab luar Si Shu ditegaskan pengguna; tidak dipasangkan ke pasal Mengzi |
| Da Xue III:3 | `(Si-kingIII.1.1.1)` | Shi Jing — Si King III.1.1.4 | Pengguna mengoreksi nomor terakhir 1 menjadi 4; belum ada tujuan tautan korpus Shi Jing |

## Aturan pelaksanaan

- Terjemahan MATAKIN 2011, Hanzi, Pinyin, dan terjemahan Inggris tidak diubah.
- Edisi fisik 2012 menjadi otoritas rujukan yang dikonfirmasi pengguna. Normalisasi hanya pada `ru-classics/reference-overlay.js`, dukungan multi-rujukan pada `reference-links.js`, dan lapisan tampilan.
- **Garis miring `/N` berarti ayat**, dan hanya dapat dinavigasi bila penanda ayatnya tersedia dalam pasal tujuan.
- Catatan konflik hanya tampil untuk **Lun Yu VI:26 (V A:3/4)**. Nomor Mengzi II A:1/8 sudah jelas menuju ayat 8; **tidak lagi ditandai konflik**.
- Pengujian: `tests/matakin-owner-corrections-2026-11-16.test.cjs`, seluruh 965 pasal, audit rujukan, dan smoke pembaca melalui GitHub Actions.

Implementasi dan diskusi berada pada PR #52: <https://github.com/zqxinai/kitab-ru-content/pull/52>.
