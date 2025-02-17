import bcrypt from 'bcryptjs';
import express from 'express';
import pg from 'pg';


const router = express.Router();
const { Client } = pg;

/**
 * POST: Sign in
 *
 * @description Handles the user login process. Checks if the user exists, verifies the password,
 * and creates a session for the user. If the login is successful, it responds with a success message
 * and the user's details. If there is an error, it responds with an error message.
 *
 * @route POST /
 * @returns {Object} A JSON object with a code and message indicating the result of the login process.
 */
router.post('/', async (req, res) => {
  const client = new Client();
  try {
    client.connect();
    const query = {
      name: 'get-user-by-email',
      text: 'SELECT "firstName", "lastName", "email", "password" FROM users WHERE "email" = $1;',
      values: [req.body.email.trim()],
    };
    const results = await client.query(query);
    if (results?.rowCount !== 1) {
      res.status(200).json({ code: 'USER_NOT_FOUND', message: 'Error while logging in', details: 'User not found' });
      return;
    }
    bcrypt.compare(req.body.password, results.rows[0].password, (err: Error, result: boolean) => {
      if (err) {
        throw err;
      }
      if (!result) {
        res.status(200).json({ code: 'WRONG_PASSWORD', message: 'Error while logging in', details: 'Wrong password' });
        return;
      }
      req.session['username'] = results.rows[0].email;
      res.status(200).json({
        code: 'LOGIN_SUCCESSFUL',
        message: 'User logged in successfully',
        details: {
          firstName: results.rows[0].firstName,
          lastName: results.rows[0].lastName,
          email: results.rows[0].email,
        },
      });
    });
  } catch (err) {
    res.status(200).json({ code: 'LOGIN_ERROR', message: 'Error while logging in', details: err });
  } finally {
    await client.end();
  }
});

export default router;
