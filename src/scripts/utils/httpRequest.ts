// Constants
import { ENV, HTTP_REQUEST } from '@/constants';

//Types
import { EnvKey, RequestOptions } from '@/types';

/**
 * Retrieves the value of an environment variable.
 *
 * This function attempts to fetch the value of the specified environment variable key from the `ENV.VAR` object. If the value is not found, it returns the provided default value. If the default value is not provided and the value is still undefined, it throws an error.
 *
 * @param key - The key of the environment variable to retrieve.
 * @returns - The value of the environment variable.
 * @throws - Throws an error if the environment variable is not found and no default value is provided.
 */
export const getEnvValue = (key: EnvKey): string => {
  const value = ENV.VAR[key];

  if (value === undefined) {
    throw new Error(ENV.MESSAGE.MISSING_VAR);
  }

  return value;
};

export const httpRequest = async <T, U>(
  url: string,
  method: string,
  data?: T,
  customHeaders?: Record<string, string>,
): Promise<U> => {
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
    return responseData as U;
  } else {
    const errorMessage = HTTP_REQUEST.ERROR_MESSAGES[response.status] || 'An unexpected error occurred';
    throw new Error(errorMessage);
  }
};
