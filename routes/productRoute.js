const express = require('express');
const productController = require('../controller/productController');
// const userAuth = require('../auth/userAuth');
// const cartRouter = require('../routes/cartRoute');

const router = express.Router();

// router.use('/:productId/carts', cartRouter);

router
	.route('/')
	.get(
		// userAuth.protectProduct,
		productController.getAllProduct
	)
	.post(productController.createProduct);

router
	.route('/:id')
	.get(productController.getProduct)
	.patch(productController.updateProduct)
	.delete(productController.deleteProduct);

module.exports = router;
