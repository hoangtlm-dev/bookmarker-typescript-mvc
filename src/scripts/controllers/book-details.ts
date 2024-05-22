import BookModel from '@/models/book';
import { Book } from '@/types';
import BookDetailsView from '@/views/book-details';
export default class BookDetailsController {
  private bookModel: BookModel;
  private bookDetailsView: BookDetailsView;

  constructor(bookModel: BookModel, bookDetailsView: BookDetailsView) {
    this.bookModel = bookModel;
    this.bookDetailsView = bookDetailsView;
  }

  async init() {
    await this.displayBookDetails();
    this.bookDetailsView.bindEditBook(this.handleGetBookById, this.handleGetImageUrl, this.handleEditBook);
    this.bookDetailsView.bindDeleteBook(this.handleDeleteBook);
  }

  displayBookDetails = async () => {
    const bookId = window.location.search.slice(4);
    this.bookDetailsView.displaySkeletonBookDetails();
    try {
      const response = await this.bookModel.getBookById(parseInt(bookId));
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
    await this.bookModel.editBook(bookId, bookData);
    this.displayBookDetails();
  };

  handleDeleteBook = async (bookId: number) => {
    await this.bookModel.deleteBook(bookId);
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };
}
