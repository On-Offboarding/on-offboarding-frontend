import { useState } from 'react';

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules object with field names as keys
 * @param {Function} onSubmit - Callback function when form is valid
 * @returns {Object} Form state and handlers
 */
export const useFormValidation = (initialValues, validationRules, onSubmit) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateField = (fieldName, value, data = formData) => {
    const rules = validationRules[fieldName];
    if (!rules) return null;

    for (const rule of rules) {
      if (!rule.validate(value, data)) {
        return rule.message;
      }
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts editing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (onSubmit) {
        onSubmit(formData);
      }
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    handleSubmit,
    validateForm,
    validateField
  };
};
