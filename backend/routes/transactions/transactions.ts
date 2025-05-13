import express from "express";
import pool from "../../db.ts"; // Import the connection pool
import { authenticationMiddleware } from "../users/users.lib.ts";
import type { TransactionsGetPayload } from "./transactions.type.ts";
import { getAverageValue } from "./transactions.lib.ts";

const router = express.Router();

/**
 * POST: Add a New Transaction
 *
 * @description Adds a new transaction to the database. The route is protected by the `authenticationMiddleware`,
 * ensuring that only authenticated users can access it. The transaction details, including `amount`, `direction`,
 * `category`, `subcategory`, and `notes`, are provided in the request body. The transaction is associated with
 * the currently authenticated user.
 *
 * @route POST /
 * @access Protected (requires authentication)
 *
 * @body {number} amount - The amount of the transaction.
 * @body {string} direction - The direction of the transaction (e.g., "income" or "expense").
 * @body {number} category - The ID of the category associated with the transaction.
 * @body {number} subcategory - The ID of the sub-category associated with the transaction (optional).
 * @body {string} notes - Additional notes for the transaction (optional).
 *
 * @returns {Object} A JSON object with a code and message indicating the result of the creation process.
 *
 */
router.post("/", authenticationMiddleware, async (req, res) => {
  const { amount, direction, category, subcategory, notes } = req.body;

  try {
    // Get user ID of the current user
    const userQuery = {
      text: 'SELECT "id" FROM users WHERE "email" = $1;',
      values: [req.session["username"]],
    };
    const userResults = await pool.query(userQuery);
    if (userResults?.rowCount < 1) {
      res.status(200).json({
        code: "ADD_TRANSACTION_ERROR",
        message: "Error while adding transaction",
        details: "Error retrieving user information",
      });
      return;
    }

    // Add new transaction
    const newTransactionQuery = {
      text: `
        INSERT INTO transactions ("user_id", "amount", "direction", "category", "sub_category", "notes")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `,
      values: [
        userResults.rows[0].id,
        amount,
        direction,
        category,
        subcategory,
        notes,
      ],
    };
    const newTransactionResults = await pool.query(newTransactionQuery);
    if (newTransactionResults?.rowCount < 1) {
      res.status(200).json({
        code: "ADD_TRANSACTION_ERROR",
        message: "Error adding transaction",
        details: "Unknown error",
      });
      return;
    }

    res.status(200).json({
      code: "ADD_TRANSACTION_SUCCESS",
      message: "Successfully added transaction",
      details: newTransactionResults.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      code: "ADD_TRANSACTION_ERROR",
      message: "Error while adding transaction",
      details: err,
    });
  }
});

/**
 * GET: Retrieve Transactions with Pagination, Sorting, and Filtering
 *
 * @description Retrieves a list of transactions from the database for the currently authenticated user.
 * Supports optional pagination, sorting, and date range filtering. The route is protected by the
 * `authenticationMiddleware`, ensuring that only authenticated users can access it.
 *
 * @route GET /
 * @access Protected (requires authentication)
 *
 * @query {number} page - The page number for pagination (optional).
 * @query {number} limit - The number of items per page (optional).
 * @query {string} sortColumn - The column to sort by (default is 'id').
 * @query {string} sortDirection - The direction to sort ('asc' or 'desc', default is 'asc').
 * @query {string} from - The start date for filtering transactions (optional).
 * @query {string} to - The end date for filtering transactions (optional).
 *
 * @returns {Object} A JSON object with a code and message indicating the result of the retrieval process.
 *
 */
router.get("/", authenticationMiddleware, async (req, res) => {
  const {
    page,
    limit,
    sortColumn = "id",
    sortDirection = "asc",
    from,
    to,
  } = req.query as TransactionsGetPayload;

  try {
    // Get user ID of the current user
    const userQuery = {
      text: 'SELECT "id" FROM users WHERE "email" = $1;',
      values: [req.session["username"]],
    };
    const userResults = await pool.query(userQuery);
    if (userResults?.rowCount < 1) {
      res.status(200).json({
        code: "GET_TRANSACTIONS_ERROR",
        message: "Error retrieving transactions",
        details: "Error retrieving user information",
      });
      return;
    }
    const userId = userResults.rows[0].id;

    // Handle pagination
    let paginationQuery = "";
    if (limit && page) {
      const offset = (Number(page) - 1) * Number(limit);
      if (Number(page) < 1 || Number(limit) < 1) {
        res.status(400).json({
          code: "GET_TRANSACTIONS_ERROR",
          message: "Error retrieving transactions",
          details: "Invalid pagination parameters",
        });
        return;
      }
      if (Number(limit) > 100) {
        res.status(200).json({
          code: "GET_TRANSACTIONS_ERROR",
          message: "Error retrieving transactions",
          details: "Limit exceeds maximum value of 100",
        });
        return;
      }
      paginationQuery = `LIMIT ${Number(limit)} OFFSET ${offset}`;
    }

    // Handle dates filtering
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    if (fromDate && toDate && fromDate > toDate) {
      res.status(200).json({
        code: "GET_TRANSACTIONS_ERROR",
        message: "Error retrieving transactions",
        details: "Invalid date range",
      });
      return;
    }
    const dateFilter =
      from && to
        ? `AND transactions.timestamp BETWEEN '${from}' AND '${to}'`
        : "";

    // Get the total count of transactions
    const countQuery = {
      text: 'SELECT COUNT(*) AS full_count FROM transactions WHERE "user_id" = $1;',
      values: [userId],
    };
    const countResults = await pool.query(countQuery);

    // Query to get transactions with pagination and sorting
    const transactionsQuery = {
      text: `
        SELECT 
          transactions.id AS id,
          transactions.amount AS amount,
          transactions.direction AS direction,
          categories.name AS category,
          categories.id AS category_id,
          sub_categories.name AS sub_category,
          sub_categories.id AS sub_category_id,
          transactions.notes AS notes,
          transactions.timestamp AS timestamp
        FROM transactions
        LEFT JOIN categories ON transactions.category = categories.id
        LEFT JOIN sub_categories ON transactions.sub_category = sub_categories.id
        WHERE transactions.user_id = $1 ${dateFilter}
        ORDER BY "${sortColumn}" ${sortDirection.toUpperCase()}
        ${paginationQuery};
      `,
      values: [userId],
    };
    const transactionsResults = await pool.query(transactionsQuery);

    if (transactionsResults?.rowCount < 1) {
      res.status(200).json({
        code: "GET_TRANSACTIONS_ERROR",
        message: "No transactions found",
        details: "No results retrieving transactions",
      });
      return;
    }

    res.status(200).json({
      code: "GET_TRANSACTIONS_SUCCESS",
      message: "Successfully retrieved transactions",
      details: {
        results: {
          transactions: transactionsResults.rows,
          average: getAverageValue(transactionsResults.rows),
        },
        count: countResults.rows[0].full_count,
      },
    });
  } catch (err) {
    res.status(500).json({
      code: "GET_TRANSACTIONS_ERROR",
      message: "Error retrieving transactions",
      details: err,
    });
  }
});

/**
 * DELETE: Delete a Transaction by ID
 *
 * @description Deletes a specific transaction from the database. The route is protected by the
 * `authenticationMiddleware`, ensuring that only authenticated users can access it. The transaction
 * is identified by its ID, which is provided as a URL parameter. The transaction is also verified
 * to belong to the currently authenticated user.
 *
 * @route DELETE /:id
 * @access Protected (requires authentication)
 *
 * @param {string} id - The ID of the transaction to delete (provided as a URL parameter).
 *
 * @returns {Object} A JSON object with a code and message indicating the result of the deletion process.
 *
 */
router.delete("/:id", authenticationMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Get user ID of the current user
    const userQuery = {
      text: 'SELECT "id" FROM users WHERE "email" = $1;',
      values: [req.session["username"]],
    };
    const userResults = await pool.query(userQuery);
    if (userResults?.rowCount < 1) {
      res.status(200).json({
        code: "DELETE_TRANSACTION_ERROR",
        message: "Error retrieving user information",
      });
      return;
    }
    const userId = userResults.rows[0].id;

    // Delete the transaction
    const deleteQuery = {
      text: `
        DELETE FROM transactions
        WHERE user_id = $1 AND id = $2
        RETURNING *;
      `,
      values: [userId, id],
    };
    const deleteResults = await pool.query(deleteQuery);

    if (deleteResults?.rowCount < 1) {
      res.status(200).json({
        code: "DELETE_TRANSACTION_ERROR",
        message: "Transaction not found",
        details: `No transaction found with ID: ${id}`,
      });
      return;
    }

    res.status(200).json({
      code: "DELETE_TRANSACTION_SUCCESS",
      message: "Successfully deleted transaction",
      details: deleteResults.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      code: "DELETE_TRANSACTION_ERROR",
      message: "Error deleting transaction",
      details: err,
    });
  }
});

export default router;
