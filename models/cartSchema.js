const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [ true, 'Cart must belong to a product' ],
    },
    quantity: {
        type: Number,
        required: true,
        min: [ 1, 'Quantity can not be less than 1.' ],
        default: 1
    },
    
    bill: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

cartSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'product',
        select: 'name price image'
    }).populate({
        path: 'user',
        select: 'name',
    });
    next();
});
const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart
