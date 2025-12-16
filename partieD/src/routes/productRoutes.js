const express = require('express');
const router = express.Router();
const cacheMiddleware = require('../middlewares/cacheMiddleware');
const productController = require('../controllers/productController');

router.get('/products', cacheMiddleware,productController.getAllProducts);
router.get('/products/:id', cacheMiddleware, productController.getProductById);
router.put('/products/:id', cacheMiddleware,productController.updateProduct);

module.exports = router;
