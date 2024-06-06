export const TOAST = {
  TYPE: {
    SUCCESS: 'success',
    FAIL: 'fail',
    WARNING: 'warning',
    INFO: 'info',
  },
  MESSAGE: {
    SUCCESS: 'Your actions executed successfully!',
    FAIL: 'Your actions executed failed',
  },
  DESCRIPTION: {
    ADDED_BOOK: 'A book has been added to the system, this action can not undo.',
    EDITED_BOOK: 'A book has been updated in the system, this action can not undo.',
    DELETED_BOOK: 'A book has been removed from the system, this action can not undo.',
  },
  CLOSE_BUTTON_ID: 'btn-close',
  DISPLAY_TIME: 3000,
} as const;
