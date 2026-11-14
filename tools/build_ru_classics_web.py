#!/usr/bin/env python3
"""Build the offline Alpha reader asset with source-faithful English by passage.

MATAKIN Chinese, Indonesian, pinyin and passage IDs remain untouched.
A Legge source unit spanning multiple MATAKIN passages is never copied to
each passage. Its explicitly curated, losslessly reconcilable source slices
are loaded from a pinned editorial split overlay; missing slices fail the build.
"""
import argparse
import hashlib
import json
from pathlib import Path

SOURCE_SHA256 = "7dddd5ca9a20491a7f5b289fa2380c3960df696b926da71653af730d84069f12"
EXPECTED_BOOKS = ["daxue", "zhongyong", "lunyu", "mengzi"]
EXPECTED_PASSAGES = 965
EXPECTED_CHAPTERS = 78
EXPECTED_EMBEDDED = 246
EXPECTED_MAPPED = 719
EXPECTED_SHARED_UNITS = 24
EXPECTED_SPLIT_PASSAGES = 93


def git_blob_sha1(raw: bytes) -> str:
    """Recreate Git blob SHA-1 so split rules are bound to exact alignment."""
    return hashlib.sha1(b"blob " + str(len(raw)).encode("ascii") + b"\0" + raw).hexdigest()


def source_english_by_passage(aligned: dict, splits: dict, valid_ids: set[str]) -> dict[str, str]:
    """Create one and only one original Legge excerpt for each aligned passage.

    A multi-ID alignment needs exactly one distinct source-conserving excerpt
    per ID. Every original byte of the English string must be assigned once.
    """
    if aligned.get("schema") != "kitab-ru.english-alignment.v1":
        raise ValueError("Unsupported English alignment schema")
    if splits.get("schema") != "kitab-ru.english-passage-splits.v1":
        raise ValueError("Unsupported English split schema")
    indexed = {}
    for group in splits.get("entries", []):
        key = group.get("alignment_id")
        if not isinstance(key, str) or key in indexed:
            raise ValueError("Invalid/duplicate split group: " + str(key))
        indexed[key] = group

    english = {}
    multi_seen = set()
    split_ids = set()
    for entry in aligned.get("entries", []):
        ids = entry.get("indonesian_passage_ids", [])
        segments = entry.get("english_segments", [])
        original = [segment.get("text") for segment in segments]
        if (not ids or not isinstance(ids, list) or
                not original or not all(isinstance(s, str) and s.strip() for s in original) or
                not entry.get("source_url")):
            raise ValueError("Incomplete English alignment: " + str(entry.get("id")))
        if len(ids) == 1:
            assignments = {ids[0]: "\n\n".join(original)}
        else:
            eid = entry.get("id")
            multi_seen.add(eid)
            rule = indexed.get(eid)
            if not rule or len(original) != 1:
                raise ValueError("Unsplit shared Legge source: " + str(eid))
            parts = rule.get("passage_texts")
            if not isinstance(parts, dict) or list(parts) != ids:
                raise ValueError("Incorrect passage IDs/order in shared source: " + str(eid))
            if any(not isinstance(parts[id], str) or len(parts[id].strip()) < 10 for id in ids):
                raise ValueError("Missing/empty split source for " + str(eid))
            if "".join(parts[id] for id in ids) != original[0]:
                raise ValueError("Split source differs from original Legge source: " + str(eid))
            assignments = parts
            split_ids.update(ids)
        for passage_id, text in assignments.items():
            if passage_id not in valid_ids or passage_id in english:
                raise ValueError("Invalid/repeated English mapping: " + passage_id)
            english[passage_id] = text.strip()

    if multi_seen != set(indexed):
        raise ValueError("Missing or extra shared Legge source groups")
    if len(multi_seen) != EXPECTED_SHARED_UNITS or len(split_ids) != EXPECTED_SPLIT_PASSAGES:
        raise ValueError("Shared English coverage changed; verify all split rules before releasing")
    return english


def build(source: Path, alignment: Path, splits: Path, output: Path) -> None:
    actual_sha = hashlib.sha256(source.read_bytes()).hexdigest()
    if actual_sha != SOURCE_SHA256:
        raise ValueError(f"Unexpected content checksum: {actual_sha}")
    alignment_raw = alignment.read_bytes()
    bundle = json.loads(source.read_text(encoding="utf-8"))
    aligned = json.loads(alignment_raw)
    split_data = json.loads(splits.read_text(encoding="utf-8"))
    if split_data.get("source_alignment_blob_sha") != git_blob_sha1(alignment_raw):
        raise ValueError("Split rules do not match pinned original alignment blob")
    if bundle.get("schema") != "ru-classics.content.v1" or bundle.get("collection") != "sishu":
        raise ValueError("Unsupported content bundle")
    if bundle.get("books") != EXPECTED_BOOKS:
        raise ValueError("Unexpected book list")
    chapters = bundle.get("chapters", [])
    passages = [p for chapter in chapters for p in chapter.get("passages", [])]
    passage_ids = [p["id"] for p in passages]
    if len(chapters) != EXPECTED_CHAPTERS or len(passages) != EXPECTED_PASSAGES:
        raise ValueError("Incomplete Si Shu package")
    if len(set(passage_ids)) != EXPECTED_PASSAGES:
        raise ValueError("Duplicate passage IDs")

    english = source_english_by_passage(aligned, split_data, set(passage_ids))
    embedded = 0
    mapped = 0
    for passage in passages:
        existing = passage.get("translation_english", "")
        if isinstance(existing, str) and existing.strip():
            if passage["id"] in english:
                raise ValueError("English mapping overlaps embedded text: " + passage["id"])
            embedded += 1
        else:
            text = english.get(passage["id"], "")
            if not text:
                raise ValueError("No English for " + passage["id"])
            passage["translation_english"] = text
            mapped += 1
    if embedded != EXPECTED_EMBEDDED or mapped != EXPECTED_MAPPED:
        raise ValueError(f"Unexpected coverage: embedded={embedded} mapped={mapped}")

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(bundle, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(
        f"Alpha package: {len(chapters)} chapters, {len(passages)} passages; "
        f"English embedded={embedded}, distinct mapped={mapped}, "
        f"shared units={EXPECTED_SHARED_UNITS}, source and splits verified"
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--alignment", required=True, type=Path)
    parser.add_argument("--splits", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    build(args.source, args.alignment, args.splits, args.output)
