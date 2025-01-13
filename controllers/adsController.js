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

  if (!user_id || !title) {
    return res.status(400).json({ error: "user_id and title are required" });
  }

  try {
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      user_id,
      title,
      description || null,
      country || null,
      state || null,
      city || null,
      instagramPostUrl || null,
      keywords ? JSON.stringify(keywords) : null,
    ];

    const result = await pool.query(query, values);
    res.status(201).json({ success: true, ad: result.rows[0] });
  } catch (error) {
    console.error("Error inserting ad:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to get ad counts by country
const getAdsCountByCountry = async (req, res) => {
  console.log("Fetching ad counts by country...");
  try {
    const query = `
      SELECT country, COUNT(*) AS ad_count
      FROM ads
      GROUP BY country;
    `;
    const result = await pool.query(query);
    console.log(result);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching ad counts by country:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createAd, getAdsCountByCountry };
