# Pemetaan Pasal MATAKIN ↔ James Legge

Editor membaca `dist/sishu-english-alignment.json` untuk padanan eksplisit berdasarkan rentang Hanzi. Berkas ini tidak mengganti penomoran MATAKIN ataupun James Legge.

Satu entri dapat menghubungkan banyak `indonesian_passage_ids` dengan banyak `english_segments`, dan satu pasal Indonesia dapat muncul di lebih dari satu entri untuk pemetaan parsial. Gunakan ID passage stabil yang sudah ada di `dist/sishu-content.json`.

## Struktur entri

```json
{
  "id": "unique-alignment-id",
  "indonesian_passage_ids": ["existing-passage-id"],
  "english_segments": [
    {
      "legge_ref": "Legge edition book/chapter/section reference",
      "text": "Exact source text, verified against cited edition"
    }
  ],
  "hanzi_span": "Full matching traditional Hanzi for the unit",
  "source_url": "Direct source/scan URL",
  "status": "draft",
  "review_note": "Where the two passage boundaries differ"
}
```

Status `draft` berarti belum diverifikasi; hanya `verified` setelah pemeriksa mencocokkan **seluruh** cakupan Hanzi, memeriksa urutan, dan mengonfirmasi kutipan/sumber Inggris. Jangan mengisi status verified otomatis hanya karena nomor pasal sama. Jangan menggandakan segmen Inggris yang sama pada satu pembacaan; jika ada pemetaan parsial, pecah menjadi unit Hanzi paling kecil yang sah.

## Tahapan migrasi

1. Pertahankan 246 terjemahan Inggris Lun Yu yang sudah ada sebagai **draf** dan jangan menandainya verified otomatis.
2. Ambil teks Inggris dari edisi James Legge yang jelas sumber dan hak penggunaannya.
3. Bangun indeks unit sumber Inggris per kitab, lalu cocokkan rentang Hanzi dengan teks Indonesia.
4. Masukkan entri pemetaan satu per satu atau dalam batch teruji; audit missing/duplicate/out-of-order.
5. Setelah seluruh 965 pasal diperiksa, baru naikkan status kelengkapan katalog dan paket.

Status saat ini: 11 pasal Da Xue sudah memiliki draf padanan Inggris eksplisit dalam `dist/sishu-english-alignment.json` dan 246 draf Inggris Lun Yu tetap berada pada paket utama. Ada 708 pasal yang masih belum memiliki terjemahan Inggris. Seluruh pemetaan tetap memerlukan verifikasi editorial. Lihat `docs/editorial-finalization.md` untuk alur penyetujuannya.
