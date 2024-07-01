// Constanst
import { ToastType } from '@/constants';

interface ToastOptions {
  closeButtonId: string;
}

/**
 * Generates an HTML string for toast content.
 *
 * @param {ToastType} type - The type of toast to be displayed.
 * @param {string} message - A main message to be displayed in the toast.
 * @param {string} description - A description or additional information to be displayed in the toast.
 * @param {string} closeIcon - The URL or path to the close icon image.
 * @param {Partial<ToastOptions>} options - Optional parameters for customizing the toast.
 * @returns {string} - An HTML string representing the toast.
 */
export const generateToastContent = (
  type: ToastType,
  message: string,
  description: string,
  closeIcon: string,
  options: Partial<ToastOptions> = {},
): string => {
  const { closeButtonId = 'btn-close' } = options;

  return `
    <div class="toast-container ${type}">
      <h2 class="text-heading toast-message">${message}</h2>
      <p class="text-description toast-description">${description}</p>
      <button id=${closeButtonId} class="btn btn-close">
        <img width="16px" height="16px" src=${closeIcon} alt="close">
      </button>
    </div>
  `;
};
