// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error("Global error handler:", err);

  // Default error status and message
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Build error response
  const errorResponse = {
    message,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  // Include stack trace and details in development mode
  if (process.env.NODE_ENV === "development") {
    errorResponse.error = err.message;
    errorResponse.stack = err.stack;
    errorResponse.code = err.code;
  }

  // Specific error type handling
  if (err.code === "ECONNREFUSED") {
    errorResponse.message = "Database connection refused. Please try again later.";
  } else if (err.code === "ETIMEDOUT") {
    errorResponse.message = "Request timeout. Please try again.";
  } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
    errorResponse.message = "Database authentication failed.";
  } else if (err.name === "ValidationError") {
    errorResponse.message = "Validation failed: " + err.message;
  } else if (err.name === "JsonWebTokenError") {
    errorResponse.message = "Invalid authentication token.";
  } else if (err.name === "TokenExpiredError") {
    errorResponse.message = "Authentication token has expired.";
  }

  res.status(status).json(errorResponse);
};

export default errorHandler;
