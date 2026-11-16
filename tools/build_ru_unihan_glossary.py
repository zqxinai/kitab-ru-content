#!/usr/bin/env python3
"""Build a source-attributed, supplementary Unihan lexicon for Si Shu characters.

Definitions from Unicode Unihan (English), not MATAKIN translations or
reviewed contextual interpretations. No characters, pinyin or scripture data
are modified. The generated JSON is published with the static website.

Unicode License v3 (SPDX Unicode-3.0), copyright Unicode, Inc.
https://www.unicode.org/license.txt
https://www.unicode.org/reports/tr38/
"""
import argparse
import io
import json
import re
import sys
import time
import urllib.error
import urllib.request
import zipfile
from collections import Counter
from pathlib import Path

UNICODE_VERSION = "17.0.0"
UNIHAN_URL = "https://www.unicode.org/Public/17.0.0/ucd/Unihan.zip"
FALLBACK_URL = "https://raw.githubusercontent.com/unicode-org/unihan-database/main/kDefinition.txt"
SCHEMA = "ru-classics.unihan-glossary.v1"
MIN_COVERAGE = 0.85
CODEPOINT = re.compile(r"^U\\+([0-9A-F]{4,6})$")
LICENSE = "Unicode-3.0"


def chinese_character(char):
    value = ord(char)
    return (
        0x3400 <= value <= 0x9FFF
        or 0xF900 <= value <= 0xFAFF
        or 0x20000 <= value <= 0x323AF
    )


def corpus_inventory(bundle):
    counts = Counter()
    chapters = bundle.get("chapters", [])
    passages = 0
    if len(chapters) != 78:
        raise ValueError("Expected 78 Si Shu chapters")
    for chapter in chapters:
        for passage in chapter.get("passages", []):
            passages += 1
            for paragraph in passage.get("ruby_paragraphs", []):
                for token in paragraph:
                    text = (token.get("traditional") or "") if token.get("type") == "ruby" else (token.get("value") or "")
                    for char in text:
                        if chinese_character(char):
                            counts[char] += 1
    if passages != 965 or not counts:
        raise ValueError(f"Expected 965 Si Shu passages, found {passages}")
    return counts


def download_bytes(url):
    request = urllib.request.Request(url, headers={"User-Agent": "RuClassics-GlossaryBuilder/1.0 (https://github.com/zqxinai/kitab-ru-content)"})
    error = None
    for attempt in range(2):
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                return response.read()
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            error = exc
            if attempt == 0:
                time.sleep(2)
    raise RuntimeError(f"Unable to download pinned Unihan source: {error}")


def parse_definitions(lines, relevant):
    entries = {}
    for raw in lines:
        line = raw.decode("utf-8") if isinstance(raw, bytes) else raw
        if not line.startswith("U+"):
            continue
        parts = line.rstrip("\\r\\n").split("\\t")
        if len(parts) != 3 or parts[1] != "kDefinition":
            continue
        # Some Unicode sources place a literal glyph after U+XXXX; only
        # the code point is authoritative for constructing the dictionary key.
        code = parts[0].split(" ", 1)[0]
        match = CODEPOINT.match(code)
        if not match:
            continue
        char = chr(int(match.group(1), 16))
        if char in relevant:
            definition = parts[2].strip()
            if definition:
                entries[char] = definition
    return entries


def build(bundle_path, output_path, unihan_archive=None):
    bundle = json.loads(Path(bundle_path).read_text(encoding="utf-8"))
    occurrences = corpus_inventory(bundle)
    if unihan_archive:
        archive = Path(unihan_archive).read_bytes()
    else:
        try:
            archive = download_bytes(UNIHAN_URL)
        except RuntimeError as exc:
            print(f"Warning: {exc}. Falling back to Unicode provisional kDefinition.", file=sys.stderr)
            archive = download_bytes(FALLBACK_URL)

    if zipfile.is_zipfile(io.BytesIO(archive)):
        source_url = UNIHAN_URL
        source_label = "Unicode Unihan 17.0.0 (kDefinition)"
        with zipfile.ZipFile(io.BytesIO(archive)) as package:
            with package.open("Unihan_Readings.txt") as data:
                found = parse_definitions(data, occurrences)
    else:
        source_url = FALLBACK_URL
        source_label = "Unicode Unihan draft kDefinition (fallback)"
        found = parse_definitions(archive.decode("utf-8").splitlines(), occurrences)
    coverage = len(found) / len(occurrences)
    if coverage < MIN_COVERAGE:
        raise ValueError(f"Unihan coverage is only {coverage:.1%}; refusing incomplete glossary")
    result = {
        "schema": SCHEMA,
        "source": source_label,
        "source_url": source_url,
        "license": LICENSE,
        "license_url": "https://www.unicode.org/license.txt",
        "language": "en",
        "total_unique_characters": len(occurrences),
        "covered_unique_characters": len(found),
        "coverage_fraction": round(coverage, 5),
        "definitions": dict(sorted(found.items())),
        "uncovered": sorted(char for char in occurrences if char not in found),
    }
    destination = Path(output_path)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":"), sort_keys=True) + "\\n", encoding="utf-8")
    print(f"Unihan glossary: {len(found)}/{len(occurrences)} unique characters ({coverage:.1%}), {destination.stat().st_size} bytes, source={source_label}")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", default="ru-classics/data/sishu.json")
    parser.add_argument("--output", default="ru-classics/data/character-unihan.json")
    parser.add_argument("--unihan-archive", help="Local Unihan ZIP or kDefinition text for repeatable offline tests")
    args = parser.parse_args()
    build(args.bundle, args.output, args.unihan_archive)
