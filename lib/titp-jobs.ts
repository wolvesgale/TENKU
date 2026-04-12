/**
 * titp-jobs.ts
 * 技能実習 移行対象職種・作業マスタ
 * 出典: 厚生労働省「技能実習の移行対象職種について」
 */

export type TitpWork = {
  code: string;   // 例: "01-01-1"
  name: string;   // 例: "施設園芸作業"
};

export type TitpJob = {
  code: string;   // 例: "01-01"
  name: string;   // 例: "耕種農業"
  works: TitpWork[];
};

export type TitpCategory = {
  code: string;   // 例: "01"
  name: string;   // 例: "農業関係"
  jobs: TitpJob[];
};

export const TITP_CATEGORIES: TitpCategory[] = [
  {
    code: "01",
    name: "農業関係",
    jobs: [
      {
        code: "01-01",
        name: "耕種農業",
        works: [
          { code: "01-01-1", name: "施設園芸作業" },
          { code: "01-01-2", name: "畑作・野菜作業" },
          { code: "01-01-3", name: "果樹作業" },
        ],
      },
      {
        code: "01-02",
        name: "畜産農業",
        works: [
          { code: "01-02-1", name: "養豚作業" },
          { code: "01-02-2", name: "養鶏作業" },
          { code: "01-02-3", name: "養牛作業" },
        ],
      },
    ],
  },
  {
    code: "02",
    name: "漁業関係",
    jobs: [
      {
        code: "02-01",
        name: "漁船漁業",
        works: [
          { code: "02-01-1", name: "かつお一本釣り漁業作業" },
          { code: "02-01-2", name: "まぐろはえ縄漁業作業" },
          { code: "02-01-3", name: "ひき縄釣り漁業作業" },
          { code: "02-01-4", name: "棒受網漁業作業" },
          { code: "02-01-5", name: "ずわいがに漁業作業" },
        ],
      },
      {
        code: "02-02",
        name: "養殖業",
        works: [
          { code: "02-02-1", name: "ほたてがい・まがき養殖作業" },
        ],
      },
    ],
  },
  {
    code: "03",
    name: "建設関係",
    jobs: [
      { code: "03-01", name: "型枠施工", works: [{ code: "03-01-1", name: "型枠工事作業" }] },
      { code: "03-02", name: "左官", works: [{ code: "03-02-1", name: "左官作業" }] },
      { code: "03-03", name: "コンクリート圧送", works: [{ code: "03-03-1", name: "コンクリート圧送工事作業" }] },
      { code: "03-04", name: "とび", works: [{ code: "03-04-1", name: "とび作業" }] },
      { code: "03-05", name: "建築大工", works: [{ code: "03-05-1", name: "大工工事作業" }] },
      { code: "03-06", name: "鉄筋継手", works: [{ code: "03-06-1", name: "ガス圧接作業" }] },
      { code: "03-07", name: "石材施工", works: [{ code: "03-07-1", name: "石張り作業" }] },
      { code: "03-08", name: "タイル張り", works: [{ code: "03-08-1", name: "タイル張り作業" }] },
      { code: "03-09", name: "鉄筋施工", works: [{ code: "03-09-1", name: "鉄筋組立て作業" }] },
      {
        code: "03-10",
        name: "内装仕上げ/表装",
        works: [
          { code: "03-10-1", name: "ボード仕上げ工事作業" },
          { code: "03-10-2", name: "カーペット仕上げ工事作業" },
          { code: "03-10-3", name: "鋼製下地工事作業" },
          { code: "03-10-4", name: "畳仕上げ作業" },
          { code: "03-10-5", name: "襖・障子等張り替え作業" },
        ],
      },
      { code: "03-11", name: "サッシ施工", works: [{ code: "03-11-1", name: "ビル用サッシ施工作業" }] },
      { code: "03-12", name: "防水施工", works: [{ code: "03-12-1", name: "シーリング防水工事作業" }] },
      { code: "03-13", name: "配管", works: [{ code: "03-13-1", name: "建築配管作業" }, { code: "03-13-2", name: "プラント配管作業" }] },
      { code: "03-14", name: "熱絶縁施工", works: [{ code: "03-14-1", name: "保温保冷工事作業" }] },
      { code: "03-15", name: "カーテンウォール施工", works: [{ code: "03-15-1", name: "カーテンウォール工事作業" }] },
      { code: "03-16", name: "押出しセメント板施工", works: [{ code: "03-16-1", name: "押出しセメント板工事作業" }] },
      { code: "03-17", name: "ガラス施工", works: [{ code: "03-17-1", name: "ガラス工事作業" }] },
      { code: "03-18", name: "建具製作", works: [{ code: "03-18-1", name: "木製建具手加工作業" }] },
      { code: "03-19", name: "建築板金", works: [{ code: "03-19-1", name: "ダクト板金作業" }, { code: "03-19-2", name: "建築板金作業" }] },
      { code: "03-20", name: "吹付ウレタン断熱", works: [{ code: "03-20-1", name: "吹付ウレタン断熱工事作業" }] },
      {
        code: "03-21",
        name: "電気通信",
        works: [
          { code: "03-21-1", name: "有線電気通信機器組立て・修理作業" },
          { code: "03-21-2", name: "有線電気通信設備設置作業" },
        ],
      },
      { code: "03-22", name: "内線電気工事", works: [{ code: "03-22-1", name: "内線電気工事作業" }] },
      {
        code: "03-23",
        name: "塗装",
        works: [
          { code: "03-23-1", name: "建築塗装作業" },
          { code: "03-23-2", name: "金属塗装作業" },
          { code: "03-23-3", name: "鋼橋塗装作業" },
          { code: "03-23-4", name: "噴霧塗装作業" },
        ],
      },
      { code: "03-24", name: "路面標示施工", works: [{ code: "03-24-1", name: "路面標示作業" }] },
    ],
  },
  {
    code: "04",
    name: "食品製造関係",
    jobs: [
      { code: "04-01", name: "缶詰巻締", works: [{ code: "04-01-1", name: "缶詰巻締作業" }] },
      {
        code: "04-02",
        name: "食鳥処理加工業",
        works: [{ code: "04-02-1", name: "食鳥処理加工作業" }],
      },
      {
        code: "04-03",
        name: "加熱性水産加工食品製造業",
        works: [
          { code: "04-03-1", name: "節類製造作業" },
          { code: "04-03-2", name: "加熱乾製品製造作業" },
          { code: "04-03-3", name: "調味加工品製造作業" },
          { code: "04-03-4", name: "くん製品製造作業" },
        ],
      },
      {
        code: "04-04",
        name: "非加熱性水産加工食品製造業",
        works: [
          { code: "04-04-1", name: "塩蔵品製造作業" },
          { code: "04-04-2", name: "乾製品製造作業" },
          { code: "04-04-3", name: "発酵食品製造作業" },
          { code: "04-04-4", name: "珍味食品製造作業" },
          { code: "04-04-5", name: "生食用加工品製造作業" },
        ],
      },
      {
        code: "04-05",
        name: "水産練り製品製造",
        works: [{ code: "04-05-1", name: "かまぼこ製品製造作業" }],
      },
      {
        code: "04-06",
        name: "牛豚食肉処理加工業",
        works: [{ code: "04-06-1", name: "牛豚部分肉製造作業" }],
      },
      {
        code: "04-07",
        name: "ハム・ソーセージ・ベーコン製造",
        works: [{ code: "04-07-1", name: "ハム・ソーセージ・ベーコン製造作業" }],
      },
      {
        code: "04-08",
        name: "パン製造",
        works: [{ code: "04-08-1", name: "パン製造作業" }],
      },
      {
        code: "04-09",
        name: "そう菜製造業",
        works: [
          { code: "04-09-1", name: "そう菜加工作業" },
          { code: "04-09-2", name: "集団調理作業" },
        ],
      },
      {
        code: "04-10",
        name: "農産物漬物製造業",
        works: [{ code: "04-10-1", name: "農産物漬物製造作業" }],
      },
      {
        code: "04-11",
        name: "医療・福祉施設給食製造",
        works: [{ code: "04-11-1", name: "医療・福祉施設給食製造作業" }],
      },
    ],
  },
  {
    code: "05",
    name: "繊維・衣服関係",
    jobs: [
      { code: "05-01", name: "紡績運転", works: [{ code: "05-01-1", name: "前紡工程作業" }, { code: "05-01-2", name: "精紡工程作業" }, { code: "05-01-3", name: "巻糸工程作業" }] },
      { code: "05-02", name: "織布運転", works: [{ code: "05-02-1", name: "準備工程作業" }, { code: "05-02-2", name: "製織工程作業" }, { code: "05-02-3", name: "仕上工程作業" }] },
      { code: "05-03", name: "染色", works: [{ code: "05-03-1", name: "糸浸染作業" }, { code: "05-03-2", name: "織物・ニット浸染作業" }] },
      { code: "05-04", name: "ニット製品製造", works: [{ code: "05-04-1", name: "靴下製造作業" }, { code: "05-04-2", name: "丸編みニット製造作業" }] },
      {
        code: "05-05",
        name: "たて編ニット生地製造",
        works: [{ code: "05-05-1", name: "たて編ニット生地製造作業" }],
      },
      {
        code: "05-06",
        name: "婦人子供服製造",
        works: [{ code: "05-06-1", name: "婦人子供既製服縫製作業" }],
      },
      {
        code: "05-07",
        name: "紳士服製造",
        works: [{ code: "05-07-1", name: "紳士既製服製造作業" }],
      },
      {
        code: "05-08",
        name: "下着類製造",
        works: [{ code: "05-08-1", name: "下着類製造作業" }],
      },
      {
        code: "05-09",
        name: "寝具製作",
        works: [{ code: "05-09-1", name: "寝具製作作業" }],
      },
      {
        code: "05-10",
        name: "カーペット製造",
        works: [{ code: "05-10-1", name: "織じゅうたん製造作業" }, { code: "05-10-2", name: "タフテッドカーペット製造作業" }],
      },
      {
        code: "05-11",
        name: "帆布製品製造",
        works: [{ code: "05-11-1", name: "帆布製品製造作業" }],
      },
      {
        code: "05-12",
        name: "布はく縫製",
        works: [{ code: "05-12-1", name: "ワイシャツ製造作業" }],
      },
      {
        code: "05-13",
        name: "座席シート縫製",
        works: [{ code: "05-13-1", name: "自動車シート縫製作業" }],
      },
    ],
  },
  {
    code: "06",
    name: "機械・金属関係",
    jobs: [
      { code: "06-01", name: "鋳造", works: [{ code: "06-01-1", name: "鋳鉄鋳物鋳造作業" }, { code: "06-01-2", name: "非鉄金属鋳物鋳造作業" }] },
      { code: "06-02", name: "鍛造", works: [{ code: "06-02-1", name: "ハンマ型鍛造作業" }, { code: "06-02-2", name: "プレス型鍛造作業" }] },
      { code: "06-03", name: "ダイカスト", works: [{ code: "06-03-1", name: "ホットチャンバダイカスト作業" }, { code: "06-03-2", name: "コールドチャンバダイカスト作業" }] },
      { code: "06-04", name: "機械加工", works: [{ code: "06-04-1", name: "普通旋盤作業" }, { code: "06-04-2", name: "フライス盤作業" }, { code: "06-04-3", name: "数値制御旋盤作業" }, { code: "06-04-4", name: "マシニングセンタ作業" }] },
      { code: "06-05", name: "金属プレス加工", works: [{ code: "06-05-1", name: "金属プレス作業" }] },
      { code: "06-06", name: "鉄工", works: [{ code: "06-06-1", name: "構造物鉄工作業" }] },
      { code: "06-07", name: "工場板金", works: [{ code: "06-07-1", name: "機械板金作業" }] },
      { code: "06-08", name: "めっき", works: [{ code: "06-08-1", name: "電気めっき作業" }, { code: "06-08-2", name: "溶融亜鉛めっき作業" }] },
      { code: "06-09", name: "アルミニウム陽極酸化処理", works: [{ code: "06-09-1", name: "陽極酸化処理作業" }] },
      { code: "06-10", name: "仕上げ", works: [{ code: "06-10-1", name: "治工具仕上げ作業" }, { code: "06-10-2", name: "金型仕上げ作業" }, { code: "06-10-3", name: "機械組立仕上げ作業" }] },
      { code: "06-11", name: "機械検査", works: [{ code: "06-11-1", name: "機械検査作業" }] },
      { code: "06-12", name: "機械保全", works: [{ code: "06-12-1", name: "機械系保全作業" }] },
      { code: "06-13", name: "電子機器組立て", works: [{ code: "06-13-1", name: "電子機器組立て作業" }] },
      { code: "06-14", name: "電気機器組立て", works: [{ code: "06-14-1", name: "回転電機組立て作業" }, { code: "06-14-2", name: "変圧器組立て作業" }, { code: "06-14-3", name: "配電盤・制御盤組立て作業" }, { code: "06-14-4", name: "開閉制御器具組立て作業" }, { code: "06-14-5", name: "回転電機巻線製造作業" }] },
      { code: "06-15", name: "プリント配線板製造", works: [{ code: "06-15-1", name: "プリント配線板設計作業" }, { code: "06-15-2", name: "プリント配線板製造作業" }] },
    ],
  },
  {
    code: "07",
    name: "その他",
    jobs: [
      { code: "07-01", name: "家具製作", works: [{ code: "07-01-1", name: "家具手加工作業" }] },
      { code: "07-02", name: "印刷", works: [{ code: "07-02-1", name: "オフセット印刷作業" }] },
      { code: "07-03", name: "製本", works: [{ code: "07-03-1", name: "製本作業" }] },
      { code: "07-04", name: "プラスチック成形", works: [{ code: "07-04-1", name: "圧縮成形作業" }, { code: "07-04-2", name: "射出成形作業" }, { code: "07-04-3", name: "インフレーション成形作業" }, { code: "07-04-4", name: "ブロー成形作業" }] },
      { code: "07-05", name: "強化プラスチック成形", works: [{ code: "07-05-1", name: "手積み積層成形作業" }] },
      { code: "07-06", name: "塗装", works: [{ code: "07-06-1", name: "建築塗装作業" }, { code: "07-06-2", name: "金属塗装作業" }, { code: "07-06-3", name: "鋼橋塗装作業" }, { code: "07-06-4", name: "噴霧塗装作業" }] },
      { code: "07-07", name: "溶接", works: [{ code: "07-07-1", name: "手溶接" }, { code: "07-07-2", name: "半自動溶接" }] },
      { code: "07-08", name: "工業包装", works: [{ code: "07-08-1", name: "工業包装作業" }] },
      { code: "07-09", name: "紙器・段ボール箱製造", works: [{ code: "07-09-1", name: "印刷箱打抜き作業" }, { code: "07-09-2", name: "印刷箱製箱作業" }, { code: "07-09-3", name: "貼箱製造作業" }, { code: "07-09-4", name: "段ボール箱製造作業" }] },
      { code: "07-10", name: "陶磁器工業製品製造", works: [{ code: "07-10-1", name: "機械ろくろ成形作業" }, { code: "07-10-2", name: "圧力鋳込み成形作業" }, { code: "07-10-3", name: "パッド印刷作業" }] },
      { code: "07-11", name: "自動車整備", works: [{ code: "07-11-1", name: "自動車整備作業" }] },
      { code: "07-12", name: "ビルクリーニング", works: [{ code: "07-12-1", name: "ビルクリーニング作業" }] },
      {
        code: "07-13",
        name: "介護",
        works: [{ code: "07-13-1", name: "介護作業" }],
      },
      {
        code: "07-14",
        name: "リネンサプライ",
        works: [{ code: "07-14-1", name: "リネンサプライ仕上げ作業" }],
      },
      {
        code: "07-15",
        name: "コンクリート製品製造",
        works: [{ code: "07-15-1", name: "コンクリート製品製造作業" }],
      },
      {
        code: "07-16",
        name: "宿泊",
        works: [{ code: "07-16-1", name: "接客・衛生管理作業" }],
      },
      {
        code: "07-17",
        name: "RPF製造",
        works: [{ code: "07-17-1", name: "RPF製造作業" }],
      },
      {
        code: "07-18",
        name: "鉄道施設保守整備",
        works: [{ code: "07-18-1", name: "軌道保守整備作業" }],
      },
      {
        code: "07-19",
        name: "ゴム製品製造",
        works: [{ code: "07-19-1", name: "成形加工作業" }, { code: "07-19-2", name: "押出し加工作業" }, { code: "07-19-3", name: "混練り圧延加工作業" }, { code: "07-19-4", name: "複合積層加工作業" }],
      },
      {
        code: "07-20",
        name: "鉄鋼",
        works: [{ code: "07-20-1", name: "電気炉製鋼作業" }, { code: "07-20-2", name: "銑鉄鋳造作業" }],
      },
      {
        code: "07-21",
        name: "石油精製",
        works: [{ code: "07-21-1", name: "石油精製オペレーター作業" }],
      },
      {
        code: "07-22",
        name: "外食業",
        works: [{ code: "07-22-1", name: "外食業全般" }],
      },
    ],
  },
];

/** 全職種をフラットなリストで取得 */
export function getAllJobs(): TitpJob[] {
  return TITP_CATEGORIES.flatMap((cat) => cat.jobs);
}

/** 職種コードから職種を取得 */
export function getJobByCode(code: string): TitpJob | undefined {
  return getAllJobs().find((j) => j.code === code);
}

/** 職種コードから分類名を取得 */
export function getCategoryByJobCode(jobCode: string): TitpCategory | undefined {
  return TITP_CATEGORIES.find((cat) => cat.jobs.some((j) => j.code === jobCode));
}

/** 区分（A〜F）の定義 */
export const TITP_CATEGORIES_AB = [
  { value: "A", label: "A：技能実習1号（第1年次）" },
  { value: "B", label: "B：技能実習2号（第2・3年次）移行" },
  { value: "C", label: "C：技能実習3号（第4・5年次）移行" },
  { value: "D", label: "D：技能実習2号（優良認定）" },
  { value: "E", label: "E：技能実習3号（優良認定）" },
  { value: "F", label: "F：その他" },
];
