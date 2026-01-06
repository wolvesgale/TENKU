import { useEffect, useMemo, useState } from "react";
import { FormFieldSchema, ValidationErrors, validateBySchema, maxLengthMessage } from "@/lib/form-utils";

export type JobFormValues = {
  companyId: string;
  title: string;
  description: string;
  workLocation: string;
  salary: string;
  employmentType: string;
  occupation?: string;
  requirements?: string;
};

type JobFieldSchema = FormFieldSchema<JobFormValues>;

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "full_time", label: "正社員" },
  { value: "part_time", label: "パート/アルバイト" },
  { value: "contract", label: "契約社員" },
  { value: "temporary", label: "派遣/短期" },
  { value: "intern", label: "インターン" },
  { value: "other", label: "その他" },
] as const;

const EMPLOYMENT_TYPE_VALUES = EMPLOYMENT_TYPE_OPTIONS.map((option) => option.value);

const defaultSchema: JobFieldSchema[] = [
  { name: "title", label: "求人タイトル", type: "text", required: true, maxLength: 100 },
  { name: "description", label: "職種・仕事内容", type: "textarea", required: true, maxLength: 1000 },
  { name: "workLocation", label: "勤務地", type: "text", required: true, maxLength: 100 },
  { name: "salary", label: "給与", type: "text", required: true, maxLength: 100 },
  {
    name: "employmentType",
    label: "雇用形態",
    type: "select",
    required: true,
    allowedValues: EMPLOYMENT_TYPE_VALUES,
    options: EMPLOYMENT_TYPE_OPTIONS,
    maxLength: 50,
  },
  { name: "occupation", label: "職種 (任意)", type: "text", maxLength: 100 },
  { name: "requirements", label: "必要スキル/人数など (任意)", type: "textarea", maxLength: 500 },
];

export type JobFormProps = {
  initialValues: JobFormValues;
  onSubmit: (values: JobFormValues) => Promise<void>;
  isSubmitting?: boolean;
  schema?: JobFieldSchema[];
};

export function JobForm({ initialValues, onSubmit, isSubmitting, schema = defaultSchema }: JobFormProps) {
  const [values, setValues] = useState<JobFormValues>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<JobFormValues>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const mergedSchema = useMemo(() => schema, [schema]);

  const updateValue = (name: keyof JobFormValues, value: string) => {
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

  const renderError = (fieldName: keyof JobFormValues) => {
    const error = errors[fieldName];
    if (!error) return null;
    return <p className="text-xs text-red-500">{error}</p>;
  };

  return (
    <div className="space-y-3">
      {mergedSchema.map((field) => {
        const requiredLabel = field.required ? <span className="ml-1 text-red-500 text-xs">必須</span> : null;
        const maxLengthNotice =
          field.maxLength !== undefined ? (
            <span className="ml-auto text-[10px] text-gray-500">{maxLengthMessage(field.maxLength)}</span>
          ) : null;

        return (
          <label key={field.name as string} className="block text-sm space-y-1">
            <div className="flex items-center gap-1">
              <span>{field.label}</span>
              {requiredLabel}
              {maxLengthNotice}
            </div>
            {field.type === "select" && (
              <select
                className="w-full border px-2 py-1 rounded"
                value={values[field.name] ?? ""}
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
                value={values[field.name] ?? ""}
                onChange={(e) => updateValue(field.name, e.target.value)}
                maxLength={field.maxLength}
              />
            )}
            {field.type === "date" && (
              <input
                type="date"
                className="w-full border px-2 py-1 rounded"
                value={values[field.name] ?? ""}
                onChange={(e) => updateValue(field.name, e.target.value)}
              />
            )}
            {field.type === "textarea" && (
              <textarea
                className="w-full border px-2 py-1 rounded"
                rows={3}
                value={values[field.name] ?? ""}
                onChange={(e) => updateValue(field.name, e.target.value)}
                maxLength={field.maxLength}
              />
            )}
            {renderError(field.name)}
          </label>
        );
      })}
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isSubmitting || submitting}
          type="button"
        >
          {isSubmitting || submitting ? "送信中..." : "保存"}
        </button>
      </div>
    </div>
  );
}
