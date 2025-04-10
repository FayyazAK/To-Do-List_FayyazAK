const HTTP_STATUS = require('../utils/statusCodes');

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;

