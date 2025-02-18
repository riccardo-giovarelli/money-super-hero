import type { RequestHandler } from 'express';

/**
 * @function authenticationMiddleware
 *
 * @description Middleware function to check if the user is authenticated. It verifies if the session contains a 'username'.
 * If the user is authenticated, it calls the next middleware function. If the user is not authenticated, it responds with
 * a 401 status code and an error message.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */
export const authenticationMiddleware: RequestHandler = (req, res, next) => {
  if (req.session['username']) {
    next();
  } else {
    res
      .status(401)
      .json({ code: 'AUTH_ERROR', message: 'Error with authentication', details: 'User not authenticated' });
  }
};
