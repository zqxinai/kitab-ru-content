# Zhong Yong — rekonsiliasi 28 kandidat `significant` (14 November 2026)

## Metode dan batas bukti
Daftar diambil dari matriks penyaringan awal `docs/audits/zhu-xi-wyg-965.json`, **28 kandidat dengan kelas `significant`** pada 129 pasal Zhong Yong. Seluruh 28 ID dicocokkan lagi secara mekanis antara Ruby tradisional di `sishu/chapters/zhongyong/*.json` dan `witness_excerpt` WYG (sumber: Zhu Xi 《四書章句集註》, 欽定四庫全書, Kanripo commit `84c6b2c5093c57ae5d41c60a73c02323d2420ef0`). Untuk potongan WYG yang tidak lengkap, file WYG penuh `KR1h0015_016.txt` turut diperiksa. **Penyaringan ulang bukan pengesahan cetakan MATAKIN 2012 setiap pasal.**

## Pengelompokan 28 kandidat

### A. 20 kandidat beda grafis/ortografi tanpa bukti kesalahan makna
| ID internal | Selisih dengan WYG | Keterangan |
| --- | --- | --- |
| `01.01` | 修 / 脩 | Bentuk lazim untuk membina diri |
| `01.03`, `11.01` | 隱 / 隠 | Variasi bentuk |
| `03.01`, `26.07` | 久 / 乆 | Variasi bentuk |
| `10.03`, `10.04`, `10.05` | 強 / 强 | Variasi grafis; konteks Bab IX sudah cocok dengan foto MATAKIN |
| `11.02` | 途 / 塗 | Variasi kata jalan/perjalanan dalam konteks `半途而廢` |
| `12.03`, `27.02` | 於 / 于 | Ortografi |
| `13.01`, `13.02`, `15.01` | 遠 / 逺 | Variasi bentuk |
| `14.04` | 徼 / 儌 | Varian bacaan/aksara pada `徼幸`; bandingkan cetak bila perlu |
| `19.03`, `20.04`, `20.07`, `20.11` | 修 / 脩 | Variasi bentuk |
| `28.01` | 專 / 専; 災 / 烖 | Variasi bentuk |

Dua puluh ID tersebut tidak diubah hanya karena kolasi berbeda. Tetap perlu bukti MATAKIN sebelum menyebut masing-masing *Final*.

### B. Enam kandidat **false alert** akibat panjang `witness_excerpt`
| ID internal | Penyebab |
| --- | --- |
| `12.01` | Matriks kehilangan aksara akhir `隠`, tetapi sumber WYG lengkap memuat `君子之道費而隠` |
| `20.12` | Aksara akhir `也` hilang hanya dari potongan matriks; WYG lengkap `懐諸侯也` |
| `20.13` | Matriks hanya mengutip sekitar 42 aksara dari kalimat 64 aksara |
| `20.14` | Matriks hanya mengutip sekitar 42 aksara dari kalimat 127 aksara |
| `20.21` | `強/强` tidak tampil di akhir `witness_excerpt`, tetapi WYG penuh memuat `雖柔必强` |
| `26.09` | `已` akhir tidak tampil di `witness_excerpt`, tetapi WYG penuh memuat `純亦不已` |

Terdapat varian grafis lain pada sebagian ayat dalam kelompok ini, tetapi tidak terbukti ada potongan kalimat yang benar-benar hilang dari naskah klasik.

### C. Dua kandidat `己 / 已` — periksa cetakan MATAKIN sebelum ditutup
| Identitas MATAKIN | ID internal | Data Ru Classics | WYG | Putusan |
| --- | --- | --- | --- | --- |
| **Bab XII:3 — Jalan Suci itu Satya dan Tepasarira** | `sishu.zhongyong.13.03` | `施諸己而不願` | `施諸已而不願` | `己` bermakna diri sendiri dan konsisten dengan terjemahan MATAKIN yang tersedia. Simpan, tetapi **tunggu foto 2012** untuk bentuk grafem |
| **Bab XXIV:3 — Iman dan Jalan Suci** | `sishu.zhongyong.25.03` | `成己仁也` (serta `自成己`) | `成已仁也` / `自成已` | `己` sesuai makna diri sendiri; **tunggu foto 2012** untuk putusan edisi |

## Keputusan
- **28/28 kandidat significant Zhong Yong telah disaring ulang** dan dikelompokkan: **20** variasi grafis/ortografi, **6** ketidaklengkapan potongan saksi dalam matriks, dan **2** kasus `己/已` yang memerlukan konfirmasi cetakan.
- **Tidak mengubah** aksara dalam 28 pasal ini berdasarkan perbedaan WYG semata; terjemahan Indonesia MATAKIN adalah acuan utama, Zhu Xi pembanding Hanzi, Legge pembanding Inggris.
- Jangan salah baca angka pertama ID internal sebagai nomor bab MATAKIN.
- Belum mencakup kategori awal `review`, `minor`, atau seluruh audit 129 pasal. **Status editorial tetap `unverified-draft`.**
