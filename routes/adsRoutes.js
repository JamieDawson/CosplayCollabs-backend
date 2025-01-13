// routes/adsRoutes.js
const express = require("express");
const router = express.Router();

// Import the controllers
const {
  createAd,
  getAdsCountByCountry,
} = require("../controllers/adsController");

// Handle root route or ads-related routes
router.get("/", (req, res) => {
  res.send("Welcome to the Ads API");
});

// POST route to create a new ad
router.post("/api/ads", createAd);

// GET route to get ad counts by country
router.get("/api/ads/count-by-country", getAdsCountByCountry);

module.exports = router;
