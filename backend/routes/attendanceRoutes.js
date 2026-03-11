const express = require("express");
const attendanceController = require("../controllers/attendanceController");
const { requireAuth, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/me", requireAuth, authorizeRoles("student"), attendanceController.getMyAttendance);
router.get("/analytics", requireAuth, authorizeRoles("student"), attendanceController.getAttendanceAnalytics);
router.post("/bunk-calc", requireAuth, attendanceController.calculateBunk);
router.post("/", requireAuth, authorizeRoles("admin"), attendanceController.upsertAttendance);
router.get("/admin", requireAuth, authorizeRoles("admin"), attendanceController.listAllAttendance);

module.exports = router;
