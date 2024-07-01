export enum ToastType {
  SUCCESS = 'success',
  FAIL = 'fail',
  WARNING = 'warning',
  INFO = 'info',
}

export const TOAST = {
  TYPE: ToastType,
  MESSAGE: {
    SUCCESS: 'Your actions executed successfully!',
    FAIL: 'Your actions executed failed',
  },
  DESCRIPTION: {
    ADDED_BOOK: 'A book has been added to the system, this action can not undo.',
    EDITED_BOOK: 'A book has been updated in the system, this action can not undo.',
    DELETED_BOOK: 'A book has been removed from the system, this action can not undo.',
  },
  DURATION_TIME: 3000,
};
