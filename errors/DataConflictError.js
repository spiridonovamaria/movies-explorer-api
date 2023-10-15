module.exports = class DataConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
