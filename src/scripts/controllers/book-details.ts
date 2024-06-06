import BookModel from '@/models/book';
import BookDetailsView from '@/views/book-details';

import { Book, EditFormHandlers } from '@/types';
import { TOAST } from '@/constants';

export default class BookDetailsController {
  private bookModel: BookModel;
  private bookDetailsView: BookDetailsView;
  private editFormHandlers: EditFormHandlers;

  constructor(bookModel: BookModel, bookDetailsView: BookDetailsView) {
    this.bookModel = bookModel;
    this.bookDetailsView = bookDetailsView;

    this.editFormHandlers = {
      getBookHandler: this.handleGetBookById,
      getImageUrlHandler: this.handleGetImageUrl,
      editBookHandler: this.handleEditBook,
    };
  }

  async init() {
    await this.displayBookDetails();
    this.bookDetailsView.bindEditBook(this.editFormHandlers);
    this.bookDetailsView.bindDeleteBook(this.handleDeleteBook);
  }

  displayBookDetails = async () => {
    const bookId = window.location.search.slice(4);
    this.bookDetailsView.displaySkeletonBookDetails();

    try {
      const response = await this.handleGetBookById(parseInt(bookId));
      this.bookDetailsView.getBookDetails(response);
    } catch (error) {
      if (error instanceof Error) {
        this.bookDetailsView.bindRequestError(error.message);
      } else {
        this.bookDetailsView.bindRequestError(error as string);
      }
    }
  };

  handleGetBookById = async (bookId: number) => {
    const response = await this.bookModel.getBookById(bookId);
    return response;
  };

  handleGetImageUrl = async (fileUpload: FormData) => {
    const response = await this.bookModel.getImageUrl(fileUpload);
    return response;
  };

  handleEditBook = async (bookId: number, bookData: Omit<Book, 'id'>) => {
    try {
      await this.bookModel.editBook(bookId, bookData);
      this.displayBookDetails();
    } catch (error) {
      if (error instanceof Error) {
        this.bookDetailsView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error.message);
      } else {
        this.bookDetailsView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error as string);
      }
    }
  };

  handleDeleteBook = async (bookId: number) => {
    try {
      await this.bookModel.deleteBook(bookId);

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        this.bookDetailsView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error.message);
      } else {
        this.bookDetailsView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error as string);
      }
    }
  };
}
