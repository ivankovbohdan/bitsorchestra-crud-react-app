export interface Category {
  value: string;
  label: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string | null;
  createdAt: string;
  modifiedAt: string;
  status: string;
}
