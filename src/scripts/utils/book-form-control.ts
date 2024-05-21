// Constants
import { BOOK_FORM, TOAST } from '@/constants';

//Types
import { Book, GetImageUrlHandler } from '@/types';

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

export const createBookFormTitle = (book: Book, isEdit: boolean) => {
  return isEdit ? BOOK_FORM.FORM_TITLE.EDIT_BOOK(book.title) : BOOK_FORM.FORM_TITLE.CREATE_BOOK;
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
  bookNamePreview: HTMLElement,
  bookImgPreview: HTMLImageElement,
  uploadBtn: HTMLButtonElement,
  positiveButton: HTMLButtonElement,
  getImageUrlHandler: GetImageUrlHandler,
  setImageUrl: (url: string) => void,
) => {
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

export const handleFormSubmit = (
  form: HTMLFormElement,
  inputElements: NodeListOf<HTMLInputElement>,
  getImageUrl: () => string,
  isEdit: boolean,
  saveCallback: (input: Omit<Book, 'id'>) => void,
  bookFormModal: HTMLElement,
  mainContent: HTMLElement,
) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    if (formData === null) return;

    const title = formData.get('book-name') as string;
    const authors = formData.get('book-authors') as string;
    if (authors === null) return;
    const authorList = authors.split(',').map((author) => author.trim());

    const publishedDate = formData.get('book-published-date') as string;
    const description = formData.get('book-description') as string;
    const imageUrl = getImageUrl();

    const data: Omit<Book, 'id'> = {
      title,
      authors: authorList,
      publishedDate,
      description,
      imageUrl,
      createdAt: new Date().getTime().toString(),
      updatedAt: new Date().getTime().toString(),
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

    saveCallback(data);
    hideModal(bookFormModal);

    const toastContainer = createElement('div', 'toast-container');
    showToast(
      toastContainer,
      toastTemplate(TOAST.MESSAGE.SUCCESS, isEdit ? TOAST.DESCRIPTION.EDITED_BOOK : TOAST.DESCRIPTION.ADDED_BOOK),
      TOAST.DISPLAY_TIME,
    );

    updateDOMElement(mainContent, toastContainer);
  });
};
