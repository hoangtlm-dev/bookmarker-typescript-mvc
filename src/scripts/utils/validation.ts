import { ValidationField, ValidationRule } from '@/types';
import { VALIDATION } from '../constants';

const rules: ValidationRule = {
  name: {
    isRequired: true,
    maxLength: 120,
  },
  authors: {
    isRequired: true,
  },
  publishedDate: {
    isRequired: true,
    isFutureDate: (value: string) => value && new Date(value) > new Date(),
  },
  image: {
    isRequired: true,
  },
  description: {
    isRequired: true,
  },
};

// Show error message
export const appendErrorMessage = <T extends HTMLElement>(inputElement: T, errorMessage: string) => {
  if (inputElement.parentElement === null) return;

  let errorElement = inputElement.parentElement.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    inputElement.parentElement.appendChild(errorElement);
  }
  errorElement.textContent = errorMessage;
};

// Remove error message
export const removeErrorMessage = <T extends HTMLElement>(inputElement: T) => {
  if (inputElement.parentElement === null) return;

  const errorElement = inputElement.parentElement.querySelector('.error-message');
  if (errorElement) {
    errorElement.textContent = '';
  }
};

// Validate all fields of form
export const validateForm = (fieldName: ValidationField, value: string, validateFieldName: string) => {
  const fieldRules = rules[fieldName];

  let errorMessage = '';

  // Check required field
  if (fieldRules.isRequired && !value.trim()) {
    errorMessage = VALIDATION.MESSAGE.IS_REQUIRED(validateFieldName);
  } else {
    // Check future date
    if ('isFutureDate' in fieldRules && fieldRules.isFutureDate(value)) {
      errorMessage = VALIDATION.MESSAGE.IS_FUTURE_DATE(validateFieldName);
    }
  }

  return errorMessage;
};

// Validate a field
export const validateField = <T extends HTMLElement>(
  inputElement: T,
  fieldName: ValidationField,
  value: string,
  validateFieldName: string,
) => {
  const errorMessage = validateForm(fieldName, value, validateFieldName);

  if (errorMessage) {
    appendErrorMessage(inputElement, errorMessage);
  } else {
    removeErrorMessage(inputElement);
  }
};
