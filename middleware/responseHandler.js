const HTTP_STATUS = require('../utils/statusCodes');

const responseHandler = (req, res, next) => {
  // Success response handler
  res.success = (data, statusCode = HTTP_STATUS.OK) => {
    res.status(statusCode).json({ status: "success", data });
  };

  // Error response handler
  res.error = (message, statusCode = HTTP_STATUS.BAD_REQUEST) => {
    res.status(statusCode).json({ status: "error", message });
  };

  next();
};

module.exports = responseHandler; 