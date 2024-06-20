// Constants
import { PAGINATION, SORT, TOAST } from '@/constants';

//Types
import { AddFormHandlers, Book, EditFormHandlers } from '@/types';

import BookModel from '@/models/book';
import BookListView from '@/views/book-list';

//Utils
import { sortArray } from '@/utils/sort-array';

export default class BookListController {
  private bookModel: BookModel;
  private bookListView: BookListView;
  private renderBooks: Book[];
  private currentPage: number;
  private itemsPerPage: number;
  private sortStatus: string;
  private addFormHandlers: AddFormHandlers;
  private editFormHandlers: EditFormHandlers;

  constructor(bookModel: BookModel, bookListView: BookListView) {
    this.bookModel = bookModel;
    this.bookListView = bookListView;
    this.renderBooks = [];
    this.currentPage = 1;
    this.itemsPerPage = PAGINATION.ITEMS_PER_PAGE;
    this.sortStatus = '';

    this.addFormHandlers = {
      getImageUrlHandler: this.handleGetImageUrl,
      getRecommendBookHandler: this.handleGetRecommendBooks,
      addBookHandler: this.handleAddBook,
    };

    this.editFormHandlers = {
      getBookHandler: this.handleGetBookById,
      getRecommendBookHandler: this.handleGetRecommendBooks,
      getImageUrlHandler: this.handleGetImageUrl,
      editBookHandler: this.handleEditBook,
    };
  }

  init = async () => {
    await this.displayBookList();
    this.bookListView.bindPageChange(this.handlePageChange);
    this.bookListView.bindAddBook(this.addFormHandlers);
    this.bookListView.bindEditBook(this.editFormHandlers);
    this.bookListView.bindSearchInputChange(this.handleSearchBook);
    this.bookListView.bindSortBook(this.handleSortBookByTitle);
    this.bookListView.bindDeleteBook(this.handleDeleteBook);
  };

  displayBookList = async (page: number = 1, itemsPerPage: number = PAGINATION.ITEMS_PER_PAGE) => {
    try {
      this.bookListView.displaySkeletonBooks(PAGINATION.ITEMS_PER_PAGE);

      // Get book in a pages
      const params = `?_page=${page}&_limit=${itemsPerPage}`;
      const response = await this.bookModel.getBooks(params);
      const books = response.data;
      const totalBooks = response.totalPage;
      const newestBooks = sortArray(books, SORT.KEY.CREATED_AT, SORT.STATUS.DESCENDING);

      this.bookListView.displayBooks(newestBooks, totalBooks, page);
    } catch (error) {
      if (error instanceof Error) {
        this.bookListView.bindRequestError(error.message);
      } else {
        this.bookListView.bindRequestError(error as string);
      }
    }
  };

  updateBookList = (bookList: Book[]) => {
    // const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    // const endIndex = startIndex + this.itemsPerPage;
    // const booksRender = bookList.slice(startIndex, endIndex);
    this.bookListView.displayBooks(bookList, bookList.length, this.currentPage);
  };

  handlePageChange = (pageNumber: number) => {
    this.currentPage = pageNumber;
    this.displayBookList(this.currentPage, this.itemsPerPage);
  };

  handleAddBook = async (data: Omit<Book, 'id'>) => {
    try {
      await this.bookModel.addBook(data);
      await this.displayBookList();
    } catch (error) {
      if (error instanceof Error) {
        this.bookListView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error.message);
      } else {
        this.bookListView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error as string);
      }
    }
  };

  handleGetRecommendBooks = async (query: string) => {
    try {
      const response = await this.bookModel.getRecommendBooks(query);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        this.bookListView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error.message);
      } else {
        this.bookListView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error as string);
      }
    }
  };

  handleGetImageUrl = async (fileUpload: FormData) => {
    const response = await this.bookModel.getImageUrl(fileUpload);
    return response ?? '';
  };

  handleGetBookById = async (bookId: number) => {
    try {
      const response = await this.bookModel.getBookById(bookId);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        this.bookListView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error.message);
      } else {
        this.bookListView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error as string);
      }
    }
  };

  handleSearchBook = (keyword: string) => {
    const searchTerm = keyword.trim().toLowerCase();

    const filteredBooks = this.renderBooks.filter((book) => book.name.toLowerCase().includes(searchTerm));

    this.updateBookList(filteredBooks);
  };

  handleSortBookByTitle = (sortStatus: string) => {
    this.sortStatus = sortStatus;

    switch (sortStatus) {
      case SORT.STATUS.ASCENDING: {
        const ascSortedBooks = sortArray(this.renderBooks, SORT.KEY.NAME, SORT.STATUS.ASCENDING);
        this.renderBooks = [...ascSortedBooks];
        break;
      }
      case SORT.STATUS.DESCENDING: {
        const descSortedBooks = sortArray(this.renderBooks, SORT.KEY.NAME, SORT.STATUS.DESCENDING);
        this.renderBooks = [...descSortedBooks];
        break;
      }
      default: {
        this.displayBookList();
        break;
      }
    }

    this.updateBookList(this.renderBooks);
  };

  handleEditBook = async (bookId: number, bookData: Omit<Book, 'id'>) => {
    try {
      await this.bookModel.editBook(bookId, bookData);
      this.displayBookList();

      this.bookListView.bindToastMessage(TOAST.TYPE.SUCCESS, TOAST.MESSAGE.SUCCESS, TOAST.DESCRIPTION.EDITED_BOOK);
    } catch (error) {
      if (error instanceof Error) {
        this.bookListView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error.message);
      } else {
        this.bookListView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error as string);
      }
    }
  };

  handleDeleteBook = async (bookId: number) => {
    try {
      await this.bookModel.deleteBook(bookId);
      await this.displayBookList();
    } catch (error) {
      if (error instanceof Error) {
        this.bookListView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error.message);
      } else {
        this.bookListView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error as string);
      }
    }
  };
}
