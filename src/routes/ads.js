const express = require("express");
const { getAdsByCity, createAd } = require("../controllers/adsController");
const router = express.Router();

// Routes
router.get("/:city_id", getAdsByCity); // Get ads for a city
router.post("/", createAd); // Create a new ad

module.exports = router;
