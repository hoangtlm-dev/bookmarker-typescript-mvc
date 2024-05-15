export const BOOK_FORM = {
  FORM_TITLE: {
    CREATE_BOOK: 'Create a new book marker',
    EDIT_BOOK: (bookName: string) => `Edit: ${bookName}`,
  },
  FORM_ID: 'book-form',
  FILE_INPUT_ID: 'file-input',
  UPLOAD_BUTTON_ID: 'btn-upload',
  POSITIVE_BUTTON_ID: 'btn-save',
  NEGATIVE_BUTTON_ID: 'btn-cancel',
  POSITIVE_TEXT: 'Save',
  NEGATIVE_TEXT: 'Cancel',
} as const;
