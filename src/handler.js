const { nanoid } = require('nanoid');
const booksCollection = [];

// Menyimpan Buku
const addBook = (request, h) => {
    const { name, author, publisher, year, stock, price } = request.payload;

    if (!name || !author || !publisher || !year || !stock || !price) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi semua kolom',
        });
        return response.code(400); 
    }

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newBook = { id, name, author, publisher, year, stock, price, createdAt, updatedAt };

    booksCollection.push(newBook);

    const isSuccess = booksCollection.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        return response.code(201); 
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan'
    });
    return response.code(500); 
};

// Menampilkan seluruh buku
const getAllBooks = () => ({
    status: 'success',
    data: {
        books: booksCollection.map(({ id, name, publisher }) => ({
            id,
            name,
            publisher,
        })),
    },
});


// Menampilkan detail buku
const getBookById = (request, h) => {
    const { id } = request.params;
    const book = booksCollection.find((books) => books.id === id);

    if (book) {
        return {
            status: 'success',
            data: {
                book: {
                    id: book.id,
                    name: book.name,
                    author: book.author,
                    publisher: book.publisher,
                    year: book.year,
                    stock: book.stock,
                    price: book.price,
                    createdAt: book.createdAt,
                    updatedAt: book.updatedAt,
                },
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    return response.code(404);
};

// Mengubah data buku
const updateBook = (request, h) => {
    const { id } = request.params;
    const { name, author, publisher, year, stock, price } = request.payload;

    // Memeriksa apakah nama buku ada di payload
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi judul buku'
        });
        return response.code(400);
    }

    const updatedAt = new Date().toISOString();
    
    const index = booksCollection.findIndex(books => books.id === id);
    
    // Memeriksa apakah buku dengan id yang diberikan ada dalam koleksi
    if (index !== -1) {
        booksCollection[index] = {
            ...booksCollection[index],
            name,
            author,
            publisher,
            year,
            stock,
            price,
            updatedAt,
        };
        
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        return response.code(200);
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    return response.code(404);
};

// Menghapus buku
const deleteBook = (request, h) => {
    const { id } = request.params;
    const index = booksCollection.findIndex(books => books.id === id);
    
    // Memeriksa apakah buku dengan id yang diberikan ada dalam koleksi
    if (index !== -1) {
        booksCollection.splice(index, 1);
        
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        return response.code(200);
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    return response.code(404);
};

module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
};
