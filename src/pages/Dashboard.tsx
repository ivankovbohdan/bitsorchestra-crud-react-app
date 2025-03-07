import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { parseISO } from "date-fns";
import { deleteBook, getBooks, updateBook } from "../api";
import { Book } from "../utils/types";
import { toZonedTime } from "date-fns-tz";

export const Dashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filterField, setFilterField] = useState<string>("active");

  useEffect(() => {
    getBooks()
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => console.error("Failed to fetch books:", error));
  }, []);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "--";

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateInUserTimezone = toZonedTime(parseISO(dateString), userTimeZone);

    return format(dateInUserTimezone, "dd MMMM yyyy, h:mma");
  };

  const handleDelete = async (bookId: string) => {
    try {
      await deleteBook(+bookId);
      setBooks((currentBooks) =>
        currentBooks.filter((book) => book.id !== bookId)
      );
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  const handleToggleStatus = async (bookId: string) => {
    const bookToUpdate = books.find((book) => book.id === bookId);

    if (!bookToUpdate) {
      console.error("Book not found");
      return;
    }

    const updatedBook = {
      ...bookToUpdate,
      status: bookToUpdate.status === "active" ? "deactivated" : "active",
      modifiedAt: new Date().toISOString(),
    };

    try {
      await updateBook(updatedBook);

      setBooks((currentBooks) =>
        currentBooks.map((book) => (book.id === bookId ? updatedBook : book))
      );
    } catch (error) {
      console.error("Failed to update book status:", error);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilterStatus = event.target.value;
    setFilterField(newFilterStatus);
  };

  const filteredBooks = books.filter((book) => {
    if (filterField === "all") {
      return true;
    }
    return book.status === filterField;
  });

  const filteredBooksCount = filteredBooks.length;

  return (
    <>
      <section className="section">
        <h1 className="title">Dashboard</h1>

        <Link
          to="/add-edit-book"
          className="button is-primary has-text-white is-inline-block mb-6"
        >
          <button>Add a Book</button>
        </Link>

        <div className="is-flex is-align-items-center is-flex-wrap-wrap is-gap-1 mb-4">
          <div className="field mb-0">
            <div className="select">
              <select value={filterField} onChange={handleFilterChange}>
                <option value="all">Show All</option>
                <option value="active">Show Active</option>
                <option value="deactivated">Show Deactivated</option>
              </select>
            </div>
          </div>

          <p className="help">
            Showing {filteredBooksCount} of {books.length}
          </p>
        </div>

        <div className="table-container">
          <table className="table is-fullwidth is-bordered is-striped">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author Name</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Created At</th>
                <th>Modified/Edited At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr
                  key={book.id}
                  className={
                    book.status === "deactivated"
                      ? "has-background-grey-light"
                      : ""
                  }
                >
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.isbn}</td>
                  <td>{formatDateTime(book.createdAt)}</td>
                  <td>{formatDateTime(book.modifiedAt)}</td>
                  <td>
                    <Link
                      to={`/add-edit-book/${book.id}`}
                      className="button is-info is-small mb-2 mr-2"
                    >
                      Edit
                    </Link>

                    {book.status === "deactivated" && (
                      <button
                        className="button is-danger is-small mb-2 mr-2"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    )}
                    <button
                      className={`button ${
                        book.status === "active" ? "is-warning" : "is-success"
                      } is-small mb-2 mr-2`}
                      onClick={() => handleToggleStatus(book.id)}
                    >
                      {book.status === "active" ? "Deactivate" : "Re-Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
