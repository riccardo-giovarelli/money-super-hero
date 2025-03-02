import bcrypt from 'bcryptjs';
import express from 'express';
import pg from 'pg';

import { authenticationMiddleware } from '../users.lib.ts';

const router = express.Router();
const { Client } = pg;

/**
 * PUT: Update User Password
 *
 * @description Updates the user's password based on the email stored in the session. The route is protected by
 * the `authenticationMiddleware`, which ensures that only authenticated users can access it. The new password is hashed
 * before being stored in the database. If the update is successful, it responds with a success message. If there is an error,
 * it responds with an error message.
 *
 * @route PUT /
 * @returns {Object} A JSON object with a code and message indicating the result of the update process.
 */
router.put('/', authenticationMiddleware, async (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err: Error, hash: string) => {
    const client = new Client();
    try {
      client.connect();
      if (err) {
        throw err;
      }
      const query = {
        name: 'update-user-password-by-email',
        text: 'UPDATE users SET "password" = $1 WHERE "email" = $2;',
        values: [hash, req.session['username']],
      };
      const results = await client.query(query);
      if (results?.rowCount !== 1) {
        throw 'Row count invalid';
      } else {
        res.status(200).json({
          code: 'UPDATE_PASSWORD_SUCCESS',
          message: 'Successfully updated user password',
          details: `Rows affected: ${results.rowCount}`,
        });
      }
    } catch (err) {
      res.status(500).json({ code: 'UPDATE_ERROR', message: 'Error while updating user password', details: err });
    } finally {
      await client.end();
    }
  });
});

export default router;
