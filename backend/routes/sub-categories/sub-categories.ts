import express from "express";
import pool from "../../db.ts"; // Import the connection pool
import { authenticationMiddleware } from "../users/users.lib.ts";
import type { CategoriesGetPayload } from "./sub-categories.type.ts";

const router = express.Router();

/**
 * GET: Retrieve Sub-Categories
 *
 * @description Retrieves a list of sub-categories from the database. Supports optional pagination and sorting.
 * The route is protected by the `authenticationMiddleware`, ensuring that only authenticated users can access it.
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

  try {
    // Query to get total count of sub-categories
    const countQuery = "SELECT count(*) AS full_count FROM sub_categories;";
    const countResults = await pool.query(countQuery);

    // Query to get sub-categories with pagination and sorting
    const subCategoriesQuery = `
      SELECT sub_categories.id AS id, sub_categories.name AS name, sub_categories.notes AS notes, 
             categories.id AS category_id, categories.name AS category_name
      FROM sub_categories
      JOIN categories ON sub_categories.category_id = categories.id
      ORDER BY "${sortColumn}" ${sortDirection.toUpperCase()}
      LIMIT $1 OFFSET $2;
    `;
    const subCategoriesResults = await pool.query(subCategoriesQuery, [
      Number(limit),
      offset,
    ]);

    // Handle results
    if (countResults?.rowCount < 1 || subCategoriesResults?.rowCount < 1) {
      res.status(200).json({
        code: "GET_SUB_CATEGORIES_ERROR",
        message: "Unable to get sub-categories",
        details: "No results retrieving sub-categories",
      });
    } else {
      res.status(200).json({
        code: "GET_SUB_CATEGORIES_SUCCESS",
        message: "Successfully retrieved sub-categories",
        details: {
          results: subCategoriesResults.rows,
          count: countResults.rows[0].full_count,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "GET_SUB_CATEGORIES_ERROR",
      message: "Error retrieving sub-categories",
      details: err,
    });
  }
});

/**
 * GET: Retrieve Sub-Categories by Category ID
 *
 * @description Retrieves a list of sub-categories associated with a specific category ID from the database.
 * The route is protected by the `authenticationMiddleware`, ensuring that only authenticated users can access it.
 *
 * @route GET /:category_id
 * @access Protected (requires authentication)
 *
 * @param {string} category_id - The ID of the category whose sub-categories are to be retrieved (provided as a URL parameter).
 *
 * @returns {Object} A JSON object with a code and message indicating the result of the retrieval process.
 *
 */
router.get("/:category_id", authenticationMiddleware, async (req, res) => {
  const { category_id } = req.params;

  try {
    // Query to get sub-categories by category ID
    const subCategoriesQuery = `
      SELECT "id", "name", "category_id", "notes"
      FROM sub_categories
      WHERE "category_id" = $1
      ORDER BY name ASC;
    `;
    const subCategoriesResults = await pool.query(subCategoriesQuery, [
      category_id,
    ]);

    // Handle results
    if (subCategoriesResults?.rowCount < 1) {
      res.status(200).json({
        code: "GET_SUB_CATEGORIES_ERROR",
        message: "Unable to get sub-categories",
        details: "No results retrieving sub-categories",
      });
    } else {
      res.status(200).json({
        code: "GET_SUB_CATEGORIES_SUCCESS",
        message: "Successfully retrieved sub-categories",
        details: {
          results: subCategoriesResults.rows,
          count: subCategoriesResults.rows.length,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "GET_SUB_CATEGORIES_ERROR",
      message: "Error retrieving sub-categories",
      details: err,
    });
  }
});

/**
 * POST: Create a New Sub-Category
 *
 * @description Adds a new sub-category to the database. The route is protected by the `authenticationMiddleware`,
 * ensuring that only authenticated users can access it. The sub-category details, including `name`, `notes`, and
 * `category_id`, are provided in the request body.
 *
 * @route POST /
 * @access Protected (requires authentication)
 *
 * @body {string} name - The name of the new sub-category.
 * @body {string} notes - Additional notes for the new sub-category (optional).
 * @body {number} category_id - The ID of the category to which the sub-category belongs.
 *
 * @returns {Object} A JSON object with a code and message indicating the result of the creation process.
 *
 */
router.post("/", authenticationMiddleware, async (req, res) => {
  const { name, notes, category_id } = req.body;

  try {
    const insertQuery = `
      INSERT INTO sub_categories ("name", "notes", "category_id")
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const insertResult = await pool.query(insertQuery, [
      name,
      notes,
      category_id,
    ]);

    if (insertResult.rowCount === 1) {
      res.status(201).json({
        code: "ADD_SUB_CATEGORY_SUCCESS",
        message: "Sub-category created successfully.",
        details: { id: insertResult.rows[0].id },
      });
    } else {
      res.status(500).json({
        code: "ADD_SUB_CATEGORY_ERROR",
        message: "Failed to create sub-category.",
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "ADD_SUB_CATEGORY_ERROR",
      message: "Error creating sub-category.",
      details: err,
    });
  }
});

/**
 * PUT: Edit an Existing Sub-Category
 *
 * @description Updates the details of a specific sub-category in the database. The route is protected by
 * the `authenticationMiddleware`, ensuring that only authenticated users can access it. The sub-category
 * is identified by its ID, and the updated `name`, `notes`, and `category_id` are provided in the request body.
 *
 * @route PUT /:id
 * @access Protected (requires authentication)
 *
 * @param {string} id - The ID of the sub-category to update (provided as a URL parameter).
 * @body {string} name - The updated name of the sub-category.
 * @body {string} notes - The updated notes for the sub-category (optional).
 * @body {number} category_id - The updated category ID to which the sub-category belongs.
 *
 * @returns {Object} A JSON object with a code and message indicating the result of the update process.
 *
 */
router.put("/:id", authenticationMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, notes, category_id } = req.body;

  try {
    const query = `
      UPDATE sub_categories
      SET "name" = $1, "category_id" = $2, "notes" = $3
      WHERE "id" = $4;
    `;
    const results = await pool.query(query, [name, category_id, notes, id]);

    if (results?.rowCount < 1) {
      res.status(200).json({
        code: "UPDATE_SUB_CATEGORY_ERROR",
        message: "Error updating sub-category",
        details: "Unknown error",
      });
    } else {
      res.status(200).json({
        code: "UPDATE_SUB_CATEGORY_SUCCESS",
        message: "Successfully updated sub-category",
        details: {
          id,
          name,
          category_id,
          notes,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "UPDATE_SUB_CATEGORY_ERROR",
      message: "Error while updating sub-category",
      details: err,
    });
  }
});

/**
 * DELETE: Delete a Sub-Category
 *
 * @description Deletes a specific sub-category from the database. The route is protected by
 * the `authenticationMiddleware`, ensuring that only authenticated users can access it.
 * The sub-category is identified by its ID, which is provided as a URL parameter.
 *
 * @route DELETE /:id
 * @access Protected (requires authentication)
 *
 * @param {string} id - The ID of the sub-category to delete (provided as a URL parameter).
 *
 * @returns {Object} A JSON object with a code and message indicating the result of the deletion process.
 *
 */
router.delete("/:id", authenticationMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      DELETE FROM sub_categories
      WHERE "id" = $1;
    `;
    const results = await pool.query(query, [id]);

    if (results?.rowCount < 1) {
      res.status(200).json({
        code: "DELETE_SUB_CATEGORY_ERROR",
        message: "Error deleting sub-category",
        details: "Unknown error",
      });
    } else {
      res.status(200).json({
        code: "DELETE_SUB_CATEGORY_SUCCESS",
        message: "Successfully deleted sub-category",
        details: {
          id,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "DELETE_SUB_CATEGORY_ERROR",
      message: "Error while deleting sub-category",
      details: err,
    });
  }
});

export default router;
