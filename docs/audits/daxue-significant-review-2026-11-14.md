# Audit lanjutan Da Xue — tujuh kandidat signifikan (14 November 2026)

## Nomor cetak MATAKIN versus ID internal
ID `sishu.daxue.04.01` dan `04.02` adalah **MATAKIN Bab III:1–2 — Puncak Kebaikan**, bukan Bab IV:1–2. Indeks internal menghitung Bab Utama sebagai kelompok tersendiri. Semua ID pada tabel berikut adalah **ID internal**, bukan nomor bab cetak. Pembuktian pemetaan di metadata `sishu/chapters/daxue/04.json`, dan foto cetak menunjukkan Bab IV — Pangkal dan Ujung dimulai dengan `子曰：聽訟...`.

## Cakupan dan sumber
Pemeriksaan read-only terhadap tujuh pasal `Da Xue` dalam `sishu/chapters/daxue/*.json` yang diberi `screen_class: significant` oleh matriks awal `zhu-xi-wyg-965.json`. Pembandingnya Zhu Xi, 《四書章句集註》, 欽定四庫全書 (WYG), snapshot Kanripo `84c6b2c5093c57ae5d41c60a73c02323d2420ef0`. Matriks merupakan snapshot pra-koreksi dan kelas `significant` bukan vonis kesalahan.

| ID | Data Ru Classics | Petikan saksi WYG | Putusan sementara |
| --- | --- | --- | --- |
| `sishu.daxue.01.06` | `修身` | `脩身` | Varian grafis/ortografis; pertahankan |
| `sishu.daxue.02.02` | `《太甲》` | `大甲` | Varian penulisan nama; jangan ubah otomatis |
| `sishu.daxue.03.01` | `苟日新` | `茍日新` | Varian grafis; pertahankan |
| `sishu.daxue.04.01` | `維民所止` | `惟民所止` | Varian tekstual; perlu bukti cetak MATAKIN sebelum menetapkan bentuk final |
| `sishu.daxue.04.02` | `黃鳥`, `於丘隅` | `黄鳥`, `于丘隅` | Varian bentuk/ortografi; pertahankan |
| `sishu.daxue.08.03` | `修身` | `脩身` | Varian grafis; pertahankan |
| `sishu.daxue.09.03` | `不修` | `不脩` | Varian grafis; pertahankan |

## Keputusan
Tidak ada perbedaan pada tujuh kandidat ini yang **membuktikan** kesalahan semantik teks Ru Classics. Tidak dilakukan perubahan teks Hanzi, pinyin, terjemahan MATAKIN, ID ayat, maupun status editorial `unverified-draft`. Pengelompokan ini adalah *review kandidat*, **bukan** sertifikasi final kesesuaian dengan foto MATAKIN 2012 yang belum diperiksa untuk pasal-pasal ini.

## Aturan audit
- Acuan utama Indonesia, nama bab dan pembagian pasal tetap MATAKIN; Zhu Xi WYG adalah pembanding Hanzi otoritatif, bukan perintah penggantian otomatis.
- Perbedaan nomor halaman edisi cetak dengan pagination aplikasi/website **bukan discrepancy**.
- Mengzi IX:7 dan 24 token 雲/云 sudah ditangani pada batch terdahulu; jangan dikerjakan ulang.
- Lanjutkan kandidat penting yang belum diverifikasi dengan bukti konteks; jangan mengesahkan `Final` secara otomatis.

## Validasi
Audit ini hanya menambahkan dokumentasi; tidak mengubah runtime atau dataset. CI/pengujian tidak dinyatakan lulus tanpa verifikasi eksekusi.
