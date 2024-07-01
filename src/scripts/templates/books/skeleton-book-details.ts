/**
 * Generates a string containing a specified number of skeleton items.
 *
 * @param totalItem - The total number of skeleton items to generate.
 * @returns - A string containing the specified number of skeleton items.
 */
const generateSkeletonInfoItem = (totalItem: number): string =>
  Array.from({ length: totalItem }, () => '<li class="book-details-info-item"></li>').join('');

/**
 *
 * @returns - an HTML string that represents the skeleton book details.
 */
export const generateSkeletonBookDetails = (): string =>
  ` <div class="book-details-image-action">
      <figure class="book-details-image-frame"></figure>
      <div class="book-details-action">
        <div class="btn btn-square btn-secondary btn-back"></div>
        <div class="btn btn-square btn-danger btn-delete"></div>
        <div class="btn btn-rectangle btn-secondary btn-edit"></div>
      </div>
    </div>
    <div class="book-details-info">
      <h2 class="text-heading book-details-heading"></h2>
      <p class="text-description book-details-description"></p>
      <ul class="book-details-info-list">
        ${generateSkeletonInfoItem(4)}
      </ul>
    </div>
  `;
