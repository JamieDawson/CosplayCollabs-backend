const pool = require("../config/db");

//Create an ad and store it in the Postgres database.
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

  console.log("Inserting ad with values:", {
    user_id,
    title,
    description,
    country,
    state,
    city,
    instagramPostUrl,
    keywords,
  });

  try {
    const query = `
      INSERT INTO ads (
        user_id, title, description, country, state, city, instagram_post_url, keywords
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

    console.log("Query:", query);
    console.log("Values:", values);

    const result = await pool.query(query, values);
    res.status(201).json({ success: true, ad: result.rows[0] });
  } catch (error) {
    console.error("Error inserting ad:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
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
    console.log("getAdsCountByCountry ", result);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching ad counts by country:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Used for the front page to get the most recent ads
const getMostRecentAds = async (req, res) => {
  console.log("Function getMostRecentAds called");
  try {
    const query = `
      SELECT * FROM ads
      ORDER BY created_at DESC
      LIMIT 10;
    `;
    const result = await pool.query(query);
    console.log("getMostRecentAds: RESULT: " + result);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.log("getMostRecentAds error triggered");

    console.error("Error fetching most recent ads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Pass in Country, State, and City to get ads for that location
const getAdsByLocation = async (req, res) => {
  const { country, state, city } = req.params;

  try {
    const query = `
      SELECT * FROM ads
      WHERE country = $1 AND state = $2 AND city = $3;
    `;
    const values = [country, state, city];

    const result = await pool.query(query, values);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching ads by location:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Get ads by state
const getAdsByState = async (req, res) => {
  const { country, state } = req.params;

  try {
    const query = `SELECT * FROM ads WHERE country=$1 AND state=$2`;
    const values = [country, state];
    const result = await pool.query(query, values);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Not pulling ads by state" });
  }
};

//Get the ads by a Users ID. This is used for users profiles!
const getAdsByUserId = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    console.log("Missing user_id in getAdsByUserId");
  }

  console.log("Ad Function getAdsByUserId called. user_id is ", user_id);

  try {
    const query = `
      SELECT * FROM ads
      WHERE user_id = $1;
    `;
    const values = [user_id];

    const result = await pool.query(query, values);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching ads by location:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Get ads by users tags. Is triggered when a user clicks on a tag and is redirected to the tags page
const getAdsByTag = async (req, res) => {
  const { tag } = req.params;

  try {
    const query = `SELECT * FROM ads
       WHERE EXISTS (
         SELECT 1 FROM jsonb_array_elements_text(keywords) AS kw
          WHERE LOWER(kw.value) = $1
    );`;

    const values = [tag];
    const result = await pool.query(query, values);

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {}
};

module.exports = {
  createAd,
  getAdsCountByCountry,
  getAdsByLocation,
  getMostRecentAds,
  getAdsByUserId,
  getAdsByTag,
  getAdsByState,
};
