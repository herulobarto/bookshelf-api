const { nanoid } = require("nanoid");
const books = require("./books");

// POST /books handler
const addBook = (request, h) => {
  const {
    name,
    author,
    publisher,
    year,
    stock,
    price,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const finished = pageCount === readPage;

  if (!name) {
    return h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    }).code(400);
  }

  const newBook = {
    id,
    name,
    author,
    publisher,
    year,
    stock,
    price,
    pageCount,
    readPage,
    finished,
    reading,
    createdAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.some((book) => book.id === id);

  if (isSuccess) {
    return h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  }).code(500);
};

// GET /books handler
const getAllBooks = (request) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading) {
    filteredBooks = filteredBooks.filter((book) => book.reading === (reading === "1"));
  }

  if (finished) {
    filteredBooks = filteredBooks.filter((book) => book.finished === (finished === "1"));
  }

  return {
    status: "success",
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };
};

// GET /books/{bookId} handler
const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((b) => b.id === bookId);

  if (book) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }

  return h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  }).code(404);
};

// PUT /books/{bookId} handler
const updateBookById = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    author,
    publisher,
    year,
    stock,
    price,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    if (!name) {
      return h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      }).code(400);
    }

    if (readPage > pageCount) {
      return h.response({
        status: "fail",
        message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      }).code(400);
    }

    books[index] = {
      ...books[index],
      name,
      author,
      publisher,
      year,
      stock,
      price,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    }).code(200);
  }

  return h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  }).code(404);
};

// DELETE /books/{bookId} handler
const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    }).code(200);
  }

  return h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  }).code(404);
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
