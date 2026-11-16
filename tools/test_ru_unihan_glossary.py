"""Regression tests for curated-corpus Unihan supplement (no network needed)."""
import io
import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from tools.build_ru_unihan_glossary import build, parse_definitions, corpus_inventory


class UnihanBuilderTest(unittest.TestCase):
    def test_parse_and_build_losslessly(self):
        glyphs = ["仁", "義", "禮", "樂", "學"]
        source = [{"type": "ruby", "traditional": glyph} for glyph in glyphs]
        chapters = [{"passages": []} for _ in range(78)]
        chapters[0]["passages"] = [
            {"id": f"test.passage.{i}", "ruby_paragraphs": [source]}
            for i in range(965)
        ]
        bundle = {"chapters": chapters}
        self.assertEqual(set(corpus_inventory(bundle)), set(glyphs))
        lines = [
            f"U+{ord(glyph):04X}\\tkDefinition\\texample {glyph} meaning"
            for glyph in glyphs
        ]
        # Convert escaped separators into actual Unicode tab/newline delimiters.
        readings = ("\\n".join(lines) + "\\n").replace("\\t", "\t").replace("\\n", "\n")
        with tempfile.TemporaryDirectory() as temp:
            folder = Path(temp)
            input_path = folder / "sishu.json"
            output_path = folder / "unihan.json"
            archive_path = folder / "Unihan.zip"
            input_path.write_text(json.dumps(bundle, ensure_ascii=False), encoding="utf-8")
            with zipfile.ZipFile(archive_path, "w") as archive:
                archive.writestr("Unihan_Readings.txt", readings)
            before = input_path.read_bytes()
            result = build(input_path, output_path, archive_path)
            self.assertEqual(result["covered_unique_characters"], 5)
            self.assertEqual(result["total_unique_characters"], 5)
            self.assertEqual(result["license"], "Unicode-3.0")
            self.assertEqual(result["definitions"]["仁"], "example 仁 meaning")
            self.assertEqual(input_path.read_bytes(), before)
            self.assertEqual(json.loads(output_path.read_text(encoding="utf-8"))["schema"],
                             "ru-classics.unihan-glossary.v1")

    def test_reject_low_coverage(self):
        relevant = {"仁": 3, "義": 2, "禮": 1}
        data = ["U+4EC1\\tkDefinition\\tbenevolence".replace("\\t", "\t")]
        self.assertEqual(set(parse_definitions(data, relevant)), {"仁"})


if __name__ == "__main__":
    unittest.main()
