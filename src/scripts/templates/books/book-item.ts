// Types
import { Book } from '@/types';

// Utils
import { getHours } from '../../utils';

interface ActionIcons {
  viewDetailsIcon: string;
  deleteIcon: string;
}

/**
 *
 * @param book - an object representing the book following the attributes defined in the types folder,
 * @param icons - an object containing URLs and for action icons.
 * @returns - an HTML string that represents the book item.
 */
export const generateBookItem = (book: Book, icons: ActionIcons): string => {
  const { name, description, image, updatedAt } = book;

  const { viewDetailsIcon, deleteIcon } = icons;

  return `
    <div class="book-primary-info">
      <h2 class="text-heading text-truncate book-name">${name}</h2>
      <p class="text-description text-truncate book-description">${description}</p>
      <div class="book-item-action">
        <button class="btn btn-square btn-secondary btn-view-details">
          <img loading="lazy" src=${viewDetailsIcon} alt="view details" />
        </button>
        <button class="btn btn-square btn-danger btn-delete">
          <img loading="lazy" src=${deleteIcon} alt="delete" />
        </button>
      </div>
    </div>
    <div class="book-published-info">
      <span class="text-description book-published-time">${getHours(updatedAt)}</span>
      <figure class="book-published-image-frame">
        <img loading="lazy" src=${image} alt="${name}" class="book-published-image" />
      </figure>
    </div>
  `;
};
