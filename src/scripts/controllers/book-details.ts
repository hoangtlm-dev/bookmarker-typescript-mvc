import BookModel from '@/models/book';
import BookDetailsView from '@/views/book-details';

import { Book, EditFormHandlers } from '@/types';
import { TOAST, BOOK_DESCRIPTION, ROUTES } from '@/constants';

export default class BookDetailsController {
  private bookModel: BookModel;
  private bookDetailsView: BookDetailsView;
  private editFormHandlers: EditFormHandlers;

  constructor(bookModel: BookModel, bookDetailsView: BookDetailsView) {
    this.bookModel = bookModel;
    this.bookDetailsView = bookDetailsView;

    this.editFormHandlers = {
      getBookHandler: this.handleGetBookById,
      getRecommendBookHandler: this.handleGetRecommendBooks,
      getImageUrlHandler: this.handleGetImageUrl,
      editBookHandler: this.handleEditBook,
    };
  }

  async init() {
    await this.displayBookDetails();
    this.bookDetailsView.bindEditBook(this.editFormHandlers);
    this.bookDetailsView.bindDeleteBook(this.handleDeleteBook);
    this.bookDetailsView.bindToggleText(this.handleToggleText);
    this.bookDetailsView.bindNavigationHome(this.handleNavigateHome);
  }

  displayBookDetails = async () => {
    const bookId = window.location.search.slice(4);
    this.bookDetailsView.displaySkeletonBookDetails();

    try {
      const response = await this.handleGetBookById(parseInt(bookId));
      this.bookDetailsView.getBookDetails(response as Book);
    } catch (error) {
      this.bookDetailsView.bindRequestError(error as string);
    }
  };

  handleGetRecommendBooks = async (query: string) => {
    try {
      const response = await this.bookModel.getRecommendBooks(query);
      return response;
    } catch (error) {
      this.bookDetailsView.bindRequestError(error as string);
      this.bookDetailsView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error as string);
    }
  };

  handleGetBookById = async (bookId: number) => {
    try {
      const response = await this.bookModel.getBookById(bookId);
      return response;
    } catch (error) {
      this.bookDetailsView.bindRequestError(error as string);
      this.bookDetailsView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error as string);
    }
  };

  handleGetImageUrl = async (fileUpload: FormData) => {
    try {
      const response = await this.bookModel.getImageUrl(fileUpload);
      return response;
    } catch (error) {
      this.bookDetailsView.bindRequestError(error as string);
      this.bookDetailsView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error as string);
    }
  };

  handleEditBook = async (bookId: number, bookData: Omit<Book, 'id'>) => {
    try {
      await this.bookModel.editBook(bookId, bookData);
      this.displayBookDetails();
    } catch (error) {
      this.bookDetailsView.bindRequestError(error as string);
      this.bookDetailsView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error as string);
    }
  };

  handleToggleText = async (
    bookId: number,
    textDescriptionElement: HTMLElement,
    btnShowDescriptionElement: HTMLButtonElement,
  ): Promise<void> => {
    const book = (await this.handleGetBookById(bookId)) as Book;

    if (btnShowDescriptionElement.textContent === BOOK_DESCRIPTION.BUTTON_TEXT.SHOW_MORE) {
      textDescriptionElement.textContent = book.description;
      btnShowDescriptionElement.textContent = BOOK_DESCRIPTION.BUTTON_TEXT.SHOW_LESS;
    } else {
      textDescriptionElement.textContent = book.description.slice(0, BOOK_DESCRIPTION.LIMIT_CHARACTER);
      btnShowDescriptionElement.textContent = BOOK_DESCRIPTION.BUTTON_TEXT.SHOW_MORE;
    }
  };

  handleNavigateHome = () => {
    window.location.href = ROUTES.HOME;
  };

  handleDeleteBook = async (bookId: number) => {
    try {
      await this.bookModel.deleteBook(bookId);

      setTimeout(() => {
        this.handleNavigateHome();
      }, 2000);
    } catch (error) {
      this.bookDetailsView.bindRequestError(error as string);
      this.bookDetailsView.bindToastMessage(TOAST.TYPE.FAIL, TOAST.MESSAGE.FAIL, error as string);
    }
  };
}
