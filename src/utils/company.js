const COMPANY_VALUE_TO_LABEL = {
  0: "Unknown",
  1: "Finansia",
  2: "AgeraPay",
};

const COMPANY_LABEL_TO_VALUE = {
  unknown: 0,
  finansia: 1,
  agerapay: 2,
};

const normalizeCompanyKey = (value) => String(value || "")
  .trim()
  .toLowerCase()
  .replace(/[\s_-]+/g, "");

export const getCompanyValue = (company) => {
  if (typeof company === "number" && Number.isFinite(company)) {
    return company;
  }

  if (typeof company !== "string") {
    return 0;
  }

  return COMPANY_LABEL_TO_VALUE[normalizeCompanyKey(company)] ?? 0;
};

export const getCompanyLabel = (company) => {
  if (typeof company === "number" && Number.isFinite(company)) {
    return COMPANY_VALUE_TO_LABEL[company] || "Unknown";
  }

  if (typeof company === "string") {
    const normalizedValue = getCompanyValue(company);
    if (normalizedValue !== 0) {
      return COMPANY_VALUE_TO_LABEL[normalizedValue];
    }

    return company || "Unknown";
  }

  return "Unknown";
};

export const COMPANY_OPTIONS = [
  { value: "finansia", label: "Finansia" },
  { value: "agerapay", label: "AgeraPay" },
];