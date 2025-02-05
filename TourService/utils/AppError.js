class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
