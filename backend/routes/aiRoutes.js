const express = require("express");
const aiController = require("../controllers/aiController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/study-helper", requireAuth, aiController.askStudyHelper);

module.exports = router;
