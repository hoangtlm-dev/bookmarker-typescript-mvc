declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_API_URL: string;
      IMG_UPLOAD_API_URL: string;
      IMG_UPLOAD_KEY: string;
      RECOMMEND_BOOK_API_URL: string;
      RECOMMEND_BOOK_API_KEY: string;
    }
  }
}

export {};
