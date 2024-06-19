export type Book = {
  id: number;
  name: string;
  description: string;
  authors: string[];
  image: string;
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
};

export type RecommendBook = {
  id: string;
  title: string;
  subtitle: string;
  authors: string[];
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  language: 'en' | 'vi';
};

export type CompareBook = {
  name: string;
  authors: string;
  publishedDate: string;
  image: string;
  description: string;
};
