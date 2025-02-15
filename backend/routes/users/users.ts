import bcrypt from 'bcryptjs';
import express from 'express';
import pg from 'pg';

import { authenticationMiddleware } from './users.lib.ts';

const router = express.Router();
const { Client } = pg;

/**
 * GET: Retrieve User Information
 *
 * @description Retrieves the user's information based on the email stored in the session. The route is protected by
 * the `authenticationMiddleware`, which ensures that only authenticated users can access it. If the user is found,
 * it responds with the user's first name, last name, and email. If no user is found, it responds with an error message.
 *
 * @route GET /myself
 * @returns {Object} A JSON object with a code and message indicating the result of the retrieval process.
 */
router.get('/myself', authenticationMiddleware, async (req, res) => {
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

/**
 * GET: Check if user is logged in
 *
 * @description Checks if the user is currently logged in by verifying the session.
 * If the user is logged in, it responds with a success message.
 *
 * @route GET /check
 * @returns {Object} A JSON object with a code and message indicating the login status.
 */
router.get('/check', authenticationMiddleware, (req, res) => {
  res.json({ code: 'LOGGED_IN', message: 'User logged in', details: '' });
});

/**
 * GET: Logout
 *
 * @description Handles the logout process by destroying the user's session and clearing the session cookie.
 * If the session is successfully destroyed, it responds with a success message. If there is an error during
 * the session destruction, it responds with an error message.
 *
 * @route GET /logout
 * @returns {Object} A JSON object with a code and message indicating the result of the logout process.
 */
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(422).json({ code: 'LOGOUT_ERROR', message: 'Error while logging out', details: err });
    } else {
      res.clearCookie('money-super-hero-session');
      res.json({ code: 'LOGGED_OUT', message: 'User logged out', details: '' });
    }
  });
});

/**
 * POST: Sign up
 *
 * @description Handles the user registration process. Checks if the user already exists,
 * hashes the password, and inserts the new user into the database. If the registration is successful,
 * it responds with a success message. If there is an error, it responds with an error message.
 *
 * @route POST /signup
 * @returns {Object} A JSON object with a code and message indicating the result of the registration process.
 */
router.post('/signup', async (req, res) => {
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
      res.status(422).json({ code: 'REGISTRATION_ERROR', message: 'Error while inserting new user', details: err });
    } finally {
      await client.end();
    }
  });
});

/**
 * POST: Sign in
 *
 * @description Handles the user login process. Checks if the user exists, verifies the password,
 * and creates a session for the user. If the login is successful, it responds with a success message
 * and the user's details. If there is an error, it responds with an error message.
 *
 * @route POST /signin
 * @returns {Object} A JSON object with a code and message indicating the result of the login process.
 */
router.post('/signin', async (req, res) => {
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
