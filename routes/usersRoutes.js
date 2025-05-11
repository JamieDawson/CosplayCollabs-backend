// routes/usersRoutes.js
const express = require("express");
const router = express.Router();
const {
  completeProfile,
  getUserByAuth0Id,
  deleteAdById,
  updateAdById,
  deleteUser,
} = require("../controllers/usersController");

// POST - complete or update a user's profile
router.post("/api/users/complete-profile", completeProfile);

// GET - retrieve a user's data by Auth0 ID (from req.params)
router.get("/api/users/:auth0_id", getUserByAuth0Id);

// DELETE ad by ID
router.delete("/api/users/delete/:id", deleteAdById);

// UPDATE an ad by ID
router.put("/api/users/update/:id", updateAdById);

//DELETE a user out of Auth0 and Postgres
router.delete("/api/users/delete-account/:id", deleteUser);

module.exports = router;
