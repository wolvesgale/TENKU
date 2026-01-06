export type SelectOption = { value: string; label: string };

export type FormFieldSchema<ValueShape extends Record<string, any>> = {
  name: keyof ValueShape;
  label: string;
  required?: boolean;
  type: "select" | "date" | "textarea" | "text";
  options?: ReadonlyArray<SelectOption>;
  allowedValues?: ReadonlyArray<string>;
  validator?: (value: ValueShape[keyof ValueShape], values: ValueShape) => string | undefined;
};

export type ValidationErrors<ValueShape> = Partial<Record<keyof ValueShape, string>>;

export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const REQUIRED_MESSAGE = "必須項目です";
export const DATE_FORMAT_MESSAGE = "日付は YYYY-MM-DD 形式で入力してください";
export const INVALID_SELECTION_MESSAGE = "選択肢から選択してください";

const isEmptyValue = (value: unknown) => {
  if (value === undefined || value === null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  return false;
};

export function validateBySchema<ValueShape extends Record<string, any>>(
  values: ValueShape,
  schema: FormFieldSchema<ValueShape>[],
): ValidationErrors<ValueShape> {
  const errors: ValidationErrors<ValueShape> = {};

  schema.forEach((field) => {
    const value = values[field.name];

    if (field.required && isEmptyValue(value)) {
      errors[field.name] = REQUIRED_MESSAGE;
      return;
    }

    if (field.type === "date" && value && typeof value === "string" && !DATE_PATTERN.test(value)) {
      errors[field.name] = DATE_FORMAT_MESSAGE;
      return;
    }

    if (field.allowedValues && value && !field.allowedValues.includes(String(value))) {
      errors[field.name] = INVALID_SELECTION_MESSAGE;
      return;
    }

    if (field.validator) {
      const message = field.validator(value, values);
      if (message) {
        errors[field.name] = message;
      }
    }
  });

  return errors;
}
