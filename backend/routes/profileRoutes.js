const express = require("express");
const profileController = require("../controllers/profileController");
const upload = require("../config/multer");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/me", requireAuth, profileController.getProfile);
router.put(
  "/me",
  requireAuth,
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  profileController.updateProfile
);

module.exports = router;
