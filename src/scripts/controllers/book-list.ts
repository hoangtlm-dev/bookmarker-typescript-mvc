// Constants
import { PAGINATION, SORT } from '@/constants';

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
      getImageUrlHandler: this.handleGetImageUrl,
      getRecommendBookHandler: this.handleGetRecommendBooks,
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

  displayBookList = async () => {
    try {
      this.bookListView.displaySkeletonBooks(PAGINATION.ITEMS_PER_PAGE);

      const response = await this.bookModel.getBooks();
      const latestBooks = sortArray(response, SORT.KEY.CREATED_AT, SORT.STATUS.DESCENDING);
      this.renderBooks = [...latestBooks];

      this.updateBookList(this.renderBooks);
    } catch (error) {
      if (error instanceof Error) {
        this.bookListView.bindRequestError(error.message);
      } else {
        this.bookListView.bindRequestError(error as string);
      }
    }
  };

  updateBookList = (bookList: Book[]) => {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const booksRender = bookList.slice(startIndex, endIndex);
    this.bookListView.displayBooks(bookList, booksRender, this.currentPage);
  };

  handlePageChange = (pageNumber: number) => {
    this.currentPage = pageNumber;
    this.updateBookList(this.renderBooks);
  };

  handleAddBook = async (data: Omit<Book, 'id'>) => {
    await this.bookModel.addBook(data);
    await this.displayBookList();
  };

  handleGetRecommendBooks = async (query: string) => {
    const response = await this.bookModel.getRecommendBooks(query);
    return response;
  };

  handleGetImageUrl = async (fileUpload: FormData) => {
    const response = await this.bookModel.getImageUrl(fileUpload);
    return response ?? '';
  };

  handleGetBookById = async (bookId: number) => {
    const response = await this.bookModel.getBookById(bookId);
    return response;
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
    await this.bookModel.editBook(bookId, bookData);
    this.displayBookList();
  };

  handleDeleteBook = async (bookId: number) => {
    await this.bookModel.deleteBook(bookId);
    this.renderBooks = await this.bookModel.getBooks();

    // Save the book list when sorting
    if (this.sortStatus !== '') {
      this.handleSortBookByTitle(this.sortStatus);
    }

    // Move back one page if the current page has no items
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    if (startIndex >= this.renderBooks.length && this.currentPage > 1) {
      this.currentPage--;
    }

    this.updateBookList(this.renderBooks);
  };
}
