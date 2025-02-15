import express from 'express';
import pg from 'pg';

import { authenticationMiddleware } from '../users.lib.ts';


const router = express.Router();
const { Client } = pg;

/**
 * GET: Retrieve User Information
 *
 * @description Retrieves the user's information based on the email stored in the session. The route is protected by
 * the `authenticationMiddleware`, which ensures that only authenticated users can access it. If the user is found,
 * it responds with the user's first name, last name, and email. If no user is found, it responds with an error message.
 *
 * @route GET /
 * @returns {Object} A JSON object with a code and message indicating the result of the retrieval process.
 */
router.get('/', authenticationMiddleware, async (req, res) => {
  const client = new Client();
  try {
    client.connect();
    const query = {
      name: 'get-user-by-email',
      text: 'SELECT "firstName", "lastName", "email" FROM users WHERE "email" = $1;',
      values: [req.session['username']],
    };
    const results = await client.query(query);
    if (results?.rowCount < 1) {
      res
        .status(422)
        .json({ code: 'GET_USER_ERROR', message: 'Error retrieving user information', details: 'No user found' });
    } else {
      res.status(200).json({
        code: 'GET_USER_SUCCESS',
        message: 'Successfully retrieved user information',
        details: {
          firstName: results.rows[0].firstName,
          lastName: results.rows[0].lastName,
          email: results.rows[0].email,
        },
      });
    }
  } catch (err) {
    res.status(422).json({ code: 'LOGIN_ERROR', message: 'Error while logging in', details: err });
  } finally {
    await client.end();
  }
});

export default router;
