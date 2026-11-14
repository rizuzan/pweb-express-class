const path = require('node:path');
const Database = require('better-sqlite3');

const databasePath = process.env.PRODUCTS_DB_PATH || path.join(__dirname, 'data.db');
const db = new Database(databasePath);

db.pragma('journal_mode = WAL');
const productsTableExists = db
  .prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'products'")
  .get();

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL CHECK (price >= 0)
  )
`);

if (!productsTableExists) {
  const insertProduct = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
  const seedProducts = db.transaction(() => {
    insertProduct.run('Pulpen', 5000);
    insertProduct.run('Buku Tulis', 12000);
    insertProduct.run('Spidol', 8000);
    insertProduct.run('Penggaris', 6000);
    insertProduct.run('Penghapus', 3000);
  });

  seedProducts();
}

module.exports = db;
