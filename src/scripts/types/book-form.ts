import { Book } from './book';

export type BookOptions = {
  formTitle: string;
  formId: string;
  uploadButtonId: string;
  fileInputId: string;
  positiveButtonId: string;
  negativeButtonId: string;
  positiveText: string;
  negativeText: string;
};

export type BookFormData = Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
