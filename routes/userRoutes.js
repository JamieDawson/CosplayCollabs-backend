// routes/usersRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Your PostgreSQL connection pool
// const authMiddleware = require("../middleware/authMiddleware"); // Uncomment if using auth middleware

// Route to complete or update a user's profile
router.post(
  "/api/users/complete-profile",
  /* authMiddleware, */ async (req, res) => {
    // Destructure the expected fields from the request body
    const { auth0_id, email, name, username } = req.body;

    // Check that required fields are provided
    if (!auth0_id || !email) {
      return res
        .status(400)
        .json({ error: "auth0_id and email are required." });
    }

    try {
      const query = `
      INSERT INTO users (auth0_id, email, full_name, username)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (auth0_id)
      DO UPDATE SET email = EXCLUDED.email,
                    full_name = EXCLUDED.full_name,
                    username = EXCLUDED.username
      RETURNING *;
    `;
      const values = [auth0_id, email, name, username];

      const result = await pool.query(query, values);

      // Respond with the updated or inserted user record
      res.status(200).json({ success: true, user: result.rows[0] });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
