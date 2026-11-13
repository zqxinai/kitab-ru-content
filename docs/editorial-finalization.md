# Konfirmasi final di Ruang Editorial

Status ditampilkan per pasal untuk **dua terjemahan**: Indonesia MATAKIN dan Inggris James Legge. Teks Hanzi tetap menjadi acuan kesesuaian. Tombol **Konfirmasi final** membuat permintaan peninjauan melalui issue GitHub, bukan langsung mengubah status situs statis. Tombol **Tandai perlu review** membuka permintaan untuk mencabut persetujuan.

## Cara menyetujui permintaan

1. Pemeriksa membuka issue, memeriksa keseluruhan Hanzi, cakupan pasal Inggris, kesetiaan terjemahan, dan referensi.
2. Pengelola memperbarui satu entri di `dist/sishu-review-status.json` dalam pull request, kemudian me-review dan merge.
3. Kedua status menjadi `final` hanya jika masing-masing snapshot yang disetujui **identik dengan teks terbaru**, dan `hanzi_span` sama dengan teks Hanzi pada pasal. Jika satu teks berubah, status bagian tersebut otomatis menjadi *perlu review*.
4. Pengguna memuat ulang editor dari versi publik yang telah diterbitkan.

Contoh entri (gunakan teks **nyata** lengkap, bukan placeholder; format berikut ilustrasi):

```json
{
  "passage_id": "sishu.daxue.01.01",
  "indonesian": "final",
  "english": "final",
  "hanzi_span": "teks Hanzi aktual lengkap dari pasal",
  "indonesian_text": "teks MATAKIN aktual lengkap dari pasal",
  "english_text": "teks Inggris terpetakan aktual lengkap dari pasal",
  "reviewed_by": "GitHub username",
  "reviewed_at": "YYYY-MM-DD",
  "source_issue": 123
}
```

Untuk pemeriksaan hanya pada satu bahasa, set bahasa lain `review`; editor menampilkan **Sebagian final**. Jangan menyatakan Inggris final hanya karena nomor pasal sama, dan jangan mencatat final jika belum ada terjemahan Inggris.

Daftar awal sengaja kosong: **tidak ada pasal yang disahkan otomatis**. Issue hanyalah permintaan, bukan bukti penerbitan. Karena editor publik adalah GitHub Pages statis, tidak ada penulisan langsung ke repository dari browser tanpa mekanisme otentikasi GitHub.
