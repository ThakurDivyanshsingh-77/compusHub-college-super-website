const express = require("express");
const notesController = require("../controllers/notesController");
const upload = require("../config/multer");
const { requireAuth, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, notesController.getNotes);
router.post("/upload", requireAuth, authorizeRoles("student"), upload.single("file"), notesController.uploadNote);
router.post("/:id/download", requireAuth, notesController.downloadNote);
router.post("/:id/rate", requireAuth, authorizeRoles("student"), notesController.rateNote);

router.get("/admin/all", requireAuth, authorizeRoles("admin"), notesController.getAllNotesAdmin);
router.patch("/admin/:id/approve", requireAuth, authorizeRoles("admin"), notesController.approveNote);
router.patch("/admin/:id/reject", requireAuth, authorizeRoles("admin"), notesController.rejectNote);
router.delete("/admin/:id", requireAuth, authorizeRoles("admin"), notesController.removeNote);

module.exports = router;
