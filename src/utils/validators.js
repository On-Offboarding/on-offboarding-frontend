
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePersonalNumber = (number) => {
  return /^\d{8}-\d{4}$/.test(number);
};

export const validatePhoneNumber = (phone) => {
  return /^(?:\+46|0)\s?7[02369]\d{7}$/.test(phone);
};

const todayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const parseDateInput = (value) => {
  if (!value || typeof value !== "string") return null;

  const parts = value.split("-");
  if (parts.length !== 3) return null;

  const [year, month, day] = parts.map(Number);
  if (!year || !month || !day) return null;

  const parsed = new Date(year, month - 1, day);
  parsed.setHours(0, 0, 0, 0);
  return parsed;
};

const isSameOrAfterToday = (value) => {
  const parsedDate = parseDateInput(value);
  if (!parsedDate) return false;

  return parsedDate >= todayStart();
};

const isSameOrBefore = (leftValue, rightValue) => {
  const leftDate = parseDateInput(leftValue);
  const rightDate = parseDateInput(rightValue);

  if (!leftDate || !rightDate) return false;

  return leftDate <= rightDate;
};

const isSameOrAfter = (leftValue, rightValue) => {
  const leftDate = parseDateInput(leftValue);
  const rightDate = parseDateInput(rightValue);

  if (!leftDate || !rightDate) return false;

  return leftDate >= rightDate;
};
// Generic required field validation
export const validateRequired = (value) => {
  return value && String(value).trim().length > 0;
};

export const loginValidationRules = {
  email: [
    {
      validate: (value) => validateRequired(value),
      message: 'E-post är obligatorisk'
    },
    {
      validate: (value) => validateEmail(value),
      message: 'Ogiltig e-postadress'
    }
  ],
  password: [
    {
      validate: (value) => validateRequired(value),
      message: 'Lösenord är obligatoriskt'
    },
    {
      validate: (value) => validatePassword(value),
      message: 'Lösenord måste vara minst 6 tecken'
    }
  ]
};
//       validate: (value) => validateRequired(value),
//       message: 'E-post är obligatorisk'
//     },
//     {
//       validate: (value) => validateEmail(value),
//       message: 'Ogiltig e-postadress'
//     }
//   ],
//   password: [
//     {
//       validate: (value) => validateRequired(value),
//       message: 'Lösenord är obligatoriskt'
//     },
//     {
//       validate: (value) => validatePassword(value),
//       message: 'Lösenord måste vara minst 6 tecken'
//     }
//   ]
// };

// Validation rules for Form section
export const getFormSectionValidationRules = (type = "onboarding") => ({
  firstname: [
    { validate: (v) => validateRequired(v), message: 'Förnamn är obligatoriskt' },
    { validate: (v) => v.length <= 50, message: 'Förnamn får vara max 50 tecken' },
  ],
  lastname: [
    { validate: (v) => validateRequired(v), message: 'Efternamn är obligatoriskt' },
    { validate: (v) => v.length <= 100, message: 'Efternamn får vara max 100 tecken' },
  ],
  personalnumber: [
    { validate: (v) => validateRequired(v), message: 'Personnummer är obligatoriskt' },
    { validate: (v) => validatePersonalNumber(v), message: 'Ogiltigt format (YYYYMMDD-XXXX)' },
  ],
  mobile: [
    { validate: (v) => validateRequired(v), message: 'Mobilnummer är obligatoriskt' },
    { validate: (v) => validatePhoneNumber(v), message: 'Ogiltigt mobilnummerformat (t.ex. +46701234567 eller 0701234567)' },
  ],
  company: [
    { validate: (v) => validateRequired(v), message: 'Företag är obligatoriskt' },
  ],
  department: [
    { validate: (v) => validateRequired(v), message: 'Avdelning är obligatorisk' },
    { validate: (v) => v.length <= 25, message: 'Avdelning får vara max 25 tecken' },
  ],
  jobtitle: [
    { validate: (v) => validateRequired(v), message: 'Tjänstetitel är obligatorisk' },
    { validate: (v) => !v || v.length <= 25, message: 'Tjänstetitel får vara max 25 tecken' },
  ],
  startdate: [
    { validate: (v) => validateRequired(v), message: 'Startdatum är obligatoriskt' },
    ...(type === "onboarding" ? [{
      validate: (v) => isSameOrAfterToday(v),
      message: 'Vid onboarding måste startdatum vara idag eller framåt i tiden',
    }] : []),
  ],
  employmentdate: [
    { validate: (v) => validateRequired(v), message: 'Anställningsdag är obligatorisk' },
    {
      validate: (v, formData) => !formData?.startdate || isSameOrBefore(v, formData.startdate),
      message: 'Anställningsdatum kan inte vara efter startdatum',
    },
  ],
  ...(type === "offboarding" ? {
    enddate: [
      { validate: (v) => validateRequired(v), message: 'Slutdatum krävs vid offboarding' },
      {
        validate: (v, formData) => !formData?.startdate || isSameOrAfter(v, formData.startdate),
        message: 'Slutdatum måste vara samma som eller efter startdatum',
      },
    ],
  } : {}),
});
