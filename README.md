# Kitab Ru — Content & Editor

Repository distribusi konten untuk aplikasi **Kitab Ru**, terpisah dari source aplikasi [Ru-Classics](https://github.com/zqxinai/Ru-Classics).

## Ruang penyuntingan

**[Buka source Kitab Ru Editor](./editor/index.html)**

Editor web statis tanpa server, dengan desain cyan pastel yang nyaman pada desktop dan mobile. Editor berjalan lokal di browser dan **tidak membutuhkan token GitHub**. Untuk menggunakan editor:
1. Buka `editor/index.html` setelah mengunduh repository (atau aktifkan GitHub Pages dengan sumber branch `main`, folder `/(root)` dan buka halaman editor).
2. Tekan **Impor JSON** untuk membuka paket naskah `ru-classics.content.v1` atau katalog `kitab-ru.catalog.v1`.
3. Di mode Naskah, pilih kitab → bab → pasal. Edit **Hanzi tradisional, pinyin per aksara, terjemahan Indonesia, dan terjemahan Inggris (opsional)**. Kata pengantar dan judul bab diedit terpisah.
4. Gunakan panel kanan untuk melihat pratinjau **ID / EN**, pemeriksaan struktur, dan jumlah kitab/bab/pasal.
5. Tekan **Ekspor JSON**, simpan berkas, tinjau diff, dan unggah sebagai revisi melalui Pull Request atau GitHub Release. **Editor tidak pernah menerbitkan perubahan otomatis**.

Jika berkas kosong dibuat sebagai kerangka, pemeriksaan struktur akan mengingatkan jumlah pasal Si Shu yang belum lengkap. Persyaratan impor Android Si Shu saat ini: 78 bab, 965 pasal, dua kata pengantar, dan `review_status: unverified-draft`.

## Dukungan dua bahasa

```json
{
  "translation_indonesian": "Terjemahan Indonesia dari sumber yang telah diperiksa",
  "translation_english": "An optional reviewed English translation"
}
```

`translation_english` **opsional**. Jangan mengarang terjemahan atau menyimpulkan versi Inggris telah tersedia hanya karena ada kolomnya. Naskah lama tanpa `translation_english` tetap kompatibel. Pilihan English pada Android hanya aktif jika ada konten Inggris; pasal yang belum diterjemahkan tetap menampilkan bahasa Indonesia.

## Katalog

`catalog.json` mendaftarkan Si Shu dan calon koleksi lain (Yi Jing, Shu Jing, Shi Jing, Li Ji, Chun Qiu). Status `coming_soon`, `draft`, atau `available`. Status tersedia mensyaratkan URL paket HTTPS serta SHA-256.

**Catatan:** aplikasi Android V1 saat ini memiliki daftar kitab statis dan importer khusus Si Shu; sinkronisasi `catalog.json` multi-kitab secara dinamis adalah pengembangan berikutnya. Antarmuka editor belum menggantikan proses review dan penerbitan.

## Kebijakan editorial

- Hanzi sumber, pinyin, terjemahan Indonesia, dan Inggris adalah lapisan berbeda.
- ID dan urutan bab/pasal harus stabil agar bookmark serta catatan pembaca tidak hilang.
- Pertahankan istilah Hokkian di dalam tanda kurung pada terjemahan Indonesia sesuai cetakan yang dijadikan sumber.
- Pakai `editorial_status` dan log revisi; tanpa audit jangan menaikkan status verifikasi teks.
- Distribusi terjemahan Si Shu dilakukan berdasarkan izin MATAKIN yang dikonfirmasi pemilik proyek; batas dan atribusi izin ditetapkan oleh dokumen perizinan. Hindari pemberian lisensi terbuka yang melebihi hak yang dimiliki.

## Keterbatasan editor V1

Penyuntingan adalah *local-first* dan tidak menyimpan perubahan otomatis di server. Perubahan bisa hilang jika browser ditutup sebelum ekspor (terdapat peringatan). Pengecekan struktur hanya mendeteksi masalah mekanis tertentu, **bukan** memastikan ketepatan makna, pinyin polifonik atau hak cipta teks. Tidak ada dukungan ekspor berkas sumber Markdown maupun penyuntingan bersamaan oleh beberapa pengguna.
