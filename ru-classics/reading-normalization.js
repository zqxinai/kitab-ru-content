/* Ru Classics: ejaan bacaan Pinyin - Hokkian tanpa menimpa teks MATAKIN. */
(function (root) {
  'use strict';
  const PAIRS = Object.freeze([
    ['Siau-lian', 'Shao Lian'], // 少連
    ['Gi-tiong', 'Yu Zhong'], // 虞仲
    ['I-iet', 'Yi Yi'], // 夷逸
    ['Tiang-chi', 'Chang Ju'], // 長沮
    ['Kiat-lik', 'Jie Ni'], // 桀溺
    ['Kia-tlik', 'Jie Ni'], // 桀溺 variant
    ['Hwan-twee', 'Huan Tui'], // 桓魋
    ['Jiam-yong', 'Ran Yong'], // 冉雍
    ['Bu-sing', 'Wucheng'], // 武城
    ['Pik-gi', 'Bo Yu'], // 伯魚
    ['Hwan-su', 'Fan Xu'], // 樊須
    ['Chiet-tiau Khai', 'Qi Diao Kai'], // 漆雕開
    ['Bing Ci-hwan', 'Meng Zhifan'], // 孟之反
    ['Ho-hiang', 'Hu Xiang'], // 互鄉
    ['Sioksun Bu-siok', 'Shusun Wushu'], // 叔孫武叔
    ['Bing Kong-too', 'Meng Gongchuo'], // 孟公綽
    ['Khwat-tong', 'Que Dang'], // 闕黨
    ['Cu-to', 'Zi Du'], // 子都
    ['Ik-ge', 'Yi Ya'], // 易牙
    ['Ki-siem', 'Juxin'], // 距心
    ['Bing See-sia', 'Meng Shishe'], // 孟施捨
    ['Kong-bing Gi', 'Gongming Yi'], // 公明儀
    ['Kwan-siok', 'Guan Shu'], // 管叔
    ['Bu-king', 'Wu Geng'], // 武庚
    ['Ciet-hwan', 'Ji Huan'], // 瘠環
    ['Oh-hik', 'Wu Huo'], // 烏獲
    ['Ok-lo', 'Wulu'], // 屋廬
    ['Pak-kiong Yu', 'Beigong You'], // 北宮黝
    ['Bian-ki', 'Mian Ju'], // 綿駒
    ['Cu-bok', 'Zi Mo'], // 子莫
    ['Cu-ci', 'Zi Zhi'], // 子之
    ['Cu-kwee', 'Zi Kuai'], // 子噲
    ['Cu-cian', 'Zi Jian'], // 子賤
    ['Cu-hwa', 'Zihua'], // 子華
    ['Hu-wat', 'Fu Yue'], // 傅說
    ['Hong-hong', 'Fenghuang'], // 鳳凰
    ['Kwi-khiu', 'Kuiqiu'], // 葵丘
    ['Kong-ya Tiang', 'Gongye Chang'], // 公冶長
    ['Kong-san Hut-jiau', 'Gongshan Furao'], // 公山弗擾
    ['Kongsiok Bun-cu', 'Gongshu Wenzi'], // 公叔文子
    ['Jiamcu', 'Ranzi'], // 冉子
    ['Cu-Siang', 'Zixiang'], // 子襄
    ['Kong Kiu', 'Kong Qiu'], // 孔丘
    ['Khong Khiu', 'Kong Qiu'], // 孔丘
    ['Ling Ien', 'Lingyin'], // 令尹, office of chief minister
    ['I Ien', 'Yi Yin'], // 伊尹, separate from generic 殷
    ['Cu-bun', 'Ziwen'], // 子文
    ['Cweecu', 'Cuizi'], // 崔子
    ['Tien Buncu', 'Chen Wenzi'], // 陳文子
    ['Culo', 'Zilu'], // 子路
    ['Siau Jien', 'Xiaoren'], // 小人
    ['Ien', 'Yin'], // 尹 or 殷 context; guard Ling Ien and Yi Yin
    ['Bun', 'Wen'], // 文, used for Wen Wang
    ['Cho', 'Chu'], // 楚
    ['Khun', 'Kun'], // 髡; guard the full Chunyu Kun name
    ['Pi Hee', 'Bi Xi'], // 嬖奚
    ['Ong-liang', 'Wang Liang'], // 王良
    ['Ong Liang', 'Wang Liang'], // 王良
    ['Hoo-sing Put-hai', 'Haosheng Buhai'], // 浩生不害
    ['Bik Khee', 'Mo Ji'], // 貉稽
    ['Chicu', 'Xu Zi'], // 徐子
    ['Huan Thi', 'Fan Chi'], // 樊遲
    ['Hwan Thi', 'Fan Chi'], // 樊遲
    ['I-ci', 'Yi Zhi'], // 夷之
    ['I-cu', 'Yi Zi'], // 夷子
    ['Jiam-kiu', 'Ran Qiu'], // 冉求
    ['Jiam-yu', 'Ran You'], // 冉有
    ['Kau-kik', 'Jiao Ge'], // 膠鬲
    ['Kik Cu-sing', 'Ji Zicheng'], // 棘子成
    ['King Chun', 'Jing Chun'], // 景春
    ['Kong-bing Koo', 'Gongming Gao'], // 公明高
    ['Kongto-cu', 'Gongduzi'], // 公都子
    ['Kwi Cu-jian', 'Ji Ziran'], // 季子然
    ['Kwi Jiem', 'Ji Ren'], // 季任
    ['Kwi-lo', 'Ji Lu'], // 季路
    ['Kwi-sun', 'Jisun'], // 季孫
    ['Lam-kiong Kwat', 'Nangong Shi'], // 南宮適; text-based reading shì, alternative historical name Nangong Kuo
    ['Phing-king', 'Peng Geng'], // 彭更
    ['Ping-liok', 'Pinglu'], // 平陸
    ['Siem-tong', 'Shen Tong'], // 沈同
    ['Siem-yu Hing', 'Shenyou Xing'], // 沈猶行
    ['Sing-han', 'Cheng Jian'], // 成覸
    ['Tai Ing-ci', 'Dai Yingzhi'], // 戴盈之
    ['Thai-cai', 'Taizai'], // 太宰 title
    ['Thiau Ing', 'Tao Ying'], // 桃應
    ['Tien Cien', 'Chen Zhen'], // 陳臻
    ['Tien-Cien', 'Chen Zhen'], // 陳臻
    ['Tien Siang', 'Chen Xiang'], // 陳相
    ['Tien Sien', 'Chen Xin'], // 陳辛
    ['Tien Singcu', 'Chen Chengzi'], // 陳成子
    ['Tien Supai', 'Chen Sibai'], // 陳司敗
    ['Tien Tai', 'Chen Dai'], // 陳代
    ['Tiencu', 'Chen Zi'], // 陳子
    ['Tong-kok', 'Dongguo'], // 東郭氏
    ['Tiang-siet', 'Chang Xi'], // 長息
    ['Ting King', 'Teng Geng'], // 滕更
    ['Buma Ki', 'Wuma Qi'], // 巫馬期
    ['Bing-sun', 'Mengsun'], // 孟孫
    ['Thio Kancu', 'Zhao Jianzi'], // 趙簡子
    ['Kong sun Yan', 'Gongsun Yan'], // 公孫衍
    ['Tio Gi', 'Zhang Yi'], // 張儀
    ['Bikcu', 'Mozi'], // 墨子 (general founder, not 墨者 title)
    ['Sien-long', 'Shennong'], // 神農
    ['Ko-so', 'Gu Sou'], // 瞽瞍
    ['Hong-hun', 'Fang Xun'], // 放勳
    ['King Thio', 'Jing Chou'], // 景醜
    ['Cu-go', 'Zi Ao'], // 子敖
    ['Hamkhiu Bong', 'Xianqiu Meng'], // 咸丘蒙
    ['Ien-su', 'Yin Shi'], // 尹士
    ['Biet-cu', 'Mizi'], // 彌子
    ['Bing I-cu', 'Meng Yizi'], // 孟懿子
    ['Bing Kwicu', 'Meng Jizi'], // 孟季子
    ['Ciok Too', 'Zhu Tuo'], // 祝鮀
    ['Coo Kau', 'Cao Jiao'], // 曹交
    ['Cu-khiem', 'Zi Qin'], // 子禽
    ['Cu-koo', 'Zigao'], // 子羔
    ['Cucok Jicu', 'Zizhuo Ruzi'], // 子濯孺子
    ['Cuhok Kingpik', 'Zifu Jingbo'], // 子服景伯
    ['Kongpik Liau', 'Gongbo Liao'], // 公伯寮
    ['Hong Bong', 'Pang Meng'], // 逄蒙
    ['Kongbing Gi', 'Gongming Yi'], // 公明儀
    ['Ongsun Ke', 'Wangsun Jia'], // 王孫賈
    ['Tiongsiok Gi', 'Zhongshu Yu'], // 仲叔圉
    ['Gan Siu-yu', 'Yan Chouyou'], // 顏讎由
    ['Tam-tay Biat-bing', 'Tantai Mieming'], // 澹臺滅明
    ['Cong Bu-tiong', 'Zang Wuzhong'], // 臧武仲 (beda dari 臧文仲)
    ['Chiong Gi', 'Chong Yu'], // 充虞
    ['Ong-hwan', 'Wang Huan'], // 王驩
    ['Hong-siok', 'Fangshu'], // 方叔
    ['Liem Hong', 'Lin Fang'], // 林放
    ['Ong Sun-ke', 'Wangsun Jia'], // 王孫賈
    ['Kwan-tiong', 'Guan Zhong'], // 管仲
    ['Pat Iet', 'Ba Yi'], // 八佾, tata delapan baris penari
    ['Kwan-chi', 'Guan Ju'], // 關雎, judul sanjak
    ['Bok-tok', 'Mu Duo'], // 木鐸, genta kayu
    ['Cu-tiang', 'Zizhang'], // 子張
    ['Cu-yu', 'Ziyou'], // 子游
    ['Cai-ngo', 'Zai Wo'], // 宰我
    ['Gan Yan', 'Yan Yuan'], // 顏淵 (juga rujukan Yan Hui)
    ['Ko-cu', 'Gaozi'], // 告子
    ['Tiong-kiong', 'Zhonggong'], // 仲弓
    ['Suma Giu', 'Sima Niu'], // 司馬牛
    ['Bing Bu-pik', 'Meng Wubo'], // 孟武伯
    ['Tien Khong', 'Chen Kang'], // 陳亢
    ['Bin Cukhian', 'Min Ziqian'], // 閔子騫
    ['Kongtocu', 'Gongduzi'], // 公都子
    ['Gakcingcu', 'Yuezhengzi'], // 樂正子
    ['Pik-kwi', 'Bai Gui'], // 白圭
    ['Hi Hing', 'Xu Xing'], // 許行
    ['Bing Hiancu', 'Meng Xianzi'], // 孟獻子
    ['Kooso', 'Gao Sou'], // 高叟
    ['Thicu', 'Chu Zi'], // 儲子
    ['Siat Liu', 'Xie Liu'], // 洩柳
    ['Twan Kan-bok', 'Duan Ganmu'], // 段乾木
    ['Bing Khoo', 'Meng Ke'], // 孟軻
    ['Liongcu', 'Longzi'], // 龍子
    ['Cu-san', 'Zichan'], // 子產
    ['Ok-locu', 'Wuluzi'], // 屋廬子
    ['Koocu', 'Gaozi'], // 高子 (bukan 告子)
    ['Kocu', 'Gaozi'], // 告子
    ['Kongsun Thio', 'Gongsun Chou'], // 公孫醜, varian tanpa tanda hubung
    ['Sing Thong', 'Cheng Tang'],
    ['Sing-thong', 'Cheng Tang'], // 湯, Lun Yu XII:22
    ['Liuhe Hwi', 'Liu Xiahui'], // 柳下惠
    ['Siok-cee', 'Shu Qi'], // 叔齊
    ['Hwan-thi', 'Fan Chi'], // 樊遲
    ['Cu-he', 'Zixia'], // 子夏
    ['Cong Bun-tiong', 'Zang Wenzhong'], // 臧文仲
    ['Ciu Jiem', 'Zhou Ren'], // 周任
    ['Koo Yau', 'Gao Yao'],
    ['I- ien', 'Yi Yin'],
    ['I-ien', 'Yi Yin'],
    ['Lai-cu', 'Lai Zhu'],
    ['Thai-kong Bong', 'Taigong Wang'],
    ['San Gi-sing', 'San Yisheng'],
    ['Khiem Tiang', 'Qin Zhang'],
    ['Sun-i Khun', 'Chunyu Kun'], // 淳於髡, Mengzi IV A:17
    ['Kong-sun Thio', 'Gongsun Chou'], // 公孫醜, Mengzi II A:1
    ['Cing See', 'Zeng Xi'], // 曾西; distinct Hanzi from 曾皙 (Cing Sik)
    ['Yancu', 'Yanzi'], // 晏子
    ['Cing Sik', 'Zeng Xi'],
    ['Bok Phi', 'Mu Pi'],
    ['Pik-tat', 'Bo Da'],
    // 伯適/伯适 ('Pik-kwat') intentionally held for contextual shi/kuo review.
    ['Tiong-tut', 'Zhong Tu'],
    ['Tiong-hut', 'Zhong Hu'],
    ['Siok-ya', 'Shu Ye'],
    ['Siok-he', 'Shu Xia'],
    ['Kwi-swi', 'Ji Sui'],
    ['Kwi-wa', 'Ji Gua'],
    ['Siau-tong', 'Xiaotong'],
    ['Kwa Siau-kun', 'Gua Xiaojun'],
    ['Kun Hu-jien', 'Jun Furen'],
    ['Hu-jien', 'Furen'],
    ['Sun', 'Shun'],
    ['Banciang', 'Wan Zhang'],
    ['Cutiang', 'Zizhang'],
    ['Khiu', 'Qiu'],
    ['Pik-i', 'Boyi'],
    ['Liu-he Hwi', 'Liu Xiahui'],
    ['Khongcu', 'Kongzi'],
    ['Bingcu', 'Mengzi'],
    ['Kuncu', 'Junzi'],
    ['Cingcu', 'Zengzi'],
    ['Cusu', 'Zisi'],
    ['Thiacu', 'Chengzi'],
    ['Thai Hak', 'Da Xue'],
    ['Tiong Yong', 'Zhong Yong'],
    ['Lun Gi', 'Lun Yu'],
    ['Su King', 'Shu Jing']
  ]);
  // Pasangan frasa historis yang tidak ambigu setelah kolasi dengan Hanzi
  // pada korpus 4 kitab (bukan replace ejaan lepas konteks).
  // Urutan frasa panjang dahulu; batas kata mencegah 'Tin' mengenai 'Ting'.
  const VERIFIED_PHRASES = Object.freeze([
    ['Negeri Tin', 'Negeri Teng - Tin'],       // 滕
    ['Negeri Ting', 'Negeri Zheng - Ting'],     // 鄭
    ['Negeri Pien', 'Negeri Bin - Pien'],      // 邠
    ['Negeri Go', 'Negeri Wu - Go'],           // 吳
    ['Negeri Coo', 'Negeri Zou - Coo'],        // 鄒
    ['Negeri Co', 'Negeri Zou - Co'],          // 鄹, Lun Yu III:15
    ['Negeri Wat', 'Negeri Yue - Wat'],        // 越
    ['Negeri Jiem', 'Negeri Ren - Jiem'],      // 任
    ['Negeri Khong', 'Negeri Kuang - Khong'],  // 匡
    ['Negeri Loo', 'Negeri Lu - Loo'],        // 魯
    ['Negeri Ki', 'Negeri Qi - Ki'],          // 杞
    ['Negeri Chai', 'Negeri Cai - Chai'],     // 蔡
    ['Negeri Siat', 'Negeri Xue - Siat'],     // 薛
    ['Rajamuda King', 'Rajamuda Jing - King'], // 景公
    ['Rajamuda Bun', 'Rajamuda Wen - Bun'],   // 滕文公
    ['Rajamuda Hwan', 'Rajamuda Huan - Hwan'],// 桓公
    ['Pangeran Bun', 'Pangeran Wen - Bun'],   // 文
    ['Pangeran Ting', 'Pangeran Ding - Ting'],// 定公
    ['Pangeran Siap', 'Pangeran She - Siap'], // 葉公 shè, bukan yè
    ['Pangeran Chien', 'Pangeran Qin - Chien'],// 秦
    ['Raja Tiu', 'Raja Zhou - Tiu'],         // 紂, bukan 周
    ['Raja Kiat', 'Raja Jie - Kiat'],        // 桀
    ['Raja Gee', 'Raja Yi - Gee'],           // 羿
    ['Raja Goo', 'Raja Ao - Goo'],           // 奡
    ['Raja Koocong', 'Raja Gaozong - Koocong'], // 高宗
    ['Raja Kwi', 'Raja Ji - Kwi'],           // 王季
    ['Negeri Hun Yok', 'Negeri Xunyu - Hun Yok'], // 獯鬻
    ['Raja Koo Cian', 'Raja Goujian - Koo Cian'], // 勾踐
    ['Raja Thai', 'Raja Taiwang - Thai'],      // 大王 = 太王, dibaca tài wáng (MOE Taiwan)
    ['Rajamuda Bok', 'Rajamuda Mu - Bok'],     // 穆公 / 繆公 (mù)
    ['Raja Cee', 'Raja Qi - Cee'],            // 齊
    ['Pangeran Pi-kan', 'Pangeran Bi Gan - Pi-kan'], // 比乾 / 比干
    ['Raja Siang', 'Raja Xiang - Siang'],     // 梁襄王, bukan 商
    ['Dinasti Siang', 'Dinasti Shang - Siang'], // 商
    ['Negeri King', 'Negeri Jing - King'],    // 荊
    ['Raja Tin', 'Raja Teng - Tin'],          // 滕
    ['Negeri Pok', 'Negeri Bo - Pok'],        // 亳
    ['Negeri Yam', 'Negeri Yan - Yam'],       // 奄
    ['Raja He', 'Raja Xia - He'],             // 夏
    ['Rajamuda Hwi', 'Rajamuda Hui - Hwi'],  // 惠
    ['Rajamuda Hau', 'Rajamuda Xiao - Hau'], // 孝
    ['Rajamuda Lo', 'Rajamuda Lu - Lo'],     // 魯
    ['Raja Gi', 'Raja Yu - Gi'],             // 虞
    ['Pangeran Lau', 'Pangeran Gong Liu - Lau'], // 公劉
    ['Pangeran King', 'Pangeran Jing - King'], // 景公
    ['Pangeran Kian', 'Pangeran Jian - Kian'] // 簡公
  ]);
  // Kolasi khusus berdasarkan Hanzi. Satu ejaan Hokkian bisa mewakili
  // aksara berbeda: Chien => 晉 (Jin) atau 秦 (Qin); Swan => 僎 atau 宣.
  const CONTEXTUAL = Object.freeze({
    'sishu.mengzi.08.31': [
      ['Bu-sing', 'Wucheng - Bu-sing'], // 武城
    ],
    'sishu.lunyu.18.06': [
      ['Khong Khiu', 'Kong Qiu - Khong Khiu'], // 孔丘
    ],
    'sishu.lunyu.06.03': [
      ['Hwee-lah', 'Hui - Hwee-lah'], // 回也
    ],
    'sishu.lunyu.18.08': [
      ['Cu-tiang', 'Zhu Zhang - Cu-tiang'], // 朱張; NOT Zizhang 子張
      ['I- iet', 'Yi Yi - I- iet'], // 夷逸; PDF broken line
    ],
    'sishu.mengzi.13.33': [
      ['raja (Cee)', 'raja (Qi - Cee)'], // 齊 identified by context
      ['bernama Tiam', 'bernama Dian - Tiam'], // 墊
    ],
    'sishu.mengzi.08.30': [
      ['Khongciang', 'Kuang Zhang - Khongciang'], // 匡章
      ['negeri (Cee)', 'negeri (Qi - Cee)'], // 齊 contextual court of Qi; Chinese verse does not spell 齊
    ],
    'sishu.lunyu.12.11': [
      ['Siancai!', 'Shanzai - Siancai!'], // 善哉
    ],
    'sishu.mengzi.03.01': [
      ['He, Ten dan Ciu', 'Xia - He, Yin - Ten dan Zhou - Ciu'], // 夏後 殷 周; keep printed 'Ten' as variant
    ],
    'sishu.zhongyong.18.02': [
      ['Kwi dan Bun', 'Ji - Kwi dan Wen - Bun'], // 王季 文王
    ],
    'sishu.daxue.04.05': [
      ['Bun dan Bu', 'Wen - Bun dan Wu - Bu'], // 文王武王
    ],
    'sishu.lunyu.05.10': [
      ['kepada I tidak', 'kepada Yu - I tidak'], // 宰予 Yu, different from 禹 Yu
      ['I-lah yang', 'Yu - I-lah yang'], // 宰予; printed suffix lah preserved
    ],
    'sishu.mengzi.13.35': [
      ['Ko-so', 'Gu Sou - Ko-so'], // 瞽瞍
    ],
    'sishu.mengzi.09.04': [
      ['Ko-so', 'Gu Sou - Ko-so'], // 瞽瞍
    ],
    'sishu.mengzi.13.43': [
      ['Ting King', 'Teng Geng - Ting King'], // 滕更
    ],
    'sishu.mengzi.06.01': [
      ['Kancu berkata', 'Jianzi - Kancu berkata'], // 簡子 abbreviates 趙簡子
      ['Ong- Liang', 'Wang Liang - Ong- Liang'], // 王良 broken PDF hyphen
      ['Ong Liang', 'Wang Liang - Ong Liang'], // 王良
      ['Thio Kancu', 'Zhao Jianzi - Thio Kancu'], // 趙簡子
    ],
    'sishu.mengzi.05.05': [
      ['Chi Piet', 'Xu Pi - Chi Piet'], // 徐辟
      ['Bikcu', 'Mozi - Bikcu'], // 墨子
      ['I-ci', 'Yi Zhi - I-ci'], // 夷之
    ],
    'sishu.lunyu.14.21': [
      ['Tien Hing telah', 'Chen Heng - Tien Hing telah'], // 陳恆, same referent as 陳成子
    ],
    'sishu.lunyu.07.31': [
      ['Go Mengzi - Bingcu', 'Wu Mengzi - Go Mengzi - Bingcu'], // 吳孟子, not 孟軻; keep printed legacy
    ],
    'sishu.lunyu.18.04': [
      ['Khongcupun', 'Kongzi - Khongcupun'], // 孔子; suffix pun preserved
    ],
    'sishu.lunyu.18.03': [
      ['Khongcupun', 'Kongzi - Khongcupun'], // 孔子; suffix pun preserved
    ],
    'sishu.mengzi.07.24': [
      ['Gak Zengzi - Cingcu', 'Yuezhengzi - Gak Cingcu'] // 樂正子, no Zengzi: overlay only, source preserved
    ],
    'sishu.mengzi.06.10': [
      ['Khong Ciang', 'Kuang Zhang - Khong Ciang'], // 匡章
      ['Tien Tiongcu', 'Chen Zhongzi - Tien Tiongcu'], // 陳仲子
      ['didaerah O-ling', 'didaerah Wuling - O-ling'], // 於陵; 於音烏, Zhu Xi
      ['di O-ling', 'di Wuling - O-ling'], // 於陵
      ['daerah Khap', 'daerah Ge - Khap'], // 蓋, 食采於蓋 (Zhao Qi)
      ['perampok Cik', 'perampok Zhi - Cik'], // 盜跖
      ['Tiongcu-lah', 'Zhongzi - Tiongcu-lah'], // 仲子
      ['apakah Tiongcu benar-benar', 'apakah Zhongzi - Tiongcu benar-benar'], // 仲子
      ['yang ditempati Tiongcu itu', 'yang ditempati Zhongzi - Tiongcu itu'], // 仲子
      ['Tiongcu, kiranya', 'Zhongzi - Tiongcu, kiranya'], // 仲子
      ['Tiongcu adalah', 'Zhongzi - Tiongcu adalah'], // 仲子
      ['Tiongcu ini', 'Zhongzi - Tiongcu ini'], // 仲子
    ],
    'sishu.mengzi.09.05': [
      ['daerah Lam Hoo', 'daerah Nanhe - Lam Hoo'], // 南河
    ],
    'sishu.daxue.04.04': [
      ['tebing sungai Ki', 'tebing sungai Qi - Ki'], // 淇, not 沂
    ],
    'sishu.mengzi.04.05': [
      ['Kota Ling-khiu', 'Kota Lingqiu - Ling-khiu'], // 靈丘
    ],
    'sishu.mengzi.04.06': [
      ['Kota Khap', 'Kota Ge - Khap'], // 蓋, 反切古盍切 di 孟子注疏
    ],
    'sishu.mengzi.04.07': [
      ['Kota Ing', 'Kota Ying - Ing'], // 嬴
    ],
    'sishu.mengzi.04.14': [
      ['daerah Hiu', 'daerah Xiu - Hiu'], // 休
      ['Kota Cong', 'Kota Chong - Cong'], // 崇
    ],
    'sishu.lunyu.11.26': [
      ['Sungai Ki', 'Sungai Yi - Ki'], // 沂; berbeda 淇 di Da Xue
    ],
    'sishu.lunyu.18.09': [
      ['Negeri Jin - Chien', 'Negeri Qin - Chien'], // 秦; edisi Hokkian Chien ambigu dengan 晉
      ['musik, Ci, lari', 'musik, Zhi - Ci, lari'], // 摯
      ['dua, Kan, lari', 'dua, Gan - Kan, lari'], // 乾
      ['tiga, Liau, lari', 'tiga, Liao - Liau, lari'], // 繚
      ['empat, Khwat, lari', 'empat, Que - Khwat, lari'], // 缺
      ['Sungai Hoo', 'Sungai He - Hoo'], // 河
      ['tambur kecil, Bu, lari', 'tambur kecil, Wu - Bu, lari'], // 武
      ['musik, Yang, serta', 'musik, Yang - Yang, serta'], // 陽 (Mandarin = legacy; identitas tetap jelas)
      ['batu, Siang, lari', 'batu, Xiang - Siang, lari'], // 襄
    ],
    'sishu.lunyu.07.19': [
      ['Negeri Siap', 'Negeri She - Siap'], // 葉 (地名 shè)
    ],
    'sishu.lunyu.14.08': [
      ['menteri luar negeri Cu-i', 'menteri luar negeri Ziyu - Cu-i'], // 行人子羽
    ],
    'sishu.lunyu.06.14': [
      ['kota Busing', 'kota Wucheng - Busing'], // 武城
    ],
    'sishu.lunyu.17.04': [
      ['kota Bu-sing', 'kota Wucheng - Bu-sing'], // 武城
    ],
    'sishu.lunyu.14.14': [
      ['daerah Hong', 'daerah Fang - Hong'], // 防
    ],
    'sishu.lunyu.15.06': [
      ['daerah Ban dan Bekpun', 'daerah Man - Ban dan Mo - Bekpun'], // 蠻貊, kelompok manusia bukan nama daerah
    ],
    // Lun Yu III: pasangan dari Hanzi pasal dan konteks terjemahan MATAKIN.
    // Nama dan istilah yang homofon dengan bahasa Indonesia tetap dibatasi pada ID pasal.
    'sishu.lunyu.03.01': [
      ['keluarga Kwi', 'keluarga Ji - Kwi'] // 季氏
    ],
    'sishu.lunyu.03.05': [
      ['Bangsa I dan Tik', 'Bangsa Yi - I dan Di - Tik'], // 夷狄
      ['Kerajaan He ini', 'Kerajaan Xia - He ini'] // 夏
    ],
    'sishu.lunyu.03.07': [
      ['cara Iep', 'cara Yi - Iep'] // 揖
    ],
    'sishu.lunyu.03.08': [
      ['Engkaulah Siang', 'Engkaulah Shang - Siang'] // 商, nama pribadi Zixia; bukan 朝代
    ],
    'sishu.lunyu.03.09': [
      ['Kerajaan He', 'Kerajaan Xia - He'], // 夏
      ['Kerajaan Ien', 'Kerajaan Yin - Ien'] // 殷
    ],
    'sishu.lunyu.03.10': [
      ['Sembahyang Tee', 'Sembahyang Di - Tee'] // 禘
    ],
    'sishu.lunyu.03.11': [
      ['Sembahyang Tee', 'Sembahyang Di - Tee'] // 禘
    ],
    'sishu.lunyu.03.13': [
      ['malaikat Oo', 'malaikat Ao - Oo'], // 奧
      ['Malaikat Co', 'Malaikat Zao - Co'] // 灶
    ],
    'sishu.lunyu.03.15': [
      ['Bio Besar', 'Taimiao - Bio Besar'] // 太廟
    ],
    'sishu.lunyu.03.17': [
      ['Su, engkau', 'Ci - Su, engkau'] // 賜, nama pribadi Zi Gong
    ],
    'sishu.lunyu.03.21': [
      ['Kerajaan He', 'Kerajaan Xia - He'], // 夏
      ['Kerajaan Ien', 'Kerajaan Yin - Ien'], // 殷
      ['pohon Siong', 'pohon Song - Siong'], // 松
      ['pohon Pik', 'pohon Bai - Pik'], // 柏
      ['pohon Lik', 'pohon Li - Lik'] // 栗
    ],
    'sishu.lunyu.03.22': [
      ['panggung Sam-kui', 'panggung San Gui - Sam-kui'] // 三歸
    ],
    'sishu.lunyu.03.25': [
      ['musik Siau', 'musik Shao - Siau'], // 韶
      ['musik Bu', 'musik Wu - Bu'] // 武
    ],
    'sishu.mengzi.05.03': [
      // III A:3 ayat 10: 庠 xiang, 序 xu, 學 xue, 校 xiao;
      // 夏 Xia, 殷 Yin, 周 Zhou. Batasi ke frasa yang cocok agar
      // 'Siang hari' (ayat 2) dan kata Indonesia lain tidak berubah.
      ['Siang, Si, Hak dan Hau', 'Xiang - Siang, Xu - Si, Xue - Hak dan Xiao - Hau'],
      ['Badan yang dinamai Siang', 'Badan yang dinamai Xiang - Siang'],
      ['Hau mengutamakan pendidikan umum', 'Xiao - Hau mengutamakan pendidikan umum'],
      ['dan Si mengutamakan kecakapan', 'dan Xu - Si mengutamakan kecakapan'],
      ['Dinasti He menamai badan pendidikan itu Hau', 'Dinasti Xia - He menamai badan pendidikan itu Xiao - Hau'],
      ['Dinasti Ien menamainya Si', 'Dinasti Yin - Ien menamainya Xu - Si'],
      ['Dinasti Zhou - Ciu menamainya Siang', 'Dinasti Zhou - Ciu menamainya Xiang - Siang'],
      ['Istilah Hak (sekolah negara)', 'Istilah Xue - Hak (sekolah negara)'],
      ['Pangeran Bun dari Negeri Tin', 'Pangeran Wen - Bun dari Negeri Teng - Tin'], // 滕文公
      ['Yang Ho berkata', 'Yang Hu - Yang Ho berkata'], // 陽虎
      ['Liongcu berkata', 'Longzi - Liongcu berkata'], // 龍子
      ['Piet Cian bertanya', 'Bi Zhan - Piet Cian bertanya'] // 畢戰
    ],
    'sishu.lunyu.08.18': [
      ['Raja Shun - Sun dan I.', 'Raja Shun - Sun dan Yu - I.'] // 舜禹
    ],
    'sishu.mengzi.05.04': [
      ['Tien Liang', 'Chen Liang - Tien Liang'], // 陳良
      ['penganut ajaran Sien-long', 'penganut ajaran Shennong - Sien-long'], // 神農
      ['Tien Sien', 'Chen Xin - Tien Sien'], // 陳辛
      ['sungai Cee dan Liap', 'sungai Ji - Cee dan Ta - Liap'], // nama lokasi, cocokkan Hanzi pada sishu.mengzi.05.04
      ['Sungai Ji dan Han', 'Sungai Ru - Ji dan Han'], // nama lokasi, cocokkan Hanzi pada sishu.mengzi.05.04
      ['Sungai Hwai dan Su', 'Sungai Huai - Hwai dan Si - Su'], // nama lokasi, cocokkan Hanzi pada sishu.mengzi.05.04
      ['Negeri King dan Si', 'Negeri Jing - King dan Shu - Si'], // 荊舒
      ['I disuruh mengatur', 'Yu - I disuruh mengatur'], // 禹
      ['I selama 8 tahun', 'Yu - I selama 8 tahun'] // 禹
    ],
    'sishu.mengzi.06.09': [
      ['Sungai Kang', 'Sungai Jiang - Kang'], // nama lokasi, cocokkan Hanzi pada sishu.mengzi.06.09
      ['Negeri-negeri King dan Si', 'Negeri-negeri Jing - King dan Shu - Si'], // 荊舒
      ['I disuruhnya mengatasi', 'Yu - I disuruhnya mengatasi'], // 禹
      ['I lalu menggali', 'Yu - I lalu menggali'], // 禹
      ['I setelah mengatasi', 'Yu - I setelah mengatasi'] // 禹; 夷 remains "I"
    ],
    'sishu.mengzi.07.09': [
      ['Raja Kiat dan Tiu sendiri', 'Raja Jie - Kiat dan Zhou - Tiu sendiri'] // 桀與紂
    ],
    'sishu.mengzi.09.07': [
      ['Baginda Thong', 'Baginda Tang - Thong'], // 湯 in 孟子萬章上, not 桐
      ['kota Pok', 'kota Bo - Pok'], // 亳
      ['daerah Yu Sien', 'daerah Youshen - Yu Sien'], // Hanzi verified context
      ['Raja He Kiat', 'Raja Xia - He Jie - Kiat'], // 夏桀
      ['istana Bokkiong', 'istana Mu Gong - Bokkiong'] // 牧宮
    ],
    // Negeri Cien = 晉/Jin pada pasal ini, bukan 秦/Qin.
    'sishu.mengzi.08.01': [
      ['Cu-ping', 'Zhufeng - Cu-ping'], // 諸馮
      ['Hu-he', 'Fuxia - Hu-he'], // 負夏
      ['Bing-tiau', 'Mingtiao - Bing-tiau'], // 鳴條
      ['Ki-ciu', 'Qizhou - Ki-ciu'], // 岐周
      ['Piet-ting', 'Bi Ying - Piet-ting'] // 畢郢
    ],
    'sishu.mengzi.08.21': [
      ['Negeri Cien', 'Negeri Jin - Cien'] // 晉
    ],
    'sishu.mengzi.10.03': [
      ['Negeri Cien', 'Negeri Jin - Cien'], // 晉
      ['Negeri Pi', 'Negeri Bi - Pi'], // 費: 朱熹費音祕, bì
      ['Gak- cing Kiu', 'Yuezheng Qiu - Gak-cing Kiu'], // 樂正裘
      ['Bok Tiong', 'Mu Zhong - Bok Tiong'], // 牧仲
      ['Hubungan Hiancu', 'Hubungan Meng Xianzi - Hiancu'],
      ['keluarga Hiancu', 'keluarga Meng Xianzi - Hiancu'], // 孟獻子
      ['Gan Puan', 'Yan Ban - Gan Puan'], // 顏般, 般音班 (Zhu Xi)
      ['Ong Sun', 'Wang Shun - Ong Sun'], // 王順
      ['Tiang Siet', 'Chang Xi - Tiang Siet'], // 長息
      ['Hai Tong', 'Hai Tang - Hai Tong'] // 亥唐 // 孟獻子
    ],
    'sishu.mengzi.14.23': [
      ['Phang Hu', 'Feng Fu - Phang Hu'], // 馮婦
      ['Di Negeri Cien', 'Di Negeri Jin - Cien'], // 晉
      ['Negeri Cien', 'Negeri Jin - Cien'] // 晉人
    ],
    'sishu.mengzi.12.10': [
      ['Bek', 'Mo - Bek'] // 貉: mò, suku utara; bukan hé (hewan)
    ],
    'sishu.lunyu.14.11': [
      ['Negeri Cien', 'Negeri Jin - Cien'] // negara Jin, keterangan tentang Zhao/Wei
    ],
    'sishu.lunyu.14.15': [
      ['Negeri Cien', 'Negeri Jin - Cien'] // 晉文公
    ],
    'sishu.lunyu.03.24': [
      ['Negeri Gi', 'Negeri Yi - Gi'] // 儀, berbeda dengan 虞 Yu (Mengzi)
    ],
    'sishu.mengzi.02.14': [
      ['daerah Siat', 'daerah Xue - Siat'],
      ['Gunung Ki', 'Gunung Qishan - Ki'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.02.15': [
      ['Gunung Ki', 'Gunung Qishan - Ki'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.04.11': [
      ['Kota Tiu', 'Kota Zhou - Tiu'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.04.12': [
      ['Kota Tiu', 'Kota Zhou - Tiu'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.05.02': [
      ['Kota Coo', 'Kota Zou - Coo'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.07.08': [
      ['Sungai Chong-long', 'Sungai Canglang - Chong-long'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.08.02': [
      ['Sungai Cien dan Wi', 'Sungai Zhen - Cien dan Wei - Wi'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.09.03': [
      ['daerah Sambiau', 'daerah Sanmiao - Sambiau'], // Hanzi verified context
      ['Sam-gwi', 'Sanwei - Sam-gwi'], // Hanzi verified context
      ['Gunung Cong', 'Gunung Chongshan - Cong'],
      ['Gunung I', 'Gunung Yushan - I'],
      ['daerah Yu-pi', 'daerah Youbi - Yu-pi'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.09.06': [
      ['Ik', 'Yi - Ik'], // 益
      ['Khee', 'Qi - Khee'], // 啓
      ['Tancu', 'Dan Zhu - Tancu'], // 丹朱
      ['Siang-kien', 'Shang Jun - Siang-kien'], // 商均 from MATAKIN note, not literal Hanzi core
      ['Baginda Thong', 'Baginda Tang - Thong'], // 湯
      ['Setelah Thong', 'Setelah Tang - Thong'], // 湯崩
      ['Thai ting', 'Tai Ding - Thai ting'], // 太丁
      ['Thai-ting', 'Tai Ding - Thai-ting'], // 太丁
      ['Gwee-ping', 'Wai Bing - Gwee-ping'], // 外丙
      ['Tiong-jiem', 'Zhong Ren - Tiong-jiem'], // 仲壬
      ['Thai-kak', 'Tai Jia - Thai-kak'], // 太甲
      ['ibukota Pok', 'ibukota Bo - Pok'], // 亳
      ['dan Ciu mewariskan', 'dan Zhou - Ciu mewariskan'], // 周
      ['Kerajaan Tong', 'Kerajaan Tang - Tong'], // 唐 as 唐虞, not 桐
      ['Gi (Sun)', 'Yu - Gi (Shun - Sun)'], // 虞; Shun title
      ['Kiat dan Tiu', 'Jie - Kiat dan Zhou - Tiu'], // 桀紂
      ['Kota Yang-sing', 'Kota Yangcheng - Yang-sing'],
      ['Gunung Ki', 'Gunung Jishan - Ki'] // 箕山; Tong 桐 already written in Pinyin
    ],
    'sishu.mengzi.12.01': [
      ['kota Co', 'kota Zou - Co'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.12.02': [
      ['kota Co', 'kota Zou - Co'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.12.05': [
      ['kota Co', 'kota Zou - Co'],
      ['kota Jiem', 'kota Ren - Jiem'],
      ['Ping-Liok', 'Pinglu - Ping-Liok'],
      ['Ping-liok', 'Pinglu - Ping-liok'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.12.06': [
      ['Sungai Ki', 'Sungai Qi - Ki'],
      ['daerah Kootong', 'daerah Gaotang - Kootong'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.13.24': [
      ['gunung Tong San', 'gunung Dongshan - Tong San'],
      ['gunung Thai', 'gunung Taishan - Thai'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.mengzi.13.36': [
      ['kota Hwan', 'kota Fan - Hwan'] // toponim diverifikasi dengan Hanzi sumber
    ],
    'sishu.lunyu.03.06': [
      ['Keluarga Kwi', 'Keluarga Ji - Kwi'], // 季氏
      ['Gunung Thai', 'Gunung Taishan - Thai']
    ],
    'sishu.lunyu.06.09': [
      ['Keluarga Kwi', 'Keluarga Ji - Kwi'], // 季氏
      ['sungai Bun', 'sungai Wen - Bun'], // 汶
      ['daerah Pi', 'daerah Bi - Pi']
    ],
    'sishu.lunyu.11.25': [
      ['daerah Pi', 'daerah Bi - Pi']
    ],
    'sishu.lunyu.16.01': [
      ['gunung Tong Bong', 'gunung Dongmeng - Tong Bong'], // Hanzi verified context
      ['daerah Pi', 'daerah Bi - Pi'],
      ['daerah Cwan-ji', 'daerah Zhuanyu - Cwan-ji'],
      ['daerah Cwan Ji', 'daerah Zhuanyu - Cwan Ji'],
      ['daerah Cwanji', 'daerah Zhuanyu - Cwanji']
    ],
    'sishu.lunyu.09.02': [
      ['daerah Tat-hang', 'daerah Daxiang - Tat-hang']
    ],
    'sishu.lunyu.11.23': [
      ['daerah Khong', 'daerah Kuang - Khong']
    ],
    'sishu.lunyu.13.17': [
      ['Daerah Ki-hu', 'Daerah Jufu - Ki-hu']
    ],
    'sishu.lunyu.14.09': [
      ['daerah Pian yang', 'daerah Pianyi - Pian yang']
    ],
    'sishu.lunyu.16.12': [
      ['Gunung Siu-yang', 'Gunung Shouyang - Siu-yang']
    ],
    'sishu.lunyu.17.07': [
      ['daerah Tiong-bo', 'daerah Zhongmou - Tiong-bo']
    ],
    'sishu.zhongyong.26.08': [
      ['Gunung Hua dan Gak', 'Gunung Huayue - Hua dan Gak']
    ],
    'sishu.mengzi.02.04': [
      ['Siancai!', 'Shanzai - Siancai!'], // 善哉
      ['lagu Ti-siau dan Kak-siau', 'lagu Zhi Shao - Ti-siau dan Jue Shao - Kak-siau'], // 徵招、角招
      ['daerah Cwan-hu', 'daerah Zhuanfu - Cwan-hu'],
      ['Tiau-bu', 'Chaowu - Tiau-bu'],
      ['daerah Long-ya', 'daerah Langya - Long-ya']
    ],
    'sishu.mengzi.02.05': [
      ['Siancai,', 'Shanzai - Siancai,'], // 善哉
      ['memerintah di daerah Ki', 'memerintah di daerah Qi - Ki'], // 岐
      ['Bukit Ki', 'Bukit Qi - Ki']
    ],
    'sishu.mengzi.01.02': [
      ['Kitab Thong Si', 'Kitab Tang Shi - Thong Si'] // 湯誓
    ],
    'sishu.mengzi.04.02': [
      ['Kingcu berkata', 'Jingzi - Kingcu berkata'], // 景子
      ['Kong- sun Thio', 'Gongsun Chou - Kong-sun Thio'], // 公孫醜; PDF broken hyphen
      ['Kekayaan Negeri Cien dan Cho', 'Kekayaan Negeri Jin - Cien dan Chu - Cho'], // 晉楚
      ['Bing Tiongcu', 'Meng Zhongzi - Bing Tiongcu'] // 孟仲子
    ],
    'sishu.mengzi.06.07': [
      // Nama tambahan dalam anotasi Zhu Xi: 段干木魏文侯時人
      ['Negeri Gwi', 'Negeri Wei - Gwi'], // 魏
      ['Yang Ho', 'Yang Huo - Yang Ho'] // 陽貨, berbeda 陽虎 Yang Hu
    ],
    'sishu.mengzi.06.03': [
      ['Ciu Siau bertanya', 'Zhou Xiao - Ciu Siau bertanya'], // 周霄
      ['Negeri Cien', 'Negeri Jin - Cien'] // 晉
    ],
    'sishu.mengzi.06.06': [
      ['Tai Put-sing', 'Dai Busheng - Tai Put-sing'], // 戴不勝
      ['Siat Ki-ciu', 'Xue Juzhou - Siat Ki-ciu'], // 薛居州
      ['jalan Cong Gak', 'jalan Zhuang Yue - Cong Gak'], // 莊岳
      ['bahasa Cho', 'bahasa Chu - Cho'], // 楚
      ['bahasa Cee', 'bahasa Qi - Cee'], // 齊
      ['orang Cee', 'orang Qi - Cee'] // 齊
    ],
    'sishu.mengzi.09.09': [
      ['daerah Khut', 'daerah Qu - Khut'], // 屈產
      ['daerah Swi-kik', 'daerah Chuiji - Swi-kik'], // Hanzi verified context
      ['Pik-li Hee', 'Baili Xi - Pik-li Hee'], // 百里奚
      ['Kiong Ciki', 'Gong Zhiqi - Kiong Ciki'], // 宮之奇
      ['Rajamuda Bok dari Negeri Jin - Chien', 'Rajamuda Mu - Bok dari Negeri Qin - Chien'], // 秦穆公
      ['rajamuda Bok dari Chien', 'rajamuda Mu - Bok dari Qin - Chien'], // 秦穆公
      ['Raja muda Bok', 'Raja muda Mu - Bok'], // 秦穆公
      ['Negeri Jin - Chien', 'Negeri Qin - Chien'], // 秦
      ['utusan Negeri Cien', 'utusan Negeri Jin - Cien'], // 晉人
      ['Negeri Gi', 'Negeri Yu - Gi'], // 虞
      ['Negeri Khik', 'Negeri Guo - Khik'] // 虢
    ],
    'sishu.mengzi.10.02': [
      ['Daerah Hu-yong', 'Daerah Fuyong - Hu-yong'], // 附庸; political territory, not place name
      ['Pak-kiong Ki', 'Beigong Qi - Pak-kiong Ki'], // 北宮錡
      ['Tian (Tian - Thian)-cu', 'Tianzi - Thian-cu'], // 天子
      ['Kong (Duke)', 'Gong - Kong (Duke)'], // 公
      ['Ho (Marquis)', 'Hou - Ho (Marquis)'], // 侯
      ['Pik (Earl)', 'Bo - Pik (Earl)'], // 伯
      ['Cu (Count)', 'Zi - Cu (Count)'], // 子
      ['Lam (Baron)', 'Nan - Lam (Baron)'] // 男
    ],
    'sishu.mengzi.11.08': [
      ['gunung Giu', 'gunung Niushan - Giu'], // Hanzi verified context
      ['Hati Nuraninya (Liang Siem)', 'Hati Nuraninya (Liangxin - Liang Siem)'] // 良心
    ],
    'sishu.lunyu.02.09': [
      ['Hwee (Gan Yan)', 'Hui - Hwee (Yan Yuan - Gan Yan)'] // 回 (Yán Huí: 顏回)
    ],
    'sishu.mengzi.01.05': [
      ['Dahulu, Negeri Cien', 'Dahulu, Negeri Jin - Cien'], // 晉國
      ['di barat dikalahkan oleh Negeri Jin - Chien', 'di barat dikalahkan oleh Negeri Qin - Chien'], // 西喪地於秦
      ['serangan Negeri Jin - Chien dan Cho', 'serangan Negeri Qin - Chien dan Chu - Cho'] // 秦楚
    ],
    'sishu.mengzi.01.07': [
      ['Gunung Thai', 'Gunung Taishan - Thai'], // nama lokasi, cocokkan Hanzi pada sishu.mengzi.01.07
      ['Pangeran Hwan', 'Pangeran Huan - Hwan'], // 齊桓
      ['Pangeran Bun dari Negeri Cien', 'Pangeran Wen - Bun dari Negeri Jin - Cien'], // 晉文
      ['seperti Chien dan Cho', 'seperti Qin - Chien dan Chu - Cho'], // 秦楚
      ['Negeri Coo', 'Negeri Zou - Coo'] // 鄒
    ],
    'sishu.mengzi.06.05': [
      ['Pangeran Kat', 'Pangeran Ge - Kat'], // 葛伯
      ['dan Cho menyerbunya', 'dan Chu - Cho menyerbunya'] // 齊楚
    ],
    'sishu.lunyu.17.05': [
      ['daerah Pi', 'daerah Bi - Pi'], // 費
      ['Kong-son Hut-jiau', 'Gongshan Furao - Kong-son Hut-jiau'], // 公山弗擾
      ['Negara Ciu Timur', 'Negara Zhou Timur - Ciu Timur'] // 東周
    ],
    'sishu.lunyu.17.10': [
      ['Ciulam', 'Zhou Nan - Ciulam'],
      ['Ciu-lam', 'Zhou Nan - Ciu-lam'], // 周南
      ['Tiau-lam', 'Shao Nan - Tiau-lam'],
      ['Tiaulam', 'Shao Nan - Tiaulam'] // 召南
    ],
    'sishu.lunyu.14.18': [
      ['Pembesar Swan', 'Pembesar Zhuan - Swan'] // 僎, MOE Taiwan zhuàn
    ],
    'sishu.mengzi.10.09': [
      ['Rajamuda Swan', 'Rajamuda Xuan - Swan'] // 齊宣王
    ],
    'sishu.lunyu.13.07': [
      ['dan Wee seperti', 'dan Wei - Wee seperti'] // 魯衛
    ],
    'sishu.mengzi.09.08': [
      ['Negeri Lu - Lo dan Wee', 'Negeri Lu - Lo dan Wei - Wee'] // 魯衛
    ]
  });

  // Hanya pasal tanpa penggunaan 夷 sebagai "I". Identitasnya dicocokkan
  // dengan token Hanzi 禹 dan semua kemunculan I di pasal bersangkutan.
  const YU_ONLY_PASSAGES = new Set([
    'sishu.lunyu.20.01',
    'sishu.mengzi.08.26',
    'sishu.mengzi.08.29',
    'sishu.mengzi.09.06',
    'sishu.mengzi.12.11'
  ]);

  function escaped(value) {
    return value.replace(/[\^$.*+?()[\]{}|\\]/g, '\\$&');
  }
  function pair(text, legacy, modern) {
    const pattern = new RegExp('(^|[^\\p{L}-])(' + escaped(legacy) + ')(?=$|[^\\p{L}-])', 'giu');
    const previous = new RegExp(escaped(modern) + '\\s*-\\s*$', 'iu');
    return text.replace(pattern, (match, prefix, token, start, source) => {
      const preceding = source.slice(0, start + prefix.length);
      if (legacy === 'Hu-jien' && /\bKun\s*$/iu.test(preceding)) return match;
      if (legacy === 'Cingcu' && /\bGak\s*$/iu.test(preceding)) return match; // 樂正子 not 曾子
      if (legacy === 'Sun' && /\b(?:Ong|Kong)\s*$/iu.test(preceding)) return match; // 王順 / 公孫 ≠ 舜
      if (legacy === 'I-cu' && /\bBing\s*$/iu.test(preceding)) return match;
      if (legacy === 'Cu-tiang' && /\bZhu Zhang\s*-\s*$/iu.test(preceding)) return match;
      if (legacy === 'Khiu' && /\bKhong\s*$/iu.test(preceding)) return match; // 孔丘 is paired as a complete name // 朱張 not 子張
      if (legacy === 'Thong' && /\bSing\s*$/iu.test(preceding)) return match; // 成湯 already covered by long name
      if (legacy === 'Ien' && /\b(?:I|Ling)\s*$/iu.test(preceding)) return match; // 伊尹 / 令尹, keep the full name
      if (legacy === 'Khun' && /\bSun-i\s*$/iu.test(preceding)) return match; // 淳於髡 full name already paired // 孟懿子 Meng Yizi, not 夷子
      if (previous.test(preceding)) return match;
      return prefix + modern + ' - ' + token;
    });
  }
  function normalize(text, passageId) {
    if (typeof text !== 'string') return text;
    // Tidak menghapus seruan "Siancai!" di tengah Lun Yu XII:11.
    let result = passageId === 'sishu.mengzi.14.38'
      ? text.replace(/\s+SIANCAI\s*$/, '')
      : text;
    // Perubahan spesifik pasal selalu dikerjakan sebelum alias umum.
    for (const [source, replacement] of CONTEXTUAL[passageId] || []) {
      const chunks = result.split(source);
      if (chunks.length === 1) continue;
      // Do not prepend Pinyin twice to the Hokkian suffix already in a pair.
      const prefix = replacement.endsWith(source) ? replacement.slice(0, -source.length) : '';
      let joined = chunks[0];
      for (const chunk of chunks.slice(1)) {
        joined += (prefix && joined.endsWith(prefix) ? source : replacement) + chunk;
      }
      result = joined;
    }

    if (YU_ONLY_PASSAGES.has(passageId)) {
      result = result.replace(/(^|[^\p{L}\d.-])I(?=$|[^\p{L}\d.-])/gu,
        (token, prefix, offset, source) => {
          const before = source.slice(0, offset + prefix.length);
          return /Yu\s*-\s*$/.test(before) ? token : prefix + 'Yu - I';
        });
    }

    // Pulihkan spasi pecah-barisan PDF pada nama Hokkian yang sama.
    result = result.replace(/\bKong-\s+sun Thio\b/gi, 'Kong-sun Thio'); // 公孫醜: repair split, not Shun
    result = result.replace(/\bI-\s+ien\b/g, 'I-ien');
    result = result.replace(/\bTiong-\s+hut\b/g, 'Tiong-hut');
    result = result.replace(/\bYao\s*\(\s*Giau\s*\)/g, 'Yao - Giau');
    result = result.replace(/\bGuan Zhong\s*\(\s*Kwan Tiong\s*\)/g, 'Guan Zhong - Kwan Tiong');
    result = result.replace(/\bZisi\s*\(\s*Cusu\s*\)/g, 'Zisi - Cusu');
    // Varian ejaan Hokkian dari saksi MATAKIN; tetap disandingkan, bukan dibuang.
    result = result.replace(/\bZisi\s*\(\s*Cu-su\s*\)/gi, 'Zisi - Cu-su'); // 子思
    result = result.replace(/\bWan Zhang\s*\(\s*Ban[ -]ciang\s*\)/gi, match => 'Wan Zhang - ' + match.match(/Ban[ -]ciang/i)[0]); // 萬章
    result = result.replace(/\bAgama Kebajikan\s*\(\s*TIK KAU\s*\)/g, 'Agama Kebajikan (De Jiao - TIK KAU)'); // 德教
    // Analekta V:8: 求 / 赤 adalah nama panggilan Ran Qiu / Gongxi Chi.
    if (passageId === 'sishu.lunyu.05.08') {
      result = result.replace(/\bKiu\s*\(\s*Jiamkiu\s*\)/g, 'Qiu - Kiu (Ran Qiu - Jiamkiu)');
      result = result.replace(/\bChik\s*\(\s*Kong-see Chik\s*\)/g, 'Chi - Chik (Gongxi Chi - Kong-see Chik)');
    }

    result = result.replace(/\bMingde\s*\(\s*Bing Tik\s*\)/g, 'Mingde - Bing Tik'); // 明德
    result = result.replace(/\bKanggao\s*\(\s*Khong-koo\s*\)/g, 'Kanggao - Khong-koo'); // 康誥
    result = result.replace(/\bTaijia\s*\(\s*Thai Kak\s*\)/g, 'Taijia - Thai Kak'); // 太甲
    result = result.replace(/\bShangdi\s*\(\s*Siang Tee\s*\)/gi, 'Shangdi - Siang Tee'); // 上帝
    result = result.replace(/\bYouzi\s*\(\s*Yucu\s*\)/g, 'Youzi - Yucu'); // 有子
    result = result.replace(/\bNegeri Ciu\b/g, 'Negeri Zhou - Ciu'); // 周
    result = result.replace(/\bKitab Kerajaan Cho\b/g, 'Kitab Kerajaan Chu - Cho'); // 楚書
    result = result.replace(/\bPangeran Wee\b/g, 'Pangeran Wei - Wee'); // 衛君
    result = result.replace(/\bdari Bu-ting\b/g, 'dari Wu Ding - Bu-ting'); // 武丁

    result = result.replace(/\bZi Lu\s*-\s*Zi Lu\s*-\s*Cu Lo\b/g, 'Zi Lu - Cu Lo');
    result = result.replace(/\bRaja Wu\s*-\s*Bu-ting\b/g, 'Raja Wu Ding - Bu-ting');
    // 禹 (Yu) has the one-letter legacy name 'I': replace only verified name contexts.
    result = result.replace(/\bRaja I(?=$|[^\p{L}-])/gu, 'Raja Yu - I');
    // Nama diri dan istilah dengan Hanzi yang telah dikolasi dalam pasal terkait.
    result = result.replace(/\b([Nn]egeri) Tien\b/g, (_,prefix) => prefix + ' Chen - Tien'); // 陳
    result = result.replace(/\bDinasti Ien\b/g, 'Dinasti Yin - Ien'); // 殷
    result = result.replace(/\bDinasti He\b/g, 'Dinasti Xia - He'); // 夏
    result = result.replace(/\bsuku bangsa Tik\b/g, 'suku bangsa Di - Tik'); // 狄
    result = result.replace(/\bsuku bangsa I\b/g, 'suku bangsa Yi - I'); // 夷
    result = result.replace(/\bPangeran Ciu\b/g, 'Pangeran Zhou - Ciu'); // 周公
    result = result.replace(/(\bseperti )I(?=\s+dan\s+(?:Koo Yau|Gao Yao))/gu, '$1Yu - I');
    result = pair(result, 'Giau', 'Yao');
    // Hanya frasa nama/gelar utuh, bukan suku kata Hokkian berdiri sendiri.
    for (const [legacy, paired] of VERIFIED_PHRASES) {
      const pattern = new RegExp('(^|[^\\p{L}-])(' + escaped(legacy) + ')(?=$|[^\\p{L}-])', 'giu');
      result = result.replace(pattern, (_full, prefix) => prefix + paired);
    }
    for (const [legacy, modern] of PAIRS) result = pair(result, legacy, modern);
    // III A:3, tata pajak: 助 zhù, 貢 gòng, 徹 chè.
    // Ketiganya merupakan istilah teknis khusus konteks pasal, bukan alias global.
    if (passageId === 'sishu.mengzi.05.03') {
      for (const [legacy, modern] of [['Co', 'Zhu'], ['Khong', 'Gong'], ['Tiat', 'Che']]) {
        result = pair(result, legacy, modern);
      }
    }
    return result;
  }
  root.RuReading = Object.freeze({ normalize, pairs: PAIRS, verifiedPhrases: VERIFIED_PHRASES, contextual: CONTEXTUAL });
  if (typeof module !== 'undefined' && module.exports) module.exports = root.RuReading;
})(typeof globalThis !== 'undefined' ? globalThis : this);
