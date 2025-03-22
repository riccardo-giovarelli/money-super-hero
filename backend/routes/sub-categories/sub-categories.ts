import express from 'express';
import pg from 'pg';

import { authenticationMiddleware } from '../users/users.lib.ts';

import type { CategoriesGetPayload } from './sub-categories.type.ts';

const router = express.Router();
const { Client } = pg;

/**
 * GET: Retrieve Sub-Categories
 *
 * @description Retrieves all sub-categories.
 *
 * @route GET /
 * @access Protected (requires authentication)
 * @returns {object} - A JSON object containing the sub-categories.
 */
router.get('/', authenticationMiddleware, async (req, res) => {
  const client = new Client();
  const {
    page = 1,
    limit = 10,
    sortColumn = 'id',
    sortDirection = 'asc',
  } = req.query as CategoriesGetPayload;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    await client.connect();

    // Query to get total count of categories
    const countQuery = {
      name: 'get-sub-categories-rows-count',
      text: 'SELECT count(*) AS full_count FROM sub_categories;',
    };
    const countResults = await client.query(countQuery);

    // Query to get sub-categories with pagination and sorting
    const subCategoriesQuery = {
      name: 'get-sub-categories-with-pagination',
      text: `SELECT sub_categories.id AS id, sub_categories.name AS name, sub_categories.notes AS notes, categories.id AS category_id, categories.name AS category_name FROM sub_categories JOIN categories ON sub_categories.category_id = categories.id ORDER BY "${sortColumn}" ${sortDirection.toUpperCase()} LIMIT $1 OFFSET $2;`,
      values: [Number(limit), offset],
    };
    const subCategoriesResults = await client.query(subCategoriesQuery);

    // Handle results
    if (countResults?.rowCount < 1 || subCategoriesResults?.rowCount < 1) {
      res.status(200).json({
        code: 'GET_SUB_CATEGORIES_ERROR',
        message: 'Unable to get sub-categories',
        details: 'No results retrieving sub-categories',
      });
    } else {
      res.status(200).json({
        code: 'GET_SUB_CATEGORIES_SUCCESS',
        message: 'Successfully retrieved sub-categories',
        details: {
          results: subCategoriesResults.rows,
          count: countResults.rows[0].full_count,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      code: 'GET_SUB_CATEGORIES_ERROR',
      message: 'Error retrieving sub-categories',
      details: err,
    });
  } finally {
    await client.end();
  }
});

/**
 * POST: Create a New Sub-Category
 *
 * @description Creates a new sub-category and associates it with a category.
 *
 * @route POST /
 * @access Protected (requires authentication)
 * @body {string} name - The name of the sub-category.
 * @body {string} notes - Notes for the sub-category (optional).
 * @body {number} category_id - The ID of the associated category.
 * @returns {object} - A JSON object containing the result of the operation.
 */
router.post('/', authenticationMiddleware, async (req, res) => {
  const client = new Client();
  const { name, notes, category_id } = req.body;

  try {
    await client.connect();
    const insertQuery = {
      name: 'create-sub-sub-category',
      text: `INSERT INTO sub_categories ("name", "notes", "category_id") VALUES ($1, $2, $3) RETURNING *;`,
      values: [name, notes, category_id],
    };
    const insertResult = await client.query(insertQuery);

    if (insertResult.rowCount === 1) {
      res.status(201).json({
        code: 'ADD_SUB_CATEGORY_SUCCESS',
        message: 'Sub-category created successfully.',
        details: { id: insertResult.rows[0].id },
      });
    } else {
      res.status(500).json({
        code: 'ADD_SUB_CATEGORY_ERROR',
        message: 'Failed to create sub-category.',
      });
    }
  } catch (err) {
    res.status(500).json({
      code: 'ADD_SUB_CATEGORY_ERROR',
      message: 'Error creating sub-category.',
      details: err,
    });
  } finally {
    await client.end();
  }
});

export default router;
