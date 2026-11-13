# Ru Classics — Tahap 2: pembacaan kontekstual Hanzi dan pinyin (14 November 2026)

## Lingkup dan bukti
Audit ini melanjutkan percakapan *Pencocokan Bab IX*, berlandaskan kebijakan [pinyin kontekstual](ru-classics-pinyin-context-policy-2026-11-14.md), saksi MATAKIN 2012 yang sudah difoto dan ditelaah, serta sumber Zhu Xi untuk pembanding. Teks **MATAKIN Indonesia tidak diterjemahkan ulang**, Hanzi klasik tidak diganti hanya karena perbedaan digital, dan status *Final* tidak disematkan otomatis.

Paket distribusi dasar dibaca secara utuh: **78 bab / 965 pasal** dan **56.759 token Hanzi ber-pinyin**. Penapisan struktural menemukan nol token Ruby kosong, nol token Hanzi Ruby berisi lebih dari satu aksara, dan tidak ada ID yang hilang dari matriks penyaringan Zhu Xi 965 pasal.

## Perubahan terbukti
| Jenis | Bukti kebahasaan | Putusan | Banyak token | Berkas sumber |
| --- | --- | --- | ---: | ---: |
| `地` dibaca `de` dalam teks klasik | `天地` (langit-bumi), `土地` (tanah), `地利` (keuntungan medan), `地方` (wilayah), `地道` (jalan bumi); seluruh 72 contoh adalah nomina **dì**, bukan partikel adverbial modern | `de → dì` | **72** | **25** |
| `與` sebelum tanda tanya/seru, berfungsi sebagai partikel tanya atau penegasan akhir (≈ `歟`) | Contoh `其斯之謂與？`, `非崇德與？`, `歸與！`. Bandingkan kasus foto Zhong Yong IX:2 dan penjelasan klasik `與平聲` | `yǔ → yú` pada **104** contoh yang tidak memiliki pengecualian leksikal | **104** | **29** |

Bacaan `配地` **dì** pada Zhong Yong XXV:4 sudah dikoreksi sebelum audit ini dan tetap dipertahankan. Demikian pula tiga `與` sebagai partikel tanya Zhong Yong IX:2 tetap **yú** walau foto MATAKIN 2012 mencetak **yǔ**.

## Pengecualian yang sengaja tidak diubah
- Lun Yu VII:11 `則誰與？`: `與` bermakna “bersama siapa”, bukan partikel tanya `歟`; tetap **yǔ**.
- Lun Yu XVIII:6 `而誰與？`: fungsi verba/relasi “bersama siapa”; tetap **yǔ**.
- Lun Yu XVII:1 `歲不我與！`: idiom “waktu tidak menungguku”; `與` bukan partikel tanya; tetap **yǔ**.
- Lun Yu XVIII:8 `伯夷、叔齊與！`: konstruksi bersifat ambigu sebagai pembacaan edisi; **yǔ** ditahan untuk pemeriksaan filologis khusus, bukan dinyatakan telah terbukti final.

Sebanyak **108** `與` berkode **yǔ** awalnya ditemukan tepat sebelum tanda tanya/seru; **104** diubah sesuai fungsi, dan **empat** dikecualikan. Tiga `與` lain sudah benar **yú** dari audit IX:2 sebelumnya.

## Perbaikan keterkaitan data Legge (tanpa mengganti teks terjemahan)
Tes editorial menunjukkan dua `hanzi_span` dalam `dist/sishu-english-alignment.json` tertinggal setelah audit foto MATAKIN 2012, meskipun teks sumber bab sudah benar:
- `legge-zhongyong-10-02`: sesuaikan dua tanda baca `， → ？` pada `南方之強與` dan `北方之強與` sesuai Zhong Yong IX:2.
- `legge-zhongyong-26-01`: samakan penempatan tanda baca `博厚配地，高明配天，悠久無疆。` dengan Zhong Yong XXV:4.

Perubahan hanya pada metadata `hanzi_span` pencocokan Indonesia–Inggris, **bukan** `english_segments[].text` (teks Inggris James Legge), `source_hanzi_simplified`, Hanzi sumber, atau terjemahan MATAKIN.

## Pelaksanaan & pengaman
- Perubahan hanya pada properti `pinyin` dalam `sishu/chapters/{zhongyong,lunyu,mengzi}/*.json`.
- Tidak mengubah karakter Hanzi, terjemahan Indonesia MATAKIN, terjemahan James Legge, identitas bab/pasal, sumber anotasi, atau `editorial_status`.
- Tes baru: `tests/contextual-pinyin-stage2.test.js` memeriksa angka 78/965, `地`, `與`, empat pengecualian, dan kesetaraan sumber-versus-distribusi dengan token yang sedang diperbaiki dinormalkan khusus untuk pengujian.
- Workflow `.github/workflows/content-audit.yml` menjalankan tes di PR dan `main`. Workflow `build-sishu.yml` yang sudah ada meregenerasi `dist/sishu-content.json` secara deterministik saat sumber `sishu/**` bergabung ke `main`. Setelah build, SHA dan deploy perlu diperiksa terpisah.

## Batas kesimpulan
Penapisan otomatis lengkap **bukan** sertifikasi bahwa seluruh 56.759 bacaan pinyin telah dicocokkan satu per satu dengan kamus atau semua 965 pasal telah mendapat persetujuan editorial. Kandidat varian Hanzi dari matriks `docs/audits/zhu-xi-wyg-965.json` tetap memiliki riwayat pemeriksaan sendiri. Foto asli MATAKIN 2012 tetap sumber pengesahan edisi bila bentuk grafem diperdebatkan.
