export const showModal = <T extends HTMLElement>(modalContainer: T, modalContent: string) => {
  modalContainer.innerHTML = modalContent;
};

export const hideModal = <T extends HTMLElement>(modalContainer: T) => {
  modalContainer.remove();
};
