import { useEffect, useMemo, useState } from "react";

export type ApplicationFormValues = {
  applicationType: string;
  personId: string;
  companyId: string;
  status: string;
  submittedAt: string;
  dueDate: string;
  memo: string;
};

export type ApplicationFieldSchema = {
  name: keyof ApplicationFormValues;
  label: string;
  required?: boolean;
  type: "select" | "date" | "textarea";
  options?: { value: string; label: string }[];
};

export type ApplicationFormProps = {
  initialValues: ApplicationFormValues;
  onSubmit: (values: ApplicationFormValues) => Promise<void>;
  isSubmitting?: boolean;
  schema?: ApplicationFieldSchema[];
  selectOptions?: Partial<Record<keyof ApplicationFormValues, { value: string; label: string }[]>>;
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const defaultSchema: ApplicationFieldSchema[] = [
  { name: "applicationType", label: "申請タイプ", type: "select", required: true },
  { name: "personId", label: "申請者", type: "select", required: true },
  { name: "companyId", label: "企業", type: "select", required: true },
  { name: "status", label: "ステータス", type: "select", required: true },
  { name: "dueDate", label: "提出期限", type: "date", required: true },
  { name: "submittedAt", label: "申請日", type: "date" },
  { name: "memo", label: "備考", type: "textarea" },
];

type ValidationError = Partial<Record<keyof ApplicationFormValues, string>>;

export function ApplicationForm({
  initialValues,
  onSubmit,
  isSubmitting,
  schema = defaultSchema,
  selectOptions,
}: ApplicationFormProps) {
  const [values, setValues] = useState<ApplicationFormValues>(initialValues);
  const [errors, setErrors] = useState<ValidationError>({});
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

  const validate = (current: ApplicationFormValues): ValidationError => {
    const nextErrors: ValidationError = {};

    mergedSchema.forEach((field) => {
      const value = current[field.name];
      if (field.required && !value) {
        nextErrors[field.name] = "必須項目です";
        return;
      }
      if (field.type === "date" && value && !DATE_PATTERN.test(value)) {
        nextErrors[field.name] = "日付は YYYY-MM-DD 形式で入力してください";
      }
    });

    return nextErrors;
  };

  const handleSubmit = async () => {
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  const updateValue = (name: keyof ApplicationFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
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
      </div>
    </div>
  );
}
