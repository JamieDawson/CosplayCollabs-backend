// routes/usersRoutes.js
const express = require("express");
const router = express.Router();

// Import the completeProfile controller function
const { completeProfile } = require("../controllers/usersController");

// Route to complete or update a user's profile
router.post("/api/users/complete-profile", completeProfile);

module.exports = router;
