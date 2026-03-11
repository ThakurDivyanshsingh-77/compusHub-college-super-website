const timetableModel = require("../models/timetableModel");
const userModel = require("../models/userModel");

const getTimetable = async (req, res, next) => {
  try {
    const filters = {
      branch: req.query.branch,
      year: req.query.year,
    };

    if (req.user.role !== "admin" && (!filters.branch || !filters.year)) {
      const user = await userModel.findById(req.user.id);
      if (user) {
        filters.branch = filters.branch || user.branch;
        filters.year = filters.year || user.year;
      }
    }

    const rows = await timetableModel.listTimetable(filters);
    return res.json({ data: rows });
  } catch (error) {
    return next(error);
  }
};

const addTimetableEntry = async (req, res, next) => {
  try {
    const requiredFields = ["day", "subject", "teacher", "room", "start_time", "end_time", "branch", "year"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const allowedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const normalizedDay =
      req.body.day.charAt(0).toUpperCase() + req.body.day.slice(1).toLowerCase();
    if (!allowedDays.includes(normalizedDay)) {
      return res.status(400).json({ message: "Day must be Monday–Friday" });
    }

    const normalizeTime = (timeStr) => {
      if (!timeStr) return null;
      // Accept HH:MM or HH:MM:SS (24h)
      if (/^\d{1,2}:\d{2}$/.test(timeStr)) return `${timeStr}:00`;
      if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr;
      return null;
    };

    const start = normalizeTime(req.body.start_time);
    const end = normalizeTime(req.body.end_time);
    if (!start || !end) {
      return res.status(400).json({ message: "Time must be HH:MM (24h) or HH:MM:SS" });
    }

    const created = await timetableModel.createTimetableEntry({
      ...req.body,
      day: normalizedDay,
      start_time: start,
      end_time: end,
    });
    return res.status(201).json({ data: created });
  } catch (error) {
    return next(error);
  }
};

const updateTimetableEntry = async (req, res, next) => {
  try {
    const updated = await timetableModel.updateTimetableEntry(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }
    return res.json({ data: updated });
  } catch (error) {
    return next(error);
  }
};

const removeTimetableEntry = async (req, res, next) => {
  try {
    const deleted = await timetableModel.deleteTimetableEntry(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Timetable entry not found" });
    }

    return res.json({ message: "Timetable entry deleted" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getTimetable,
  addTimetableEntry,
  updateTimetableEntry,
  removeTimetableEntry,
};
