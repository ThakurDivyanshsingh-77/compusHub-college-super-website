const attendanceModel = require("../models/attendanceModel");

const calculateBunkDetails = ({ totalClasses, attendedClasses, minimumAttendance }) => {
  const total = Number(totalClasses);
  const attended = Number(attendedClasses);
  const minimum = Number(minimumAttendance || 75);

  if (!Number.isFinite(total) || !Number.isFinite(attended) || total <= 0 || attended < 0 || attended > total) {
    return null;
  }

  const currentPercentage = Number(((attended / total) * 100).toFixed(2));
  const allowedBunks = Math.max(0, Math.floor((attended * 100) / minimum - total));

  const nextTenAttendAll = Number((((attended + 10) / (total + 10)) * 100).toFixed(2));
  const afterAllowedBunks = Number(((attended / (total + allowedBunks)) * 100).toFixed(2));

  return {
    currentPercentage,
    allowedBunks,
    futurePrediction: {
      ifAttendNext10: nextTenAttendAll,
      ifUseAllAllowedBunks: afterAllowedBunks,
    },
  };
};

const getMyAttendance = async (req, res, next) => {
  try {
    const data = await attendanceModel.getStudentAttendance(req.user.id);

    const overall =
      data.length > 0
        ? Number((data.reduce((sum, item) => sum + Number(item.percentage || 0), 0) / data.length).toFixed(2))
        : 0;

    const lowAttendanceSubjects = data.filter((item) => Number(item.percentage) < 75).map((item) => item.subject);

    return res.json({
      overallPercentage: overall,
      lowAttendanceSubjects,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const getAttendanceAnalytics = async (req, res, next) => {
  try {
    const data = await attendanceModel.getStudentAttendance(req.user.id);

    const chartData = {
      labels: data.map((item) => item.subject),
      percentages: data.map((item) => Number(item.percentage || 0)),
    };

    return res.json({ data: chartData });
  } catch (error) {
    return next(error);
  }
};

const calculateBunk = async (req, res, next) => {
  try {
    const details = calculateBunkDetails(req.body);
    if (!details) {
      return res.status(400).json({ message: "Invalid inputs" });
    }

    return res.json(details);
  } catch (error) {
    return next(error);
  }
};

const upsertAttendance = async (req, res, next) => {
  try {
    const { student_id, subject, total_classes, attended_classes } = req.body;
    if (!student_id || !subject || total_classes == null || attended_classes == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await attendanceModel.upsertAttendance({
      student_id,
      subject,
      total_classes,
      attended_classes,
    });

    return res.json({ data: result });
  } catch (error) {
    return next(error);
  }
};

const listAllAttendance = async (_req, res, next) => {
  try {
    const rows = await attendanceModel.listAllAttendance();
    return res.json({ data: rows });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMyAttendance,
  getAttendanceAnalytics,
  calculateBunk,
  upsertAttendance,
  listAllAttendance,
};
