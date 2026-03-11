const pool = require("../config/db");
const timetableModel = require("../models/timetableModel");
const eventsModel = require("../models/eventsModel");
const attendanceModel = require("../models/attendanceModel");
const userModel = require("../models/userModel");

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getStudentDashboard = async (req, res, next) => {
  try {
    const student = await userModel.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const today = dayNames[new Date().getDay()];

    const todayClasses = await timetableModel.listTimetable({
      branch: student.branch,
      year: student.year,
      day: today,
    });

    const allAttendance = await attendanceModel.getStudentAttendance(student.id);
    const overallAttendance =
      allAttendance.length > 0
        ? Number(
            (
              allAttendance.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / allAttendance.length
            ).toFixed(2)
          )
        : 0;

    const [noteCountRows] = await pool.query(
      "SELECT COUNT(*) as count FROM notes WHERE status = 'approved' AND branch = ? AND year = ?",
      [student.branch, student.year]
    );

    const events = await eventsModel.listEvents();
    const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date()).slice(0, 5);

    const studyTips = [
      "Use active recall by testing yourself after each topic.",
      "Review notes within 24 hours to improve long-term retention.",
      "Prioritize weak subjects using short focused study blocks.",
    ];

    return res.json({
      overview: {
        todayClasses: todayClasses.length,
        attendancePercentage: overallAttendance,
        notesAvailable: noteCountRows[0]?.count || 0,
        upcomingEvents: upcomingEvents.length,
      },
      today,
      classes: todayClasses,
      events: upcomingEvents,
      tips: studyTips,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStudentDashboard,
};
