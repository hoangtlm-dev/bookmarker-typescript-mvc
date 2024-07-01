/**
 *
 * @returns - an HTML string that represents the skeleton book item.
 */
export const generateSkeletonBookItem = (): string =>
  ` <div class="book-primary-info">
      <h2 class="text-heading text-truncate book-name"></h2>
      <p class="text-description text-truncate book-description"></p>
      <div class="book-item-action">
        <div class="btn btn-square"></div>
        <div class="btn btn-square"></div>
      </div>
    </div>
    <div class="book-published-info">
      <span class="text-description book-published-time"></span>
      <figure class="book-published-image-frame"></figure>
    </div>
  `;
