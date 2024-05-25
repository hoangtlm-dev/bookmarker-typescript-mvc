import backIcon from '../../../assets/icons/left-forward.svg';
import deleteIcon from '../../../assets/icons/trash.svg';
import editIcon from '../../../assets/icons/edit.svg';

import { timeFormat } from '../../utils/time-control';
import { Book } from '@/types';

export const generateBookDetails = (book: Book) => {
  const { title, description, authors, imageUrl, createdAt, updatedAt } = book;

  return `
    <div class="book-details-image-action">
      <figure class="book-details-image-frame">
        <img loading="lazy" src=${imageUrl} alt=${title} class="book-details-image"/>
      </figure>
      <div class="book-details-action">
        <button class="btn btn-square btn-secondary btn-back">
          <a href='/'>
            <img loading="lazy" src=${backIcon} alt="Back"/>
          </a>
        </button>
        <button class="btn btn-square btn-danger btn-delete">
          <img loading="lazy" src=${deleteIcon} alt="Delete"/>
        </button>
        <button class="btn btn-rectangle btn-secondary btn-edit">
          <img loading="lazy" src=${editIcon} alt="Edit" />
          <span class="btn-edit-text text-description text-light">Edit</span>
        </button>
      </div>
    </div>
    <div class="book-details-info">
      <h2 class="text-heading book-details-heading">${title}</h2>
      <p class="text-description book-details-description">${description}</p>
      <ul class="book-details-info-list">
        <li class="book-details-info-item">
          <span class="text-sub-heading book-details-info-title">Author: </span>
          <span class="text-description book-details-info-description">${authors.join(', ')}</span>
        </li>
        <li class="book-details-info-item">
          <span class="text-sub-heading book-details-info-title">Published date: </span>
          <span class="text-description book-details-info-description">${timeFormat(createdAt)}</span>
        </li>
        <li class="book-details-info-item">
          <span class="text-sub-heading book-details-info-title">Created at: </span>
          <span class="text-description book-details-info-description">${timeFormat(createdAt)}</span>
        </li>
        <li class="book-details-info-item">
          <span class="text-sub-heading book-details-info-title">Updated at: </span>
          <span class="text-description book-details-info-description">${timeFormat(updatedAt)}</span>
        </li>
      </ul>
    </div>
  `;
};
