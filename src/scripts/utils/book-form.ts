// Constants
import { BOOK_FORM, DEBOUNCE } from '@/constants';

//Types
import {
  AutoFillFormOptionElements,
  Book,
  BookFormData,
  BookFormMode,
  CompareBook,
  FileChangeOptionElements,
  FormSubmitOptionElements,
  GetImageUrlHandler,
  GetRecommendBookHandler,
  NameInputChangeElements,
  RecommendBook,
  ValidationField,
} from '@/types';

//Templates
import { bookFormTemplate, generateModalContent } from '@/templates';

// Utils
import {
  appendErrorMessage,
  createElement,
  hideModal,
  showModal,
  updateDOMElement,
  removeDOMElement,
  validateField,
  validateForm,
  debounce,
} from '@/utils';

export const createBookFormTitle = (book: Book, mode: BookFormMode) => {
  return mode === BOOK_FORM.MODE.EDIT_BOOK
    ? BOOK_FORM.FORM_TITLE.EDIT_BOOK(book.name)
    : BOOK_FORM.FORM_TITLE.CREATE_BOOK;
};

export const createBookFormModal = (book: Book, formTitle: string) => {
  const bookForm = bookFormTemplate(book, { formTitle });
  const bookFormContent = generateModalContent(bookForm);
  const bookFormModal = createElement('div', 'modal');
  showModal(bookFormModal, bookFormContent);
  return bookFormModal;
};

export const getCurrentFormData = (
  inputElements: NodeListOf<HTMLInputElement>,
  fileChangeOptionElements?: FileChangeOptionElements,
  getImageUrlHandler?: GetImageUrlHandler,
): { [key: string]: string } => {
  const currentFormData: { [key: string]: string } = {};

  inputElements.forEach((input) => {
    if (input.type === 'file' && fileChangeOptionElements && getImageUrlHandler) {
      handleFileInputChange(input, fileChangeOptionElements, getImageUrlHandler);
    }

    currentFormData[input.getAttribute('data-field-name') as string] = input.value.trim();
  });

  return currentFormData;
};

export const clearFileInputData = (fileChangeOptionElements: FileChangeOptionElements) => {
  const { fileInputElement, hiddenFileInputElement, bookNamePreview, bookImgPreview, positiveButton, uploadBtn } =
    fileChangeOptionElements;

  fileInputElement.disabled = true;
  hiddenFileInputElement.value = '';
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
  const { fileInputElement, bookNamePreview, bookImgPreview, hiddenFileInputElement, positiveButton } =
    fileChangeOptionElements;

  fileInputElement.disabled = false;
  bookNamePreview.innerHTML = `Selected: ${file.name}`;
  bookImgPreview.src = URL.createObjectURL(file);
  bookImgPreview.style.width = '96px';
  bookImgPreview.style.height = '116px';

  hiddenFileInputElement.value = imageUrl;

  if (hiddenFileInputElement) {
    validateField(hiddenFileInputElement, 'image', imageUrl, "Book's image");
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
    updateDOMElement(fileChangeOptionElements.bookNamePreview, spinner);

    const imageUrl = await getImageUrlHandler(formData);

    updateFileInputData(file, imageUrl as string, fileChangeOptionElements);
    removeDOMElement(fileChangeOptionElements.bookNamePreview, spinner);
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

export const autoFillRecommendBook = (
  bookListElement: HTMLUListElement,
  formDataElements: AutoFillFormOptionElements,
  recommendBooks: RecommendBook[],
) => {
  const {
    nameInputElement,
    authorsInputElement,
    publishedDateInputElement,
    descriptionInputElement,
    validationInputElements,
  } = formDataElements;

  //Prevent blur when clicking on item
  bookListElement.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });

  bookListElement.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains('book-recommendation-item')) {
      const selectedRecommendBook = recommendBooks.find((book) => book.title === target.textContent);

      if (selectedRecommendBook) {
        // Update form value
        nameInputElement.value = selectedRecommendBook.title;
        authorsInputElement.value = selectedRecommendBook.authors.toString();
        publishedDateInputElement.value = selectedRecommendBook.publishedDate;
        descriptionInputElement.value = selectedRecommendBook.description;
      }

      // Validate field when auto field
      validationInputElements.forEach((input) => {
        validateField(
          input,
          input.getAttribute('data-field-name') as ValidationField,
          input.value,
          input.getAttribute('data-field-validate') as string,
        );
      });

      hideRecommendationBooks(bookListElement);
    }
  });

  nameInputElement.addEventListener('blur', () => {
    hideRecommendationBooks(bookListElement);
  });
};

export const displayRecommendationBooks = (
  bookListWrapper: HTMLUListElement,
  books: RecommendBook[],
  recommendationBookClass: string,
) => {
  while (bookListWrapper.firstChild) {
    bookListWrapper.removeChild(bookListWrapper.firstChild);
  }

  if (books.length > 0) {
    books.forEach((book) => {
      if (book.language !== 'vi') {
        const recommendBookItem = createElement('li', recommendationBookClass);
        recommendBookItem.textContent = book.title;
        bookListWrapper.appendChild(recommendBookItem);
      }
    });
  }
};

export const hideRecommendationBooks = (bookListWrapper: HTMLUListElement) => {
  bookListWrapper.remove();
};

export const handleNameInputChange = (
  nameInputChangeElements: NameInputChangeElements,
  booksRecommendationItemClass: string,
  getRecommendBookHandler: GetRecommendBookHandler,
) => {
  const {
    nameInputGroup,
    booksRecommendation,
    nameInputElement,
    authorsInputElement,
    publishedDateInputElement,
    descriptionInputElement,
    inputElements,
  } = nameInputChangeElements;

  nameInputElement.addEventListener(
    'input',
    debounce(async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const query = target.value.trim();

      if (query) {
        const recommendBooks = await getRecommendBookHandler(query);
        displayRecommendationBooks(
          booksRecommendation,
          recommendBooks as RecommendBook[],
          booksRecommendationItemClass,
        );

        if (!booksRecommendation.parentElement) {
          updateDOMElement(nameInputGroup, booksRecommendation);
        }

        // autofill recommended book
        const formDataElements = {
          nameInputElement,
          authorsInputElement,
          publishedDateInputElement,
          descriptionInputElement,
          validationInputElements: inputElements,
        };

        autoFillRecommendBook(booksRecommendation, formDataElements, recommendBooks as RecommendBook[]);
      } else {
        if (booksRecommendation.parentElement) {
          hideRecommendationBooks(booksRecommendation);
        }
      }
    }, DEBOUNCE.DELAY_TIME),
  );
};

export const handleDisablePositiveButton = (
  inputElements: NodeListOf<HTMLInputElement>,
  positiveButton: HTMLButtonElement,
  originalData: CompareBook,
) => {
  positiveButton.disabled = true;

  inputElements.forEach((input) => {
    input.addEventListener('input', () => {
      const currentData = getCurrentFormData(inputElements);
      const isSameData = JSON.stringify(currentData) === JSON.stringify(originalData);

      const debouncedCompare = debounce(() => {
        if (!isSameData) {
          positiveButton.disabled = false;
        } else {
          positiveButton.disabled = true;
        }
      }, DEBOUNCE.DELAY_TIME);

      debouncedCompare();
    });
  });
};

export const handleFormSubmit = (
  form: HTMLFormElement,
  mode: BookFormMode,
  originalData: BookFormData,
  formSubmitOptionElements: FormSubmitOptionElements,
  saveHandler: (input: Omit<Book, 'id'>) => void,
) => {
  const { inputElements, bookFormModal } = formSubmitOptionElements;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const name = formData.get('book-name') as string;
    const authors = formData.get('book-authors') as string;
    if (authors === null) return;
    const authorList = authors.split(',').map((author) => author.trim());

    const publishedDate = formData.get('book-published-date') as string;
    const description = formData.get('book-description') as string;
    const image = formData.get('book-image') as string;
    const currentTime = new Date().getTime().toString();

    const submitData: Omit<Book, 'id'> = {
      name,
      authors: authorList,
      publishedDate,
      description,
      image,
      createdAt: mode === BOOK_FORM.MODE.EDIT_BOOK ? originalData.createdAt : currentTime,
      updatedAt: currentTime,
    };

    let isFormValid = true;

    inputElements.forEach((input) => {
      let validateValue = '';
      if (input.type === 'file') {
        validateValue = image;
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
  });
};
