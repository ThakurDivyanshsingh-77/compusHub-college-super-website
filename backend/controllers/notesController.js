const path = require("path");
const notesModel = require("../models/notesModel");
const userModel = require("../models/userModel");

const getNotes = async (req, res, next) => {
  try {
    const rows = await notesModel.listNotes(req.query);
    return res.json({ data: rows });
  } catch (error) {
    return next(error);
  }
};

const uploadNote = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const { title, subject, branch, year } = req.body;
    if (!title || !subject || !branch || !year) {
      return res.status(400).json({ message: "title, subject, branch and year are required" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const created = await notesModel.createNote({
      title,
      subject,
      branch,
      year,
      uploaded_by: req.user.id,
      file_url: fileUrl,
      file_type: path.extname(req.file.originalname).replace(".", "").toUpperCase(),
    });

    return res.status(201).json({ data: created, message: "Note uploaded and pending admin approval" });
  } catch (error) {
    return next(error);
  }
};

const downloadNote = async (req, res, next) => {
  try {
    const note = await notesModel.incrementDownload(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.json({ fileUrl: note.file_url, downloads: note.downloads });
  } catch (error) {
    return next(error);
  }
};

const rateNote = async (req, res, next) => {
  try {
    const rating = Number(req.body.rating);
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const note = await notesModel.rateNote({
      note_id: req.params.id,
      student_id: req.user.id,
      rating,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.json({ data: note });
  } catch (error) {
    return next(error);
  }
};

const getAllNotesAdmin = async (_req, res, next) => {
  try {
    const rows = await notesModel.listAllNotes();
    return res.json({ data: rows });
  } catch (error) {
    return next(error);
  }
};

const approveNote = async (req, res, next) => {
  try {
    const note = await notesModel.updateNoteStatus(req.params.id, "approved");
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.json({ data: note });
  } catch (error) {
    return next(error);
  }
};

const rejectNote = async (req, res, next) => {
  try {
    const note = await notesModel.updateNoteStatus(req.params.id, "rejected");
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.json({ data: note });
  } catch (error) {
    return next(error);
  }
};

const removeNote = async (req, res, next) => {
  try {
    const deleted = await notesModel.deleteNote(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.json({ message: "Note deleted" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getNotes,
  uploadNote,
  downloadNote,
  rateNote,
  getAllNotesAdmin,
  approveNote,
  rejectNote,
  removeNote,
};
