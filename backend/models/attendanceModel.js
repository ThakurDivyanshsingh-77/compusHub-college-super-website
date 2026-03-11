const pool = require("../config/db");

const getStudentAttendance = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT id, student_id, subject, total_classes, attended_classes,
            ROUND((attended_classes / NULLIF(total_classes, 0)) * 100, 2) AS percentage
     FROM attendance
     WHERE student_id = ?
     ORDER BY subject ASC`,
    [studentId]
  );

  return rows;
};

const upsertAttendance = async ({ student_id, subject, total_classes, attended_classes }) => {
  const [rows] = await pool.query(
    "SELECT id FROM attendance WHERE student_id = ? AND subject = ? LIMIT 1",
    [student_id, subject]
  );

  if (rows.length) {
    await pool.query(
      "UPDATE attendance SET total_classes = ?, attended_classes = ? WHERE id = ?",
      [total_classes, attended_classes, rows[0].id]
    );
    const [updated] = await pool.query("SELECT * FROM attendance WHERE id = ?", [rows[0].id]);
    return updated[0];
  }

  const [result] = await pool.query(
    `INSERT INTO attendance (student_id, subject, total_classes, attended_classes)
     VALUES (?, ?, ?, ?)`,
    [student_id, subject, total_classes, attended_classes]
  );

  const [created] = await pool.query("SELECT * FROM attendance WHERE id = ?", [result.insertId]);
  return created[0];
};

const listAllAttendance = async () => {
  const [rows] = await pool.query(
    `SELECT a.id,
            a.student_id,
            u.name AS student_name,
            u.branch,
            u.year,
            a.subject,
            a.total_classes,
            a.attended_classes,
            ROUND((a.attended_classes / NULLIF(a.total_classes, 0)) * 100, 2) AS percentage
     FROM attendance a
     JOIN users u ON u.id = a.student_id
     ORDER BY u.branch, u.year, u.name, a.subject`
  );
  return rows;
};

module.exports = {
  getStudentAttendance,
  upsertAttendance,
  listAllAttendance,
};
