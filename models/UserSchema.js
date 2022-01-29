const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        reqiured: [true, 'Please type your name'] 
    },
    lastName: {
        type: String,
        reqiured: [true, 'Please type your last name'] 
    },
    email: {
        type: String,
        required: [ true, 'Please provide your email' ],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ['admin','user'],
    }

})

userSchema.methods.correctUserPassword = async function (
    candidatePassword,
    userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User