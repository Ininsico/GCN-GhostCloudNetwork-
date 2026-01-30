export class Apperror extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
//Developement Error Response
const sendErrorDev = (req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};
//Production Error Response
const sendErrorProd = (req, res) => {
    //operational send error to clients
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            stauts: statuscode,
            message: err.message
        });
    }
    //Code-Based errors 
    else {
        //log Error
        console.error('Error', err);
        res.status(500).json({
            status: 'error',
            message: "Internal Server Error"
        });
    }
}

//Handle Specific MongoDB errors
const handleDuplicateFeildsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate feild message:${value}.Please use another value`;
    return new Apperror(message, 400);
}
const handleValidationErrorsDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('_ ')}`;
    return new Apperror(message, 400);
}
const handlecastError = (err) => {
    const errors = `Invalid ${err.path}: ${err.value}`;
    return new Apperror(message, 400);
}
const handleJWTError = (err) => {
    new Apperror('Invalid token.Please try again later', 401);
}
const handleJWTExpiresError = (err) => {
    new Apperror('Your token has expired,Please try again later', 401);
}
//Main error handler Middleware;
export const errorhandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'developement') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        err.message = err.message;
        if (error.name === 'CastError') error = handlecastError(error);
        if (error.node === 11000) error = handleDuplicateFeildsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorsDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (error.name === 'TokenExpiredError') error = handleJWTExpiresError(error);

        sendErrorProd(error, res);
    }
};

//404 Handler
export const notFoundHandler = (req, res, next) => {
    const error = new Apperror(`Cant find ${req.originalUrl} on this server`, 404);
    next(error);
}

//Async handler to catch async errors
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}