/* MATAKIN 2012-style reference display — manually checked pilot batches 01–08.
 * Original MATAKIN 2011 translation_indonesian MUST remain unchanged.
 * Replacements are keyed by stable passage ID and exact old reference string.
 * This is a presentation convention, NOT a transcription claim about
 * the printed wording of the unavailable 2012 pages. No links to subayat. */
(function(scope){
  'use strict';
  const records=Object.freeze([
    Object.freeze({"passage_id":"sishu.lunyu.18.02","source":"(S.S. XV: 14)","display":"(Lunyu - Sabda Suci XV:14)","target_id":"sishu.lunyu.15.14","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.18.03","source":"(S.S. II: 5)","display":"(Lunyu - Sabda Suci II:5)","target_id":"sishu.lunyu.02.05","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.18.05","source":"(S.S. IX: 9)","display":"(Lunyu - Sabda Suci IX:9)","target_id":"sishu.lunyu.09.09","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.18.06","source":"(S.S. XIV: 39)","display":"(Lunyu - Sabda Suci XIV:39)","target_id":"sishu.lunyu.14.39","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.18.08","source":"(S.S. V:23)","display":"(Lunyu - Sabda Suci V:23)","target_id":"sishu.lunyu.05.23","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.daxue.05.01","source":"(SS XII: 13)","display":"(Lunyu - Sabda Suci XII:13)","target_id":"sishu.lunyu.12.13","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.daxue.11.15","source":"(S.S.IV 3)","display":"(Lunyu - Sabda Suci IV:3)","target_id":"sishu.lunyu.04.03","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.daxue.11.18","source":"(S.S. XIII: 26)","display":"(Lunyu - Sabda Suci XIII:26)","target_id":"sishu.lunyu.13.26","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.daxue.11.23","source":"(Bc. IA:1)","display":"(Mengzi - Bingcu I A:1)","target_id":"sishu.mengzi.01.01","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.01.01","source":"(AB. X:23)","display":"(Daxue - Ajaran Besar X:23)","target_id":"sishu.daxue.11.23","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.05.07","source":"(S.S. IX: 14)","display":"(Lunyu - Sabda Suci IX:14)","target_id":"sishu.lunyu.09.14","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.05.08","source":"(S.S. II: 6)","display":"(Lunyu - Sabda Suci II:6)","target_id":"sishu.lunyu.02.06","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.05.08","source":"(S.S. VI: 4)","display":"(Lunyu - Sabda Suci VI:4)","target_id":"sishu.lunyu.06.04","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.05.10","source":"(S.S. III: 21)","display":"(Lunyu - Sabda Suci III:21)","target_id":"sishu.lunyu.03.21","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.06.04","source":"(S.S. V: 8)","display":"(Lunyu - Sabda Suci V:8)","target_id":"sishu.lunyu.05.08","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.06.22","source":"(S.S. II: 5)","display":"(Lunyu - Sabda Suci II:5)","target_id":"sishu.lunyu.02.05","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.06.30","source":"(S.S. XIV: 42)","display":"(Lunyu - Sabda Suci XIV:42)","target_id":"sishu.lunyu.14.42","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.10.01","source":"(S.S. III: 15)","display":"(Lunyu - Sabda Suci III:15)","target_id":"sishu.lunyu.03.15","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.10.07","source":"(S.S. VII: 13)","display":"(Lunyu - Sabda Suci VII:13)","target_id":"sishu.lunyu.07.13","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.10.08","source":"(S.S. IX: 16)","display":"(Lunyu - Sabda Suci IX:16)","target_id":"sishu.lunyu.09.16","decision":"presentation-only / printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.05.08","source":"(T.S. VIII)","display":"(Zhongyong - Tengah Sempurna VIII)","target_id":null,"decision":"presentation-only / chapter-level reference; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.05.12","source":"(A.B. IX: 4)","display":"(Daxue - Ajaran Besar IX:4)","target_id":"sishu.daxue.10.04","decision":"presentation-only / theme: reciprocity / cross-reference numbering retained; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.05.25","source":"(S.S. I: 3)","display":"(Lunyu - Sabda Suci I:3)","target_id":"sishu.lunyu.01.03","decision":"presentation-only / theme: speech and outward manner; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.10.21","source":"(S.S. III: 15)","display":"(Lunyu - Sabda Suci III:15)","target_id":"sishu.lunyu.03.15","decision":"presentation-only / text parallel: temple asking; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.10.25","source":"(S.S. IX: 10)","display":"(Lunyu - Sabda Suci IX:10)","target_id":"sishu.lunyu.09.10","decision":"presentation-only / text parallel: mourning and ceremonial clothes; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.16.09","source":"(T.S. XIX: 9)","display":"(Zhongyong - Tengah Sempurna XIX:9)","target_id":"sishu.zhongyong.20.09","decision":"presentation-only / theme: learning and attaining knowledge; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.16.12","source":"(S.S. XII: 10)","display":"(Lunyu - Sabda Suci XII:10)","target_id":"sishu.lunyu.12.10","decision":"presentation-only / theme: cultivating virtue; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.12.10","source":"(S.S. XVI: 12)","display":"(Lunyu - Sabda Suci XVI:12)","target_id":"sishu.lunyu.16.12","decision":"presentation-only / MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.12.14","source":"(S.S. XIII: 3)","display":"(Lunyu - Sabda Suci XIII:3)","target_id":"sishu.lunyu.13.03","decision":"presentation-only / MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.12.16","source":"(T.S. IX: 3)","display":"(Zhongyong - Tengah Sempurna IX:3)","target_id":"sishu.zhongyong.10.03","decision":"presentation-only / MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.10.03","source":"(S.S. XII:16)","display":"(Lunyu - Sabda Suci XII:16)","target_id":"sishu.lunyu.12.16","decision":"presentation-only / MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.12.22","source":"(Bc. VIIA: 46)","display":"(Mengzi - Bingcu VII A:46)","target_id":"sishu.mengzi.13.46","decision":"presentation-only / theme: love and wisdom; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.12.13","source":"(A.B. IV )","display":"(Daxue - Ajaran Besar IV)","target_id":null,"decision":"presentation-only / chapter-only; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.12.20","source":"(T.S. VIII)","display":"(Zhongyong - Tengah Sempurna VIII)","target_id":null,"decision":"presentation-only / chapter-only; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.01.07","source":"(S.S. IX: 18)","display":"(Lunyu - Sabda Suci IX:18)","target_id":"sishu.lunyu.09.18","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.01.09","source":"(S.S. II: 5)","display":"(Lunyu - Sabda Suci II:5)","target_id":"sishu.lunyu.02.05","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.01.10","source":"(S.S. V:4)","display":"(Lunyu - Sabda Suci V:4)","target_id":"sishu.lunyu.05.04","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.01.11","source":"(S.S. IV: 20)","display":"(Lunyu - Sabda Suci IV:20)","target_id":"sishu.lunyu.04.20","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.01.12","source":"(S.S. IV: 13)","display":"(Lunyu - Sabda Suci IV:13)","target_id":"sishu.lunyu.04.13","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.01.14","source":"(S.S. II: 15)","display":"(Lunyu - Sabda Suci II:15)","target_id":"sishu.lunyu.02.15","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.01.15","source":"(S.S. XIV: 10)","display":"(Lunyu - Sabda Suci XIV:10)","target_id":"sishu.lunyu.14.10","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.01.16","source":"(S.S. XIV: 30)","display":"(Lunyu - Sabda Suci XIV:30)","target_id":"sishu.lunyu.14.30","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.02.02","source":"(S.S. XIII: 5)","display":"(Lunyu - Sabda Suci XIII:5)","target_id":"sishu.lunyu.13.05","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.02.03","source":"(Bc. VIIA: 3)","display":"(Mengzi - Bingcu VII A:3)","target_id":"sishu.mengzi.13.03","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.02.04","source":"(S.S. VII: 17)","display":"(Lunyu - Sabda Suci VII:17)","target_id":"sishu.lunyu.07.17","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.02.05","source":"(S.S. VI.22)","display":"(Lunyu - Sabda Suci VI:22)","target_id":"sishu.lunyu.06.22","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.02.06","source":"(S.S. V:8)","display":"(Lunyu - Sabda Suci V:8)","target_id":"sishu.lunyu.05.08","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.02.12","source":"(S.S. V:4)","display":"(Lunyu - Sabda Suci V:4)","target_id":"sishu.lunyu.05.04","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.02.13","source":"(S.S. V.4)","display":"(Lunyu - Sabda Suci V:4)","target_id":"sishu.lunyu.05.04","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.02.14","source":"(S.S. XIII: 23)","display":"(Lunyu - Sabda Suci XIII:23)","target_id":"sishu.lunyu.13.23","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.02.15","source":"(S.S. I:14)","display":"(Lunyu - Sabda Suci I:14)","target_id":"sishu.lunyu.01.14","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.02.20","source":"(S.S. X: 16)","display":"(Lunyu - Sabda Suci X:16)","target_id":"sishu.lunyu.10.16","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.02.23","source":"(S.S. III:9)","display":"(Lunyu - Sabda Suci III:9)","target_id":"sishu.lunyu.03.09","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.04.02","source":"(S.S. XV. 9)","display":"(Lunyu - Sabda Suci XV:9)","target_id":"sishu.lunyu.15.09","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.04.03","source":"(A.B. X 15)","display":"(Daxue - Ajaran Besar X:15)","target_id":"sishu.daxue.11.15","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.04.04","source":"(S.S. XIV: 6)","display":"(Lunyu - Sabda Suci XIV:6)","target_id":"sishu.lunyu.14.06","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.04.07","source":"(S.S. I: 8)","display":"(Lunyu - Sabda Suci I:8)","target_id":"sishu.lunyu.01.08","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.04.12","source":"(A.B. X: 23)","display":"(Daxue - Ajaran Besar X:23)","target_id":"sishu.daxue.11.23","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.03.10","source":"(T.S. XVIII:6)","display":"(Zhongyong - Tengah Sempurna XVIII:6)","target_id":"sishu.zhongyong.19.06","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.03.14","source":"(T.S. XXVII: 5)","display":"(Zhongyong - Tengah Sempurna XXVII:5)","target_id":"sishu.zhongyong.28.05","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.07.26","source":"(Bc. VIIB: 25)","display":"(Mengzi - Bingcu VII B:25)","target_id":"sishu.mengzi.14.25","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.07.30","source":"(A.B. IX. 3)","display":"(Daxue - Ajaran Besar IX:3)","target_id":"sishu.daxue.10.03","decision":"presentation-only / target passage exists; MATAKIN cross-reference relationship accepted without independent thematic review; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.09.08","source":"(T.S. V)","display":"(Zhongyong - Tengah Sempurna V)","target_id":null,"decision":"presentation-only / chapter-only; no passage link; printed 2012 phrasing not attested"})
,
    Object.freeze({"passage_id":"sishu.lunyu.02.19","source":"(T.S. XIX: 1; S.S. III: 21)","display":"(Zhongyong - Tengah Sempurna XIX:1; Lunyu - Sabda Suci III:21)","target_id":null,"decision":"presentation-only / compound citation targets documented per segment in sources/references/matakin-compound-batch01.json; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.07.05","source":"(T.S. XVII: 3; S.S. VIII: 11)","display":"(Zhongyong - Tengah Sempurna XVII:3; Lunyu - Sabda Suci VIII:11)","target_id":null,"decision":"presentation-only / compound citation targets documented per segment in sources/references/matakin-compound-batch01.json; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.07.21","source":"(S.S. XI: 12; T.S. X: 1)","display":"(Lunyu - Sabda Suci XI:12; Zhongyong - Tengah Sempurna X:1)","target_id":null,"decision":"presentation-only / compound citation targets documented per segment in sources/references/matakin-compound-batch01.json; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.05.16","source":"(S.S. XIV: 9; Bc. IV B.2)","display":"(Lunyu - Sabda Suci XIV:9; Mengzi - Bingcu IV B:2)","target_id":null,"decision":"presentation-only / compound citation targets documented per segment in sources/references/matakin-compound-batch01.json; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.05.22","source":"(S.S. XV: 2; Bc. VII B: 37)","display":"(Lunyu - Sabda Suci XV:2; Mengzi - Bingcu VII B:37)","target_id":null,"decision":"presentation-only / compound citation targets documented per segment in sources/references/matakin-compound-batch01.json; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.05.23","source":"(Bc. II. A: 2; S.S. VII: 15)","display":"(Mengzi - Bingcu II A:2; Lunyu - Sabda Suci VII:15)","target_id":null,"decision":"presentation-only / compound citation targets documented per segment in sources/references/matakin-compound-batch01.json; no passage link; printed 2012 phrasing not attested"})
,
    Object.freeze({"passage_id":"sishu.lunyu.03.07","source":"(T.S. XIII: 5; Bc IIA: 7/5)","display":"(Zhongyong - Tengah Sempurna XIII:5; Mengzi - Bingcu II A:7/5)","target_id":null,"decision":"presentation-only / compound citation targets documented per segment in sources/references/matakin-compound-batch02.json; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.03.09","source":"(T.S. XXVII: 5; S.S. II:23)","display":"(Zhongyong - Tengah Sempurna XXVII:5; Lunyu - Sabda Suci II:23)","target_id":null,"decision":"presentation-only / compound citation targets documented per segment in sources/references/matakin-compound-batch02.json; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.07.02","source":"(S.S. IX: 16; Bc. IIA: 2/19)","display":"(Lunyu - Sabda Suci IX:16; Mengzi - Bingcu II A:2/19)","target_id":null,"decision":"presentation-only / compound citation targets documented per segment in sources/references/matakin-compound-batch02.json; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.07.13","source":"(T.S. XV: 3; S.S. X: 7)","display":"(Zhongyong - Tengah Sempurna XV:3; Lunyu - Sabda Suci X:7)","target_id":null,"decision":"presentation-only / compound citation targets documented per segment in sources/references/matakin-compound-batch02.json; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.09.09","source":"(S.S. XVIII 5; Bc. IIA: 2/28)","display":"(Lunyu - Sabda Suci XVIII:5; Mengzi - Bingcu II A:2/28)","target_id":null,"decision":"presentation-only / compound citation targets documented per segment in sources/references/matakin-compound-batch02.json; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.09.29","source":"(S.S. XIV: 28; T.S. XIX: 10)","display":"(Lunyu - Sabda Suci XIV:28; Zhongyong - Tengah Sempurna XIX:10)","target_id":null,"decision":"presentation-only / compound citation targets documented per segment in sources/references/matakin-compound-batch02.json; no passage link; printed 2012 phrasing not attested"})
,
    Object.freeze({"passage_id":"sishu.lunyu.01.08","source":"(S.S. IV:7; V:25)","display":"(Lunyu - Sabda Suci IV:7; Lun Yu V:25)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.03.21","source":"(S.S. II:19; V:10)","display":"(Lunyu - Sabda Suci II:19; Lun Yu V:10)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.03.24","source":"(S.S. VII: 23; IX: 5)","display":"(Lunyu - Sabda Suci VII:23; Lun Yu IX:5)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.05.02","source":"(S.S. VI: 1,2; XI: 5)","display":"(Lunyu - Sabda Suci VI:1,2; Lun Yu XI:5)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.05.04","source":"(S.S. I: 10; II: 12, 13)","display":"(Lunyu - Sabda Suci I:10; Lun Yu II:12,13)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.09.16","source":"(S.S. VII: 2; X: 8)","display":"(Lunyu - Sabda Suci VII:2; Lun Yu X:8)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.12.20","source":"(S.S. XIII. 20; XV. 6)","display":"(Lunyu - Sabda Suci XIII:20; Lun Yu XV:6)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.14.20","source":"(S.S. IV: 22; XIV: 27)","display":"(Lunyu - Sabda Suci IV:22; Lun Yu XIV:27)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.20.02","source":"(S.S.IV:18;XIII:26;VII: 38 )","display":"(Lunyu - Sabda Suci IV:18; Lun Yu XIII:26; Lun Yu VII:38)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.14.36","source":"(S.S. VII: 23; IX: 5; Bc. IB: 16)","display":"(Lunyu - Sabda Suci VII:23; Lun Yu IX:5; Mengzi - Bingcu I B:16)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.13.21","source":"(Bc. VII B: 37; S.S. V: 22)","display":"(Mengzi - Bingcu VII B:37; Lunyu - Sabda Suci V:22)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.13.26","source":"(A.B. X: 18; S.S. XX: 2)","display":"(Daxue - Ajaran Besar X:18; Lunyu - Sabda Suci XX:2)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.11.12","source":"(S.S. VII 21; T.S. X: 1)","display":"(Lunyu - Sabda Suci VII:21; Zhongyong - Tengah Sempurna X:1)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.14.01","source":"(S.S. VIII: 13; Bc. VIIA: 6,7)","display":"(Lunyu - Sabda Suci VIII:13; Mengzi - Bingcu VII A:6,7)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.02.05","source":"(S.S. I:9; III: 1,2; XIX:5; Bc. IIIA: 2)","display":"(Lunyu - Sabda Suci I:9; Lun Yu III:1,2; Lun Yu XIX:5; Mengzi - Bingcu III A:2)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.lunyu.07.23","source":"(S.S. III: 24; IX: 5)","display":"(Lunyu - Sabda Suci III:24; Lun Yu IX:5)","target_id":null,"decision":"presentation-only / MATAKIN compound citation with inherited book names; per-segment passages recorded; no passage link; printed 2012 phrasing not attested"})
,
    Object.freeze({"passage_id":"sishu.lunyu.09.05","source":"(S.S. III: 24; VII \": 23; XIV: 36; Bc. IB: 16)","display":"(Lunyu - Sabda Suci III:24; Lun Yu VII:23; Lun Yu XIV:36; Mengzi - Bingcu I B:16)","target_id":null,"decision":"presentation-only / 2012 MATAKIN photograph confirms VII.23 and all four referenced items; editorial naming is normalized, not a verbatim 2012 transcription; per-segment target IDs validated; no passage link; 2011 source remains unchanged; printed 2012 citation witnessed but exact display typography not attested"})
,
    Object.freeze({"passage_id":"sishu.zhongyong.03.01","source":"(S.S. VI: 29)","display":"(Lunyu - Sabda Suci VI:29)","target_id":"sishu.lunyu.06.29","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.06.01","source":"(S.S. IX:8)","display":"(Lunyu - Sabda Suci IX:8)","target_id":"sishu.lunyu.09.08","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.11.03","source":"(Bc. IV B: 10)","display":"(Mengzi - Bingcu IV B:10)","target_id":"sishu.mengzi.08.10","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.12.02","source":"(S.S. XIV: 17)","display":"(Lunyu - Sabda Suci XIV:17)","target_id":"sishu.lunyu.14.17","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.13.01","source":"(Bc. IVB: 10)","display":"(Mengzi - Bingcu IV B:10)","target_id":"sishu.mengzi.08.10","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.14.05","source":"(S.S. III: 7)","display":"(Lunyu - Sabda Suci III:7)","target_id":"sishu.lunyu.03.07","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.16.03","source":"(S.S. VII:13)","display":"(Lunyu - Sabda Suci VII:13)","target_id":"sishu.lunyu.07.13","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.19.06","source":"(S.S. III:10)","display":"(Lunyu - Sabda Suci III:10)","target_id":"sishu.lunyu.03.10","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.20.01","source":"(S.S. II:19)","display":"(Lunyu - Sabda Suci II:19)","target_id":"sishu.lunyu.02.19","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.20.09","source":"(S.S. XIII: 9)","display":"(Lunyu - Sabda Suci XIII:9)","target_id":"sishu.lunyu.13.09","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.20.10","source":"(S.S. IX:29)","display":"(Lunyu - Sabda Suci IX:29)","target_id":"sishu.lunyu.09.29","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.27.06","source":"(S.S. II: 11)","display":"(Lunyu - Sabda Suci II:11)","target_id":"sishu.lunyu.02.11","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.zhongyong.29.04","source":"(T.S. XIX: 7)","display":"(Zhongyong - Tengah Sempurna XIX:7)","target_id":"sishu.zhongyong.20.07","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.03.01","source":"(SS. XVIII:1)","display":"(Lunyu - Sabda Suci XVIII:1)","target_id":"sishu.lunyu.18.01","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.03.01","source":"(SS.III.21)","display":"(Lunyu - Sabda Suci III:21)","target_id":"sishu.lunyu.03.21","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.03.02","source":"(SS.XI.3)","display":"(Lunyu - Sabda Suci XI:3)","target_id":"sishu.lunyu.11.03","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.03.02","source":"(SS. VII: 2)","display":"(Lunyu - Sabda Suci VII:2)","target_id":"sishu.lunyu.07.02","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.03.02","source":"(SS.VII.26)","display":"(Lunyu - Sabda Suci VII:26)","target_id":"sishu.lunyu.07.26","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.03.02","source":"(SS.XII:22)","display":"(Lunyu - Sabda Suci XII:22)","target_id":"sishu.lunyu.12.22","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.03.02","source":"(S S.IX: 9)","display":"(Lunyu - Sabda Suci IX:9)","target_id":"sishu.lunyu.09.09","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.03.07","source":"(SS.IV:1)","display":"(Lunyu - Sabda Suci IV:1)","target_id":"sishu.lunyu.04.01","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.04.02","source":"(S.S. XVII:20)","display":"(Lunyu - Sabda Suci XVII:20)","target_id":"sishu.lunyu.17.20","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.04.09","source":"(SS VII:5)","display":"(Lunyu - Sabda Suci VII:5)","target_id":"sishu.lunyu.07.05","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.04.13","source":"(S.S.XIV:35)","display":"(Lunyu - Sabda Suci XIV:35)","target_id":"sishu.lunyu.14.35","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.04.13","source":"(S.S.IX:5)","display":"(Lunyu - Sabda Suci IX:5)","target_id":"sishu.lunyu.09.05","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.05.03","source":"(S.S.XVII:1)","display":"(Lunyu - Sabda Suci XVII:1)","target_id":"sishu.lunyu.17.01","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"}),
    Object.freeze({"passage_id":"sishu.mengzi.02.07","source":"(SS XIII.24)","display":"(Lunyu - Sabda Suci XIII:24)","target_id":"sishu.lunyu.13.24","decision":"presentation-only / MATAKIN source number mapped to existing passage; original remains unmodified; 2012 exact phrasing not attested"})
  ]);
  // Owner-verified MATAKIN 2012 reference corrections. Never mutate the
  // MATAKIN 2011 transcription: replace exact (passage_id, source) overlay
  // records only, keeping notes for genuine numbering contradictions.
  const curated=Object.freeze([
  {
    "passage_id": "sishu.lunyu.02.11",
    "source": "(T.S. XXV1:6)",
    "display": "(Zhongyong - Tengah Sempurna XXVI:6)",
    "target_id": "sishu.zhongyong.27.06",
    "decision": "Pemilik cetakan MATAKIN 2012 menegaskan XXVI:6, bukan XXV1:6; pasangan pasal 27.06 benar"
  },
  {
    "passage_id": "sishu.lunyu.05.08",
    "source": "(T.S. VIII)",
    "display": "(Zhongyong - Tengah Sempurna Bab VIII)",
    "target_id": "sishu.zhongyong.09.01",
    "decision": "Pemilik mengonfirmasi hanya Bab VIII; isinya hanya satu pasal; tautan diarahkan ke satu-satunya pasal tanpa mengubah label menjadi VIII:1"
  },
  {
    "passage_id": "sishu.lunyu.12.20",
    "source": "(T.S. VIII)",
    "display": "(Zhongyong - Tengah Sempurna Bab VIII)",
    "target_id": "sishu.zhongyong.09.01",
    "decision": "Konsistensi rujukan Bab VIII ke satu-satunya pasal dalam bab"
  },
  {
    "passage_id": "sishu.lunyu.06.26",
    "source": "(Bc.VA: 3/4)",
    "display": "(Mengzi - Bingcu V A:3/4)",
    "target_id": null,
    "decision": "Pemilik memastikan rujukan tercetak V A:3/4 pada MATAKIN 2012. Kandidat paralel kuat Mengzi V A:2 ayat 4, tetapi bukan koreksi cetakan",
    "note": "Rujukan MATAKIN 2012 berbunyi V A:3/4, tetapi ayat tersebut tidak ditemukan. Paralel isi ditemukan dalam Mengzi V A:2 ayat 4: 君子可欺以其方，難罔以非其道. Usulan alternatif, belum disahkan sebagai koreksi cetakan."
  },
  {
    "passage_id": "sishu.lunyu.14.10",
    "source": "(S.S. 1:15)",
    "display": "(Lunyu - Sabda Suci I:15)",
    "target_id": "sishu.lunyu.01.15",
    "decision": "Pemilik memastikan angka 1 pada hasil ekstraksi seharusnya angka Romawi I"
  },
  {
    "passage_id": "sishu.lunyu.18.01",
    "source": "(Mengzi - Bingcu IIA: 1/8)",
    "display": "(Mengzi - Bingcu II A:1/8)",
    "target_id": "sishu.mengzi.03.01",
    "decision": "Pemilik mengoreksi salah ketik sebelumnya: Mengzi II A:1/8 menunjuk ayat 8. Tautan langsung pada ayat 8.",
    "ayat": 8
  },
  {
    "passage_id": "sishu.mengzi.03.02",
    "source": "(TS.XXIX- XXXI;SS 23-25)",
    "display": "(Zhongyong - Tengah Sempurna Bab XXIX–XXXI; Lunyu - Sabda Suci XIX:23,24,25)",
    "target_id": null,
    "decision": "Pemilik memastikan konteks Mengzi II A:2 ayat 26; T.S. Bab XXIX–XXXI dan S.S. Bab XIX:23 s.d.25. Tiga pasal S.S. dapat diberi tautan terpisah; rentang bab T.S. tetap berupa label bab"
  },
  {
    "passage_id": "sishu.mengzi.01.07",
    "source": "(II.5.4.4)",
    "display": "(Shi Jing — Si King II.5.4.4)",
    "target_id": null,
    "decision": "Pemilik mengonfirmasi sumber Shi Jing II.5.4.4, berada dalam Mengzi I A:7 ayat 9. Tidak membuat tautan kitab luar Si Shu"
  },
  {
    "passage_id": "sishu.mengzi.01.05",
    "source": "(VII. B:4,2)",
    "display": "(Mengzi - Bingcu VII.B:4/2)",
    "target_id": "sishu.mengzi.14.04",
    "ayat": 2,
    "decision": "Confirmed implicit self-reference in Mengzi I A:5; VII B:4 ayat 2 exists. Display title per owner convention, preserve archived source; printed 2012 wording not attested."
  },
  {
    "passage_id": "sishu.daxue.03.03",
    "source": "(Si-kingIII.1.1.1)",
    "display": "(Shi Jing — Si King III.1.1.4)",
    "target_id": null,
    "decision": "Pemilik memastikan rujukan Shi Jing III.1.1.4, bukan III.1.1.1. Arsip MATAKIN 2011 tidak ditimpa"
  }
].map(r=>Object.freeze(r)));
  const correctedKeys=new Set(curated.map(r=>r.passage_id+'::'+r.source));
  const canonicalRecords=Object.freeze([
    ...records.filter(r=>!correctedKeys.has(r.passage_id+'::'+r.source)),
    ...curated
  ]);
  const byId=new Map();
  for(const r of canonicalRecords){
    if(!byId.has(r.passage_id))byId.set(r.passage_id,[]);
    byId.get(r.passage_id).push(r);
  }
  function present(passageId,text){
    if(typeof text!=='string')return text;
    let result=text;
    for(const r of byId.get(passageId)||[]){
      // Exact reference match, never a global S.S. / Bc. / AB. replacement.
      if(result.includes(r.source))result=result.split(r.source).join(r.display);
    }
    return result;
  }
  // Return display segments with optional passage targets. Never invent subayat
  // links for compounds or chapter-only references (target_id === null).
  function segments(passageId,text){
    if(typeof text!=='string')return [];
    const matches=[];
    for(const r of byId.get(passageId)||[]){
      if(!r.source)continue;
      let at=0;
      while((at=text.indexOf(r.source,at))!==-1){
        matches.push({start:at,end:at+r.source.length,text:r.display,target_id:r.target_id??null,...(r.ayat?{ayat:r.ayat}:{}),...(r.note?{note:r.note}:{})});
        at+=r.source.length;
      }
    }
    matches.sort((a,b)=>a.start-b.start||b.end-a.end);
    const parts=[];
    let cursor=0;
    for(const r of matches){
      if(r.start<cursor)continue;
      if(r.start>cursor)parts.push({text:text.slice(cursor,r.start),target_id:null});
      parts.push({text:r.text,target_id:r.target_id,...(r.ayat?{ayat:r.ayat}:{}),...(r.note?{note:r.note}:{})});
      cursor=r.end;
    }
    if(cursor<text.length||!parts.length)parts.push({text:text.slice(cursor),target_id:null});
    return parts;
  }
  const api=Object.freeze({records:canonicalRecords,present,segments});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  scope.Matakin2012References=api;
})(typeof globalThis!=='undefined'?globalThis:this);
