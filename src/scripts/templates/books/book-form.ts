import { BOOK_FORM } from '@/constants';
import { Book } from '@/types';
import { BookOptions } from '@/types/book-form';
import uploadIcon from '../../../assets/icons/upload.svg';

export const bookFormTemplate = (book: Book, options: Partial<BookOptions>) => {
  const { name, description, authors, image, publishedDate } = book;

  const {
    formTitle = BOOK_FORM.FORM_TITLE.CREATE_BOOK,
    formId = BOOK_FORM.FORM_ID,
    uploadButtonId = BOOK_FORM.UPLOAD_BUTTON_ID,
    fileInputId = BOOK_FORM.FILE_INPUT_ID,
    positiveButtonId = BOOK_FORM.POSITIVE_BUTTON_ID,
    negativeButtonId = BOOK_FORM.NEGATIVE_BUTTON_ID,
    positiveText = BOOK_FORM.POSITIVE_TEXT,
    negativeText = BOOK_FORM.NEGATIVE_TEXT,
  } = options;

  return `
    <form id=${formId} class="book-form">
      <h2 class="form-heading text-heading">${formTitle}</h2>
      <div class="form-content">
        <div class="input-group book-name">
          <label for="book-name" class="input-label text-sub-heading">Book name</label>
          <input type="text" class="input-box" name="book-name" placeholder="Book name" data-field-name="name" data-field-validate="Book's name" value="${name}" autocomplete="off"/>
          <p class="text-description text-error error-message"></p>
        </div>
        <div class="input-group book-author">
          <label for="book-authors" class="input-label text-sub-heading">Author(s)</label>
          <input type="text" class="input-box" name="book-authors" placeholder="Author(s)" data-field-name="authors" data-field-validate="Book's author(s)" value="${authors.join(', ')}"/>
          <p class="text-description text-error error-message"></p>
        </div>
        <div class="input-group book-published-date">
          <label for="book-published-date" class="input-label text-sub-heading">Published date</label>
          <input type="date" placeholder="MM/DD/YYYY" class="input-box" name="book-published-date" data-field-name="publishedDate" data-field-validate="Book's published date" value="${publishedDate}"/>
          <p class="text-description text-error error-message"></p>
        </div>
        <div class="input-group book-image">
          <label for="book-image" class="input-label text-sub-heading">Image</label>
          <button id=${uploadButtonId} type="button" class="btn btn-secondary btn-upload">
            <img src=${uploadIcon} alt="upload" />
            <span class="upload-text text-sub-heading text-light">Upload</span>
          </button>
          <input id=${fileInputId} accept="image/*" type="file"/>
          <input type="hidden" class="input-box" name="book-image" data-field-name="image" data-field-validate="Book's image" value="${image}"/>
          <div class="book-preview">
            <span class="text-description book-name-preview"></span>
            <img class="book-img-preview" src="${image}" alt="${name}"/>
          </div>
          <p class="text-description text-error error-message"></p>
        </div>
        <div class="input-group book-description">
          <label for="book-description" class="input-label text-sub-heading">Description</label>
          <textarea class="input-box" name="book-description" placeholder="Description" data-field-name="description" data-field-validate="Book's description">${description}</textarea>
          <p class="text-description text-error error-message"></p>
        </div>
      </div>
      <div class="form-action">
        <button id=${negativeButtonId} type="button" class="btn btn-cancel btn-action text-sub-heading text-light btn-cancel">${negativeText}</button>
        <button id=${positiveButtonId} type="submit" class="btn btn-secondary btn-action text-sub-heading text-light btn-save">${positiveText}</button>
      </div>
    </form>
  `;
};
