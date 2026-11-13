# Da Xue Bab V:1 — rekaman foto MATAKIN 2012, pemisahan pelengkap Zhu Xi

**ID internal:** `sishu.daxue.06.01`, Bab V — Meneliti Hakekat Tiap Perkara.

## Kebijakan sumber dan keterbatasan
**MATAKIN 2012** adalah edisi utama proyek; Hanzi dan struktur bab mengikuti *rekaman pembacaan foto* yang terdokumentasi dalam [audit sebelumnya](../sishu-textual-variants.md). Foto asli **tidak diperiksa ulang dalam batch ini**, dan nomor halaman cetak tidak terlihat dalam bukti yang tercatat. PDF lengkap MATAKIN 2011 tetap sumber terjemahan Indonesia tanpa penyuntingan kalimat; Zhu Xi, 《四書章句集註》 WYG hanya pembanding Hanzi, sedangkan Legge hanya pembanding Inggris.

**Sumber pembanding:** Kanripo `KR1h0015_000.txt`, `KR1h0015_WYG_000-11b` sampai `KR1h0015_WYG_000-12a`, [commit tetap 84c6b2c5093c57ae5d41c60a73c02323d2420ef0](https://github.com/kanripo/KR1h0015/tree/84c6b2c5093c57ae5d41c60a73c02323d2420ef0).

## Ralat yang diterapkan
| Bagian | Sebelumnya | Setelahnya | Alasan |
| --- | --- | --- | --- |
| Pelengkap (paragraf kedua) | `唯於理有未窮` | `惟於理有未窮` | Foto MATAKIN 2012 terdokumentasi; WYG cocok, pinyin wéi tetap |
| Pelengkap (paragraf kedua) | `故其知又不盡也` | `故其知有不盡也` | Foto MATAKIN 2012 terdokumentasi; WYG cocok, pinyin yòu → yǒu |
| Paragraf pertama | `此謂知本，此謂知之至也。` | **Tidak diubah** | Diterbitkan dalam susunan bab MATAKIN; komentar Zhu Xi menyebut `此謂知本` sebagai `衍文` (catatan pembanding, bukan dasar penghapusan) |
| Paragraf kedua | `所謂致知在格物者…` | **Teks dipertahankan dan diberi label** | Pelengkap Zhu Xi yang mengambil maksud Chengzi, bukan bagian kitab dengan status historis yang sama seperti kalimat sebelumnya |

## Pemisahan bukti secara eksplisit
- `textual_sections` memberi label *redaksi tercetak MATAKIN 2012* dan *teks pelengkap Zhu Xi berdasarkan maksud Chengzi*, tanpa mengklaim autentisitas autograf tiap karakter pada redaksi pertama.
- `editorial_annotations` menyimpan pengantar yang direkam dari foto: `蓋釋格物，致知之義，而今亡矣。間嘗竊取程子之意以補之曰：`. Saksi WYG membaca `閒嘗` alih-alih `間嘗`: **perbedaan ini dicatat, tidak dihapus atau dinormalisasi diam-diam**.
- Editor menempatkan label kedua bagian dan pengantar Zhu Xi di luar teks Ruby serta sebelum paragraf pelengkap. Catatan penyunting bukan teks utama kitab.
- Terjemahan Indonesia MATAKIN tetap verbatim dengan FNV-1a UTF-16 `a2e010d0`; 78 bab / 965 pasal, ID stabil, registry Final kosong. Belum ada alignment Inggris pasal ini, tidak membuat kutipan Legge atau Final.

## Verifikasi
Tes `tests/daxue-matakin-2012-supplement.test.js` memeriksa koreksi karakter/pinyin, checksum, struktur, metadata serta dist. Smoke interaktif `editor/tests/daxue-section-smoke.mjs` memeriksa penampilan pemisahan naskah dan pengantar di editor. Tidak mengklaim audit keseluruhan 965 pasal selesai.
