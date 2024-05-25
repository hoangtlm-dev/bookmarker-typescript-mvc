export const generateRequestError = (message: string) => `
  <div class='request-error container'>
    <p class='text-description request-error-message'>${message}</p>
    <a class='text-description back-link' href='/'>Back to home</a>
  </div>
`;
