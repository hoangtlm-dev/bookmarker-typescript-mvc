// Constants
import { HTTP_REQUEST } from '@/constants';

// Types
import { RequestOptions } from '@/types';

export const httpRequest = async <T, U>(
  url: string,
  method: string,
  data?: T,
  customHeaders?: Record<string, string>,
): Promise<U | { data: U; totalPage: number }> => {
  const headers = customHeaders ? { ...customHeaders } : {};

  const options: RequestOptions = {
    method: method,
    headers,
    body: null,
  };

  if (method !== HTTP_REQUEST.METHODS.GET && method !== HTTP_REQUEST.METHODS.DELETE) {
    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers['Content-Type'] = HTTP_REQUEST.CONTENT_TYPE.APPLICATION_JSON;
      options.body = JSON.stringify(data);
    }
  }

  const response = await fetch(url, options);

  if (response.ok) {
    const responseData = await response.json();

    if (method === HTTP_REQUEST.METHODS.GET && Array.isArray(responseData)) {
      const totalPage = parseInt(response.headers.get('X-Total-Count') as string, 10);

      return {
        data: responseData as U,
        totalPage,
      };
    } else {
      return responseData as U;
    }
  } else {
    const errorMessage = HTTP_REQUEST.ERROR_MESSAGES[response.status] || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
};
