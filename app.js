const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = 3000;

// PENTING: Middleware agar Express bisa membaca body bertipe JSON pada request POST
app.use(express.json());

// Mendaftarkan route dengan awalan URL '/products'
app.use('/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});