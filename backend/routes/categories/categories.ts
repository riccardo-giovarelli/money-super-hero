import express from 'express';
import pg from 'pg';

import { authenticationMiddleware } from '../users/users.lib.ts';

const router = express.Router();
const { Client } = pg;

/**
 * GET: Categories
 *
 * @description Retrieves categories with pagination.
 *
 * @access Protected (requires authentication)
 * @param {number} page - The page number for pagination (default is 1).
 * @param {number} limit - The number of items per page (default is 10).
 * @returns {object} - A JSON object containing the categories and the total count.
 */
router.get('/', authenticationMiddleware, async (req, res) => {
  const client = new Client();
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  try {
    await client.connect();

    // Query to get categories with pagination
    const categoriesQuery = {
      name: 'get-categories-with-pagination',
      text: 'SELECT "id", "name", "notes" FROM categories LIMIT $1 OFFSET $2;',
      values: [Number(limit), offset],
    };
    const categoriesResults = await client.query(categoriesQuery);

    // Query to get total count of categories
    const categoriesCountQuery = {
      name: 'get-categories-rows-count',
      text: 'SELECT count(*)  AS full_count FROM categories;',
    };
    const categoriesCountResults = await client.query(categoriesCountQuery);

    if (categoriesCountResults?.rowCount < 1 || categoriesResults?.rowCount < 1) {
      res.status(200).json({ code: 'GET_CATEGORIES_ERROR', message: 'No categories found', details: '' });
    } else {
      res.status(200).json({
        code: 'GET_CATEGORIES_SUCCESS',
        message: 'Successfully retrieved categories',
        details: {
          results: categoriesResults.rows,
          count: categoriesCountResults.rows[0].full_count,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ code: 'GET_CATEGORIES_ERROR', message: 'Error retrieving categories', details: err });
  } finally {
    await client.end();
  }
});

export default router;
