export type Book = {
  id: number;
  name: string;
  description: string;
  authors: string | string[];
  imageUrl: string;
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
