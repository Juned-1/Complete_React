class AppError extends Error{
    //inherit built in Error class
    //all operational error are handled here
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor); //capture error into constructor of current object
    }
}
module.exports = AppError;