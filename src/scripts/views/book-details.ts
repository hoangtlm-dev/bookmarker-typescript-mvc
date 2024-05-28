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
} from '../utils';

// Templates
import {
  modalContentTemplate,
  toastTemplate,
  generateBookDetails,
  generateConfirmDialog,
  generateSkeletonBookDetails,
  generateRequestError,
} from '../templates';

//Types
import { Book, BookFormMode, DeleteBookHandler, EditFormHandlers, ShowFormHandlers } from '@/types';

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

  showBookForm = (book: Book, mode: BookFormMode, showFormHandlers: ShowFormHandlers) => {
    const { getImageUrlHandler, saveHandler } = showFormHandlers;

    const formTitle = createBookFormTitle(book, mode);
    const bookFormModal = createBookFormModal(book, formTitle);
    this.mainContent.appendChild(bookFormModal);

    const mainContent = this.mainContent;
    const form = getElement<HTMLFormElement>('#book-form');
    const inputElements = getElements<HTMLInputElement>('.input-box');
    const fileInput = getElement<HTMLInputElement>(`#${BOOK_FORM.FILE_INPUT_ID}`);
    const hiddenFileInput = getElement<HTMLInputElement>('.book-form input[type="hidden"]');
    const bookImgPreview = getElement<HTMLImageElement>('.book-img-preview');
    const bookNamePreview = getElement('.book-name-preview');
    const uploadBtn = getElement<HTMLButtonElement>('#btn-upload');
    const positiveButton = getElement<HTMLButtonElement>(`#${BOOK_FORM.POSITIVE_BUTTON_ID}`);
    const negativeButton = getElement<HTMLButtonElement>(`#${BOOK_FORM.NEGATIVE_BUTTON_ID}`);

    const fileChangeOptionElements = { bookNamePreview, bookImgPreview, hiddenFileInput, uploadBtn, positiveButton };
    const formSubmitOptionElements = { inputElements, bookFormModal, positiveButton, mainContent };

    handleFileInputChange(fileInput, fileChangeOptionElements, getImageUrlHandler);
    handleInputValidation(inputElements);
    handleNegativeButtonClick(negativeButton, bookFormModal);
    handleFormSubmit(form, mode, book, formSubmitOptionElements, saveHandler);
  };

  bindEditBook = (editFormHandlers: EditFormHandlers) => {
    const { getBookHandler, getImageUrlHandler, editBookHandler } = editFormHandlers;
    this.mainContent.addEventListener('click', async (event) => {
      const btnEdit = (event.target as HTMLElement).closest('.btn-edit');

      if (btnEdit) {
        const selectedBook = await getBookHandler(parseInt(this.bookId));

        const showFormHandlers: ShowFormHandlers = {
          getImageUrlHandler,
          saveHandler: async (data: Omit<Book, 'id'>) => {
            editBookHandler(parseInt(this.bookId), data);
          },
        };

        this.showBookForm(selectedBook, BOOK_FORM.MODE.EDIT_BOOK, showFormHandlers);
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
