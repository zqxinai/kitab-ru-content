# Audit ulang ejaan Hokkian dan pasangan Hanyu Pinyin — 15 November 2026

## Ruang lingkup dan keputusan

Audit ini meliputi keempat kitab Si Shu pada repositori, **78 bab dan 965 pasal**
(Da Xue 64, Zhong Yong 129, Lun Yu 512, Mengzi 260). Tujuannya **bukan
mengganti** istilah MATAKIN, melainkan menampilkan **Pinyin – ejaan lama**
secara berdampingan bila identitas Hanzi dapat dibuktikan.

Sumber `sishu/chapters/**/NN.json`, termasuk `translation_indonesian`,
`ruby_paragraphs`, dan teks Inggris, tidak diubah. Semua penambahan hanya
di `ru-classics/reading-normalization.js`. Status editorial tidak dinaikkan
menjadi Final hanya karena CI lulus.

## Hasil terukur

- Baseline sebelumnya (PR #48): 313 tampilan pasal berbeda dari arsip
  setelah penyandingan nama/istilah; audit sebelumnya belum menuntaskan
  nama orang tanpa gelar atau istilah yang berdiri sendiri.
- Setelah koreksi ini: **344 tampilan pasal** memiliki penyandingan (angka
  dari pengujian lengkap GitHub Actions pada 15 November 2026, lintas 965
  pasal). Ini **bukan** persentase pasal yang telah bersertifikasi filologis.
- Pemindai `tools/audit_ru_romanization.cjs`: nol kandidat *terdeteksi*
  nama bergelar, nama tempat, dan nama orang tanpa gelar setelah penyaringan
  positif palsu eksplisit.
- Pemindai independen `tools/audit_legacy_romanization.cjs`: nol kandidat
  ejaan lama berdiri sendiri dari istilah yang sudah dikenal. Tercatat **1
  pola nama ganda di arsip sumber** yang telah ditangani oleh overlay;
  ini bukan izin untuk mengubah naskah sumber.
- **32 pengujian lulus, 0 gagal**; uji antarmuka pembaca juga berhasil.
  CI sekarang gagal otomatis bila salah satu dari dua inventaris 965
  pasal kembali menghasilkan kandidat yang tidak ditangani. Artefak
  inventaris JSON disimpan dalam tiap CI run.

## Contoh penting yang diperiksa menurut Hanzi

| Konteks | Hanzi | Tampilan pembaca |
| --- | --- | --- |
| Mengzi VII B:19 | 貉稽 | Mo Ji – Bik Khee |
| Mengzi III B:2 | 景春, 公孫衍, 張儀 | Jing Chun – King Chun; Gongsun Yan – Kong sun Yan; Zhang Yi – Tio Gi |
| Mengzi VII A:33 | 王子墊 | Dian – Tiam |
| Mengzi IV B:30 | 匡章 | Kuang Zhang – Khongciang |
| Mengzi V A:6 | 益, 啓, 太丁, 外丙, 仲壬, 太甲 | Yi – Ik; Qi – Khee; Tai Ding – Thai ting; Wai Bing – Gwee-ping; Zhong Ren – Tiong-jiem; Tai Jia – Thai-kak |
| Lun Yu III:4 | 林放 | Lin Fang – Liem Hong |
| Lun Yu V:19 | 令尹, 子文, 陳文子 | Lingyin – Ling Ien; Ziwen – Cu-bun; Chen Wenzi – Tien Buncu |
| Lun Yu I:10 | 子禽 | Zi Qin – Cu-khiem |
| Mengzi III A:4 | 陳相, 陳良, 陳辛 | Chen Xiang – Tien Siang; Chen Liang – Tien Liang; Chen Xin – Tien Sien |
| Mengzi V A:7 | 湯 | Tang – Thong, hanya pada nama Raja Tang |
| Da Xue II:4 | 小人 | Xiaoren – Siau Jien |

### Homofon dan kesalahan yang dicegah

1. `晉 Jin` tidak boleh berubah menjadi `秦 Qin` walaupun ejaan lama bisa
   mirip; `陽虎 Yang Hu` tidak sama dengan `陽貨 Yang Huo`.
2. `禹 Yu` tidak sama dengan `夷 Yi`; `益 Yi` dan `伊尹 Yi Yin` juga
   identitas berbeda. Kata `I` satu huruf memerlukan konteks pasal.
3. `公孫 Gongsun` tidak boleh berubah menjadi `Gong Shun` oleh aturan
   global `Sun → Shun`; `孟懿子 Meng Yizi` tidak sama dengan `夷子 Yi Zi`.
4. `樂正子 Yuezhengzi` tidak sama dengan `曾子 Zengzi`.
5. `淇 Qi`, `沂 Yi`, dan `岐 Qi` berbeda walau ejaan lama `Ki`
   dipakai di beberapa tempat.
6. `桐 Tong` sebagai toponim tidak sama dengan `唐 Tang` pada `唐虞`.
   Aturan `Ciu` dan `Thong` global dibatalkan karena memecah nama
   majemuk yang sebelumnya sudah benar.
7. `善哉` (ditampilkan `Shanzai – Siancai`) ditangani hanya pada ayat yang
   cocok; label terminal `SIANCAI` yang merupakan tambahan arsip
   tidak dikira sebagai teks ayat.
8. Frasa Indonesia seperti `Kata-kata`, `istana Salju`, dan
   `daerah Selatankah` bukan ejaan Hokkian; alasan pengecualian
   tempat dinyatakan secara eksplisit di pemindai.

## Makna "selesai" dan batas pembuktian

**Selesai untuk inventaris otomatis yang didefinisikan di atas** berarti
seluruh 965 pasal terbaca, dua pemindai tidak mengembalikan kandidat,
seluruh regresi lulus, dan sumber MATAKIN tidak tertimpa. **Ini tidak
membuktikan tidak ada satu pun nama/istilah Hokkian di luar kosakata
pemindai**; regex tidak dapat menyimpulkan identitas Hanzi untuk semua
frasa tanpa pemeriksaan filologis per token.

Foto fisik cetakan MATAKIN 2012 tidak tersedia lengkap; karena itu
jangan klaim penyalinan pinyin 2012 telah diverifikasi 100%,
jangan secara otomatis mengesahkan status semua ayat sebagai Final,
dan jangan mengganti keputusan varian berdasarkan dugaan.

Panduan sumber: `docs/source-policy.md`, kebijakan pinyin:
`docs/audits/ru-classics-pinyin-context-policy-2026-11-14.md`.
