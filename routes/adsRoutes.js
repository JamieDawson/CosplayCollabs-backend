// routes/adsRoutes.js
const express = require("express");
const router = express.Router();

// Import the controllers
const {
  createAd,
  getAdsCountByCountry,
  getAdsByLocation,
  getMostRecentAds,
  getAdsByUserId,
  getAdsByTag,
  getAdsByState,
} = require("../controllers/adsController");

// Handle root route or ads-related routes
router.get("/", (req, res) => {
  res.send("Welcome to the Ads API");
});

// POST route to create a new ad
router.post("/api/ads", createAd);

// GET route to get ad counts by country
router.get("/api/ads/count-by-country", getAdsCountByCountry);

//GEt route by state
router.get("/api/ads/by-state/:country/:state", getAdsByState);

//GET route to get ads by city
router.get("/api/ads/:country/:state/:city", getAdsByLocation);

//GET most recent ads in ads database
router.get("/api/ads/most-recent", getMostRecentAds);

//GET ads by user_id
router.get("/api/ads/user/:user_id", getAdsByUserId);

//GET ads by value founds in array of tags.
router.get("/api/ads/ads-by-tag/:tag", getAdsByTag);

module.exports = router;
