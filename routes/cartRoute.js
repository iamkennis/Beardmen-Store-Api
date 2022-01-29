const express = require('express');
const cartController = require('../controller/cartController');
const userAuth = require('../auth/userAuth')
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(cartController.getCartProducts)
    .post(userAuth.protectProduct,cartController.addCartProduct)

// router.route('/:id')
//     // .get(cartController.getCartProducts)
//     // .post(cartController.addCartProduct);
      
router.route('/userId/productId/:id')
    .delete(cartController.deleteCartProduct)
      

module.exports = router