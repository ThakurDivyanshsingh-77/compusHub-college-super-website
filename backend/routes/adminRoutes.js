const express = require("express");
const adminController = require("../controllers/adminController");
const { requireAuth, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", requireAuth, authorizeRoles("admin"), adminController.getAdminDashboard);
router.get("/students", requireAuth, authorizeRoles("admin"), adminController.listStudents);
router.put("/students/:id", requireAuth, authorizeRoles("admin"), adminController.updateStudent);
router.delete("/students/:id", requireAuth, authorizeRoles("admin"), adminController.deleteStudent);

module.exports = router;
