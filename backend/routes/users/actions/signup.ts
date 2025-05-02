import bcrypt from "bcryptjs";
import express from "express";
import pool from "../../../db.ts"; // Import the connection pool

const router = express.Router();

/**
 * POST: Sign up
 *
 * @description Handles the user registration process. Checks if the user already exists,
 * hashes the password, and inserts the new user into the database. If the registration is successful,
 * it responds with a success message. If there is an error, it responds with an error message.
 *
 * @route POST /
 * @access Public
 * @returns {Object} A JSON object with a code and message indicating the result of the registration process.
 */
router.post("/", async (req, res) => {
  try {
    // Check if the user already exists
    const checkUserQuery = {
      name: "get-user-by-email",
      text: 'SELECT EXISTS(SELECT 1 FROM users WHERE "email" = $1)',
      values: [req.body.email.trim()],
    };
    const checkUserResults = await pool.query(checkUserQuery);

    if (checkUserResults?.rows?.[0]?.exists) {
      res.status(200).json({
        code: "USER_EXISTS",
        message: "Error while inserting new user",
        details: "User already exists",
      });
      return;
    }

    // Hash the password
    const hash = await bcrypt.hash(req.body.password, 10);

    // Insert the new user into the database
    const insertUserQuery = {
      name: "insert-new-user",
      text: 'INSERT INTO users("firstName", "lastName", "email", "password") VALUES($1, $2, $3, $4)',
      values: [
        req.body.firstName,
        req.body.lastName,
        req.body.email.trim(),
        hash,
      ],
    };
    const insertUserResults = await pool.query(insertUserQuery);

    if (insertUserResults?.rowCount !== 1) {
      throw new Error("Failed to insert new user");
    }

    res.status(200).json({
      code: "REGISTRATION_SUCCESSFUL",
      message: "New user saved successfully",
      details: insertUserResults,
    });
  } catch (err) {
    res.status(500).json({
      code: "REGISTRATION_ERROR",
      message: "Error while inserting new user",
      details: err,
    });
  }
});

export default router;
