export const generateSkeletonBookItem = () =>
  ` <div class="book-primary-info">
      <h2 class="text-heading text-truncate book-name"></h2>
      <p class="text-description text-truncate book-description"></p>
      <div class="book-item-action">
        <button class="btn btn-square"></button>
        <button class="btn btn-square"></button>
      </div>
    </div>
    <div class="book-published-info">
      <span class="text-description book-published-time"></span>
      <figure class="book-published-image-frame"></figure>
    </div>
  `;
