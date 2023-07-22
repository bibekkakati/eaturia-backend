require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

require("./helpers/mongoHelper").mongoconnect();

// Environment variables
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const publicRoutes = require("./routes/publicRoutes");
const authenticate = require("./middlewares/authenticate");
const sanitizer = require("./middlewares/sanitizer");

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(authenticate);
app.use(sanitizer);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/public", publicRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
