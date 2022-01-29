const AppError = require('../utils/appError');

const handleCastError = (err) => {
	const value = /".*?"/g.exec(err.message);
	const message = `Invalid ${value[0]} input field error, Please type the require input to the field`;
	return new AppError(message, 400);
};

const handleDuplicateError = (err) => {
	const value = err.errmsg.match(/([""])(\\?.)*?\1/);
	const message = `${value} already exist, Please use another one`;
	return new AppError(message, 400);
};

const handleValidationError = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input error ${errors.join('. ')}`;
	console.log(err);
	return new AppError(message, 401);
};

const handleJWTError = (err) =>
	new AppError('Invalid Token. Please log in again!', 401);
const handleJWTExpired = (err) =>
	new AppError('Session Expired. Please log in again', 401);

const ErrorInDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
		error: err.error,
	});
};

const ErrorInProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!',
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		ErrorInDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		console.log(err);
		if (err.message.includes('Cast')) err = handleCastError(err);

		if (err.code === 11000) err = handleDuplicateError(err);

		if (err.name === 'ValidationError') err = handleValidationError(err);
		if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
		if (err.name === 'TokenExpiredError') err = handleJWTExpired(err);
		ErrorInProd(err, res);
	}
};
