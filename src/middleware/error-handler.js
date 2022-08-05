function errorHandler(err, req, res, next) {
  switch (true) {
    case err.message === "NotFoundError":
      // custom application error
      return res.status(404).json({ message: err.messageValue });
    case err.message.type === "UnauthorizedError":
      // jwt authentication error
      return res.status(401).json({ message: err.messageValue });
    default:
      // return res.status(500).json({ message: err.message });
      return res.status(400).send({
        data: null,
        error: err.message,
        success: false,
      });
  }
}

module.exports = errorHandler;
