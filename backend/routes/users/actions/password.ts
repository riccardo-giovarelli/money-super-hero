import bcrypt from "bcryptjs";
import express from "express";
import pool from "../../../db.ts"; // Import the connection pool
import { authenticationMiddleware } from "../users.lib.ts";

const router = express.Router();

/**
 * PUT: Update User Password
 *
 * @description Updates the user's password based on the email stored in the session. The route is protected by
 * the `authenticationMiddleware`, which ensures that only authenticated users can access it. The new password is hashed
 * before being stored in the database. If the update is successful, it responds with a success message. If there is an error,
 * it responds with an error message.
 *
 * @route PUT /
 * @access Protected (requires authentication)
 * @returns {Object} A JSON object with a code and message indicating the result of the update process.
 */
router.put("/", authenticationMiddleware, async (req, res) => {
  try {
    // Hash the new password
    const hash = await bcrypt.hash(req.body.password, 10);

    // Update the user's password in the database
    const query = {
      name: "update-user-password-by-email",
      text: 'UPDATE users SET "password" = $1 WHERE "email" = $2;',
      values: [hash, req.session["username"]],
    };
    const results = await pool.query(query);

    if (results?.rowCount !== 1) {
      res.status(400).json({
        code: "UPDATE_PASSWORD_ERROR",
        message: "Failed to update user password",
        details: "No rows were affected",
      });
    } else {
      res.status(200).json({
        code: "UPDATE_PASSWORD_SUCCESS",
        message: "Successfully updated user password",
        details: `Rows affected: ${results.rowCount}`,
      });
    }
  } catch (err) {
    res.status(500).json({
      code: "UPDATE_PASSWORD_ERROR",
      message: "Error while updating user password",
      details: err,
    });
  }
});

export default router;
