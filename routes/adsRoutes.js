// routes/adsRoutes.js
const express = require("express");
const router = express.Router();

// Import the controller
const { createAd } = require("../controllers/adsController");

// Handle root route or ads-related routes
router.get("/", (req, res) => {
  res.send("Welcome to the Ads API");
});

// POST route to create a new ad
router.post("/api/ads", createAd);

module.exports = router;
