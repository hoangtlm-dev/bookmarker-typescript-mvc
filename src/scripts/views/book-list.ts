// Constants
import { PAGINATION } from '@/constants';

// Types
import { Book, PageChangeHandler } from '@/types';

// Utils
import {
  createElement,
  getElement,
  getElements,
  removeDOMElement,
  removeDOMElementBySelector,
  updateDOMElement,
} from '@/utils';

// Templates
import { generateBookItem, generateListEmpty, generatePagination } from '@/templates';

// Icons
import viewDetailsIcon from '../../assets/icons/left-forward.svg';
import deleteIcon from '../../assets/icons/trash.svg';

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
    this.createBtn = getElement('#btn-create');
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
}
