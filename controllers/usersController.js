// controllers/usersController.js
const pool = require("../config/db");

// Complete a user's profile after Auth0 signup process
const completeProfile = async (req, res) => {
  const { auth0_id, email, full_name, username } = req.body;

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
    const values = [auth0_id, email, full_name, username];
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

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Ad not found" });
    }

    res.status(200).json({ success: true, message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAdById = async (req, res) => {
  console.log("updateAdById called");

  const { id } = req.params;
  const {
    title,
    description,
    country,
    state,
    city,
    instagramPostUrl,
    keywords,
  } = req.body;

  console.log("Updating Ad ID:", id);
  console.log("New Data:", {
    title,
    description,
    country,
    state,
    city,
    instagramPostUrl,
    keywords,
  });

  try {
    const fieldsToUpdate = [];
    const values = [];
    let query = "UPDATE ads SET ";

    if (title) {
      fieldsToUpdate.push("title = $" + (values.length + 1));
      values.push(title);
    }
    if (description) {
      fieldsToUpdate.push("description = $" + (values.length + 1));
      values.push(description);
    }
    if (country) {
      fieldsToUpdate.push("country = $" + (values.length + 1));
      values.push(country);
    }
    if (state) {
      fieldsToUpdate.push("state = $" + (values.length + 1));
      values.push(state);
    }
    if (city) {
      fieldsToUpdate.push("city = $" + (values.length + 1));
      values.push(city);
    }
    if (instagramPostUrl) {
      fieldsToUpdate.push("instagram_post_url = $" + (values.length + 1));
      values.push(instagramPostUrl);
    }
    if (Array.isArray(keywords)) {
      fieldsToUpdate.push("keywords = $" + (values.length + 1));
      values.push(JSON.stringify(keywords)); // ✅ Convert array to JSON string
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    query += fieldsToUpdate.join(", ") + " WHERE id = $" + (values.length + 1);
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Ad not found" });
    }

    res.status(200).json({ success: true, message: "Ad updated successfully" });
  } catch (error) {
    console.error("Error updating ad:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  completeProfile,
  getUserByAuth0Id,
  deleteAdById,
  updateAdById,
};
