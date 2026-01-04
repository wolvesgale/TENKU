import { TaskStatus, Program } from "@prisma/client";

export type TaskTemplate = { title: string; offsetDays: number; status?: TaskStatus };

type RuleSet = {
  base: TaskTemplate[];
  variants: Record<string, TaskTemplate[]>;
};

export const taskRules: RuleSet = {
  base: [
    { title: "Kickoff", offsetDays: 1, status: TaskStatus.TODO },
    { title: "Deadline watch", offsetDays: 7, status: TaskStatus.TODO },
    { title: "Final review", offsetDays: 14, status: TaskStatus.TODO },
    { title: "Submit", offsetDays: 16, status: TaskStatus.TODO },
    { title: "Post-submit log", offsetDays: 20, status: TaskStatus.TODO },
  ],
  variants: {
    titp_plan_application: [
      { title: "技能計画ドラフト", offsetDays: 3 },
      { title: "講習スケジュール確定", offsetDays: 5 },
      { title: "OTIT 資料確認", offsetDays: 8 },
    ],
    ssw_support_plan_and_imm: [
      { title: "在留書類チェック", offsetDays: 4 },
      { title: "支援計画レビュー", offsetDays: 6 },
      { title: "IMM 提出準備", offsetDays: 10 },
    ],
    imm_change_status_ta_for_ssw: [
      { title: "在留資格変更草案", offsetDays: 3 },
      { title: "雇用条件確認", offsetDays: 6 },
      { title: "提出セットアップ", offsetDays: 9 },
    ],
  },
};

export function generateTasks(caseType: string, program: Program) {
  const now = new Date();
  const templates = [...taskRules.base, ...(taskRules.variants[caseType] || [])];
  return templates.map((tpl, idx) => {
    const dueDate = new Date(now.getTime() + tpl.offsetDays * 24 * 60 * 60 * 1000);
    return {
      title: tpl.title,
      dueDate,
      status: tpl.status || TaskStatus.TODO,
      order: idx,
      ruleSnapshot: { caseType, program, offsetDays: tpl.offsetDays },
    };
  });
}
