class AppError extends Error {
    constructor(status, message, cause = null) {
        super(message);
        this.status = status;
        this.cause = cause;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;