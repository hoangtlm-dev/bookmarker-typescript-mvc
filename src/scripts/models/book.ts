// Types
import { Book } from '@/types';

//Services
import { addBookService, deleteBookService, editBookService, getBookByIdService, getBooksServices } from '@/services';

export default class BookModel {
  addBook = async (bookData: Book) => {
    const response = await addBookService(bookData);
    return response;
  };

  getBooks = async () => {
    const response = await getBooksServices();
    return response;
  };

  getBookById = async (bookId: number) => {
    const response = await getBookByIdService(bookId);
    return response;
  };

  editBook = async (bookId: number, bookData: Book) => {
    await editBookService(bookId, bookData);
  };

  deleteBook = async (bookId: number) => {
    await deleteBookService(bookId);
  };
}
