// routes/usersRoutes.js
const express = require("express");
const router = express.Router();

// Import the completeProfile controller function
const {
  completeProfile,
  getUserByAuth0Id,
} = require("../controllers/usersController");

//POST - Route to complete or update a user's profile
router.post("/api/users/complete-profile", completeProfile);

//GET the entire users row by it's auth0 to display on the front page.
router.get("/api/users/:auth0_id", getUserByAuth0Id);

module.exports = router;
