const { nanoid } = require('nanoid');
const booksCollection = [];

// Menyimpan Buku
const addBook = (request, h) => {
    const { judul, penulis, penerbit, tahun, stok, harga } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newBook = { id, judul, penulis, penerbit, tahun, stok, harga, createdAt, updatedAt };

    booksCollection.push(newBook);

    const isSuccess = booksCollection.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
                book: newBook,
            },
        }).code(201);
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    }).code(500);
};

// Menampilkan seluruh buku
const getAllBooks = () => ({
    status: 'success',
    data: {
        booksCollection,
    },
});

// Menampilkan detail buku
const getBookById = (request, h) => {
    const { id } = request.params;
    const book = booksCollection.filter((books) => books.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Mengubah data buku
const updateBook = (request, h) => {
    const { id } = request.params;
    const { judul, penulis, penerbit, tahun, stok, harga } = request.payload;
    const updatedAt = new Date().toISOString();
    
    const index = booksCollection.findIndex(books => books.id === id);
    
    if (index !== -1) {
        booksCollection[index] = {
            ...booksCollection[index],
            judul,
            penulis,
            penerbit,
            tahun,
            stok,
            harga,
            updatedAt,
        };
        
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diubah',
        });
        response.code(200);
        return response;
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

// Menghapus buku
const deleteBook = (request, h) => {
    const { id } = request.params;
    const index = booksCollection.findIndex(books => books.id === id);
    
    if (index !== -1) {
        booksCollection.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
};
