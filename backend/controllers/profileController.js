const userModel = require("../models/userModel");

const getProfile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ data: userModel.sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "branch",
      "year",
      "skills",
      "cgpa",
      "internship_experience",
    ];

    const payload = {};
    for (const field of allowedFields) {
      if (req.body[field] != null) {
        payload[field] = req.body[field];
      }
    }

    if (req.files?.profile_photo?.[0]) {
      payload.profile_photo = `/uploads/${req.files.profile_photo[0].filename}`;
    }

    if (req.files?.resume?.[0]) {
      payload.resume_url = `/uploads/${req.files.resume[0].filename}`;
    }

    const updated = await userModel.updateUser(req.user.id, payload);
    return res.json({ data: userModel.sanitizeUser(updated) });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
