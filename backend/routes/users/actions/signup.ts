import bcrypt from 'bcryptjs';
import express from 'express';
import pg from 'pg';

const router = express.Router();
const { Client } = pg;

/**
 * POST: Sign up
 *
 * @description Handles the user registration process. Checks if the user already exists,
 * hashes the password, and inserts the new user into the database. If the registration is successful,
 * it responds with a success message. If there is an error, it responds with an error message.
 *
 * @route POST /
 * @access Protected (requires authentication)
 * @returns {Object} A JSON object with a code and message indicating the result of the registration process.
 */
router.post('/', async (req, res) => {
  // Check if the user already exists
  const client = new Client();
  try {
    client.connect();
    const query = {
      name: 'get-user-by-email',
      text: 'SELECT EXISTS(SELECT 1 FROM users WHERE "email" = $1)',
      values: [req.body.email.trim()],
    };
    const results = await client.query(query);
    if (results?.rows?.[0]?.exists) {
      res
        .status(200)
        .json({ code: 'USER_EXISTS', message: 'Error while inserting new user', details: 'User already exists' });
      return;
    }
  } catch (err) {
    await client.end();
    res.status(500).json({ code: 'REGISTRATION_ERROR', message: 'Error while inserting new user', details: err });
    return;
  }

  // Insert new user
  bcrypt.hash(req.body.password, 10, async (err: Error, hash: string) => {
    const client = new Client();
    try {
      client.connect();
      if (err) {
        throw err;
      }
      const query = {
        name: 'insert-new-user',
        text: 'INSERT INTO users("firstName", "lastName", "email", "password") VALUES($1, $2, $3, $4)',
        values: [req.body.firstName, req.body.lastName, req.body.email, hash],
      };
      const results = await client.query(query);
      if (results?.rowCount !== 1) {
        throw 'Row count invalid';
      }
      res
        .status(200)
        .json({ code: 'REGISTRATION_SUCCESSFUL', message: 'New user saved successfully', details: results });
    } catch (err) {
      res.status(500).json({ code: 'REGISTRATION_ERROR', message: 'Error while inserting new user', details: err });
    } finally {
      await client.end();
    }
  });
});

export default router;
