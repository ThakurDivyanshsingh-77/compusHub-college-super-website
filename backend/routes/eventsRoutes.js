const express = require("express");
const eventsController = require("../controllers/eventsController");
const { requireAuth, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, eventsController.getEvents);
router.post("/:id/register", requireAuth, authorizeRoles("student"), eventsController.registerEvent);
router.get("/:id/registrations", requireAuth, authorizeRoles("admin"), eventsController.getRegistrations);

router.post("/", requireAuth, authorizeRoles("admin"), eventsController.createEvent);
router.put("/:id", requireAuth, authorizeRoles("admin"), eventsController.updateEvent);
router.delete("/:id", requireAuth, authorizeRoles("admin"), eventsController.removeEvent);

module.exports = router;
