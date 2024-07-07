// Constants
import { ROUTES } from './constants';

// Models
import BookModel from './models/book';

// Views
import BookListView from './views/book-list';
import BookDetailsView from './views/book-details';

// Controllers
import BookListController from './controllers/book-list';
import BookDetailsController from './controllers/book-details';
import { navigate } from './utils';

const bookModel = new BookModel();

const bookListView = new BookListView();
const bookDetailsView = new BookDetailsView();

const ROUTES_MAP = [
  {
    path: ROUTES.HOME,
    handler: () => {
      const bookListController = new BookListController(bookModel, bookListView);
      bookListController.init();
    },
  },
  {
    path: ROUTES.BOOK_DETAILS,
    handler: () => {
      const bookDetailsController = new BookDetailsController(bookModel, bookDetailsView);
      bookDetailsController.init();
    },
  },
];

const routeHandler = (pathName: string): void => {
  const currentRoute = ROUTES_MAP.find((route) => route.path === pathName);

  if (!currentRoute) {
    navigate(ROUTES.NOT_FOUND);
  }

  currentRoute?.handler();
};

document.addEventListener('DOMContentLoaded', (): void => {
  routeHandler(window.location.pathname);
});
