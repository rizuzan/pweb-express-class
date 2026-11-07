const db = require('../database');

const isValidId = (id) => Number.isSafeInteger(id) && id > 0;

const validateProduct = (name, price) => {
  if (typeof name !== 'string' || name.trim() === '') {
    return 'Nama produk wajib diisi dengan teks';
  }

  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    return 'Harga produk harus berupa angka nol atau lebih';
  }

  return null;
};

const getAllProducts = (req, res) => {
  const products = db.prepare('SELECT id, name, price FROM products ORDER BY id').all();
  res.status(200).json(products);
};

const getProductById = (req, res) => {
  const id = Number(req.params.id);

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'ID produk tidak valid' });
  }

  const product = db.prepare('SELECT id, name, price FROM products WHERE id = ?').get(id);

  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  res.status(200).json(product);
};

const createProduct = (req, res) => {
  const { name, price } = req.body ?? {};
  const validationError = validateProduct(name, price);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const result = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)').run(name.trim(), price);
  const product = db.prepare('SELECT id, name, price FROM products WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json(product);
};

const updateProduct = (req, res) => {
  const { id, name, price } = req.body ?? {};

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'ID produk tidak valid' });
  }

  const validationError = validateProduct(name, price);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const result = db.prepare('UPDATE products SET name = ?, price = ? WHERE id = ?').run(name.trim(), price, id);

  if (result.changes === 0) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  const product = db.prepare('SELECT id, name, price FROM products WHERE id = ?').get(id);
  res.status(200).json(product);
};

const deleteProduct = (req, res) => {
  const id = Number(req.params.id);

  if (!isValidId(id)) {
    return res.status(400).json({ message: 'ID produk tidak valid' });
  }

  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);

  if (result.changes === 0) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  res.status(200).json({ message: 'Produk berhasil dihapus' });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};