import BookModel from './models/book';
import BookDetailsView from './views/book-details';
import BookDetailsController from './controllers/book-details';

const bookModel = new BookModel();
const bookDetailsView = new BookDetailsView();

const app = new BookDetailsController(bookModel, bookDetailsView);

app.init();
