export const VALIDATION = {
  MESSAGE: {
    IS_REQUIRED: (field: string) => `${field} cannot be empty!`,
    MAX_LENGTH: (field: string, length: number) => `${field} cannot have more than ${length} characters!`,
    IS_FUTURE_DATE: (field: string) => `${field} cannot be in the future!`,
    IS_VALID_FORMAT: (field: string, extension: string) => `${field} cannot be in ${extension} extension!`,
  },
} as const;
