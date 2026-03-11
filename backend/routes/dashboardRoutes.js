const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { requireAuth, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/student", requireAuth, authorizeRoles("student"), dashboardController.getStudentDashboard);

module.exports = router;
