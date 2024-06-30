import { Book, RecommendBook } from './book';

export type PageChangeHandler = (pageNumber: number) => void;

export type AddBookHandler = (data: Omit<Book, 'id'>) => void;

export type GetImageUrlHandler = (formData: FormData) => Promise<string | undefined>;

export type GetBookHandler = (bookId: number) => Promise<Book | undefined>;

export type EditBookHandler = (bookId: number, data: Omit<Book, 'id'>) => void;

export type GetRecommendBookHandler = (query: string) => Promise<RecommendBook[] | undefined>;

export type SearchBookHandler = (keyword: string) => void;

export type NavigateBookDetailsHandlers = (bookId: number) => void;

export type NavigateHomeHandler = () => void;

export type SortBookHandler = (sortStatus: string) => void;

export type DeleteBookHandler = (bookId: number) => void;

export type ToggleTextHandler = (
  bookId: number,
  textDescriptionElement: HTMLElement,
  btnShowDescriptionElement: HTMLButtonElement,
) => void;

export type AddFormHandlers = {
  getImageUrlHandler: GetImageUrlHandler;
  getRecommendBookHandler: GetRecommendBookHandler;
  addBookHandler: AddBookHandler;
};

export type EditFormHandlers = {
  getBookHandler: GetBookHandler;
  getImageUrlHandler: GetImageUrlHandler;
  getRecommendBookHandler: GetRecommendBookHandler;
  editBookHandler: EditBookHandler;
};

export type ShowFormHandlers = {
  getImageUrlHandler: GetImageUrlHandler;
  getRecommendBookHandler: GetRecommendBookHandler;
  saveHandler: (input: Omit<Book, 'id'>) => void;
};
