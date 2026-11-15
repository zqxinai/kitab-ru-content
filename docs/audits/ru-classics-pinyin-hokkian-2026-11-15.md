# Audit Pinyin–Hokkian Ru Classics — 15 November 2026

**Lingkup:** 4 kitab Si Shu, 78 bab, 965 pasal. Ini adalah *audit inventaris dan penyajian nama/istilah*, **bukan** sertifikasi filologis seluruh isi atau pernyataan bahwa semua Hokkian telah teridentifikasi. Sumber Indonesia MATAKIN 2011 tetap arsip dasar; foto MATAKIN 2012 menjadi saksi untuk bagian yang tersedia. Jangan mengubah status Final secara otomatis.

## Perubahan yang sudah diterapkan
- Pembaca menggunakan overlay `RuReading.normalize(text,id)`. `translation_indonesian` sumber tidak ditimpa.
- 46 pola frasa bergelar yang terverifikasi dipasangkan secara aman, termasuk nama negara, raja, dan dinasti. Pola dibatasi kata/gelar untuk mencegah salah cocok dengan kata Indonesia biasa (contoh *siang hari*).
- 16 jenis ejaan nama pribadi baru dicocokkan dengan Hanzi dalam pasal terkait, misalnya `公都子 Gongduzi – Kongtocu`, `告子 Gaozi – Kocu`, `高子 Gaozi – Koocu`, `樂正子 Yuezhengzi – Gakcingcu`, `白圭 Bai Gui – Pik-kwi`, `許行 Xu Xing – Hi Hing`, dan `子產 Zichan – Cu-san`.
- Beberapa pasangan **wajib kontekstual**: `陽虎 Yang Hu – Yang Ho` tidak sama dengan `陽貨 Yang Huo – Yang Ho`; `晉 Jin` bukan `秦 Qin`; `儀 Yi` bukan `虞 Yu`; `商 Shang` bukan `襄 Xiang`.
- Mengzi III A:3 ayat 10: istilah sekolah `庠 Xiang – Siang`, `序 Xu – Si`, `學 Xue – Hak`, `校 Xiao – Hau`, beserta dinasti, telah dilengkapi.
- `太王 Tài Wáng` juga dapat ditulis `大王`; pengenal Raja Thai kini `Taiwang – Thai`, bukan `Da Wang – Thai`. Rujukan: [MOE Taiwan](https://dict.revised.moe.edu.tw/dictView.jsp?ID=49943&la=0&powerMode=0).
- `費` pada `費惠公` di Mengzi X B:3 dibaca **Bi** sesuai catatan Zhu Xi `費音祕`, bukan Fei. Rujukan: [Mengzi Ji Zhu](https://www.shidianguji.com/zh/book/NGJ892411999032550228537/chapter/1lqfuit38cmcu).
- `貉` pada Mengzi VI B:10 adalah kelompok manusia utara, dibaca **Mo**, berbeda dari bacaan nama hewan **He**. Rujukan: [CText / kamus](https://ctext.org/dictionary.pl?char=%E8%B2%89&if=gb).
- `魏文侯` pada keterangan historis Mengzi III B:7 memastikan `Negeri Wei – Gwi`, walaupun nama Wei muncul di anotasi dan bukan Hanzi ayat inti. Rujukan: [孟子纂疏](https://zh.wikisource.org/zh-hans/%E5%AD%9F%E5%AD%90%E7%BA%82%E7%96%8F_%28%E5%9B%9B%E5%BA%AB%E5%85%A8%E6%9B%B8%E6%9C%AC%29/%E5%8D%B7%E5%85%AD).

## Pengujian reproduktif
- `node --test tests/ru-classics-reading-normalization.test.js tests/ru-classics-reading-corpus.test.js`
- `node tools/audit_ru_romanization.cjs --json` menghasilkan inventaris kandidat nama bergelar lengkap dengan ID pasal. **Nol kandidat tersisa dalam pola nama bergelar yang dipindai** setelah verifikasi dan pengecualian positif palsu (`Negeri Kun` bagian dari `Kun Yi – Khun I`; `Negeri Tengah` bahasa Indonesia; `Rajamuda Xuan` sudah Mandarin).
- `node ru-classics/tests/smoke.cjs` dijalankan setelah fixture `ru-classics/data/sishu.json` dibangun.
- Pada CI run [#17](https://github.com/zqxinai/kitab-ru-content/actions/runs/43707494837), **12 tes lulus, 0 gagal**; semua 965 pasal diperiksa; 236 tampilan pasal berbeda dari teks arsip karena overlay yang disengaja; pembaca UI smoke test lulus.
- Publikasi GitHub Pages setelah commit tersebut juga berhasil: [deployment](https://github.com/zqxinai/kitab-ru-content/actions/runs/43707494844).

## Batas pembuktian / pekerjaan editorial
- **Nol kandidat nama bergelar ≠ nol Hokkian di seluruh naskah.** Pola pemindai tidak bisa mengenali semua nama tanpa gelar, istilah ritual, atau varian ejaan. Hal ini telah dibuktikan oleh ditemukannya 16 ejaan nama pribadi setelah pola bergelar dinyatakan bersih. Inventaris luas masih harus ditingkatkan dan daftar glosarium tetap diperiksa berdasarkan Hanzi.
- Perbedaan cetakan fisik MATAKIN 2012 belum terfoto lengkap; hasil tampilan yang bersandar pada sumber Hanzi dan anotasi tetap berbeda dari klaim *sama persis dengan cetakan*.
- Foto MATAKIN harus tetap menjadi bukti ketika ada varian; komentar Zhu Xi dipakai untuk mengidentifikasi nama yang tidak muncul dalam teks inti.
- Persetujuan editorial tetap terpisah dari kelulusan CI. Jangan menyematkan status `Final` hanya karena regex dan tes berhasil.

Kebijakan sumber: [source-policy.md](../source-policy.md). Modul normalisasi: [reading-normalization.js](../../ru-classics/reading-normalization.js).