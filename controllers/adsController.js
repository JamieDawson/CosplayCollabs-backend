const pool = require("../config/db");

const createAd = async (req, res) => {
  const {
    user_id,
    title,
    description,
    country,
    state,
    city,
    instagramPostUrl,
    keywords,
  } = req.body;

  // Check required fields
  if (!user_id || !title) {
    return res.status(400).json({ error: "user_id and title are required" });
  }

  try {
    // Insert ad into the database, do not include the `id` since it's auto-generated
    const query = `
      INSERT INTO ads (
        user_id,
        title,
        description,
        country,
        state,
        city,
        instagram_post_url,
        keywords
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING *;
    `;
    const values = [
      user_id,
      title,
      description || null,
      country || null,
      state || null,
      city || null,
      instagramPostUrl || null,
      keywords ? JSON.stringify(keywords) : null, // Save keywords as JSON
    ];

    const result = await pool.query(query, values);
    res.status(201).json({ success: true, ad: result.rows[0] });
  } catch (error) {
    console.error("Error inserting ad:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createAd };
