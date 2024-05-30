import { ConfirmDialogOptions } from '@/types';

export const generateConfirmDialog = (message: string, description: string, options: Partial<ConfirmDialogOptions>) => {
  const { positiveButtonId, negativeButtonId, positiveText, negativeText } = options;

  return `
    <div class="confirm-dialog">
      <h2 class="text-heading confirm-dialog-heading">${message}</h2>
      <p class="text-description confirm-dialog-description">${description}</p>
      <div class="confirm-dialog-action">
        <button id=${negativeButtonId} class="text-sub-heading text-light btn btn-action btn-cancel">${negativeText}</button>
        <button id=${positiveButtonId} class="text-sub-heading text-light btn btn-secondary btn-action btn-confirm">${positiveText}</button>
      </div>
    </div>
  `;
};
