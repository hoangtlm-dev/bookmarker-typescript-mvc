// Constants
import { HTTP_REQUEST, API_PATH } from '@/constants';

// Types
import { Book } from '@/types';

// Utils
import { httpRequest } from '@/utils';

// Api path
const bookApiUrl = `${process.env.BASE_API_URL}/${API_PATH.BOOKS}`;

export const addBookService = async (bookData: Book): Promise<Book> => {
  const response = await httpRequest<Omit<Book, 'id'>, Book>(bookApiUrl, HTTP_REQUEST.METHODS.POST, bookData);
  return response;
};

export const getBooksServices = async (): Promise<Book[]> => {
  const response = await httpRequest<null, Book[]>(bookApiUrl, HTTP_REQUEST.METHODS.GET);
  return response;
};

export const getBookByIdService = async (bookId: number): Promise<Book> => {
  const response = await httpRequest<null, Book>(`${bookApiUrl}/${bookId}`, HTTP_REQUEST.METHODS.GET);
  return response;
};

export const editBookService = async (bookId: number, bookData: Book): Promise<Book> => {
  const response = await httpRequest<Book, Book>(`${bookApiUrl}/${bookId}`, HTTP_REQUEST.METHODS.PUT, bookData);
  return response;
};

export const deleteBookService = async (bookId: number): Promise<void> => {
  await httpRequest<null, null>(`${bookApiUrl}/${bookId}`, HTTP_REQUEST.METHODS.DELETE);
};
