// index.js
const express = require("express");
const cors = require("cors");
const adsRoutes = require("./routes/adsRoutes");
const usersRoutes = require("./routes/userRoutes"); // Import the new users route

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/", adsRoutes);
app.use("/", usersRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
