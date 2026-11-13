#!/usr/bin/env python3
"""Build distributable Si Shu JSON package from chapter files.

This is a deterministic data pipeline. It never translates text.
English additions must have an attributed source in each passage.
"""
import hashlib
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "sishu" / "manifest.json"
DIST = ROOT / "dist"
COUNTS = {"daxue": 64, "zhongyong": 129, "lunyu": 512, "mengzi": 260}
CHAPTERS = {"daxue": 11, "zhongyong": 33, "lunyu": 20, "mengzi": 14}

def main():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if manifest.get("schema") != "ru-classics.content.v1":
        raise ValueError("Unsupported schema")
    if manifest.get("review_status") != "unverified-draft":
        raise ValueError("Draft review status required for Android V1")
    if manifest.get("books") != list(COUNTS):
        raise ValueError("Unexpected books or order")
    chapters = []
    chapter_ids = set()
    passage_ids = set()
    by_book_chapters = Counter()
    by_book_passages = Counter()
    english_count = 0
    source_count = 0

    for item in manifest["chapters"]:
        relative = item["path"]
        if not relative.startswith("sishu/chapters/") or ".." in relative.split("/"):
            raise ValueError("Unsafe chapter path: " + relative)
        path = ROOT / relative
        chapter = json.loads(path.read_text(encoding="utf-8"))
        if (chapter["id"], chapter["book"], chapter["index"], len(chapter["passages"])) != (
            item["id"], item["book"], item["index"], item["passages"]
        ):
            raise ValueError("Manifest mismatch: " + relative)
        if chapter["id"] in chapter_ids:
            raise ValueError("Duplicate chapter ID: " + chapter["id"])
        chapter_ids.add(chapter["id"])
        by_book_chapters[chapter["book"]] += 1
        by_book_passages[chapter["book"]] += len(chapter["passages"])
        for passage in chapter["passages"]:
            if passage["id"] in passage_ids:
                raise ValueError("Duplicate passage ID: " + passage["id"])
            passage_ids.add(passage["id"])
            if not passage.get("translation_indonesian", "").strip():
                raise ValueError("Missing Indonesian translation: " + passage["id"])
            if not passage.get("ruby_paragraphs"):
                raise ValueError("Missing source Hanzi/pinyin: " + passage["id"])
            translation_en = passage.get("translation_english")
            if translation_en is not None:
                if not isinstance(translation_en, str) or not translation_en.strip():
                    raise ValueError("Empty English translation: " + passage["id"])
                if not passage.get("translation_english_source"):
                    raise ValueError("English text lacks provenance: " + passage["id"])
                english_count += 1
            source_count += 1
        chapters.append(chapter)

    if by_book_chapters != Counter(CHAPTERS):
        raise ValueError(f"Chapter count mismatch: {by_book_chapters}")
    if by_book_passages != Counter(COUNTS) or source_count != 965:
        raise ValueError(f"Passage count mismatch: {by_book_passages}")
    if english_count != manifest["languages"]["english"]["aligned_passages"]:
        raise ValueError("English source count differs from manifest")
    if len(manifest.get("front_matter", [])) != 2:
        raise ValueError("Expected two Zhu Xi prefaces")

    bundle = {
        "schema": manifest["schema"],
        "collection": manifest["collection"],
        "content_version": manifest["content_version"],
        "review_status": manifest["review_status"],
        "books": manifest["books"],
        "front_matter": manifest["front_matter"],
        "chapters": chapters,
        "english_source_notes": manifest["languages"]["english"],
        "tian_translation_policy": manifest["tian_translation_policy"],
    }
    DIST.mkdir(exist_ok=True)
    target = DIST / "sishu-content.json"
    encoded = json.dumps(bundle, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    target.write_bytes(encoded)
    digest = hashlib.sha256(encoded).hexdigest()
    (DIST / "sishu-content.sha256").write_text(
        digest + "  sishu-content.json\n", encoding="utf-8"
    )
    summary = {
        "schema": bundle["schema"],
        "content_version": bundle["content_version"],
        "review_status": bundle["review_status"],
        "chapters": len(chapters),
        "passages": source_count,
        "english_passages": english_count,
        "needs_english": source_count - english_count,
        "sha256": digest,
        "bytes": len(encoded),
    }
    (DIST / "build-report.json").write_text(
        json.dumps(summary, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
