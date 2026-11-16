"""Deterministic validation of the CC-CIDICT filtered dictionary builder."""
import json
import tempfile
import unittest
from pathlib import Path
from tools.build_ru_cidict_glossary import build, corpus_terms, parse_cidict


class CIDictTest(unittest.TestCase):
    def test_source_filter_and_losslessness(self):
        passages=[{
            "id":f"p{i}", "ruby_paragraphs":[[
                {"type":"ruby","traditional":"仁"},
                {"type":"ruby","traditional":"義"},
                {"type":"text","value":"，"},
                {"type":"ruby","traditional":"君"},
                {"type":"ruby","traditional":"子"},
                {"type":"text","value":"。"},
            ]]
        } for i in range(965)]
        bundle={"chapters":[{"passages": passages}]+[{"passages":[]} for _ in range(77)]}
        terms,chars=corpus_terms(bundle)
        self.assertEqual(chars,{"仁","義","君","子"})
        self.assertIn("仁義",terms)
        self.assertIn("君子",terms)
        self.assertNotIn("義君",terms)
        rows=[
            "# CC-CIDICT dictionary (sample)",
            "仁 仁 [ren2] /cinta kasih/",
            "義 义 [yi4] /kebenaran/",
            "仁義 仁义 [ren2 yi4] /kemanusiaan dan kebenaran/",
            "君子 君子 [jun1 zi3] /orang berbudi luhur/",
            "君子 君子 [jun1 zi3] /orang terhormat/",
            "大學 大学 [da4 xue2] /perguruan tinggi/",
        ]
        entries,parsed=parse_cidict(rows,terms)
        self.assertEqual(parsed,6)
        self.assertEqual(len(entries),4)
        self.assertEqual(len(entries["君子"]),2)
        self.assertNotIn("大學",entries)
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp)
            original=root/"bundle.json"
            original.write_text(json.dumps(bundle,ensure_ascii=False),encoding="utf-8")
            source=root/"cidict.u8"
            source.write_text("\n".join(rows),encoding="utf-8")
            target=root/"cidict.json"
            before=original.read_bytes()
            result=build(original,target,source)
            self.assertEqual(before,original.read_bytes())
            self.assertEqual(result["language"],"id")
            self.assertEqual(result["license"],"CC-BY-SA-4.0")
            self.assertEqual(result["single_character_covered"],2)
            self.assertEqual(result["headwords"]["仁義"][0]["definitions"],["kemanusiaan dan kebenaran"])
            self.assertEqual(json.loads(target.read_text(encoding="utf-8"))["schema"],"ru-classics.cidict-glossary.v1")


if __name__=="__main__":
    unittest.main()
