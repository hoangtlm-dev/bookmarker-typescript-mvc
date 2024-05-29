// Constants
import { BOOK_FORM, TOAST } from '@/constants';

//Types
import {
  Book,
  BookFormData,
  BookFormMode,
  FileChangeOptionElements,
  FormSubmitOptionElements,
  GetImageUrlHandler,
} from '@/types';

//Templates
import { bookFormTemplate, modalContentTemplate, toastTemplate } from '@/templates';

// Utils
import {
  ValidationField,
  appendErrorMessage,
  createElement,
  hideModal,
  showModal,
  showToast,
  updateDOMElement,
  removeDOMElement,
  validateField,
  validateForm,
} from '@/utils';

export const createBookFormTitle = (book: Book, mode: BookFormMode) => {
  return mode === BOOK_FORM.MODE.EDIT_BOOK
    ? BOOK_FORM.FORM_TITLE.EDIT_BOOK(book.name)
    : BOOK_FORM.FORM_TITLE.CREATE_BOOK;
};

export const createBookFormModal = (book: Book, formTitle: string) => {
  const bookForm = bookFormTemplate(book, { formTitle });
  const bookFormContent = modalContentTemplate(bookForm);
  const bookFormModal = createElement('div', 'modal');
  showModal(bookFormModal, bookFormContent);
  return bookFormModal;
};

export const getCurrentFormData = (
  inputElements: NodeListOf<HTMLInputElement>,
  fileChangeOptionElements?: FileChangeOptionElements,
  getImageUrlHandler?: GetImageUrlHandler,
) => {
  const currentFormData: { [key: string]: string } = {};
  inputElements.forEach((input) => {
    if (input.type === 'file' && fileChangeOptionElements && getImageUrlHandler) {
      handleFileInputChange(input, fileChangeOptionElements, getImageUrlHandler);
    }
    currentFormData[input.getAttribute('data-field-name') as string] = input.value;
  });
  return currentFormData;
};

export const clearFileInputData = (fileChangeOptionElements: FileChangeOptionElements) => {
  const { bookNamePreview, bookImgPreview, hiddenFileInput, positiveButton, uploadBtn } = fileChangeOptionElements;

  hiddenFileInput.value = '';
  bookNamePreview.innerHTML = '';
  bookImgPreview.src = '';
  bookImgPreview.style.width = '0';
  bookImgPreview.style.height = '0';
  uploadBtn.style.display = 'none';
  positiveButton.disabled = true;
};

export const updateFileInputData = (
  file: File,
  imageUrl: string,
  fileChangeOptionElements: FileChangeOptionElements,
) => {
  const { bookNamePreview, bookImgPreview, hiddenFileInput, positiveButton } = fileChangeOptionElements;

  bookNamePreview.innerHTML = `Selected: ${file.name}`;
  bookImgPreview.src = URL.createObjectURL(file);
  bookImgPreview.style.width = '96px';
  bookImgPreview.style.height = '116px';

  hiddenFileInput.value = imageUrl;

  if (hiddenFileInput) {
    validateField(hiddenFileInput, 'imageUrl', imageUrl, "Book's image");
  }

  positiveButton.disabled = false;
};

export const handleFileInputChange = (
  fileInput: HTMLInputElement,
  fileChangeOptionElements: FileChangeOptionElements,
  getImageUrlHandler: GetImageUrlHandler,
) => {
  fileInput.addEventListener('change', async (event) => {
    const spinner = createElement('div', 'spinner');
    const target = event.target as HTMLInputElement;

    if (target.files === null || target.files.length === 0) {
      return;
    }
    const file = target.files[0];

    const formData = new FormData();
    formData.append('image', file);

    clearFileInputData(fileChangeOptionElements);
    updateDOMElement(fileInput.parentElement as HTMLElement, spinner);

    const imageUrl = await getImageUrlHandler(formData);

    updateFileInputData(file, imageUrl, fileChangeOptionElements);
    removeDOMElement(fileInput.parentElement as HTMLElement, spinner);
  });
};

export const handleInputValidation = (inputElements: NodeListOf<HTMLInputElement>) => {
  inputElements.forEach((input) => {
    input.addEventListener('input', () => {
      const validateFieldName = input.getAttribute('data-field-validate');
      const inputField = input.getAttribute('data-field-name') as ValidationField;
      if (validateFieldName !== null) validateField(input, inputField, input.value, validateFieldName);
    });
  });
};

export const handleNegativeButtonClick = (negativeButton: HTMLButtonElement, bookFormModal: HTMLElement) => {
  negativeButton.addEventListener('click', () => hideModal(bookFormModal));
};

export const isDataEqual = <T>(obj1: T, obj2: T, attributes: (keyof T)[]) => {
  return attributes.every((attr) => {
    const value1 = obj1[attr];
    const value2 = obj2[attr];
    if (Array.isArray(value1) && Array.isArray(value2)) {
      return JSON.stringify(value1) === JSON.stringify(value2);
    }
    return value1 === value2;
  });
};

export const handleFormSubmit = (
  form: HTMLFormElement,
  mode: BookFormMode,
  originalData: BookFormData,
  formSubmitOptionElements: FormSubmitOptionElements,
  saveHandler: (input: Omit<Book, 'id'>) => void,
) => {
  const { inputElements, bookFormModal, mainContent } = formSubmitOptionElements;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const name = formData.get('book-name') as string;
    const authors = formData.get('book-authors') as string;
    if (authors === null) return;
    const authorList = authors.split(',').map((author) => author.trim());

    const publishedDate = formData.get('book-published-date') as string;
    const description = formData.get('book-description') as string;
    const imageUrl = formData.get('book-image') as string;
    const currentTime = new Date().getTime().toString();

    const submitData: Omit<Book, 'id'> = {
      name,
      authors: authorList,
      publishedDate,
      description,
      imageUrl,
      createdAt: mode === BOOK_FORM.MODE.EDIT_BOOK ? originalData.createdAt : currentTime,
      updatedAt: currentTime,
      deletedAt: undefined,
    };

    let isFormValid = true;
    inputElements.forEach((input) => {
      let validateValue = '';
      if (input.type === 'file') {
        validateValue = imageUrl;
      } else {
        validateValue = input.value;
      }

      const inputField = input.getAttribute('data-field-name') as ValidationField;
      const errorField = input.getAttribute('data-field-validate') as string;
      const error = validateForm(inputField, validateValue, errorField);

      if (error) {
        isFormValid = false;
        appendErrorMessage(input, error);
      }
    });

    if (!isFormValid) return;

    saveHandler(submitData);

    hideModal(bookFormModal);

    const toastContainer = createElement('div', 'toast-container');
    showToast(
      toastContainer,
      toastTemplate(
        TOAST.MESSAGE.SUCCESS,
        mode === BOOK_FORM.MODE.EDIT_BOOK ? TOAST.DESCRIPTION.EDITED_BOOK : TOAST.DESCRIPTION.ADDED_BOOK,
      ),
      TOAST.DISPLAY_TIME,
    );

    updateDOMElement(mainContent, toastContainer);
  });
};
