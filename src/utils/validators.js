
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePersonalNumber = (number) => {
  const personalNumberRegex = /^\d{6}-\d{4}$|^\d{8}-\d{4}$/;
  return personalNumberRegex.test(number);
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9+\-\s]{7,}$/;
  return phoneRegex.test(phone);
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

// Validation rules for Form section
export const formSectionValidationRules = {
  firstname: [
    {
      validate: (value) => validateRequired(value),
      message: 'Förnamn är obligatoriskt'
    }
  ],
  lastname: [
    {
      validate: (value) => validateRequired(value),
      message: 'Efternamn är obligatoriskt'
    }
  ],
  personalnumber: [
    {
      validate: (value) => validateRequired(value),
      message: 'Personnummer är obligatoriskt'
    },
    {
      validate: (value) => validatePersonalNumber(value),
      message: 'Ogiltigt personnummerformat (använd XXXXXX-XXXX)'
    }
  ],
  mobile: [
    {
      validate: (value) => validateRequired(value),
      message: 'Mobilnummer är obligatoriskt'
    },
    {
      validate: (value) => validatePhoneNumber(value),
      message: 'Ogiltigt mobilnummerformat'
    }
  ],
  company: [
    {
      validate: (value) => validateRequired(value),
      message: 'Företag är obligatoriskt'
    }
  ],
  department: [
    {
      validate: (value) => validateRequired(value),
      message: 'Avdelning är obligatorisk'
    }
  ],
  jobtitle: [
    {
      validate: (value) => validateRequired(value),
      message: 'Tjänstetitel är obligatorisk'
    }
  ],
  startdate: [
    {
      validate: (value) => validateRequired(value),
      message: 'Startdatum är obligatoriskt'
    }
  ],
  employmentdate: [
    {
      validate: (value) => validateRequired(value),
      message: 'Anställningsdag är obligatorisk'
    }
  ]
};
