// Constants
import { HTTP_REQUEST, PATHS } from '@/constants';

// Types
import { Book, ImgBBApiResponse, RecommendBook } from '@/types';

// Utils
import { getEnvValue, httpRequest } from '@/utils';

// Api key
const recommendBookApiKey = getEnvValue('RECOMMEND_BOOK_API_KEY');
const uploadImageApiKey = getEnvValue('IMG_UPLOAD_API_KEY');

// Api path
const bookApiUrl = `${getEnvValue('BASE_API_URL')}/${PATHS.BOOKS}`;
const uploadImageApiUrl = `${getEnvValue('IMG_UPLOAD_API_URL')}?key=${uploadImageApiKey}`;
const recommendBookApiUrl = getEnvValue('RECOMMEND_BOOK_API_URL');

/**
 * Adds a new book to the system.
 *
 * @param bookData - The book data excluding the ID.
 * @returns - The newly added book object including its ID.
 */
export const addBookService = async (bookData: Omit<Book, 'id'>): Promise<Book> =>
  await httpRequest<Omit<Book, 'id'>, Book>(bookApiUrl, HTTP_REQUEST.METHODS.POST, bookData);

/**
 * Retrieves a list of all books from the system.
 *
 * @returns - An array of book objects.
 */
export const getBooksServices = async (): Promise<Book[]> =>
  await httpRequest<null, Book[]>(bookApiUrl, HTTP_REQUEST.METHODS.GET);

/**
 * Retrieves a list of recommended books based on a search query.
 *
 * @param query - The search query.
 * @returns - An array of recommended book objects.
 */
export const getRecommendBookServices = async (query: string): Promise<RecommendBook[]> => {
  const customHeaders = {
    'API-key': recommendBookApiKey,
  };

  const response = await httpRequest<{ query: string }, RecommendBook[]>(
    recommendBookApiUrl,
    HTTP_REQUEST.METHODS.POST,
    { query },
    customHeaders,
  );
  return response;
};

/**
 * Retrieves detailed information about a book by its ID.
 *
 * @param bookId - The ID of the book.
 * @returns - A book object.
 */
export const getBookByIdService = async (bookId: number): Promise<Book> =>
  await httpRequest<null, Book>(`${bookApiUrl}/${bookId}`, HTTP_REQUEST.METHODS.GET);

/**
 * Uploads an image and returns its URL.
 *
 * @param formData - The image data in FormData format.
 * @returns - The URL of the uploaded image.
 */
export const getImageUrlServices = async (formData: FormData): Promise<string> =>
  (await httpRequest<FormData, ImgBBApiResponse>(uploadImageApiUrl, HTTP_REQUEST.METHODS.POST, formData)).data.url;

/**
 * Edits the information of an existing book.
 *
 * @param bookId - The ID of the book.
 * @param bookData - The book data excluding the ID.
 * @returns - The updated book object.
 */
export const editBookService = async (bookId: number, bookData: Omit<Book, 'id'>): Promise<Book> =>
  await httpRequest<Omit<Book, 'id'>, Book>(`${bookApiUrl}/${bookId}`, HTTP_REQUEST.METHODS.PUT, bookData);

/**
 * Deletes a book from the system.
 *
 * @param bookId - The ID of the book.
 */
export const deleteBookService = async (bookId: number): Promise<void> =>
  await httpRequest(`${bookApiUrl}/${bookId}`, HTTP_REQUEST.METHODS.DELETE);
