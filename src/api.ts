import { Book } from "./utils/types";

export const API_BASE_URL = "http://localhost:3000";

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

export const getBooks = () => request<Book[]>("/books");

export const addBook = (book: Book) =>
  request<Book>("/books", {
    method: "POST",
    body: JSON.stringify({
      ...book,
      createdAt: new Date().toISOString(),
      modifiedAt: "",
      status: "active",
    }),
  });


export const deleteBook = (id: number) =>
  request<void>(`/books/${id}`, {
    method: "DELETE",
  });

export const updateBook = (book: Book) =>
  request<Book>(`/books/${book.id}`, {
    method: "PUT",
    body: JSON.stringify(book),
  });

export const getBookById = (id: string) => request<Book>(`/books/${id}`);
