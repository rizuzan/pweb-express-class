// Data awal disimpan di array dalam memori (tanpa database)
const products = [
  { id: 1, name: 'Buku', price: 15000 },
  { id: 2, name: 'Pulpen', price: 5000 },
];

// 1. Mengambil seluruh produk (GET /products)
const getAllProducts = (req, res) => {
  res.status(200).json(products);
};

// 2. Mengambil 1 produk berdasarkan ID (GET /products/:id)
const getProductById = (req, res) => {
  // req.params.id selalu bertipe string, jadi harus diubah ke angka (integer)
  const id = parseInt(req.params.id);
  
  // Mencari produk di dalam array yang ID-nya cocok
  const product = products.find((item) => item.id === id);

  // Jika produk tidak ditemukan, kembalikan status 404
  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  // Jika ditemukan, kembalikan status 200 beserta objek produknya
  res.status(200).json(product);
};

// 3. Menambahkan produk baru (POST /products)
const createProduct = (req, res) => {
  // Mengambil data name dan price dari body request (JSON)
  const { name, price } = req.body;

  // Membuat ID baru secara otomatis (ID terakhir + 1, atau 1 jika array kosong)
  const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

  // Menyusun objek produk baru
  const newProduct = {
    id: newId,
    name: name,
    price: price,
  };

  // Menyimpan produk baru ke dalam array products
  products.push(newProduct);

  // Mengembalikan status 201 (Created) beserta data produk yang baru dibuat
  res.status(201).json(newProduct);
};

// Mengekspor fungsi agar bisa digunakan di file route
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
};