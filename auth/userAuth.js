const {promisify} = require('util')
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SERCRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });


exports.signup = catchAsync(async (req, res, next) => {

  const newUser = await User.create({

    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    
  });
  
  const token = signToken(newUser._id);
  
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
  

});

exports.signin = catchAsync(async (req, res, next) => {

const { email, password } = req.body;
  
//Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctUserPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id)
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
    
});


exports.protectProduct = catchAsync(async (req, res, next) => {
  //1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt)
  {
    token = req.cookies.jwt;
  }
  
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }
  //2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SERCRET);
  //3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exists.')
    );
  };
  //4) Check if user changed password after the token was issuse
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
