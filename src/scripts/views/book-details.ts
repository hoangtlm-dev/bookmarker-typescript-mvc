// Constants
import { BOOK_FORM, CONFIRM_DIALOG, DEBOUNCE, TOAST } from '../constants';

// Utils
import {
  hideModal,
  showModal,
  showToast,
  createElement,
  getElement,
  getElements,
  createBookFormTitle,
  createBookFormModal,
  updateDOMElement,
  handleFileInputChange,
  handleInputValidation,
  handleNegativeButtonClick,
  handleFormSubmit,
  removeChildNodes,
  debounce,
  validateField,
  getCurrentFormData,
} from '../utils';

// Templates
import {
  defaultToastOptions,
  modalContentTemplate,
  toastTemplate,
  generateBookDetails,
  generateConfirmDialog,
  generateSkeletonBookDetails,
  generateRequestError,
} from '../templates';

//Types
import {
  AutoFillFormOptionElements,
  Book,
  BookFormMode,
  CompareBook,
  DeleteBookHandler,
  EditFormHandlers,
  RecommendBook,
  ShowFormHandlers,
  ToastOptions,
  ToastType,
  ToggleTextHandler,
  ValidationField,
} from '@/types';

export default class BookDetailsView {
  private mainContent: HTMLDivElement;
  private bookId: string;

  constructor() {
    this.mainContent = getElement('.content');
    this.bookId = window.location.search.slice(4);
  }

  bindRequestError = (message: string) => {
    removeChildNodes(this.mainContent);
    this.mainContent.innerHTML = generateRequestError(message);
  };

  bindToastMessage = (type: ToastType, message: string, description: string) => {
    const toastContainer = createElement('div', 'toast-container');

    const options: ToastOptions = {
      ...defaultToastOptions,
      type,
    };

    showToast(toastContainer, toastTemplate(message, description, options), TOAST.DISPLAY_TIME);

    this.mainContent.appendChild(toastContainer);
  };

  displaySkeletonBookDetails() {
    const bookDetailsWrapper = createElement('section', 'skeleton-book-details container');
    bookDetailsWrapper.innerHTML = generateSkeletonBookDetails();
    updateDOMElement(this.mainContent, bookDetailsWrapper);
  }

  getBookDetails(book: Book) {
    removeChildNodes(this.mainContent);
    const bookDetailsWrapper = createElement('section', 'book-details container');
    bookDetailsWrapper.innerHTML = generateBookDetails(book);
    updateDOMElement(this.mainContent, bookDetailsWrapper);
  }

  displayRecommendationBooks = (bookListWrapper: HTMLUListElement, books: RecommendBook[]) => {
    while (bookListWrapper.firstChild) {
      bookListWrapper.removeChild(bookListWrapper.firstChild);
    }

    if (books.length > 0) {
      books.forEach((book) => {
        if (book.language !== 'vi') {
          const recommendBookItem = createElement('li', 'text-description book-recommendation-item');
          recommendBookItem.textContent = book.title;
          bookListWrapper.appendChild(recommendBookItem);
        }
      });
    }
  };

  autoFillRecommendBook = (
    bookListElement: HTMLUListElement,
    optionElements: AutoFillFormOptionElements,
    recommendBooks: RecommendBook[],
  ) => {
    const {
      nameInputElement,
      authorsInputElement,
      publishedDateInputElement,
      descriptionInputElement,
      validationInputElements,
    } = optionElements;

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

        this.hideRecommendationBooks(bookListElement);
      }
    });

    nameInputElement.addEventListener('blur', () => {
      this.hideRecommendationBooks(bookListElement);
    });
  };

  hideRecommendationBooks = (bookListWrapper: HTMLUListElement) => {
    bookListWrapper.remove();
  };

  showBookForm = (book: Book, mode: BookFormMode, showFormHandlers: ShowFormHandlers) => {
    const { getImageUrlHandler, getRecommendBookHandler, saveHandler } = showFormHandlers;

    const formTitle = createBookFormTitle(book, mode);
    const bookFormModal = createBookFormModal(book, formTitle);
    updateDOMElement(this.mainContent, bookFormModal);

    const form = getElement<HTMLFormElement>('#book-form');
    const inputElements = getElements<HTMLInputElement>('.input-box');
    const nameInputGroup = getElement<HTMLDivElement>('.input-group.book-name');
    const nameInputElement = getElement<HTMLInputElement>('.input-box[name="book-name"]');
    const authorsInputElement = getElement<HTMLInputElement>('.input-box[name="book-authors"]');
    const publishedDateInputElement = getElement<HTMLInputElement>('.input-box[name="book-published-date"]');
    const descriptionInputElement = getElement<HTMLInputElement>('.input-box[name="book-description"]');
    const fileInputElement = getElement<HTMLInputElement>(`#${BOOK_FORM.FILE_INPUT_ID}`);
    const hiddenFileInputElement = getElement<HTMLInputElement>('.book-form input[type="hidden"]');
    const bookImgPreview = getElement<HTMLImageElement>('.book-img-preview');
    const bookNamePreview = getElement('.book-name-preview');
    const uploadBtn = getElement<HTMLButtonElement>('#btn-upload');
    const positiveButton = getElement<HTMLButtonElement>(`#${BOOK_FORM.POSITIVE_BUTTON_ID}`);
    const negativeButton = getElement<HTMLButtonElement>(`#${BOOK_FORM.NEGATIVE_BUTTON_ID}`);
    const booksRecommendation =
      getElement<HTMLUListElement>('.book-recommendation-list') ||
      createElement<HTMLUListElement>('ul', 'book-recommendation-list');

    const originalData: CompareBook = {
      name: book.name,
      authors: book.authors.join(','),
      publishedDate: book.publishedDate,
      image: book.image,
      description: book.description,
    };

    // Disable Save button when the data is not changed
    if (mode === BOOK_FORM.MODE.EDIT_BOOK) {
      positiveButton.disabled = true;

      const currentData = getCurrentFormData(inputElements);
      const isSameData = JSON.stringify(currentData) === JSON.stringify(originalData);

      const debouncedCompare = debounce(() => {
        if (!isSameData) {
          positiveButton.disabled = false;
        } else {
          positiveButton.disabled = true;
        }
      }, DEBOUNCE.DELAY_TIME);

      inputElements.forEach((input) => {
        input.addEventListener('input', () => {
          debouncedCompare();
        });
      });
    }

    nameInputElement.addEventListener(
      'input',

      debounce(async (event: Event) => {
        const target = event.target as HTMLInputElement;
        const query = target.value.trim();

        if (query) {
          const recommendBooks = await getRecommendBookHandler(query);
          this.displayRecommendationBooks(booksRecommendation, recommendBooks as RecommendBook[]);
          if (!booksRecommendation.parentElement) {
            updateDOMElement(nameInputGroup, booksRecommendation);
          }

          //autofill recommended book
          const optionElements = {
            nameInputElement,
            authorsInputElement,
            publishedDateInputElement,
            descriptionInputElement,
            validationInputElements: inputElements,
          };

          this.autoFillRecommendBook(booksRecommendation, optionElements, recommendBooks as RecommendBook[]);
        } else {
          if (booksRecommendation.parentElement) {
            this.hideRecommendationBooks(booksRecommendation);
          }
        }
      }, DEBOUNCE.DELAY_TIME),
    );

    const fileChangeOptionElements = {
      fileInputElement,
      hiddenFileInputElement,
      bookNamePreview,
      bookImgPreview,
      uploadBtn,
      positiveButton,
    };
    const formSubmitOptionElements = { inputElements, bookFormModal, positiveButton };

    handleFileInputChange(fileInputElement, fileChangeOptionElements, getImageUrlHandler);
    handleInputValidation(inputElements);
    handleNegativeButtonClick(negativeButton, bookFormModal);
    handleFormSubmit(form, mode, book, formSubmitOptionElements, saveHandler);
  };

  bindEditBook = (editFormHandlers: EditFormHandlers) => {
    const { getBookHandler, getRecommendBookHandler, getImageUrlHandler, editBookHandler } = editFormHandlers;
    this.mainContent.addEventListener('click', async (event) => {
      const btnEdit = (event.target as HTMLElement).closest('.btn-edit');

      if (btnEdit) {
        const selectedBook = (await getBookHandler(parseInt(this.bookId))) as Book;

        if (selectedBook instanceof Error) return;

        const showFormHandlers: ShowFormHandlers = {
          getImageUrlHandler,
          getRecommendBookHandler,
          saveHandler: async (data: Omit<Book, 'id'>) => {
            editBookHandler(parseInt(this.bookId), data);
          },
        };

        this.showBookForm(selectedBook, BOOK_FORM.MODE.EDIT_BOOK, showFormHandlers);
      }
    });
  };

  bindToggleText = (handler: ToggleTextHandler) => {
    this.mainContent.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const btnShowDescription = target.closest('.btn-show-description') as HTMLButtonElement;
      const textDescriptionElement = getElement('.book-details-description');

      if (btnShowDescription) {
        handler(parseInt(this.bookId), textDescriptionElement, btnShowDescription);
      }
    });
  };

  bindDeleteBook = (handler: DeleteBookHandler) => {
    this.mainContent.addEventListener('click', (event) => {
      const btnDelete = (event.target as HTMLElement).closest('.btn-delete');

      if (btnDelete) {
        // Create and show the confirm dialog
        const confirmDialogOptions = {
          positiveButtonId: CONFIRM_DIALOG.POSITIVE_BUTTON_ID,
          negativeButtonId: CONFIRM_DIALOG.NEGATIVE_BUTTON_ID,
          positiveText: CONFIRM_DIALOG.POSITIVE_TEXT,
          negativeText: CONFIRM_DIALOG.NEGATIVE_TEXT,
        };
        const confirmDialog = generateConfirmDialog(
          CONFIRM_DIALOG.MESSAGE.DELETE_BOOK,
          CONFIRM_DIALOG.DESCRIPTION,
          confirmDialogOptions,
        );
        const confirmModalContent = modalContentTemplate(confirmDialog);
        const confirmModal = createElement('div', 'modal');
        showModal(confirmModal, confirmModalContent);
        this.mainContent.appendChild(confirmModal);

        // Get the positive and negative buttons from the modal
        const positiveButton = getElement(`#${CONFIRM_DIALOG.POSITIVE_BUTTON_ID}`);
        const negativeButton = getElement(`#${CONFIRM_DIALOG.NEGATIVE_BUTTON_ID}`);

        // Handling the 'OK' button click
        positiveButton.addEventListener('click', () => {
          handler(parseInt(this.bookId));
          // Remove the modal from the DOM
          this.mainContent.removeChild(confirmModal);

          // Show the toast message
          const toastContainer = createElement('div', 'toast-container');
          showToast(
            toastContainer,
            toastTemplate(TOAST.MESSAGE.SUCCESS, TOAST.DESCRIPTION.DELETED_BOOK),
            TOAST.DISPLAY_TIME,
          );

          this.mainContent.appendChild(toastContainer);
        });

        // Handling the 'Cancel' button click
        negativeButton.addEventListener('click', () => {
          hideModal(confirmModal);
        });
      }
    });
  };
}
