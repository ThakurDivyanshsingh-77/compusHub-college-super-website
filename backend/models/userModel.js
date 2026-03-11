const pool = require("../config/db");

const sanitizeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

const findByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
};

const createStudent = async ({ name, email, password, branch, year }) => {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, role, branch, year)
     VALUES (?, ?, ?, 'student', ?, ?)`,
    [name, email, password, branch, year]
  );

  return findById(result.insertId);
};

const updateUser = async (id, payload) => {
  const fields = Object.keys(payload);
  if (!fields.length) {
    return findById(id);
  }

  const setClause = fields.map((key) => `${key} = ?`).join(", ");
  const values = fields.map((key) => payload[key]);
  values.push(id);

  await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);
  return findById(id);
};

const listStudents = async () => {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, branch, year, cgpa, skills, internship_experience FROM users WHERE role = 'student' ORDER BY id DESC"
  );
  return rows;
};

const deleteStudent = async (id) => {
  const [result] = await pool.query("DELETE FROM users WHERE id = ? AND role = 'student'", [id]);
  return result.affectedRows > 0;
};

module.exports = {
  sanitizeUser,
  findByEmail,
  findById,
  createStudent,
  updateUser,
  listStudents,
  deleteStudent,
};
