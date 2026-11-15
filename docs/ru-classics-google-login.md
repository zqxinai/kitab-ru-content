# Login Google untuk Ru Classics — panduan singkat

**Status 15 November 2026:** konfigurasi Firebase Web App publik untuk proyek `ru-classics` sudah dimasukkan ke `ru-classics/firebase-config.js`, dan kode autentikasi Google serta persetujuan editor sudah disiapkan. Ini **bukan bukti sistem telah live**: Google provider, Firestore Rules produksi, login browser, hasil deployment, dan admin pertama masih harus diverifikasi. Pembaca dapat membaca tanpa login.

## Dua alamat yang saat ini tersedia

- `/editor/`: **ruang audit editorial lama** yang mengirim usulan melalui GitHub Issues. Tombol "Konfirmasi final" hanya mengirim permintaan; tidak menerbitkan Final.
- `/ru-classics/#editor`: **ruang kolaborasi baru** yang memakai Google Sign-In dengan Firestore. Hanya editor yang disetujui dapat mengirim usulan; admin memutuskan akun dan revisi. Revisi approved menjadi overlay di website pembaca, **belum otomatis** masuk file sumber, status Final MATAKIN, maupun APK.

Keduanya belum digabung menjadi satu ruang kerja; jangan menyamakan status permohonan GitHub dengan status akun Firestore.

## Pengaktifan

1. Buat Firebase project atau gunakan yang sudah dipilih untuk Ru Classics; aktifkan Google Sign-In di **Authentication → Sign-in method → Google**.
2. Tambahkan domain `zqxinai.github.io` pada Firebase Authentication **Authorized domains**; gunakan domain tanpa path.
3. Buat Firestore dan deploy security rules **yang sama** dengan berkas `firebase/firestore.rules` di repositori `zqxinai/Ru-Classics`, sebelum login editor dibuka. Dilarang menggunakan `allow read, write: if true`.
4. Konfigurasi **Firebase Web App publik** untuk `ru-classics` sudah ada di `ru-classics/firebase-config.js` pada repositori `zqxinai/kitab-ru-content`. Variabel GitHub Actions `RU_FIREBASE_CONFIG_JSON` **opsional** dan akan menimpa konfigurasi tersebut jika ditetapkan; bila digunakan harus menunjuk project `ru-classics` yang sama. Bila repositori `Ru-Classics` juga akan menayangkan website, samakan project Firebase secara eksplisit.
5. Perubahan berkas `ru-classics/**` memicu workflow **Publish Kitab Ru Editor (GitHub Pages)**; jalankan manual jika diperlukan. Konfirmasikan workflow berhasil dan `firebase-config.js` pada website menunjuk proyek yang benar. Pemeriksaan workflow hanya membuktikan paket terbentuk; belum membuktikan Google login atau rules berfungsi secara nyata.
6. Login Google pertama menciptakan profil `pending`. Pemilik proyek memverifikasi Firebase Auth UID-nya dan memberikan `role: admin` **secara manual** lewat Firestore Console. Tidak ada bootstrap admin berdasarkan email yang diketik pengguna.
7. Uji benar-benar melalui browser dan Firebase Emulator: guest tidak membuat akun; pending tidak membuat usulan; editor hanya mengirim `pending`; admin dapat menyetujui/menolak; usulan `approved` terlihat publik; akun lain tidak membaca usulan `pending`.

**Catatan keamanan:** Firebase Web App config boleh disertakan di JavaScript publik. Jangan pernah menaruh OAuth Client Secret, private key, Firebase Admin SDK credentials, service-account JSON, atau token sesi di variabel ini.

**Khusus edisi MATAKIN:** persetujuan usulan untuk tampilan website **tidak** berarti pengesahan Final dan tidak mengubah teks otoritatif; perubahan ke sumber resmi tetap melalui audit editorial dan pull request tersendiri.
