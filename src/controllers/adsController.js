const db = require("../config/db");

// Get ads for a city
const getAdsByCity = async (req, res) => {
  const { city_id } = req.params;
  try {
    const result = await db.query("SELECT * FROM ads WHERE city_id = $1", [
      city_id,
    ]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Create a new ad
const createAd = async (req, res) => {
  const { cosplayer_name, ad_description, instagram_link, city_id } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO ads (cosplayer_name, ad_description, instagram_link, city_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [cosplayer_name, ad_description, instagram_link, city_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { getAdsByCity, createAd };
