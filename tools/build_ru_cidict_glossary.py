#!/usr/bin/env python3
"""Build a small Ru Classics Indonesian glossary from CC-CIDICT.

Only terms present in the 965 original Si Shu passages are included.
The source dictionary is copyright CC-CIDICT / Harmony Mandarin contributors,
licensed CC BY-SA 4.0. This derived dictionary data is CC BY-SA 4.0.
The entire scripture corpus and all translations remain untouched.
Source: https://cidict.org/download/
Terms are *modern dictionary headwords*, not authoritative classical exegesis.
"""
import argparse
import hashlib
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

SOURCE_URL = "https://cidict.org/download/u8"
SCHEMA = "ru-classics.cidict-glossary.v1"
LICENSE = "CC-BY-SA-4.0"
MAX_DOWNLOAD = 120_000_000
HEADWORD = re.compile(r"^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+/(.*)/\s*$")
CJK_RANGE = ((0x3400, 0x9FFF), (0xF900, 0xFAFF), (0x20000, 0x323AF))
MAX_HEADWORD_LENGTH = 8


def is_hanzi(char):
    cp = ord(char)
    return any(lo <= cp <= hi for lo, hi in CJK_RANGE)


def corpus_terms(bundle):
    chapters = bundle.get("chapters", [])
    passages = sum(len(chapter.get("passages", [])) for chapter in chapters)
    if len(chapters) != 78 or passages != 965:
        raise ValueError(f"Unrecognized Si Shu corpus: {len(chapters)} chapters, {passages} passages")
    terms = set()
    characters = set()
    for chapter in chapters:
        for passage in chapter["passages"]:
            for paragraph in passage.get("ruby_paragraphs", []):
                seq = []
                def flush():
                    if not seq:
                        return
                    for i in range(len(seq)):
                        for j in range(i + 1, min(len(seq), i + MAX_HEADWORD_LENGTH) + 1):
                            terms.add("".join(seq[i:j]))
                    seq.clear()
                for token in paragraph:
                    text = token.get("traditional", "") if token.get("type") == "ruby" else token.get("value", "")
                    for char in text:
                        if is_hanzi(char):
                            seq.append(char)
                            characters.add(char)
                        else:
                            flush()
                flush()
    return terms, characters


def parse_cidict(lines, relevant):
    """Read CC-CEDICT-like .u8 lines; no definitions are translated or fabricated."""
    matches = {}
    raw_rows = 0
    for raw in lines:
        if not raw or raw.startswith("#"):
            continue
        m = HEADWORD.match(raw)
        if not m:
            continue
        traditional, simplified, pinyin, joined = m.groups()
        raw_rows += 1
        if traditional not in relevant:
            continue
        definitions = [part.strip() for part in joined.split("/") if part.strip()]
        if not definitions:
            continue
        # Retain data as dictionary evidence, not aligned to MATAKIN source pinyin.
        record = {
            "pinyin": pinyin,
            "definitions": definitions[:12],
            "simplified": simplified if simplified != traditional else None,
        }
        existing = matches.setdefault(traditional, [])
        if record not in existing and len(existing) < 6:
            existing.append(record)
    return matches, raw_rows


def fetch_u8(url=SOURCE_URL):
    request = urllib.request.Request(url, headers={
        "User-Agent": "RuClassics/1.0 (+https://github.com/zqxinai/kitab-ru-content)",
        "Accept": "text/plain,application/octet-stream,*/*",
    })
    failure = None
    for attempt in range(2):
        try:
            with urllib.request.urlopen(request, timeout=65) as response:
                data = response.read(MAX_DOWNLOAD + 1)
                if len(data) > MAX_DOWNLOAD:
                    raise RuntimeError("CC-CIDICT download exceeds 120 MB")
                if len(data) < 1_000_000 or b"<html" in data[:4096].lower():
                    raise RuntimeError(f"CC-CIDICT returned non-dictionary content ({len(data)} bytes)")
                return data
        except (OSError, urllib.error.URLError, TimeoutError, RuntimeError) as e:
            failure = e
            if attempt == 0:
                time.sleep(2)
    raise RuntimeError(f"Unable to download CC-CIDICT .u8: {failure}") from failure


def build(bundle_path, output_path, source_path=None):
    bundle = json.loads(Path(bundle_path).read_text(encoding="utf-8"))
    terms, unique_chars = corpus_terms(bundle)
    blob = Path(source_path).read_bytes() if source_path else fetch_u8()
    try:
        lines = blob.decode("utf-8-sig").splitlines()
    except UnicodeDecodeError as exc:
        raise ValueError("CC-CIDICT source is not UTF-8") from exc
    matches, parsed_rows = parse_cidict(lines, terms)
    if parsed_rows < 4 and len(lines) > 4:
        raise ValueError("CC-CIDICT text is not in the supported U8 schema")
    if not source_path and parsed_rows < 50_000:
        raise ValueError(f"Expected full CC-CIDICT dump; found only {parsed_rows} rows")
    covered_chars = sum(ch in matches for ch in unique_chars)
    # Don't silently declare full Indonesian coverage. This is supplementary.
    result = {
        "schema": SCHEMA,
        "license": LICENSE,
        "license_url": "https://creativecommons.org/licenses/by-sa/4.0/",
        "source": "CC-CIDICT (Harmony Mandarin dan kontributor)",
        "source_url": "https://cidict.org/download/",
        "source_sha256": hashlib.sha256(blob).hexdigest(),
        "source_entries_parsed": parsed_rows,
        "language": "id",
        "corpus_unique_characters": len(unique_chars),
        "single_character_covered": covered_chars,
        "headwords": {k: matches[k] for k in sorted(matches)},
        "uncovered_characters": sorted(ch for ch in unique_chars if ch not in matches),
    }
    output=Path(output_path)
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(result,ensure_ascii=False,separators=(",",":")) + "\n",encoding="utf-8")
    print(f"CC-CIDICT source rows={parsed_rows}; corpus headwords={len(matches)}; "
          f"single-char Indonesian={covered_chars}/{len(unique_chars)}; "
          f"file={output.stat().st_size} bytes",flush=True)
    return result


if __name__ == "__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle",default="ru-classics/data/sishu.json")
    parser.add_argument("--output",default="ru-classics/data/character-cidict.json")
    parser.add_argument("--source-file",help="Existing .u8 file for deterministic offline tests")
    args=parser.parse_args()
    build(args.bundle,args.output,args.source_file)
