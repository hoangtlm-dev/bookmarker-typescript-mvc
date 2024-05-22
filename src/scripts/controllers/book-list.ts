// Constants
import { PAGINATION, SORT } from '@/constants';

//Types
import { Book } from '@/types';

import BookModel from '@/models/book';
import BookListView from '@/views/book-list';
import { sortArray } from '@/utils/sort-array';

export default class BookListController {
  private bookModel: BookModel;
  private bookListView: BookListView;
  private originalBooks: Book[];
  private renderBooks: Book[];
  private currentPage: number;
  private itemsPerPage: number;

  constructor(bookModel: BookModel, bookListView: BookListView) {
    this.bookModel = bookModel;
    this.bookListView = bookListView;
    this.originalBooks = [];
    this.renderBooks = [];
    this.currentPage = 1;
    this.itemsPerPage = PAGINATION.ITEMS_PER_PAGE;
  }

  init = async () => {
    await this.displayBookList();
    this.bookListView.bindPageChange(this.handlePageChange);
    this.bookListView.bindAddBook(this.handleGetImageUrl, this.handleAddBook, this.handleGetRecommendBooks);
    this.bookListView.bindEditBook(
      this.handleGetBookById,
      this.handleGetImageUrl,
      this.handleGetRecommendBooks,
      this.handleEditBook,
    );
    this.bookListView.bindSearchInputChange(this.handleSearchBook);
    this.bookListView.bindSortBook(this.handleSortBookByTitle);
    this.bookListView.bindDeleteBook(this.handleDeleteBook);
  };

  displayBookList = async () => {
    try {
      this.bookListView.displaySkeletonBooks(PAGINATION.ITEMS_PER_PAGE);
      const response = await this.bookModel.getBooks();
      this.originalBooks = response;
      this.renderBooks = [...this.originalBooks];
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
    const booksToShow = bookList.slice(startIndex, endIndex);
    this.bookListView.displayBooks(bookList, booksToShow, this.currentPage);
  };

  handlePageChange = (pageNumber: number) => {
    this.currentPage = pageNumber;
    this.updateBookList(this.renderBooks);
  };

  handleAddBook = async (data: Omit<Book, 'id'>) => {
    const response = await this.bookModel.addBook(data);
    this.renderBooks.unshift(response);
    this.originalBooks = [...this.renderBooks];
    this.updateBookList(this.originalBooks);
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

    const filteredBooks = this.renderBooks.filter((book) => book.title.toLowerCase().includes(searchTerm));

    this.updateBookList(filteredBooks);
  };

  handleSortBookByTitle = (sortStatus: string) => {
    switch (sortStatus) {
      case SORT.STATUS.ASCENDING: {
        const ascSortedBooks = sortArray(this.renderBooks, SORT.KEY.TITLE, SORT.STATUS.ASCENDING);
        this.renderBooks = [...ascSortedBooks];
        break;
      }
      case SORT.STATUS.DESCENDING: {
        const descSortedBooks = sortArray(this.renderBooks, SORT.KEY.TITLE, SORT.STATUS.DESCENDING);
        this.renderBooks = [...descSortedBooks];
        break;
      }
      default:
        this.renderBooks = [...this.originalBooks];
    }

    this.updateBookList(this.renderBooks);
  };

  handleEditBook = async (bookId: number, bookData: Omit<Book, 'id'>) => {
    await this.bookModel.editBook(bookId, bookData);
    this.displayBookList();
  };

  handleDeleteBook = async (bookId: number) => {
    await this.bookModel.deleteBook(bookId);
    // Refresh the book list from the model
    this.renderBooks = await this.bookModel.getBooks();
    this.originalBooks = [...this.renderBooks];

    // Move back one page if the current page has no items
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    if (startIndex >= this.renderBooks.length && this.currentPage > 1) {
      this.currentPage--;
    }

    // Update the view with the new list of books
    this.updateBookList(this.renderBooks);
  };
}
