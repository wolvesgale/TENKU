export const APPLICATION_TYPES = [
  { value: "residence_certificate", label: "認定証明書交付" },
  { value: "status_change", label: "変更許可" },
  { value: "period_extension", label: "期間更新" },
];

export const STATUS_OPTIONS = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"].map((status) => ({
  value: status,
  label: status,
}));
