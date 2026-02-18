import { useEffect, useMemo, useState } from "react";
import { FormFieldSchema, ValidationErrors, validateBySchema } from "@/lib/form-utils";

export type TrainingPlanFormValues = {
  planType: string;
  personId: string;
  companyId: string;
  plannedStart: string;
  plannedEnd: string;
  status: string;
  description: string;
  trainingStartDate: string;
  trainingEndDate: string;
  trainingDurationYears: string;
  trainingDurationMonths: string;
  trainingDurationDays: string;
  trainingHoursTotal: string;
  trainingHoursLecture: string;
  trainingHoursPractice: string;
  jobCode2: string;
  jobName2: string;
  workName2: string;
  prevCertNumber: string;
  entryTrainingRequired: string;
};

export type TrainingPlanFieldSchema = FormFieldSchema<TrainingPlanFormValues>;

export const TRAINING_PLAN_STATUS_OPTIONS = [
  { value: "DRAFT", label: "DRAFT" },
  { value: "SUBMITTED", label: "SUBMITTED" },
  { value: "APPROVED", label: "APPROVED" },
] as const;

const TRAINING_PLAN_STATUS_VALUES = TRAINING_PLAN_STATUS_OPTIONS.map((option) => option.value);

const defaultSchema: TrainingPlanFieldSchema[] = [
  { name: "planType", label: "プラン名/種別", type: "text", required: true },
  { name: "personId", label: "対象者", type: "select", required: true },
  { name: "companyId", label: "実習実施者", type: "select", required: true },
  { name: "plannedStart", label: "開始日", type: "date", required: true },
  { name: "plannedEnd", label: "終了日", type: "date", required: true },
  {
    name: "status",
    label: "ステータス",
    type: "select",
    required: true,
    allowedValues: TRAINING_PLAN_STATUS_VALUES,
    options: TRAINING_PLAN_STATUS_OPTIONS,
  },
  { name: "description", label: "職種/作業", type: "textarea", required: true },
  { name: "trainingStartDate", label: "実習開始日（PDF用）", type: "date", required: false },
  { name: "trainingEndDate", label: "実習終了日（PDF用）", type: "date", required: false },
  { name: "trainingDurationYears", label: "実習期間_年", type: "text", required: false },
  { name: "trainingDurationMonths", label: "実習期間_月", type: "text", required: false },
  { name: "trainingDurationDays", label: "実習期間_日", type: "text", required: false },
  { name: "trainingHoursTotal", label: "実習時間合計", type: "text", required: false },
  { name: "trainingHoursLecture", label: "実習時間_講習", type: "text", required: false },
  { name: "trainingHoursPractice", label: "実習時間_実習", type: "text", required: false },
  { name: "jobCode2", label: "職種コード2", type: "text", required: false },
  { name: "jobName2", label: "職種名2", type: "text", required: false },
  { name: "workName2", label: "作業名2", type: "text", required: false },
  { name: "prevCertNumber", label: "前段階認定番号", type: "text", required: false },
  { name: "entryTrainingRequired", label: "入国後講習（1=必要/0=不要）", type: "text", required: false },
];

export type TrainingPlanFormProps = {
  initialValues: TrainingPlanFormValues;
  onSubmit: (values: TrainingPlanFormValues) => Promise<void>;
  isSubmitting?: boolean;
  schema?: TrainingPlanFieldSchema[];
  selectOptions?: Partial<Record<keyof TrainingPlanFormValues, { value: string; label: string }[]>>;
  onCancel?: () => void;
};

export function TrainingPlanForm({
  initialValues,
  onSubmit,
  isSubmitting,
  schema = defaultSchema,
  selectOptions,
  onCancel,
}: TrainingPlanFormProps) {
  const [values, setValues] = useState<TrainingPlanFormValues>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<TrainingPlanFormValues>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const mergedSchema = useMemo(
    () =>
      schema.map((field) => ({
        ...field,
        options: selectOptions?.[field.name] ?? field.options,
      })),
    [schema, selectOptions],
  );

  const updateValue = (name: keyof TrainingPlanFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const validation = validateBySchema(values, mergedSchema);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {mergedSchema.map((field) => {
        const error = errors[field.name];
        const requiredLabel = field.required ? <span className="ml-1 text-red-500 text-xs">必須</span> : null;

        return (
          <label key={field.name} className="block text-sm space-y-1">
            <div className="flex items-center gap-1">
              <span>{field.label}</span>
              {requiredLabel}
            </div>
            {field.type === "select" && (
              <select
                className="w-full border px-2 py-1 rounded"
                value={values[field.name]}
                onChange={(e) => updateValue(field.name, e.target.value)}
              >
                <option value="">選択してください</option>
                {(field.options ?? []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {field.type === "text" && (
              <input
                type="text"
                className="w-full border px-2 py-1 rounded"
                value={values[field.name]}
                onChange={(e) => updateValue(field.name, e.target.value)}
              />
            )}
            {field.type === "date" && (
              <input
                type="date"
                className="w-full border px-2 py-1 rounded"
                value={values[field.name]}
                onChange={(e) => updateValue(field.name, e.target.value)}
              />
            )}
            {field.type === "textarea" && (
              <textarea
                className="w-full border px-2 py-1 rounded"
                rows={3}
                value={values[field.name]}
                onChange={(e) => updateValue(field.name, e.target.value)}
              />
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
          </label>
        );
      })}
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isSubmitting || submitting}
        >
          {isSubmitting || submitting ? "送信中..." : "保存"}
        </button>
        {onCancel && (
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={onCancel}
            disabled={isSubmitting || submitting}
            type="button"
          >
            戻る
          </button>
        )}
      </div>
    </div>
  );
}
