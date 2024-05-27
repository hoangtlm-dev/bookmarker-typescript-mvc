// Constants
import { BOOK_FORM, TOAST } from '@/constants';

//Types
import {
  Book,
  BookFormData,
  BookFormMode,
  FileChangeHandlers,
  FileChangeOptionElements,
  FormSubmitHandlers,
  FormSubmitOptionElements,
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
  validateField,
  validateForm,
} from '@/utils';

export const createBookFormTitle = (book: Book, mode: BookFormMode) => {
  return mode === BOOK_FORM.MODE.EDIT_BOOK
    ? BOOK_FORM.FORM_TITLE.EDIT_BOOK(book.title)
    : BOOK_FORM.FORM_TITLE.CREATE_BOOK;
};

export const createBookFormModal = (book: Book, formTitle: string) => {
  const bookForm = bookFormTemplate(book, { formTitle });
  const bookFormContent = modalContentTemplate(bookForm);
  const bookFormModal = createElement('div', 'modal');
  showModal(bookFormModal, bookFormContent);
  return bookFormModal;
};

export const handleFileInputChange = (
  fileInput: HTMLInputElement,
  fileChangeOptionElements: FileChangeOptionElements,
  fileChangeHandlers: FileChangeHandlers,
) => {
  const { bookNamePreview, bookImgPreview, positiveButton, uploadBtn } = fileChangeOptionElements;
  const { getImageUrlHandler, setImageUrl } = fileChangeHandlers;

  fileInput.addEventListener('change', async (event) => {
    positiveButton.disabled = true;
    const target = event.target as HTMLInputElement;
    if (target.files === null) return;
    const file = target.files[0];

    bookNamePreview.innerHTML = `Selected: ${file.name}`;
    bookImgPreview.src = URL.createObjectURL(file);
    bookImgPreview.style.width = '96px';
    bookImgPreview.style.height = '116px';
    uploadBtn.style.opacity = '0';

    const formData = new FormData();
    formData.append('image', file);

    const imageUrl = await getImageUrlHandler(formData);
    setImageUrl(imageUrl);
    positiveButton.disabled = false;
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
  formSubmitHandlers: FormSubmitHandlers,
) => {
  const { getImageUrl, saveHandler } = formSubmitHandlers;
  const { inputElements, bookFormModal, mainContent } = formSubmitOptionElements;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const title = formData.get('book-name') as string;
    const authors = formData.get('book-authors') as string;
    if (authors === null) return;
    const authorList = authors.split(',').map((author) => author.trim());

    const publishedDate = formData.get('book-published-date') as string;
    const description = formData.get('book-description') as string;
    const imageUrl = getImageUrl();
    const currentTime = new Date().getTime().toString();

    const submitData: Omit<Book, 'id'> = {
      title,
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

    // Check if the original data is the same as the submitted data
    const attributesToCheck: (keyof BookFormData)[] = ['title', 'description', 'authors', 'imageUrl', 'publishedDate'];

    if (isDataEqual(originalData, submitData, attributesToCheck)) {
      return;
    }

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
