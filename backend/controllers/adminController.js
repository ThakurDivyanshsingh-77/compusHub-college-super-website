const pool = require("../config/db");
const userModel = require("../models/userModel");

const getAdminDashboard = async (_req, res, next) => {
  try {
    const [[students]] = await pool.query("SELECT COUNT(*) as total FROM users WHERE role = 'student'");
    const [[notes]] = await pool.query("SELECT COUNT(*) as total FROM notes");
    const [[events]] = await pool.query("SELECT COUNT(*) as total FROM events");
    const [[attendanceRows]] = await pool.query("SELECT COUNT(*) as total FROM attendance");

    const [lowAttendance] = await pool.query(
      `SELECT u.name, a.subject,
              ROUND((a.attended_classes / NULLIF(a.total_classes, 0)) * 100, 2) AS percentage
       FROM attendance a
       JOIN users u ON u.id = a.student_id
       WHERE (a.attended_classes / NULLIF(a.total_classes, 0)) * 100 < 75
       ORDER BY percentage ASC
       LIMIT 10`
    );

    return res.json({
      overview: {
        totalStudents: students.total,
        uploadedNotes: notes.total,
        events: events.total,
        attendanceReports: attendanceRows.total,
      },
      lowAttendance,
    });
  } catch (error) {
    return next(error);
  }
};

const listStudents = async (_req, res, next) => {
  try {
    const students = await userModel.listStudents();
    return res.json({ data: students });
  } catch (error) {
    return next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const payload = {};
    const fields = ["name", "email", "branch", "year", "skills", "cgpa", "internship_experience"];

    for (const field of fields) {
      if (req.body[field] != null) {
        payload[field] = req.body[field];
      }
    }

    const student = await userModel.updateUser(req.params.id, payload);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ data: userModel.sanitizeUser(student) });
  } catch (error) {
    return next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const deleted = await userModel.deleteStudent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student deleted" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAdminDashboard,
  listStudents,
  updateStudent,
  deleteStudent,
};
