const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const { getDashboardOverview } = require("../controllers/dashboard");

// Route to get dashboard overview (protected)
router.get("/overview", authenticateToken, getDashboardOverview);

module.exports = router;
