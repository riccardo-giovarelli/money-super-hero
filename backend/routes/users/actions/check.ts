import express from 'express';

const router = express.Router();

/**
 * GET: Check Authentication Status
 *
 * @description Checks if the user is currently authenticated by verifying the presence of the 'username' in the session.
 * If the user is authenticated, it responds with a success message indicating that the user is logged in.
 * If the user is not authenticated, it responds with a message indicating that the user is not logged in.
 *
 * @route GET /
 * @returns {Object} A JSON object with a code and message indicating the authentication status.
 */
router.get('/', (req, res) => {
  if (req.session['username']) {
    res
      .status(200)
      .json({ code: 'LOGGED_IN', message: 'User authenticated', details: 'Current user is authenticated' });
  } else {
    res
      .status(200)
      .json({ code: 'LOGGED_OUT', message: 'User non authenticated', details: 'Current user is not authenticated' });
  }
});

export default router;
