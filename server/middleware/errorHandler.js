// Simple error handler middleware.
// Express calls this when a route throws an error or calls next(error).
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Server error',
  });
};

module.exports = errorHandler;
