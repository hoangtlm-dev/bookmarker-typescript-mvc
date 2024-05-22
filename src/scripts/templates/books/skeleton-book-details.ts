export const generateSkeletonBookDetails = () =>
  `
    <div class="book-details-image-action">
      <figure class="book-details-image-frame"></figure>
      <div class="book-details-action">
        <button class="btn btn-square btn-secondary btn-back"></button>
        <button class="btn btn-square btn-danger btn-delete"></button>
        <button class="btn btn-rectangle btn-secondary btn-edit"></button>
      </div>
    </div>
    <div class="book-details-info">
      <h2 class="text-heading book-details-heading"></h2>
      <p class="text-description book-details-description"></p>
      <ul class="book-details-info-list">
        <li class="book-details-info-item"></li>
        <li class="book-details-info-item"></li>
        <li class="book-details-info-item"></li>
        <li class="book-details-info-item"></li>
      </ul>
    </div>
  `;
