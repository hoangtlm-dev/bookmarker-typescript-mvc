// Constants
import { BOOK_FORM } from '@/constants';

//Types
import { Book } from './book';
import { GetImageUrlHandler } from './handler';

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

export type FileChangeOptionElements = {
  bookNamePreview: HTMLElement;
  bookImgPreview: HTMLImageElement;
  uploadBtn: HTMLButtonElement;
  positiveButton: HTMLButtonElement;
};

export type FileChangeHandlers = {
  getImageUrlHandler: GetImageUrlHandler;
  setImageUrl: (url: string) => void;
};

export type FormSubmitOptionElements = {
  inputElements: NodeListOf<HTMLInputElement>;
  bookFormModal: HTMLElement;
  positiveButton: HTMLButtonElement;
  mainContent: HTMLElement;
};

export type FormSubmitHandlers = {
  getImageUrl: () => string;
  saveHandler: (input: Omit<Book, 'id'>) => void;
};
