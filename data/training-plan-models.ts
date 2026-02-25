export type TrainingPlanModel = {
  jobCode: string;
  jobName: string;
  workName: string;
  mandatoryTasks: string[];
  relatedTasks: string[];
  peripheralTasks: string[];
  materials: string[];
  equipment: string[];
  productExamples: string[];
};

export const trainingPlanModels: TrainingPlanModel[] = [
  {
    jobCode: "05-12",
    jobName: "惣菜製造業",
    workName: "惣菜製造作業",
    mandatoryTasks: [
      "副原材料の計量",
      "加熱（炒める・揚げる・煮る・焼く等）",
      "冷却",
      "盛付け",
    ],
    relatedTasks: [
      "主原材料の下処理（洗浄・カット等）",
      "包装・密封",
      "異物・品質確認",
      "在庫確認・発注補助",
      "容器・包装材の準備",
    ],
    peripheralTasks: [
      "清掃・整理整頓",
      "機器・設備の日常点検",
      "廃棄物の分別・処理",
      "資材・消耗品の補充",
    ],
    materials: [
      "野菜類（キャベツ・にんじん・ほうれん草等）",
      "肉類（鶏肉・豚肉・牛肉等）",
      "魚介類",
      "調味料（塩・醤油・みりん・砂糖・食用油等）",
      "包装用容器・フィルム",
    ],
    equipment: [
      "フライヤー（揚げ物機）",
      "回転釜（煮物・炒め物用）",
      "スチームコンベクションオーブン",
      "スライサー・カッター",
      "包装機（トレーシーラー等）",
      "計量器・温度計",
    ],
    productExamples: [
      "煮物惣菜（筑前煮・切り干し大根等）",
      "揚げ物惣菜（コロッケ・唐揚げ等）",
      "焼き物惣菜（焼き魚・肉炒め等）",
      "和え物・酢の物",
      "漬物",
    ],
  },
];

export function findModel(jobCode: string): TrainingPlanModel | undefined {
  return trainingPlanModels.find((m) => m.jobCode === jobCode);
}
