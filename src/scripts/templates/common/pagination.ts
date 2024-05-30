// Utils
import { createElement } from '../../utils';

interface OnPageChange {
  (pageNumber: number): void;
}

const createPaginationItem = (pageNumber: number, onPageChange: OnPageChange, currentPage: number): HTMLElement => {
  const paginationItem = createElement('li', 'pagination-item');

  const button = createElement(
    'button',
    'btn btn-primary btn-square btn-pagination text-description',
  ) as HTMLButtonElement;
  button.textContent = pageNumber.toString();
  button.dataset.page = pageNumber.toString();

  if (pageNumber === currentPage) {
    button.classList.add('btn-secondary', 'text-light', 'current');
    button.classList.remove('btn-primary');
  }

  button.addEventListener('click', () => onPageChange(pageNumber));
  paginationItem.appendChild(button);

  return paginationItem;
};

export const generatePagination = (
  totalItems: number,
  itemsPerPage: number,
  onPageChange: OnPageChange,
  currentPage: number,
): HTMLElement | null => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationList = createElement('ul', 'pagination-list');

  // Hide pagination when having only 1 page
  if (totalPages === 1) {
    return null;
  }

  for (let i = 1; i <= totalPages; i++) {
    paginationList.appendChild(createPaginationItem(i, onPageChange, currentPage));
  }

  return paginationList;
};
