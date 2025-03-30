import express from 'express';
import pg from 'pg';

import { authenticationMiddleware } from '../users/users.lib.ts';

const router = express.Router();
const { Client } = pg;

/**
 * POST: Add a New Transaction
 *
 * @description Adds a new transaction to the database for the authenticated user.
 *
 * @route POST /
 * @access Protected (requires authentication)
 *
 * @body {number} amount - The amount of the transaction.
 * @body {string} direction - The direction of the transaction ('IN' for income, 'OUT' for expense).
 * @body {string} category - The category of the transaction.
 * @body {string} subcategory - The subcategory of the transaction (optional).
 * @body {string} notes - Additional notes for the transaction (optional).
 *
 * @returns {object} - A JSON object with the result of the operation.
 */
router.post('/', authenticationMiddleware, async (req, res) => {
  const client = new Client();
  const { amount, direction, category, subcategory, notes } = req.body;

  try {
    await client.connect();

    // Get user ID of the current user
    const userQuery = {
      name: 'get-user-id-by-email',
      text: 'SELECT "id" FROM users WHERE "email" = $1;',
      values: [req.session['username']],
    };
    const userResults = await client.query(userQuery);
    if (userResults?.rowCount < 1) {
      res.status(200).json({
        code: 'ADD_TRANSACTION_ERROR',
        message: 'Error while adding transaction',
        details: 'Error retrieving user information',
      });
    }

    // Add new transaction
    const newTransactionQuery = {
      name: 'add-new-transaction',
      text: 'INSERT INTO transactions ("user_id", "amount", "direction", "category", "sub_category", "notes") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
      values: [userResults.rows[0].id, amount, direction, category, subcategory, notes],
    };
    const newTransactionResults = await client.query(newTransactionQuery);
    console.log('results', newTransactionResults);
    if (newTransactionResults?.rowCount < 1) {
      res.status(200).json({
        code: 'ADD_TRANSACTION_ERROR',
        message: 'Error adding transaction',
        details: 'Unknown error',
      });
    } else {
      res.status(200).json({
        code: 'ADD_TRANSACTION_SUCCESS',
        message: 'Successfully added transaction',
        details: newTransactionResults.rows[0],
      });
    }
  } catch (err) {
    res.status(500).json({
      code: 'ADD_TRANSACTION_ERROR',
      message: 'Error while adding transaction',
      details: err,
    });
  } finally {
    await client.end();
  }
});

export default router;
