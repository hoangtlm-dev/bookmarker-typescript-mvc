export type Book = {
  id: number;
  title: string;
  description: string;
  authors: string[];
  imageUrl: string;
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
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
  title: string;
  authors: string;
  publishedDate: string;
  imageUrl: string;
  description: string;
};
