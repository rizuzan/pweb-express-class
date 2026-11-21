const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const productRoutes = require('./routes/productRoutes');

const app = express();
const builtFrontend = path.join(__dirname, 'dist');
const frontendDirectory = fs.existsSync(path.join(builtFrontend, 'index.html'))
  ? builtFrontend
  : path.join(__dirname, 'public');
const frontendIndex = path.join(frontendDirectory, 'index.html');

app.use(express.json());
app.get('/products/:id', (req, res, next) => {
  if (req.get('accept')?.includes('text/html') && fs.existsSync(frontendIndex)) {
    return res.sendFile(frontendIndex);
  }

  next();
});
app.use('/products', productRoutes);
app.use(express.static(frontendDirectory));
app.use((req, res, next) => {
  if (req.method === 'GET' && req.path !== '/products' && !req.path.startsWith('/products/')) {
    return res.sendFile(frontendIndex, (error) => {
      if (error) next(error);
    });
  }

  next();
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 500
    ? err.status
    : 500;

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    message: status < 500 ? 'Request tidak valid' : 'Terjadi kesalahan pada server',
  });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
}

module.exports = app;