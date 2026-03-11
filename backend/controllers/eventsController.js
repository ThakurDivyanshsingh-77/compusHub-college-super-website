const eventsModel = require("../models/eventsModel");

const getEvents = async (_req, res, next) => {
  try {
    const rows = await eventsModel.listEvents();
    return res.json({ data: rows });
  } catch (error) {
    return next(error);
  }
};

const registerEvent = async (req, res, next) => {
  try {
    const result = await eventsModel.registerForEvent({
      event_id: req.params.id,
      student_id: req.user.id,
    });

    if (result.alreadyRegistered) {
      return res.status(200).json({ message: "Already registered" });
    }

    return res.status(201).json({ message: "Successfully registered" });
  } catch (error) {
    return next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location } = req.body;
    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const created = await eventsModel.createEvent({ title, description, date, location });
    return res.status(201).json({ data: created });
  } catch (error) {
    return next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const updated = await eventsModel.updateEvent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json({ data: updated });
  } catch (error) {
    return next(error);
  }
};

const removeEvent = async (req, res, next) => {
  try {
    const deleted = await eventsModel.deleteEvent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json({ message: "Event deleted" });
  } catch (error) {
    return next(error);
  }
};

const getRegistrations = async (req, res, next) => {
  try {
    const registrations = await eventsModel.getEventRegistrations(req.params.id);
    return res.json({ data: registrations });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getEvents,
  registerEvent,
  createEvent,
  updateEvent,
  removeEvent,
  getRegistrations,
};
