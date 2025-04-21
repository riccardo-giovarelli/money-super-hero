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
 * @body {number} category - The category of the transaction.
 * @body {number} subcategory - The subcategory of the transaction (optional).
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
 * GET: Retrieve Transactions with Pagination, Sorting, and Filtering
 *
 * @description Retrieves a paginated list of transactions for the authenticated user. Supports optional sorting
 *              by columns, filtering by date range, and pagination.
 *
 * @route GET /
 * @access Protected (requires authentication)
 *
 * @query {number} page - The page number for pagination (default is 1).
 * @query {number} limit - The number of items per page (default is 10, maximum is 100).
 * @query {string} sortColumn - The column to sort by (default is 'id').
 * @query {string} sortDirection - The direction to sort ('asc' or 'desc', default is 'asc').
 * @query {string} from - The start date for filtering transactions (optional, ISO 8601 format).
 * @query {string} to - The end date for filtering transactions (optional, ISO 8601 format).
 *
 * @returns {object} - A JSON object containing the transactions and the total count.
 */
router.get("/", authenticationMiddleware, async (req, res) => {
  const client = new Client();

  const {
    page,
    limit,
    sortColumn = "id",
    sortDirection = "asc",
    from,
    to,
  } = req.query as TransactionsGetPayload;

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

    // Handle pagination
    let paginationQuery = "";
    if (limit && page) {
      const offset = (Number(page) - 1) * Number(limit);
      if (Number(page) < 1 || Number(limit) < 1) {
        res.status(200).json({
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
      if (Number(offset) < 0) {
        res.status(200).json({
          code: "GET_TRANSACTIONS_ERROR",
          message: "Error retrieving transactions",
          details: "Invalid offset value",
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
      name: "get-transactions-count",
      text: 'SELECT COUNT(*) AS full_count FROM transactions WHERE "user_id" = $1;',
      values: [userId],
    };
    const countResults = await client.query(countQuery);

    // Query to get transactions with pagination and sorting
    const transactionsQuery = {
      name: "get-transactions-with-pagination",
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
    ORDER BY "${sortColumn}" ${sortDirection.toString().toUpperCase()}
    ${paginationQuery};
  `,
      values: [userId],
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

/**
 * GET: Retrieve a Transaction by ID
 *
 * @description Retrieves a specific transaction by its ID for the authenticated user.
 *
 * @route GET /:id
 * @access Protected (requires authentication)
 *
 * @param {string} id - The ID of the transaction to retrieve.
 *
 * @returns {object} - A JSON object with the result of the operation.
 */
router.get("/:id", authenticationMiddleware, async (req, res) => {
  const client = new Client();
  const { id } = req.params;

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
        code: "GET_TRANSACTION_ERROR",
        message: "Error retrieving transaction",
        details: "Error retrieving user information",
      });
      return;
    }
    const userId = userResults.rows[0].id;

    const transactionQuery = {
      name: "get-transaction-by-id",
      text: `
        SELECT id, amount, direction, category, sub_category, notes, timestamp
        FROM transactions
        WHERE user_id = $1 AND id = $2;
      `,
      values: [userId, id],
    };
    const transactionResults = await client.query(transactionQuery);

    // Handle results
    if (transactionResults?.rowCount < 1) {
      res.status(200).json({
        code: "GET_TRANSACTION_ERROR",
        message: "Transaction not found",
        details: `No transaction found with ID: ${id}`,
      });
    } else {
      res.status(200).json({
        code: "GET_TRANSACTION_SUCCESS",
        message: "Successfully retrieved transaction",
        details: transactionResults.rows[0],
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "GET_TRANSACTION_ERROR",
      message: "Error retrieving transaction",
      details: err,
    });
  } finally {
    await client.end();
  }
});

/**
 * PUT: Edit a Transaction by ID
 *
 * @description Updates the details of a specific transaction for the authenticated user.
 *
 * @route PUT /:id
 * @access Protected (requires authentication)
 *
 * @param {string} id - The ID of the transaction to update (provided as a URL parameter).
 * @body {number} [amount] - The updated amount of the transaction (optional).
 * @body {string} [direction] - The updated direction of the transaction ('IN' or 'OUT', optional).
 * @body {number} [category] - The updated category of the transaction (optional).
 * @body {number} [subcategory] - The updated subcategory of the transaction (optional).
 * @body {string} [notes] - The updated notes for the transaction (optional).
 *
 * @returns {object} - A JSON object containing the result of the operation.
 */
router.put("/:id", authenticationMiddleware, async (req, res) => {
  const client = new Client();
  const { id } = req.params;
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
        code: "EDIT_TRANSACTION_ERROR",
        message: "Error retrieving user information",
      });
      return;
    }
    const userId = userResults.rows[0].id;

    // Update the transaction
    const updateQuery = {
      name: "edit-transaction-by-id",
      text: `
        UPDATE transactions
        SET 
          amount = COALESCE($1, amount),
          direction = COALESCE($2, direction),
          category = COALESCE($3, category),
          sub_category = COALESCE($4, sub_category),
          notes = COALESCE($5, notes)
        WHERE user_id = $6 AND id = $7
        RETURNING *;
      `,
      values: [amount, direction, category, subcategory, notes, userId, id],
    };
    const updateResults = await client.query(updateQuery);

    // Handle results
    if (updateResults?.rowCount < 1) {
      res.status(200).json({
        code: "EDIT_TRANSACTION_ERROR",
        message: "Transaction not found or no changes made",
        details: `No transaction found with id ${id}`,
      });
    } else {
      res.status(200).json({
        code: "EDIT_TRANSACTION_SUCCESS",
        message: "Successfully updated transaction",
        details: updateResults.rows[0],
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "EDIT_TRANSACTION_ERROR",
      message: "Error updating transaction",
      details: err,
    });
  } finally {
    await client.end();
  }
});

/**
 * DELETE: Delete a Transaction by ID
 *
 * @description Deletes a specific transaction for the authenticated user by its ID.
 *
 * @route DELETE /:id
 * @access Protected (requires authentication)
 *
 * @param {string} id - The ID of the transaction to delete (provided as a URL parameter).
 *
 * @returns {object} - A JSON object containing the result of the operation.
 */
router.delete("/:id", authenticationMiddleware, async (req, res) => {
  const client = new Client();
  const { id } = req.params;

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
        code: "DELETE_TRANSACTION_ERROR",
        message: "Error retrieving user information",
      });
      return;
    }
    const userId = userResults.rows[0].id;

    // Delete the transaction
    const deleteQuery = {
      name: "delete-transaction-by-id",
      text: `
        DELETE FROM transactions
        WHERE user_id = $1 AND id = $2
        RETURNING *;
      `,
      values: [userId, id],
    };
    const deleteResults = await client.query(deleteQuery);

    // Handle results
    if (deleteResults?.rowCount < 1) {
      res.status(200).json({
        code: "DELETE_TRANSACTION_ERROR",
        message: "Transaction not found",
        details: `No transaction found with ID: ${id}`,
      });
    } else {
      res.status(200).json({
        code: "DELETE_TRANSACTION_SUCCESS",
        message: "Successfully deleted transaction",
        details: deleteResults.rows[0],
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "DELETE_TRANSACTION_ERROR",
      message: "Error deleting transaction",
      details: err,
    });
  } finally {
    await client.end();
  }
});

export default router;
