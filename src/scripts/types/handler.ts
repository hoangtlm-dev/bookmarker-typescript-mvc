import { Book } from './book';

export type PageChangeHandler = (pageNumber: number) => void;

export type AddBookHandler = (data: Partial<Book>) => void;

export type GetImageUrlHandler = (formData: FormData) => Promise<string>;
