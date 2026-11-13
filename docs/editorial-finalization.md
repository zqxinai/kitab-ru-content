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

Untuk pemeriksaan hanya pada satu bahasa, **pertahankan status bahasa lain sebagaimana adanya**; editor menampilkan **Sebagian final** bila baru satu bahasa yang disahkan. Jangan menyatakan Inggris final hanya karena nomor pasal sama, dan jangan mencatat final jika belum ada terjemahan Inggris.

Daftar awal sengaja kosong: **tidak ada pasal yang disahkan otomatis**. Issue hanyalah permintaan, bukan bukti penerbitan. Karena editor publik adalah GitHub Pages statis, tidak ada penulisan langsung ke repository dari browser tanpa mekanisme otentikasi GitHub.

## Pemeriksaan massal per bab

Bagian **Status Bab** menampilkan jumlah final bahasa Indonesia dan Inggris secara terpisah, serta jumlah teks Inggris yang belum tersedia. Pemeriksa dapat memilih **Indonesia & Inggris**, **Indonesia saja**, atau **Inggris saja**, lalu mengajukan finalisasi atau review ulang seluruh bab dengan satu issue.

- Pengajuan finalisasi dinonaktifkan jika ada draf lokal yang belum diajukan atau bahasa yang dipilih belum lengkap pada salah satu pasal.
- Issue massal berisi daftar periksa seluruh ID pasal; pengelola tetap wajib mengecek setiap item. **Satu klik bukan persetujuan otomatis untuk seluruh bab.**
- Status resmi menjadi final hanya setelah entri tiap pasal dikomit dan di-merge ke `dist/sishu-review-status.json`, beserta snapshot lengkap dan jejak pemeriksaan (`reviewed_by`, `reviewed_at`, `source_issue`).
- Jika hanya satu bahasa disetujui, terjemahan lain tetap pada status sebelumnya.
- Navigasi pasal menyediakan filter Semua, Perlu review, Sebagian final, dan Final kedua bahasa.

Validasi otomatis: `node tools/audit_review_status.js` dan `node --test tests/editorial-review.test.js`. Workflow `.github/workflows/editorial-review.yml` memeriksa perubahan pada pull request sebelum digabungkan.
