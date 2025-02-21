// controllers/usersController.js
const pool = require("../config/db");

// Complete a user's profile after Auth0 signup process
const completeProfile = async (req, res) => {
  const { auth0_id, email, name, username } = req.body;

  if (!auth0_id || !email) {
    return res.status(400).json({ error: "auth0_id and email are required." });
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
    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET user by Auth0 ID from URL params
const getUserByAuth0Id = async (req, res) => {
  const { auth0_id } = req.params;
  console.log("Received auth0_id:", auth0_id); // <-- temporary log
  try {
    const result = await pool.query("SELECT * FROM users WHERE auth0_id = $1", [
      auth0_id,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json({ success: true, user: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//DELETE ad by ID
// NOT WORKING?
const deleteAdById = async (req, res) => {
  console.log("deleteAdById");
  const { id } = req.params;
  console.log(id);
  try {
    const result = await pool.query("DELETE FROM ads WHERE id = $1", [id]);
    console.log(result);
    res.status(200).json({ success: true, message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  completeProfile,
  getUserByAuth0Id,
  deleteAdById,
};
