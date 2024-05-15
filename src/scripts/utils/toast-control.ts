import { TOAST } from '../constants';

export const hideToast = <T extends HTMLElement>(toastContainer: T) => {
  toastContainer.remove();
};

export const showToast = <T extends HTMLElement>(toastContainer: T, toastTemplate: string, displayTime: number) => {
   
  toastContainer.innerHTML = toastTemplate;

  // Get the close button
  const closeButton = toastContainer.querySelector(`#${TOAST.CLOSE_BUTTON_ID}`);

  // Hide the toast when clicking on close button
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      hideToast(toastContainer);
    });
  }

  // Automatically hide the toast after a certain time
  setTimeout(() => {
    hideToast(toastContainer);
  }, displayTime);
};
