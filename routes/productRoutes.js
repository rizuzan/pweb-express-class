const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Menghubungkan endpoint dengan masing-masing fungsi di controller
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;