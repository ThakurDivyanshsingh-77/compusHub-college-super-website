const express = require("express");
const timetableController = require("../controllers/timetableController");
const { requireAuth, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, timetableController.getTimetable);

router.post("/", requireAuth, authorizeRoles("admin"), timetableController.addTimetableEntry);
router.put("/:id", requireAuth, authorizeRoles("admin"), timetableController.updateTimetableEntry);
router.delete("/:id", requireAuth, authorizeRoles("admin"), timetableController.removeTimetableEntry);

module.exports = router;
