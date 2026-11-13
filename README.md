# Kitab Ru · Koleksi Naskah dan Ruang Editorial

Repository ini menyimpan naskah kitab klasik Ru untuk aplikasi Kitab Ru, termasuk Si Shu, beserta ruang pemeriksaan terjemahannya.

## Buka Ruang Editorial

**https://zqxinai.github.io/kitab-ru-content/editor/**

Editor dirancang untuk pemeriksa terjemahan, bukan pengelola berkas. Naskah dibuka **langsung dan otomatis dari koleksi GitHub**, tanpa perlu mengunduh atau memasukkan berkas.

### Panduan untuk tim

1. **Pilih kitab**: Da Xue, Zhong Yong, Lun Yu, atau Mengzi.
2. **Pilih bab dan pasal**, atau cari Hanzi/kata Indonesia/Inggris.
3. **Baca berdampingan**: Hanzi asli dengan pinyin, teks Indonesia, dan teks Inggris yang tersedia.
4. Jika ada koreksi, tekan **Sunting terjemahan**. Ubah teks seperlunya, sertakan alasan serta rujukan.
5. Tekan **Ajukan perbaikan**. Masuk dengan akun GitHub untuk mengirimkan usulan. Pengelola memeriksa dan menyetujui koreksi sebelum mengubah naskah resmi.

Draf disimpan di browser perangkat masing-masing dan tidak otomatis tersinkron antarperangkat. Riwayat pengajuan dapat diakses lewat **Riwayat usulan**. Tidak ada publikasi otomatis ketika seseorang mengajukan koreksi.

**Penting tentang akses:** GitHub Pages dan daftar usulan dalam repository ini terbuka untuk publik. Pengguna GitHub lainnya juga bisa mengajukan usulan. Hanya pengelola dengan izin penulisan repository yang bisa menerbitkan perubahan. Agar hanya anggota tim yang boleh mengakses formulir dan mengirim koreksi tanpa melalui GitHub, diperlukan login dan layanan perantara terlindungi (belum tersedia pada editor statis ini). Jangan memasukkan informasi pribadi atau rahasia dalam usulan publik.

### Pedoman pemeriksaan

- Bandingkan Hanzi dan pinyin dengan terjemahan Indonesia MATAKIN serta terjemahan Inggris James Legge.
- Cocokkan berdasarkan teks Hanzi, bukan nomor urut saja; pembagian pasal edisi sumber bisa berbeda.
- Terjemahan Inggris yang muncul pada draf belum otomatis selesai diperiksa.
- Istilah Tian tidak selalu diterjemahkan God oleh James Legge. Kata-kata Legge tidak diganti tanpa memberi label bahwa itu keputusan redaksional tersendiri.
- Simpan rujukan dan alasan setiap perbaikan.

## Asal Hanzi dan batas audit

**Hanzi dalam proyek tidak berasal dari PDF MATAKIN.** Terjemahan Indonesia dan penomoran merujuk PDF MATAKIN, sedangkan berkas Markdown yang menjadi dasar paket JSON sebelumnya mengambil Hanzi dari JSON publik `hanzhaodeng/chinese-ancient-text`, dengan konversi ICU Hans-Hant dan pinyin ICU Han-Latin. Hal ini didokumentasikan di [Catatan asal Hanzi](docs/hanzi-provenance.md). Berkas sumber asal belum diaudit filologis per karakter. Jangan menyebutnya “Hanzi MATAKIN” atau memperlakukan perbedaan korpus dengan Legge otomatis sebagai kesalahan MATAKIN.

## Koleksi sumber

- [Naskah bacaan Si Shu](dist/sishu-content.json)
- [Naskah per bab](sishu/chapters/)
- [Catatan edisi dan sumber](sishu/manifest.json)
- [Katalog kitab](catalog.json)
- [Ketentuan hak cipta](COPYRIGHT.md)

Pengajuan koreksi tidak secara otomatis mengubah naskah di atas. Pengelola harus menyetujui, memperbarui sumber, dan menerbitkan kembali versi yang sudah diperiksa.

## Pemeriksaan sebelum penerbitan

Website menjalankan pemeriksaan struktur naskah, navigasi, penyuntingan, draf, pencarian, dan pengajuan koreksi dengan pengujian otomatis dari folder editor/tests. Pengujian mekanis bukan pengganti pemeriksaan ketepatan terjemahan.

## Hak cipta

Terjemahan MATAKIN, catatan dan anotasi memiliki pemegang hak masing-masing. Repository publik tidak secara otomatis memberikan hak untuk menyebarluaskan ulang seluruh terjemahan dengan lisensi bebas.
