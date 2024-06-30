// Constants
import { DEBOUNCE, PAGINATION, SORT, TOAST } from '@/constants';

// Types
import {
  AddFormHandlers,
  Book,
  BookFormMode,
  CompareBook,
  DeleteBookHandler,
  EditFormHandlers,
  FormHandleElements,
  NavigateBookDetailsHandlers,
  PageChangeHandler,
  SearchBookHandler,
  ShowFormHandlers,
  SortBookHandler,
  ToastOptions,
  ToastType,
} from '@/types';

// Utils
import {
  createBookFormModal,
  createBookFormTitle,
  createElement,
  debounce,
  getElement,
  getElements,
  handleDisablePositiveButton,
  handleFileInputChange,
  handleFormSubmit,
  handleInputValidation,
  handleNameInputChange,
  handleNegativeButtonClick,
  hideModal,
  removeChildNodes,
  removeDOMElement,
  removeDOMElementBySelector,
  // showBookForm,
  showModal,
  showToast,
  updateDOMElement,
} from '@/utils';

// Templates
import {
  defaultToastOptions,
  generateBookItem,
  generateConfirmDialog,
  generateListEmpty,
  generatePagination,
  generateRequestError,
  generateSkeletonBookItem,
  modalContentTemplate,
  toastTemplate,
} from '@/templates';

// Icons
import viewDetailsIcon from '../../assets/icons/right-forward.svg';
import deleteIcon from '../../assets/icons/trash.svg';

// Constants
import { BOOK_FORM, CONFIRM_DIALOG } from '@/constants';

// Mocks
import { MOCK_BOOK } from '@/mocks';

export default class BookListView {
  private mainContent: HTMLDivElement;
  private bookListWrapper: HTMLDivElement;
  private bookList: HTMLUListElement;
  private createBtn: HTMLButtonElement;
  private searchBox: HTMLInputElement;
  private sortBtns: NodeListOf<HTMLButtonElement>;
  private sortStatus: string;

  constructor() {
    this.mainContent = getElement('.content');
    this.bookListWrapper = getElement('.book-list-wrapper');
    this.bookList = getElement('.book-list');
    this.createBtn = getElement<HTMLButtonElement>('#btn-create');
    this.searchBox = getElement('#search-box');
    this.sortBtns = getElements('.btn-sort');
    this.sortStatus = '';
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

  displaySkeletonBooks = (count: number) => {
    Array.from({ length: count }).forEach(() => {
      const skeletonBookItem = createElement('li', 'skeleton-book-item');
      skeletonBookItem.innerHTML = generateSkeletonBookItem();
      updateDOMElement(this.bookList, skeletonBookItem);
    });
  };

  displayBooks = (bookList: Book[], booksShow: Book[], currentPage: number) => {
    while (this.bookList.firstChild) {
      this.bookList.removeChild(this.bookList.firstChild);
    }

    // Remove existing Pagination
    removeDOMElementBySelector(this.bookListWrapper, '.pagination');

    // Remove existing Empty list
    removeDOMElementBySelector(this.bookListWrapper, '.list-empty');

    if (booksShow.length === 0) {
      const bookListEmpty = createElement('div', 'list-empty');
      bookListEmpty.innerHTML = generateListEmpty();
      this.bookListWrapper.appendChild(bookListEmpty);
      removeDOMElement(this.bookListWrapper, this.bookList);
    } else {
      booksShow.forEach((book) => {
        const bookItem = createElement('li', 'book-item');
        const icons = { viewDetailsIcon, deleteIcon };
        bookItem.innerHTML = generateBookItem(book, icons);
        bookItem.setAttribute('data-book-id', book.id.toString());
        updateDOMElement(this.bookList, bookItem);
        updateDOMElement(this.bookListWrapper, this.bookList);
      });

      // Display Pagination
      if (bookList.length > PAGINATION.ITEMS_PER_PAGE) {
        const paginationContainer = createElement('div', 'pagination');
        const paginationElement = generatePagination(
          bookList.length,
          PAGINATION.ITEMS_PER_PAGE,
          () => {
            removeDOMElement(this.bookListWrapper, paginationContainer);
          },
          currentPage,
        );

        if (paginationElement) {
          updateDOMElement(paginationContainer, paginationElement);
          updateDOMElement(this.bookListWrapper, paginationContainer);
        }
      }
    }
  };

  bindPageChange = (handler: PageChangeHandler) => {
    this.mainContent.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('btn-pagination')) {
        const pageNumber = parseInt(target.dataset.page!, 10);
        if (pageNumber) {
          handler(pageNumber);
        }
      }
    });
  };

  toggleSortStatus = (target: HTMLElement) => {
    const isAscending = target.classList.contains('asc');
    const isDescending = target.classList.contains('desc');
    const oppositeClass = isAscending ? 'desc' : 'asc';

    let newStatus = '';

    if (isAscending) {
      newStatus = SORT.STATUS.ASCENDING;
    } else if (isDescending) {
      newStatus = SORT.STATUS.DESCENDING;
    }

    // Remove 'active' class from the opposite sort button if it exists
    const oppositeButton = (target.parentElement as HTMLElement).querySelector(`.${oppositeClass}`);
    if (oppositeButton) {
      oppositeButton.classList.remove('active');
    }

    // Toggle the current sort status and the 'active' class on the current button
    if (newStatus === this.sortStatus) {
      // If the current status matches the new, reset to default and remove 'active'
      this.sortStatus = '';
      target.classList.remove('active');
    } else {
      // Otherwise, update to the new status and add 'active'
      this.sortStatus = newStatus;
      target.classList.add('active');
    }
  };

  bindSortBook = (handler: SortBookHandler) => {
    this.sortBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        this.toggleSortStatus(event.target as HTMLElement);
        handler(this.sortStatus);
      });
    });
  };

  bindSearchInputChange = (handler: SearchBookHandler) => {
    const debouncedHandler = debounce(handler, DEBOUNCE.DELAY_TIME);

    this.searchBox.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      debouncedHandler(target.value);
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

  bindAddBook = (addFormHandlers: AddFormHandlers) => {
    const { getImageUrlHandler, getRecommendBookHandler, addBookHandler } = addFormHandlers;

    this.createBtn.addEventListener('click', (event) => {
      event.preventDefault();

      // Get form handles elements

      const showFormHandlers: ShowFormHandlers = {
        getImageUrlHandler,
        getRecommendBookHandler,
        saveHandler: async (data: Omit<Book, 'id'>) => {
          addBookHandler(data);
        },
      };

      this.showBookForm(MOCK_BOOK, BOOK_FORM.MODE.ADD_BOOK, showFormHandlers);
    });
  };

  bindNavigationBookDetails = (handler: NavigateBookDetailsHandlers): void => {
    this.mainContent.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const btnViewDetails = target.closest('.btn-view-details');

      if (btnViewDetails) {
        const bookItem = target.closest('.book-item') as HTMLElement;
        const bookIdString = bookItem.getAttribute('data-book-id') as string;
        const bookId = parseInt(bookIdString);
        handler(bookId);
      }
    });
  };

  bindEditBook = (editFormHandlers: EditFormHandlers) => {
    const { getBookHandler, getRecommendBookHandler, getImageUrlHandler, editBookHandler } = editFormHandlers;

    // Get form handles elements
    this.mainContent.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;

      const bookItem = target.closest('.book-item');

      const btnDelete = target.closest('.btn-delete');
      const btnViewDetails = target.closest('.btn-view-details');

      if (btnDelete || btnViewDetails) {
        return;
      }

      if (bookItem) {
        const bookIdString = bookItem.getAttribute('data-book-id');

        if (bookIdString === null) return;

        const bookId = parseInt(bookIdString);

        const selectedBook = await getBookHandler(bookId);

        if (!selectedBook) return;

        const showFormHandlers: ShowFormHandlers = {
          getImageUrlHandler,
          getRecommendBookHandler,
          saveHandler: (data: Omit<Book, 'id'>) => {
            editBookHandler(bookId, data);
          },
        };

        this.showBookForm(selectedBook, BOOK_FORM.MODE.EDIT_BOOK, showFormHandlers);
      }
    });
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

  bindDeleteBook(handler: DeleteBookHandler) {
    this.mainContent.addEventListener('click', (event) => {
      const btnDelete = (event.target as HTMLElement).closest('.btn-delete');

      if (btnDelete) {
        event.stopPropagation();
        const bookItem = (event.target as HTMLElement).closest('.book-item')!;
        const bookId = parseInt(bookItem.getAttribute('data-book-id') as string, 10);

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
          handler(bookId);
          // Remove the modal from the DOM
          this.mainContent.removeChild(confirmModal);
        });

        // Handling the 'Cancel' button click
        negativeButton.addEventListener('click', () => {
          hideModal(confirmModal);
        });
      }
    });
  }
}
