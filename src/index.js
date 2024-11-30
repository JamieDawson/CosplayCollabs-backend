const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Routes
const adsRoutes = require("./routes/ads");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/ads", adsRoutes);

// Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
