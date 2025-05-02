import express from "express";
import pool from "../../db.ts"; // Import the connection pool
import { authenticationMiddleware } from "../users/users.lib.ts";
import type { CategoriesGetPayload } from "./sub-categories.type.ts";

const router = express.Router();

/**
 * GET: Retrieve Sub-Categories
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
