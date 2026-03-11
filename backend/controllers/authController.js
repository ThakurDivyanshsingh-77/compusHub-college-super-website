const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const createToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      branch: user.branch,
      year: user.year,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const register = async (req, res, next) => {
  try {
    const { name, email, password, branch, year } = req.body;

    if (!name || !email || !password || !branch || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.createStudent({
      name,
      email,
      password: hashedPassword,
      branch,
      year,
    });

    const token = createToken(user);
    return res.status(201).json({ token, user: userModel.sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);
    return res.json({ token, user: userModel.sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: userModel.sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
  me,
};
