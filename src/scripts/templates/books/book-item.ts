// Icons
import { Book } from '@/types';

// Utils
import { getHours } from '../../utils';

interface Icons {
  viewDetailsIcon: string;
  deleteIcon: string;
}

export const generateBookItem = (book: Book, icons: Icons) => {
  const { id, title, description, imageUrl, updatedAt } = book;

  const { viewDetailsIcon, deleteIcon } = icons;

  return `
    <div class="book-primary-info">
      <h2 class="text-heading text-truncate book-name">${title}</h2>
      <p class="text-description text-truncate book-description">${description}</p>
      <div class="book-item-action">
        <button class="btn btn-square btn-secondary btn-view-details">
          <a href='/book-details?id=${id}'>
            <img loading="lazy" src=${viewDetailsIcon} alt="View Details" />
          </a>
        </button>
        <button class="btn btn-square btn-danger btn-delete">
          <img loading="lazy" src=${deleteIcon} alt="Delete" />
        </button>
      </div>
    </div>
    <div class="book-published-info">
      <span class="text-description book-published-time">${getHours(updatedAt)}</span>
      <figure class="book-published-image-frame">
        <img loading="lazy" src=${imageUrl} alt="${title}" class="book-published-image" />
      </figure>
    </div>
  `;
};
