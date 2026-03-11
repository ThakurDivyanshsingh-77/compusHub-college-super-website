const pool = require("../config/db");

const listTimetable = async (filters = {}) => {
  const clauses = [];
  const values = [];

  if (filters.branch) {
    clauses.push("branch = ?");
    values.push(filters.branch);
  }

  if (filters.year) {
    clauses.push("year = ?");
    values.push(filters.year);
  }

  if (filters.day) {
    clauses.push("day = ?");
    values.push(filters.day);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT id, day, subject, teacher, room, start_time, end_time, branch, year
     FROM timetable ${where}
     ORDER BY FIELD(day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'), start_time`,
    values
  );

  return rows;
};

const createTimetableEntry = async (payload) => {
  const { day, subject, teacher, room, start_time, end_time, branch, year } = payload;
  const [result] = await pool.query(
    `INSERT INTO timetable (day, subject, teacher, room, start_time, end_time, branch, year)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [day, subject, teacher, room, start_time, end_time, branch, year]
  );

  const [rows] = await pool.query("SELECT * FROM timetable WHERE id = ?", [result.insertId]);
  return rows[0];
};

const updateTimetableEntry = async (id, payload) => {
  const fields = Object.keys(payload);
  if (!fields.length) {
    const [rows] = await pool.query("SELECT * FROM timetable WHERE id = ?", [id]);
    return rows[0] || null;
  }

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = fields.map((field) => payload[field]);
  values.push(id);

  await pool.query(`UPDATE timetable SET ${setClause} WHERE id = ?`, values);
  const [rows] = await pool.query("SELECT * FROM timetable WHERE id = ?", [id]);
  return rows[0] || null;
};

const deleteTimetableEntry = async (id) => {
  const [result] = await pool.query("DELETE FROM timetable WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = {
  listTimetable,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
};
