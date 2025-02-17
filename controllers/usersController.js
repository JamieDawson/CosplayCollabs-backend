const pool = require("../config/db");

// Complete a users profile after auth0 signup process
const completeProfile = async (req, res) => {
  const { auth0_id, email, name, username } = req.body;

  // Validate required fields
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

    // Respond with the updated or inserted user record
    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  completeProfile,
};
