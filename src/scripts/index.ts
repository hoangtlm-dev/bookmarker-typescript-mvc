import BookModel from './models/book';
import BookListView from './views/book-list';
import BookListController from './controllers/book-list';

const bookModel = new BookModel();
const bookListView = new BookListView();

const app = new BookListController(bookModel, bookListView);

document.addEventListener('DOMContentLoaded', (): void => {
  app.init();
});
