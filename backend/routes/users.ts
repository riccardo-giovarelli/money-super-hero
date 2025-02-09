import bcrypt from 'bcryptjs';
import express from 'express';

import client from '../utils/db/client.ts';

const router = express.Router();

/**
 * GET: Check if user is logged in
 */
router.get('/', (req, res) => {
  if (req.session['username']) {
    res.json({ code: 'LOGGED_IN', message: 'User logged in', details: '' });
  } else {
    res.json({ code: 'LOGGED_OUT', message: 'User logged out', details: '' });
  }
});

/**
 * POST: Sign up
 */
router.post('/signup', async (req, res) => {
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
        .json({ code: 'USER_EXISTS', message: 'Error while inserting new user', details: 'User already exists' });
      return;
    }
  } catch (err) {
    await client.end();
    res.status(422).json({ code: 'REGISTRATION_ERROR', message: 'Error while inserting new user', details: err });
    return;
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
        .json({ code: 'REGISTRATION_SUCCESSFUL', message: 'New user saved successfully', details: results });
    } catch (err) {
      res.status(422).json({ code: 'REGISTRATION_ERROR', message: 'Error while inserting new user', details: err });
    } finally {
      await client.end();
    }
  });
});

/**
 * POST: Sign in
 */
router.post('/signin', async (req, res) => {
  try {
    const query = {
      name: 'get-user-by-email',
      text: 'SELECT "firstName", "lastName", "email", "password" FROM users WHERE "email" = $1;',
      values: [req.body.email.trim()],
    };
    const results = await client.query(query);
    if (results?.rowCount !== 1) {
      res.status(422).json({ code: 'USER_NOT_FOUND', message: 'Error while logging in', details: 'User not found' });
      return;
    }
    bcrypt.compare(req.body.password, results.rows[0].password, (err: Error, result: boolean) => {
      if (err) {
        throw err;
      }
      if (!result) {
        res.status(422).json({ code: 'WRONG_PASSWORD', message: 'Error while logging in', details: 'Wrong password' });
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
    res.status(422).json({ code: 'LOGIN_ERROR', message: 'Error while logging in', details: err });
  } finally {
    await client.end();
  }
});

export default router;
