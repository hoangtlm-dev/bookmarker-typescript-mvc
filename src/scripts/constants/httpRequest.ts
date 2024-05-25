export const ERROR_MESSAGES: { [key: number]: string } = {
  400: 'Bad Request - The server could not understand the request due to invalid syntax.',
  401: 'Unauthorized - The client must authenticate itself to get the requested response.',
  403: 'Forbidden - The client does not have access rights to the content.',
  404: 'Not Found - The server can not find the requested resource.',
  500: "Internal Server Error - The server has encountered a situation it doesn't know how to handle.",
} as const;

export const HTTP_REQUEST = {
  CONTENT_TYPE: {
    APPLICATION_JSON: 'application/json',
  },
  METHODS: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
  },
  ERROR_MESSAGES,
} as const;
