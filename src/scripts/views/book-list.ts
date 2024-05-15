// Constants
import { PAGINATION, TOAST } from '@/constants';

// Types
import { AddBookHandler, Book, GetImageUrlHandler, PageChangeHandler } from '@/types';

// Utils
import {
  ValidationField,
  appendErrorMessage,
  createElement,
  getElement,
  getElements,
  removeDOMElement,
  removeDOMElementBySelector,
  updateDOMElement,
  validateField,
  validateForm,
} from '@/utils';

// Templates
import { generateBookItem, generateListEmpty, generatePagination, toastTemplate, bookFormTemplate } from '@/templates';

// Icons
import viewDetailsIcon from '../../assets/icons/left-forward.svg';
import deleteIcon from '../../assets/icons/trash.svg';

// Constants
import { BOOK_FORM } from '@/constants';

// Utils
import { hideModal, showModal, showToast, modalContentTemplate } from '@/utils';

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

  displaySkeletonBooks = (count: number) => {
    for (let i = 0; i < count; i++) {
      const skeletonBookItem = createElement('li', 'book-item loading');
      skeletonBookItem.innerHTML = generateBookItem();
      updateDOMElement(this.bookList, skeletonBookItem);
    }
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

  bindPageChange(handler: PageChangeHandler) {
    this.mainContent.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('btn-pagination')) {
        const pageNumber = parseInt(target.dataset.page!, 10);
        if (pageNumber) {
          handler(pageNumber);
        }
      }
    });
  }

  bindAddBook = (getImageUrlHandler: GetImageUrlHandler, addHandler: AddBookHandler) => {
    this.createBtn.addEventListener('click', (event) => {
      event.preventDefault();

      this.showBookForm(MOCK_BOOK, false, getImageUrlHandler, async (data: Partial<Book>) => {
        addHandler(data);
      });
    });
  };

  showBookForm = (
    book: Book,
    isEdit: boolean,
    getImageUrlHandler: GetImageUrlHandler,
    saveCallback: (data: Partial<Book>) => Promise<void>,
  ) => {
     
    const formTitle = isEdit ? BOOK_FORM.FORM_TITLE.EDIT_BOOK(book.name) : BOOK_FORM.FORM_TITLE.CREATE_BOOK;
    const bookForm = bookFormTemplate(book, { formTitle });
    const bookFormContent = modalContentTemplate(bookForm);
    const bookFormModal = createElement('div', 'modal');

    showModal(bookFormModal, bookFormContent);
    this.mainContent.appendChild(bookFormModal);

    // Get form element
    const form = getElement<HTMLFormElement>('#book-form');
    const inputElements = getElements<HTMLInputElement>('.input-box');
    const fileInput = getElement<HTMLInputElement>(`#${BOOK_FORM.FILE_INPUT_ID}`);
    const bookImgPreview = getElement<HTMLImageElement>('.book-img-preview');
    const bookNamePreview = getElement('.book-name-preview');
    const uploadBtn = getElement<HTMLButtonElement>('#btn-upload');

    // Get image url
    let imageUrl = book.imageUrl || '';

    const positiveButton = getElement<HTMLButtonElement>(`#${BOOK_FORM.POSITIVE_BUTTON_ID}`);

    fileInput.addEventListener('change', async (event) => {
      positiveButton.disabled = true;
      const target = event.target as HTMLInputElement;

      if (target.files === null) return;

      const file = target.files[0];

      bookNamePreview.innerHTML = `Selected: ${file.name}`;
      bookImgPreview.src = URL.createObjectURL(file);
      const oldBookImgStyle = bookImgPreview.getAttribute('style') ?? '';
      const newBookImgStyle = oldBookImgStyle + 'width: 96px; height: 116px';
      bookImgPreview.setAttribute('style', newBookImgStyle);

      const oldUploadBtnStyle = uploadBtn.getAttribute('style') ?? '';
      const newUploadBtnStyle = oldUploadBtnStyle + 'opacity: 0';
      uploadBtn.setAttribute('style', newUploadBtnStyle);

      const formData = new FormData();
      formData.append('image', file);

      imageUrl = await getImageUrlHandler(formData);

      positiveButton.disabled = false;
    });

    // Handling form inputs for validation
    inputElements.forEach((input) => {
      input.addEventListener('input', () => {
        const validateFieldName = input.getAttribute('data-field-validate');

        const inputField = input.getAttribute('data-field-name') as ValidationField;

        if (validateFieldName !== null) validateField(input, inputField, input.value, validateFieldName);
      });
    });

    const negativeButton = getElement<HTMLButtonElement>(`#${BOOK_FORM.NEGATIVE_BUTTON_ID}`);

    negativeButton.addEventListener('click', () => hideModal(bookFormModal));

    // Handling the 'Save' button click within the form
     
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      // Use FormData to retrieve form data
      const formData = new FormData(form);
      if (formData === null) return;

      const name = formData.get('book-name') as string;
      const authors = formData.get('book-authors') as string;

      if (authors === null) return;
      const authorList = authors.split(',').map((author) => author.trim());

      const publishedDate = formData.get('book-published-date') as string;
      const description = formData.get('book-description') as string;

      const data: Omit<Book, 'id'> = {
        name,
        authors: authorList,
        publishedDate,
        description,
        imageUrl,
        createdAt: new Date().getTime().toLocaleString(),
        updatedAt: new Date().getTime().toLocaleString(),
        deletedAt: undefined,
      };

      // validate all fields before submitting
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

      // Stop execution if the form is not valid
      if (!isFormValid) {
        return;
      }

      saveCallback(data);

      // Remove the modal from the DOM
      hideModal(bookFormModal);

      // Show the toast message
      const toastContainer = createElement('div', 'toast-container');
      showToast(
        toastContainer,
        toastTemplate(TOAST.MESSAGE.SUCCESS, isEdit ? TOAST.DESCRIPTION.EDITED_BOOK : TOAST.DESCRIPTION.ADDED_BOOK),
        TOAST.DISPLAY_TIME,
      );

      this.mainContent.appendChild(toastContainer);
    });
  };
}
