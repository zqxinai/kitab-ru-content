# Asal Hanzi pada Si Shu — catatan provenance dan koreksi atribusi

Tanggal pemeriksaan: 13 November 2026. Status: **asal korpus teridentifikasi; audit filologis menyeluruh belum selesai.**

## Rantai sumber terverifikasi

1. **PDF MATAKIN, `SI SHU.pdf`** — sumber teks terjemahan Indonesia serta struktur bab/pasal; **tidak memuat Hanzi dalam PDF yang diberikan kepada proyek**.
2. **Draf Markdown Si Shu** — tersimpan di Google Drive, folder `Si Shu — Revisi Cetakan v2 — 2026-11-13 (DRAF AUDIT)`. Dokumen arsip `06 - Metode dan Audit.md`, https://drive.google.com/file/d/1M_fWS_E8-naI6gOj8X114q0Fl2-EeS5b/view , secara eksplisit mencatat bahwa teks Mandarin diambil dari JSON publik `hanzhaodeng/chinese-ancient-text`: `大学章句集注.json`, `中庸.json`, `论语.json`, `孟子.json`.
3. **Konversi dalam proses penyusunan Markdown** menurut dokumen metode: Hanzi sederhana → tradisional dengan ICU `Hans-Hant`; pinyin bertanda nada menggunakan ICU `Han-Latin` dan beberapa koreksi. Dokumentasi metode ini **bukan** jaminan akurasi semua karakter dan pelafalan.
4. **JSON `kitab-ru-content`** — file bab `sishu/chapters/…` diimpor dari Markdown tersebut. Commit impor Lun Yu bab 1–10: `000effe6996d94980a85a40aca047b2b57aef858`. File `tools/build_sishu.py` hanya menggabungkan file bab dan memvalidasi struktur; **tidak** mengambil Hanzi dari PDF atau menerjemahkan ulang.
5. **James Legge** — pembanding Hanzi untuk pemetaan perikop dan sumber terjemahan Inggris **yang ditambahkan kemudian**. Tidak dapat dipakai untuk menyimpulkan bahwa bentuk karakter awal proyek dicetak oleh MATAKIN.

Repo sumber Mandarin: https://github.com/hanzhaodeng/chinese-ancient-text . Pemeriksaan dilakukan terhadap `论语.json` pada ref `master` (HEAD teramati `01a1183cd9bbc243bb156967043c32b6685c0d2f`, blob `0bb699ff9cb42f5cded90ec83671bc3741d30eac`). Ini **snapshot yang diperiksa kini**, bukan bukti bahwa hash yang sama dicatat pada impor Markdown awal. Dokumen audit Da Xue contoh terpisah memakai Wikisource `四書章句集註/大學章句` sebagai **pembanding**, dan tidak menggantikan sumber JSON utama proses Markdown.

## Audit perbedaan Lun Yu: korpus awal vs. Legge

| Pasal ID proyek | `论语.json` awal (Hanzi sederhana) | Hanzi proyek sesudah konversi | Transkripsi Hanzi Legge | Kesimpulan |
| --- | --- | --- | --- | --- |
| `sishu.lunyu.09.26` | `三军可夺帅也` | `三軍可奪帥也` | `三軍可奪師也` | `帅 → 帥` adalah konversi tepat; `師` perbedaan transkripsi Legge, bukan bukti salah salin proyek |
| `sishu.lunyu.10.24` | `寝不尸，居不客。` | `寢不屍，居不客。` | `寢不尸，居不容。` | `客/容` merupakan bacaan berbeda; keduanya terattestasi dalam tradisi tekstual; periksa acuan edisi sebelum memilih |
| `sishu.lunyu.11.03` | `政事：冉有，季路。` | `政事：冉有，季路。` | `政事、冉有、李路。` | `季路` konsisten dengan nama murid yang dimaksud; bentuk `李路` di sumber transkripsi Legge perlu diperiksa terhadap cetakan |
| `sishu.lunyu.14.33` | `曰：“骥不称其力，称其德也。”` | `曰：“驥不稱其力，稱其德也。”` | `子曰、驥、不稱其力、稱其德也。` | `曰` berasal dari JSON awal, tetapi `子曰` tercantum pada edisi Zhu Xi dan sesuai terjemahan Indonesia “Nabi bersabda”; perlu ralat editorial terpisah bila memilih edisi acuan tersebut |

Setiap bentuk Hanzi pada keempat pasal diverifikasi langsung terhadap `论语.json` sumber (indeks bab 9:26, 10:24, 11:3, 14:33); tidak ada perubahan otomatis pada isi kitab dalam audit provenance ini.

## Konsekuensi editorial

- Hindari istilah **“Hanzi MATAKIN”**: tulis **“Hanzi proyek dari korpus pembanding”**, **“terjemahan Indonesia MATAKIN”**, atau **“penomoran pasal MATAKIN”**.
- Untuk penilaian perbedaan karakter: utamakan konteks kalimat, terjemahan Indonesia, identitas tokoh, dan rujukan ke naskah klasik primer/edisi acuan. Tidak semua deviasi harus memblokir draf terjemahan Inggris; tetapi setiap deviasi diberi alasan dan tetap **needs review** sampai diperiksa.
- Jangan otomatis mengganti `客` menjadi `容`, `帥` menjadi `師`, atau `季路` menjadi `李路` demi cocok dengan Legge. Evaluasi `曰` → `子曰` sebagai revisi teks proyek yang bersumber, dengan pembaruan pinyin terkait, dalam pekerjaan editorial tersendiri.
- Kecocokan mekanis 100% hanya memeriksa bentuk yang disalin dan pasangan; bukan sertifikasi kebenaran teks Hanzi secara historis. `dist/sishu-review-status.json` tetap menjadi satu-satunya registry status Final.
