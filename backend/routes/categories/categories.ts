import express from 'express';
import pg from 'pg';

import { authenticationMiddleware } from '../users/users.lib.ts';


import type { CategoriesGetPayload } from './categories.type.ts';

const router = express.Router();
const { Client } = pg;

/**
 * GET: Retrieve Categories
 *
 * @description Retrieves a list of categories from the database. Supports optional pagination and sorting.
 * If no pagination parameters (`page` and `limit`) are provided, all categories are retrieved without pagination.
 *
 * @route GET /
 * @access Protected (requires authentication)
 *
 * @param {number} page - The page number for pagination (default is 1).
 * @param {number} limit - The number of items per page (default is 10).
 * @param {string} sortColumn - The column to sort by (default is 'id').
 * @param {string} sortDirection - The direction to sort (asc or desc, default is 'asc').
 * @returns {object} - A JSON object containing the categories and the total count.
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

  /**
   * If no query parameters are provided,
   * retrieve all categories without pagination.
   */
  if (!req?.query?.page || !req?.query?.limit) {
    try {
      await client.connect();

      // Query to get categories without pagination
      const categoriesResults = await client.query(
        'SELECT id, name, notes FROM categories ORDER BY name ASC;'
      );

      // Handle results
      if (categoriesResults?.rowCount < 1) {
        res.status(200).json({
          code: 'GET_CATEGORIES_ERROR',
          message: 'Unable to get categories',
          details: 'No results retrieving categories',
        });
      } else {
        res.status(200).json({
          code: 'GET_CATEGORIES_SUCCESS',
          message: 'Successfully retrieved categories',
          details: {
            results: categoriesResults.rows,
            count: categoriesResults.rows.length,
          },
        });
      }
    } catch (err) {
      res.status(500).json({
        code: 'GET_CATEGORIES_ERROR',
        message: 'Error retrieving categories',
        details: err,
      });
    } finally {
      await client.end();
    }
    return;
  }

  try {
    await client.connect();

    // Query to get total count of categories
    const countQuery = {
      name: 'get-categories-rows-count',
      text: 'SELECT count(*) AS full_count FROM categories;',
    };
    const countResults = await client.query(countQuery);

    // Query to get categories with pagination and sorting
    const categoriesQuery = {
      name: 'get-categories-with-pagination',
      text: `SELECT "id", "name", "notes" FROM categories ORDER BY "${sortColumn}" ${sortDirection.toUpperCase()} LIMIT $1 OFFSET $2;`,
      values: [Number(limit), offset],
    };
    const categoriesResults = await client.query(categoriesQuery);

    // Handle results
    if (countResults?.rowCount < 1 || categoriesResults?.rowCount < 1) {
      res.status(200).json({
        code: 'GET_CATEGORIES_ERROR',
        message: 'Unable to get categories',
        details: 'No results retrieving categories',
      });
    } else {
      res.status(200).json({
        code: 'GET_CATEGORIES_SUCCESS',
        message: 'Successfully retrieved categories',
        details: {
          results: categoriesResults.rows,
          count: countResults.rows[0].full_count,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      code: 'GET_CATEGORIES_ERROR',
      message: 'Error retrieving categories',
      details: err,
    });
  } finally {
    await client.end();
  }
});

/**
 * PUT: Update Category by ID
 *
 * @description Updates a category's information based on the provided ID. The route is protected by
 * the `authenticationMiddleware`, which ensures that only authenticated users can access it. If the update is successful,
 * it responds with a success message. If there is an error, it responds with an error message.
 *
 * @route PUT /:id
 * @access Protected (requires authentication)
 *
 * @param {string} id - The ID of the category to update.
 * @param {string} name - The new name of the category.
 * @param {string} notes - The new notes for the category.
 * @returns {Object} A JSON object with a code and message indicating the result of the update process.
 */
router.put('/:id', authenticationMiddleware, async (req, res) => {
  const client = new Client();
  const { id } = req.params;
  const { name, notes } = req.body;

  try {
    await client.connect();
    const query = {
      name: 'update-category-by-id',
      text: 'UPDATE categories SET "name" = $1, "notes" = $2 WHERE "id" = $3;',
      values: [name, notes, id],
    };
    const results = await client.query(query);
    if (results?.rowCount < 1) {
      res.status(200).json({
        code: 'UPDATE_CATEGORY_ERROR',
        message: 'Error updating category',
        details: 'Unknown error',
      });
    } else {
      res.status(200).json({
        code: 'UPDATE_CATEGORY_SUCCESS',
        message: 'Successfully updated category',
        details: {
          id,
          name,
          notes,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      code: 'UPDATE_CATEGORY_ERROR',
      message: 'Error while updating category',
      details: err,
    });
  } finally {
    await client.end();
  }
});

/**
 * DELETE: Delete Category by ID
 *
 * @description Deletes a category based on the provided ID. The route is protected by
 * the `authenticationMiddleware`, which ensures that only authenticated users can access it. If the deletion is successful,
 * it responds with a success message. If there is an error, it responds with an error message.
 *
 * @route DELETE /:id
 * @access Protected (requires authentication)
 *
 * @param {string} id - The ID of the category to delete.
 * @returns {Object} A JSON object with a code and message indicating the result of the deletion process.
 */
router.delete('/:id', authenticationMiddleware, async (req, res) => {
  const client = new Client();
  const { id } = req.params;

  try {
    await client.connect();
    const query = {
      name: 'delete-category-by-id',
      text: 'DELETE FROM categories WHERE "id" = $1;',
      values: [id],
    };
    const results = await client.query(query);
    if (results?.rowCount < 1) {
      res.status(200).json({
        code: 'DELETE_CATEGORY_ERROR',
        message: 'Error deleting category',
        details: 'Unknown error',
      });
    } else {
      res.status(200).json({
        code: 'DELETE_CATEGORY_SUCCESS',
        message: 'Successfully deleted category',
        details: {
          id,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      code: 'DELETE_CATEGORY_ERROR',
      message: 'Error while deleting category',
      details: err,
    });
  } finally {
    await client.end();
  }
});

/**
 * POST: Add New Category
 *
 * @description Adds a new category to the categories table. The route is protected by
 * the `authenticationMiddleware`, which ensures that only authenticated users can access it. If the addition is successful,
 * it responds with a success message. If there is an error, it responds with an error message.
 *
 * @route POST /
 * @access Protected (requires authentication)
 *
 * @param {string} name - The name of the new category.
 * @param {string} notes - The notes for the new category.
 * @returns {Object} A JSON object with a code and message indicating the result of the addition process.
 */
router.post('/', authenticationMiddleware, async (req, res) => {
  const client = new Client();
  const { name, notes } = req.body;

  try {
    await client.connect();
    const query = {
      name: 'add-new-category',
      text: 'INSERT INTO categories ("name", "notes") VALUES ($1, $2) RETURNING *;',
      values: [name, notes],
    };
    const results = await client.query(query);
    if (results?.rowCount < 1) {
      res.status(200).json({
        code: 'ADD_CATEGORY_ERROR',
        message: 'Error adding category',
        details: 'Unknown error',
      });
    } else {
      res.status(200).json({
        code: 'ADD_CATEGORY_SUCCESS',
        message: 'Successfully added category',
        details: results.rows[0],
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ code: 'ADD_CATEGORY_ERROR', message: 'Error while adding category', details: err });
  } finally {
    await client.end();
  }
});

export default router;
