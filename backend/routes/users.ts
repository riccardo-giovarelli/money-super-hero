import bcrypt from 'bcryptjs';
import express from 'express';

import client from '../utils/db/client.ts';

const router = express.Router();

/**
 * POST
 */
router.post('', async (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err: Error, hash: string) => {
    try {
      if (err) {
        throw err;
      }
      const text = 'INSERT INTO users("firstName", "lastName", "email", "password") VALUES($1, $2, $3, $4)';
      const values = [req.body.firstName, req.body.lastName, req.body.email, hash];
      const results = await client.query(text, values);
      if (results?.rowCount !== 1) {
        throw 'Row count invalid';
      }
      res.status(200).json({ Message: 'New user saved successfully' });
    } catch (err) {
      res.status(422).json({ Message: 'Error while inserting new user', Details: err });
    } finally {
      await client.end();
    }
  });
});

export default router;
