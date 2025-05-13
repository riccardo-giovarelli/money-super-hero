import express from "express";
import pool from "../../db.ts"; // Import the connection pool
import { authenticationMiddleware } from "../users/users.lib.ts";
import type { CategoriesGetPayload } from "./categories.type.ts";

const router = express.Router();

/**
 * GET: Retrieve Categories
 *
 * @description Retrieves a list of categories from the database. Supports optional pagination and sorting.
 * If no pagination parameters (`page` and `limit`) are provided, all categories are retrieved without pagination.
 *
 * @route GET /
 * @access Protected (requires authentication)
 *
 * @query {number} page - The page number for pagination (default is 1).
 * @query {number} limit - The number of items per page (default is 10).
 * @query {string} sortColumn - The column to sort by (default is 'id').
 * @query {string} sortDirection - The direction to sort ('asc' or 'desc', default is 'asc').
 *
 * @returns {Object} A JSON object with a code and message indicating the result of the retrieval process.
 *
 */
router.get("/", authenticationMiddleware, async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortColumn = "id",
    sortDirection = "asc",
  } = req.query as CategoriesGetPayload;
  const offset = (Number(page) - 1) * Number(limit);

  if (!req?.query?.page || !req?.query?.limit) {
    try {
      // Query to get categories without pagination
      const categoriesResults = await pool.query(
        "SELECT id, name, notes FROM categories ORDER BY name ASC;"
      );

      if (categoriesResults?.rowCount < 1) {
        res.status(200).json({
          code: "GET_CATEGORIES_ERROR",
          message: "Unable to get categories",
          details: "No results retrieving categories",
        });
      } else {
        res.status(200).json({
          code: "GET_CATEGORIES_SUCCESS",
          message: "Successfully retrieved categories",
          details: {
            results: categoriesResults.rows,
            count: categoriesResults.rows.length,
          },
        });
      }
    } catch (err) {
      res.status(500).json({
        code: "GET_CATEGORIES_ERROR",
        message: "Error retrieving categories",
        details: err,
      });
    }
    return;
  }

  try {
    // Query to get total count of categories
    const countQuery = "SELECT count(*) AS full_count FROM categories;";
    const countResults = await pool.query(countQuery);

    // Query to get categories with pagination and sorting
    const categoriesQuery = `
      SELECT "id", "name", "notes"
      FROM categories
      ORDER BY "${sortColumn}" ${sortDirection.toUpperCase()}
      LIMIT $1 OFFSET $2;
    `;
    const categoriesResults = await pool.query(categoriesQuery, [
      Number(limit),
      offset,
    ]);

    if (countResults?.rowCount < 1 || categoriesResults?.rowCount < 1) {
      res.status(200).json({
        code: "GET_CATEGORIES_ERROR",
        message: "Unable to get categories",
        details: "No results retrieving categories",
      });
    } else {
      res.status(200).json({
        code: "GET_CATEGORIES_SUCCESS",
        message: "Successfully retrieved categories",
        details: {
          results: categoriesResults.rows,
          count: countResults.rows[0].full_count,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "GET_CATEGORIES_ERROR",
      message: "Error retrieving categories",
      details: err,
    });
  }
});

/**
 * PUT: Update Category by ID
 *
 * @description Updates the details of a specific category in the database. The route is protected by
 * the `authenticationMiddleware`, ensuring that only authenticated users can access it. The category
 * is identified by its ID, and the updated `name` and `notes` are provided in the request body.
 *
 * @route PUT /:id
 * @access Protected (requires authentication)
 *
 * @param {string} id - The ID of the category to update (provided as a URL parameter).
 * @body {string} name - The updated name of the category.
 * @body {string} notes - The updated notes for the category.
 *
 * @returns {Object} A JSON object with a code and message indicating the result of the update process.
 *
 */
router.put("/:id", authenticationMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, notes } = req.body;

  try {
    const query = {
      text: 'UPDATE categories SET "name" = $1, "notes" = $2 WHERE "id" = $3;',
      values: [name, notes, id],
    };
    const results = await pool.query(query);

    if (results?.rowCount < 1) {
      res.status(200).json({
        code: "UPDATE_CATEGORY_ERROR",
        message: "Error updating category",
        details: "Unknown error",
      });
    } else {
      res.status(200).json({
        code: "UPDATE_CATEGORY_SUCCESS",
        message: "Successfully updated category",
        details: {
          id,
          name,
          notes,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "UPDATE_CATEGORY_ERROR",
      message: "Error while updating category",
      details: err,
    });
  }
});

/**
 * DELETE: Delete Category by ID
 *
 * @description Deletes a specific category from the database. The route is protected by
 * the `authenticationMiddleware`, ensuring that only authenticated users can access it.
 * The category is identified by its ID, which is provided as a URL parameter.
 *
 * @route DELETE /:id
 * @access Protected (requires authentication)
 *
 * @param {string} id - The ID of the category to delete (provided as a URL parameter).
 *
 * @returns {Object} A JSON object with a code and message indicating the result of the deletion process.
 *
 */
router.delete("/:id", authenticationMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const query = {
      text: 'DELETE FROM categories WHERE "id" = $1;',
      values: [id],
    };
    const results = await pool.query(query);

    if (results?.rowCount < 1) {
      res.status(200).json({
        code: "DELETE_CATEGORY_ERROR",
        message: "Error deleting category",
        details: "Unknown error",
      });
    } else {
      res.status(200).json({
        code: "DELETE_CATEGORY_SUCCESS",
        message: "Successfully deleted category",
        details: {
          id,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "DELETE_CATEGORY_ERROR",
      message: "Error while deleting category",
      details: err,
    });
  }
});

/**
 * POST: Add New Category
 *
 * @description Adds a new category to the database. The route is protected by the `authenticationMiddleware`,
 * ensuring that only authenticated users can access it. The category details, including `name` and `notes`,
 * are provided in the request body.
 *
 * @route POST /
 * @access Protected (requires authentication)
 *
 * @body {string} name - The name of the new category.
 * @body {string} notes - Additional notes for the new category (optional).
 *
 * @returns {Object} A JSON object with a code and message indicating the result of the addition process.
 *
 */
router.post("/", authenticationMiddleware, async (req, res) => {
  const { name, notes } = req.body;

  try {
    const query = {
      text: 'INSERT INTO categories ("name", "notes") VALUES ($1, $2) RETURNING *;',
      values: [name, notes],
    };
    const results = await pool.query(query);

    if (results?.rowCount < 1) {
      res.status(200).json({
        code: "ADD_CATEGORY_ERROR",
        message: "Error adding category",
        details: "Unknown error",
      });
    } else {
      res.status(200).json({
        code: "ADD_CATEGORY_SUCCESS",
        message: "Successfully added category",
        details: results.rows[0],
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "ADD_CATEGORY_ERROR",
      message: "Error while adding category",
      details: err,
    });
  }
});

export default router;
