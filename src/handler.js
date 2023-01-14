const { nanoid } = require('nanoid');
const book = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.paylod;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  book.push(newBook);

  const isSuccess = book.fillter((books) => books.id === id).length > 0;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku, Mohon isi Nama buku',
    });
    response.code(400);

    return response;
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku, readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil di tambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal di tambahkan',
  });
  response.code(500);

  return response;
};

const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let fillterBook = book;

  if (name !== undefined) {
    fillterBook = fillterBook.fillter((books) => books.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    fillterBook = fillterBook.fillter((books) => books.reading === !!Number(reading));
  }

  if (finished !== undefined) {
    fillterBook = fillterBook.filter((books) => books.finished === !!Number(finished));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: fillterBook.map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
      })),
    },
  });
  response.code(200);

  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const books = book.fillter((b) => b.id === id)[0];

  if (books !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak di temukan',
  });
  response.code(404);

  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.paylod;
  const updatedAt = new Date().toISOString();
  const index = book.findIndex((books) => books.id === id);

  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku, mohon isi nama buku',
      });
      response.code(400);

      return response;
    }

    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readpage tidak boleh lebih besar dari pagecount',
      });
      response.code(400);

      return response;
    }
    const finished = pageCount === readPage;

    book[index] = {
      ...book[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'fail',
      message: 'gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'succes',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = book.findIndex((n) => n.id === id);

  if (index !== -1) {
    book.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil  diHapus',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku Gagal dihapus, Id tidak di temukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
