import classNames from "classnames";
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { addBook, getBookById, getBooks, updateBook } from "../api";
import { Book } from "../utils/types";
import { categories } from "../utils/categories";

export const AddEditBook: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  const [title, setTitle] = useState("");
  const [hasTitleError, setHasTitleError] = useState(false);

  const [name, setName] = useState("");
  const [hasNameError, setHasNameError] = useState(false);

  const [category, setCategory] = useState("");
  const [hasCategoryError, setHasCategoryError] = useState(false);

  const [isbn, setIsbn] = useState<Number | null>(null);
  const [hasIsbnError, setHasIsbnError] = useState(false);

  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getBookById(id)
        .then((book) => {
          setTitle(book.title);
          setName(book.author);
          setCategory(book.category);
          setIsbn(book.isbn ? +book.isbn : null);
        })
        .catch((error) => console.error("Failed to fetch book:", error));
    }
  }, [id]);

  useEffect(() => {
    getBooks()
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => console.error("Failed to fetch books:", error));
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasTitleError(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setHasNameError(false);
  };

  const handleCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
    setHasCategoryError(false);
  };

  const handleIsbn = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsbn(+event.target.value);
    setHasIsbnError(false);
  };

  const handleReset = () => {
    setTitle("");
    setName("");
    setCategory("");
    setIsbn(null);

    setHasTitleError(false);
    setHasNameError(false);
    setHasCategoryError(false);
    setHasIsbnError(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let isValid = true;

    if (!title) {
      setHasTitleError(true);
      isValid = false;
    }

    if (!name) {
      setHasNameError(true);
      isValid = false;
    }

    if (!category) {
      setHasCategoryError(true);
      isValid = false;
    }

    if (!isbn) {
      setHasIsbnError(true);
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const maxId = books.reduce((max, book) => Math.max(max, +book.id), 0);

    const newBook = {
      id: id || (maxId + 1).toString(),
      title,
      author: name,
      category,
      isbn: isbn?.toString() || null,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      status: id ? books.find((book) => book.id === id)?.status || "active" : "active",
    };

    try {
      if (id) {
        await updateBook(newBook);
        alert("Book updated successfully!");
      } else {
        await addBook(newBook);
        alert("Book added successfully!");
      }

      navigate("/");
    } catch (error) {
      console.error("Failed to save book:", error);
      alert("Failed to save book");
    }
  };

  return (
    <section className="section">
      <h1 className="title">{id ? "Edit Book" : "Add a Book"}</h1>

      <Link to="/" className="is-block mb-6">
        <button>Back to Dashboard</button>
      </Link>

      <form onSubmit={handleSubmit}>
        <div className="field mb-5">
          <label className="label" htmlFor="book-title">
            Book title
          </label>
          <div className="control">
            <input
              id="book-title"
              className={classNames("input", { "is-danger": hasTitleError })}
              type="text"
              placeholder="Book title"
              onChange={handleTitleChange}
              value={title}
            />
          </div>
          {hasTitleError && <p className="help is-danger">Title is required</p>}
        </div>

        <div className="field mb-5">
          <label className="label" htmlFor="author-name">
            Author name
          </label>
          <div className="control">
            <input
              id="author-name"
              className={classNames("input", { "is-danger": hasNameError })}
              type="text"
              placeholder="Author name"
              onChange={handleNameChange}
              value={name}
            />
          </div>
          {hasNameError && (
            <p className="help is-danger">This field is required</p>
          )}
        </div>

        <div className="field mb-5">
          <label className="label" htmlFor="category">
            Category
          </label>
          <div className="control">
            <div
              className={classNames("select", {
                "is-danger": hasCategoryError,
              })}
            >
              <select
                id="category"
                name="category"
                onChange={handleCategory}
                value={category.toLowerCase()}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {hasCategoryError && (
            <p className="help is-danger">This field is required</p>
          )}
        </div>

        <div className="field mb-5">
          <label className="label" htmlFor="isbn">
            ISBN
          </label>
          <div className="control">
            <input
              id="isbn"
              className={classNames("input", { "is-danger": hasIsbnError })}
              type="number"
              placeholder="ISBN"
              onChange={handleIsbn}
              value={isbn !== null ? isbn.toString() : ""}
            />
          </div>

          {hasIsbnError && (
            <p className="help is-danger">This field is required</p>
          )}
        </div>

        <div className="buttons">
          <button className="button is-link" type="submit">
            {id ? "Edit Book" : "Add a Book"}
          </button>

          <button
            className="button is-link is-light"
            type="reset"
            onClick={handleReset}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
};
