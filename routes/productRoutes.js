const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts) // Public
  .post(protect, admin, createProduct); // Admin only

router.route('/:id')
  .put(protect, admin, updateProduct) // Admin only
  .delete(protect, admin, deleteProduct); // Admin only

module.exports = router;
