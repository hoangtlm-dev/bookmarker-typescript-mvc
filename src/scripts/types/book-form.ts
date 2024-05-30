// Constants
import { BOOK_FORM } from '@/constants';

//Types
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

export type BookFormMode = (typeof BOOK_FORM.MODE)[keyof typeof BOOK_FORM.MODE];

export type BookFormData = Omit<Book, 'id' | 'updatedAt' | 'deletedAt'>;

export type AutoFillFormOptionElements = {
  nameInputElement: HTMLInputElement;
  authorsInputElement: HTMLInputElement;
  publishedDateInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  validationInputElements: NodeListOf<HTMLInputElement>;
};

export type FileChangeOptionElements = {
  bookNamePreview: HTMLElement;
  bookImgPreview: HTMLImageElement;
  hiddenFileInputElement: HTMLInputElement;
  uploadBtn: HTMLButtonElement;
  positiveButton: HTMLButtonElement;
};

export type FormSubmitOptionElements = {
  inputElements: NodeListOf<HTMLInputElement>;
  bookFormModal: HTMLElement;
  positiveButton: HTMLButtonElement;
  mainContent: HTMLElement;
};
