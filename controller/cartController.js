const Cart = require('../models/cartSchema');
const Product = require('../models/ProductSchema');
const catchAsync = require('../utils/catchAsync');

exports.getCartProducts = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };
    const carts = await Cart.find(filter);

    res.status(200).json({
        status: 'success',
        results: carts.length,
        data: {
            carts,
        },
    });
    
});

exports.addCartProduct = catchAsync(async (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    // if (!req.body.user) req.body.user = req.user.id;
    const newCart = await Cart.create(req.body)
    
    res.status(200).json({
    createdAt: req.createdAt,
    status: 'success',
    data: {
      cart: newCart,
    },
  });
    
    // const userId = req.params.id
    // const { productId, quantity } = req.body;

    // let cart = await Cart.findOne({ userId});
    // let product = await Product.findOne({ _id: productId })
    
    // if (!product)
    // {
    //   return  res.status(404).send('product not found !')
    // }

    // const price = product.price
    // const name = product.title
    // const image = product.image

   
    // return res.status(201).send(newCart);
    // if (cart)
    // {
        // let productIndex = cart.products.findIndex(p => p.productId == productId);
        // if (productIndex > -1)
        // {
        //     let itemProduct = cart.products[ product ];
        //     itemProduct.quantity += quantity;
        //     cart.products[ productIndex ] = itemProduct;
        // } else
        // {
        //     cart.products.push({ productId, name, quantity, price, image });
        // }
    //     cart.bill += quantity.price;
    //     cart = await cart.save();
    // return res.status(201).send(cart)
    
    
    // } else
    // {
        
    // }
})

exports.deleteCartProduct = catchAsync(async (req, res, next) => {
    const userId = req.params.userId;
    const productId = req.params.productId
    
    let cart = await Cart.findOne({ userId });
    let productIndex = cart.products.findIndex(p => p.productId === productId);

    if (productIndex > -1)
        {
            let itemProduct = cart.products[ product ];
           cart.bill -= itemProduct.quantity*itemProduct.price;
            cart.products.splice(productIndex, 1)
    }
    cart = await cart.save();
    return res.status(201).send(cart)
})