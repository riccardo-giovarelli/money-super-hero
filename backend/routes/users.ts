import bcrypt from 'bcryptjs';
import express from 'express';

import client from '../utils/db/client.ts';


const router = express.Router();

/**
 * POST
 */
router.post('', async (req, res) => {
  // Check if the user already exists
  try {
    const query = {
      name: 'get-user-by-email',
      text: 'SELECT EXISTS(SELECT 1 FROM users WHERE "email" = $1)',
      values: [req.body.email.trim()],
    };
    const results = await client.query(query);
    if (results?.rows?.[0]?.exists) {
      res
        .status(422)
        .json({ code: 'USER_EXISTS', Message: 'Error while inserting new user', Details: 'User already exists' });
    }
  } catch (err) {
    res.status(422).json({ code: 'REGISTRATION_ERROR', Message: 'Error while inserting new user', Details: err });
    await client.end();
  }

  // Insert new user
  bcrypt.hash(req.body.password, 10, async (err: Error, hash: string) => {
    try {
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
        .json({ code: 'REGISTRATION_SUCCESSFUL', Message: 'New user saved successfully', Details: results });
    } catch (err) {
      res.status(422).json({ code: 'REGISTRATION_ERROR', Message: 'Error while inserting new user', Details: err });
    } finally {
      await client.end();
    }
  });
});

export default router;
