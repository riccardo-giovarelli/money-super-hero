import express from "express";
import pg from "pg";

import { authenticationMiddleware } from "../users/users.lib.ts";
import type { TransactionsGetPayload } from "./transactions.type.ts";

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
router.post("/", authenticationMiddleware, async (req, res) => {
  const client = new Client();
  const { amount, direction, category, subcategory, notes } = req.body;

  try {
    await client.connect();

    // Get user ID of the current user
    const userQuery = {
      name: "get-user-id-by-email",
      text: 'SELECT "id" FROM users WHERE "email" = $1;',
      values: [req.session["username"]],
    };
    const userResults = await client.query(userQuery);
    if (userResults?.rowCount < 1) {
      res.status(200).json({
        code: "ADD_TRANSACTION_ERROR",
        message: "Error while adding transaction",
        details: "Error retrieving user information",
      });
    }

    // Add new transaction
    const newTransactionQuery = {
      name: "add-new-transaction",
      text: 'INSERT INTO transactions ("user_id", "amount", "direction", "category", "sub_category", "notes") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
      values: [
        userResults.rows[0].id,
        amount,
        direction,
        category,
        subcategory,
        notes,
      ],
    };
    const newTransactionResults = await client.query(newTransactionQuery);
    if (newTransactionResults?.rowCount < 1) {
      res.status(200).json({
        code: "ADD_TRANSACTION_ERROR",
        message: "Error adding transaction",
        details: "Unknown error",
      });
    } else {
      res.status(200).json({
        code: "ADD_TRANSACTION_SUCCESS",
        message: "Successfully added transaction",
        details: newTransactionResults.rows[0],
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "ADD_TRANSACTION_ERROR",
      message: "Error while adding transaction",
      details: err,
    });
  } finally {
    await client.end();
  }
});

/**
 * GET: Retrieve Transactions with Pagination and Ordering
 *
 * @description Retrieves a paginated list of transactions for the authenticated user, with optional sorting by columns.
 *
 * @route GET /
 * @access Protected (requires authentication)
 *
 * @query {number} page - The page number for pagination (default is 1).
 * @query {number} limit - The number of items per page (default is 10).
 * @query {string} sortColumn - The column to sort by (default is 'id').
 * @query {string} sortDirection - The direction to sort ('asc' or 'desc', default is 'asc').
 *
 * @returns {object} - A JSON object with the result of the operation.
 */
router.get("/", authenticationMiddleware, async (req, res) => {
  const client = new Client();

  const {
    page = 1,
    limit = 10,
    sortColumn = "id",
    sortDirection = "asc",
  } = req.query as TransactionsGetPayload;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    await client.connect();

    // Get user ID of the current user
    const userQuery = {
      name: "get-user-id-by-email",
      text: 'SELECT "id" FROM users WHERE "email" = $1;',
      values: [req.session["username"]],
    };
    const userResults = await client.query(userQuery);
    if (userResults?.rowCount < 1) {
      res.status(200).json({
        code: "GET_TRANSACTIONS_ERROR",
        message: "Error retrieving transactions",
        details: "Error retrieving user information",
      });
      return;
    }
    const userId = userResults.rows[0].id;

    // Get the total count of transactions
    const countQuery = {
      name: "get-transactions-count",
      text: 'SELECT COUNT(*) AS full_count FROM transactions WHERE "user_id" = $1;',
      values: [userId],
    };
    const countResults = await client.query(countQuery);

    // Query to get transactions with pagination and sorting
    const transactionsQuery = {
      name: "get-transactions-with-pagination",
      text: `
        SELECT "id", "amount", "direction", "category", "sub_category", "notes", "timestamp"
        FROM transactions
        WHERE "user_id" = $1
        ORDER BY "${sortColumn}" ${sortDirection.toString().toUpperCase()}
        LIMIT $2 OFFSET $3;
      `,
      values: [userId, Number(limit), offset],
    };
    const transactionsResults = await client.query(transactionsQuery);

    // Handle results
    if (transactionsResults?.rowCount < 1) {
      res.status(200).json({
        code: "GET_TRANSACTIONS_ERROR",
        message: "No transactions found",
        details: "No results retrieving transactions",
      });
    } else {
      res.status(200).json({
        code: "GET_TRANSACTIONS_SUCCESS",
        message: "Successfully retrieved transactions",
        details: {
          results: transactionsResults.rows,
          count: countResults.rows[0].full_count,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "GET_TRANSACTIONS_ERROR",
      message: "Error retrieving transactions",
      details: err,
    });
  } finally {
    await client.end();
  }
});

export default router;
