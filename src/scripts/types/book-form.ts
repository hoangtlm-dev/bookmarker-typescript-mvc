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

export type BookFormData = Omit<Book, 'id' | 'updatedAt'>;

export type FormHandleElements = {
  form: HTMLFormElement;
  inputElements: NodeListOf<HTMLInputElement>;
  nameInputGroup: HTMLDivElement;
  nameInputElement: HTMLInputElement;
  authorsInputElement: HTMLInputElement;
  publishedDateInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  fileInputElement: HTMLInputElement;
  hiddenFileInputElement: HTMLInputElement;
  bookImgPreview: HTMLImageElement;
  bookNamePreview: HTMLSpanElement;
  uploadBtn: HTMLButtonElement;
  positiveButton: HTMLButtonElement;
  negativeButton: HTMLButtonElement;
  booksRecommendation: HTMLUListElement;
};

export type AutoFillFormOptionElements = {
  nameInputElement: HTMLInputElement;
  authorsInputElement: HTMLInputElement;
  publishedDateInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  validationInputElements: NodeListOf<HTMLInputElement>;
};

export type NameInputChangeElements = {
  nameInputGroup: HTMLDivElement;
  booksRecommendation: HTMLUListElement;
  nameInputElement: HTMLInputElement;
  authorsInputElement: HTMLInputElement;
  publishedDateInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  inputElements: NodeListOf<HTMLInputElement>;
};

export type FileChangeOptionElements = {
  fileInputElement: HTMLInputElement;
  hiddenFileInputElement: HTMLInputElement;
  bookNamePreview: HTMLElement;
  bookImgPreview: HTMLImageElement;
  uploadBtn: HTMLButtonElement;
  positiveButton: HTMLButtonElement;
};

export type FormSubmitOptionElements = {
  inputElements: NodeListOf<HTMLInputElement>;
  bookFormModal: HTMLElement;
  positiveButton: HTMLButtonElement;
};
