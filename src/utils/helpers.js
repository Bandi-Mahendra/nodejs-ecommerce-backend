class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const sendSuccess = (res, statusCode, message, data = null, meta = undefined) => {
  const response = { success: true, message };

  if (data !== null) {
    response.data = data;
  }

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  AppError,
  asyncHandler,
  sendSuccess,
};
