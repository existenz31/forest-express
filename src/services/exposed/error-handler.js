/**
 * Creates an error handler, that will return errors as JSON responses
 *
 * @param {{logger?: {error: (message: string, context?: any) => void }}?} options
 * @returns {import("express").ErrorRequestHandler}
 */
function errorHandler({ logger } = {}) {
  /**
   * @param {any} error
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @param {() => void} next
   */
  return function handleError(error, request, response, next) {
    if (error) {
      // NOTICE: Send the first error if any.
      if (error && error.errors && error.errors[0] && error.errors[0].message) {
        error.message = error.errors[0].message;
      }

      if (!error.status && logger) {
        // NOTICE: Unexpected errors should log an error in the console.
        logger.error('Unexpected error: ', error);
      }

      response.status(error.status || 500).send({
        errors: [{
          status: error.status || 500,
          detail: error.message,
        }],
      });
    } else {
      next();
    }
  };
}

module.exports = errorHandler;
