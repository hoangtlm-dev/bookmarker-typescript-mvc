import { Book, RecommendBook } from './book';

export type PageChangeHandler = (pageNumber: number) => void;

export type AddBookHandler = (data: Omit<Book, 'id'>) => void;

export type GetImageUrlHandler = (formData: FormData) => Promise<string>;

export type GetBookHandler = (bookId: number) => Promise<Book>;

export type EditBookHandler = (bookId: number, data: Omit<Book, 'id'>) => void;

export type GetRecommendBookHandler = (query: string) => Promise<RecommendBook[]>;

export type SearchBookHandler = (keyword: string) => void;

export type SortBookHandler = (sortStatus: string) => void;

export type DeleteBookHandler = (bookId: number) => void;

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
  getRecommendBookHandler?: GetRecommendBookHandler;
  saveHandler: (input: Omit<Book, 'id'>) => void;
};
