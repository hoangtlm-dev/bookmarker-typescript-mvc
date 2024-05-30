export type ValidationRule = {
  name: {
    isRequired: boolean;
    maxLength: number;
  };
  authors: {
    isRequired: boolean;
  };
  publishedDate: {
    isRequired: boolean;
    isFutureDate: (value: string) => boolean | '';
  };
  imageUrl: {
    isRequired: boolean;
  };
  description: {
    isRequired: boolean;
  };
};

export type ValidationField = keyof ValidationRule;
