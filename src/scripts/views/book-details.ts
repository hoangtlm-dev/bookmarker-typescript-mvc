// Constants
import { BOOK_FORM, CONFIRM_DIALOG, TOAST } from '../constants';

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
  handleDisablePositiveButton,
  handleNameInputChange,
} from '../utils';

// Templates
import {
  generateBookDetails,
  generateConfirmDialog,
  generateSkeletonBookDetails,
  generateRequestError,
  generateToastContent,
  generateModalContent,
} from '../templates';

//Types
import {
  Book,
  BookFormMode,
  CompareBook,
  DeleteBookHandler,
  EditFormHandlers,
  FormHandleElements,
  NavigateHomeHandler,
  ShowFormHandlers,
  ToastType,
  ToggleTextHandler,
} from '@/types';

// Icons
import closeIcon from '../../assets/icons/close.svg';

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

  bindToastMessage = (type: ToastType, message: string, description: string): void => {
    const toastContainer = createElement('div', 'toast-container');
    const toastContent = generateToastContent(type, message, description, closeIcon);
    showToast(toastContainer, toastContent, TOAST.DURATION_TIME);

    updateDOMElement(this.mainContent, toastContainer);
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

  bindNavigationHome = (handler: NavigateHomeHandler): void => {
    this.mainContent.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const btnBack = target.closest('.btn-back');

      if (btnBack) {
        handler();
      }
    });
  };
  getFormHandleElements = (): FormHandleElements => {
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

    return {
      form,
      inputElements,
      nameInputGroup,
      nameInputElement,
      authorsInputElement,
      publishedDateInputElement,
      descriptionInputElement,
      fileInputElement,
      hiddenFileInputElement,
      bookImgPreview,
      bookNamePreview,
      uploadBtn,
      positiveButton,
      negativeButton,
      booksRecommendation,
    };
  };
  showBookForm = (book: Book, mode: BookFormMode, showFormHandlers: ShowFormHandlers) => {
    const { getImageUrlHandler, getRecommendBookHandler, saveHandler } = showFormHandlers;

    // Create book form title and append into DOM
    const formTitle = createBookFormTitle(book, mode);
    const bookFormModal = createBookFormModal(book, formTitle);
    updateDOMElement(this.mainContent, bookFormModal);

    // Get form handle elements
    const formHandleElements: FormHandleElements = this.getFormHandleElements();
    const {
      form,
      inputElements,
      nameInputGroup,
      nameInputElement,
      authorsInputElement,
      publishedDateInputElement,
      descriptionInputElement,
      fileInputElement,
      hiddenFileInputElement,
      bookImgPreview,
      bookNamePreview,
      uploadBtn,
      positiveButton,
      negativeButton,
      booksRecommendation,
    } = formHandleElements;

    const originalData: CompareBook = {
      name: book.name,
      authors: book.authors.join(','),
      publishedDate: book.publishedDate,
      image: book.image,
      description: book.description,
    };

    // Disable Save button when the data is not changed in edit mode
    if (mode === BOOK_FORM.MODE.EDIT_BOOK) {
      handleDisablePositiveButton(inputElements, positiveButton, originalData);
    }

    // Handle change for file name
    const nameInputChangeElements = {
      nameInputGroup,
      booksRecommendation,
      nameInputElement,
      authorsInputElement,
      publishedDateInputElement,
      descriptionInputElement,
      inputElements,
    };
    const booksRecommendationItemClass = 'text-description book-recommendation-item';
    handleNameInputChange(nameInputChangeElements, booksRecommendationItemClass, getRecommendBookHandler);

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

  bindDeleteBook = (handler: DeleteBookHandler): void => {
    this.mainContent.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const btnDelete = target.closest('.btn-delete');

      if (btnDelete) {
        // Create and show the confirm dialog
        const confirmDialog = generateConfirmDialog(CONFIRM_DIALOG.MESSAGE.DELETE_BOOK, CONFIRM_DIALOG.DESCRIPTION);
        const confirmModalContent = generateModalContent(confirmDialog);
        const confirmModal = createElement('div', 'modal');
        showModal(confirmModal, confirmModalContent);
        updateDOMElement(this.mainContent, confirmModal);

        // Get the positive and negative buttons from the modal
        const positiveButton = getElement('#btn-confirm');
        const negativeButton = getElement('#btn-cancel');

        // Handling the 'OK' button click
        positiveButton.addEventListener('click', () => {
          handler(parseInt(this.bookId));
          // Remove the modal from the DOM
          this.mainContent.removeChild(confirmModal);
        });

        // Handling the 'Cancel' button click
        negativeButton.addEventListener('click', () => {
          hideModal(confirmModal);
        });
      }
    });
  };
}
