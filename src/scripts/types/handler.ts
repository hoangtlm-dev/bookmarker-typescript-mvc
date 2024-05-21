import { Book, RecommendBook } from './book';

export type PageChangeHandler = (pageNumber: number) => void;

export type AddBookHandler = (data: Omit<Book, 'id'>) => void;

export type GetImageUrlHandler = (formData: FormData) => Promise<string>;

export type DisplayFormHandler = (bookId: number) => Promise<Book>;

export type EditBookHandler = (bookId: number, data: Omit<Book, 'id'>) => void;

export type GetRecommendBookHandler = (query: string) => Promise<RecommendBook[]>;

export type SearchBookHandler = (keyword: string) => void;

export type SortBookHandler = (sortStatus: string) => void;

export type DeleteBookHandler = (bookId: number) => void;
