interface ConfirmDialogOptions {
  positiveButtonId: string;
  negativeButtonId: string;
  positiveText: string;
  negativeText: string;
}

/**
 * Generates a confirm dialog HTML string.
 *
 * @param message - The main message or title of the confirm dialog.
 * @param description - The description or body text of the confirm dialog.
 * @param options - The options for customizing the confirm dialog.
 * @returns - The HTML string representing the confirm dialog.
 */
export const generateConfirmDialog = (
  message: string,
  description: string,
  options: Partial<ConfirmDialogOptions> = {},
): string => {
  const {
    positiveButtonId = 'btn-confirm',
    negativeButtonId = 'btn-cancel',
    positiveText = 'OK',
    negativeText = 'Cancel',
  } = options;

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
