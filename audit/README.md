# Ru Classics — Audit Studio

Dashboard: setelah perubahan disetujui dan terbit di GitHub Pages, buka
https://zqxinai.github.io/kitab-ru-content/audit/

## Batas keamanan editorial

- Baca-saja untuk naskah: mengambil sumber dari dist/sishu-content.json, peta dist/sishu-english-alignment.json, metadata bab 2012, dan dist/sishu-review-status.json. Tidak mengubah Hanzi, pinyin, terjemahan MATAKIN, Legge, maupun komentar Zhu Xi.
- Beda status: Draft = tersedia tanpa approval; Perlu Review = belum tersedia atau masalah alignment terdeteksi; Final = hanya jika registry yang telah digabung menyimpan reviewer, tanggal, issue, snapshot Hanzi dan Inggris yang cocok dengan teks saat ini.
- Hanzi terverifikasi: tidak diasumsikan dari adanya Hanzi. Harus ada bukti registry resmi (hanzi, hanzi_status, atau hanzi_audit = verified/final dan snapshot cocok).
- Catatan discrepancy: interpretive comparison tetap terbaca sebagai perbedaan tafsir atau bacaan; bukan ralat otomatis pada MATAKIN.
- Pengesahan lokal bukan Final resmi: tombol Setujui & ajukan Final menyimpan proposal lokal dengan fingerprint naskah. Kirim melalui Issue GitHub, kemudian lakukan audit dan merge registry secara terpisah. GitHub Pages tidak menyimpan data review lokal antargawai.
- Bukti asal: nomor halaman 2012 adalah metadata bab; tidak membuktikan teks per pasal cocok dengan edisi 2012.
- Regresi rilis: 7 checklist mencakup Hanzi, pinyin, terjemahan MATAKIN, alignment Inggris, pemisahan komentar, editor web, dan paket Android. Checklist dan proposal batal berlaku jika fingerprint naskah berubah.
- Jangan otomatis terbitkan: pengelola harus meninjau issue, menyiapkan PR perubahan registry, menjalankan pengujian, serta mengecek editor dan paket Android sebelum merge dan rilis.

## Cara pakai

1. Pilih kitab di sidebar; daftar berisi maksimal 10 pasal per kelompok, pilih batch dengan panah/jump.
2. Cari berdasarkan ID, Hanzi, pinyin, Indonesia atau Inggris; gunakan filter status Inggris/Hanzi.
3. Buka satu pasal untuk membandingkan 3 kolom dan membaca anotasi, provenance, riwayat dan discrepancy.
4. Jika ada ketidaksesuaian nyata, isi catatan dan sumber; jangan otomatis mengganti naskah.
5. Untuk pengajuan Final, isi reviewer dan bukti, centang seluruh pemeriksaan lalu pilih Setujui & ajukan Final. Lanjutkan dengan Buat usulan GitHub.
6. Ekspor JSON untuk menyimpan pekerjaan dan impor lagi pada browser lain. Hanya catatan dengan fingerprint pasal yang identik diterima.

## Struktur modular

- audit/index.html — UI dan kontrol aksesibilitas
- audit/style.css — tema cyan pastel responsif
- audit/app.js — loader, model stabil by passage ID, status registry, metadata, batch, audit lokal, approval gate
- audit/tests/regression.mjs — pengecekan struktur data asli dan antarmuka
- .github/workflows/audit-regression.yml — CI pull request

Untuk menambah batch, tambahkan pasal di data kanonis sesuai kontrak ID yang stabil lalu bangun ulang dist melalui pipeline proyek. Dashboard membaca semua pasal baru tanpa memuat ulang review untuk ID yang sudah valid. Jangan menggabungkan dua pasal hanya karena nomor edisi Inggris/Indonesia berbeda.

## Menjalankan pemeriksaan

Di root repository: node audit/tests/regression.mjs

Tes memeriksa baseline 965 pasal / 78 bab, keunikan ID, keberadaan data utama, hubungan alignment dan registry, struktur DOM dan sintaks JavaScript. Audit filologis dan keselarasan terjemahan tetap membutuhkan peninjauan manual.

## Privasi

Data audit disimpan pada localStorage perangkat. GitHub Issues bersifat publik; jangan mengirim identitas atau dokumen pribadi yang tidak ingin dipublikasikan. Snapshot usulan tidak boleh digunakan sebagai registry Final. Tidak ada token GitHub atau kredensial yang disimpan dashboard.
