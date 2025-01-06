const express = require("express");
const cors = require("cors");
const adsRoutes = require("./routes/adsRoutes");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/", adsRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

/*
db.js: Centralizes the database connection configuration to keep it reusable.
adsController.js: Handles the logic for creating ads.
adsRoutes.js: Maps HTTP requests to the appropriate controller functions.
index.js: Serves as the main file to set up middleware and start the server.

This structure adheres to the Model-View-Controller (MVC) pattern.
*/
