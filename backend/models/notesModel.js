const pool = require("../config/db");

const listNotes = async (filters = {}) => {
  const clauses = ["status = 'approved'"];
  const values = [];

  if (filters.subject) {
    clauses.push("n.subject = ?");
    values.push(filters.subject);
  }

  if (filters.branch) {
    clauses.push("n.branch = ?");
    values.push(filters.branch);
  }

  if (filters.year) {
    clauses.push("n.year = ?");
    values.push(filters.year);
  }

  if (filters.search) {
    clauses.push("(n.title LIKE ? OR n.subject LIKE ?)");
    values.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  const [rows] = await pool.query(
    `SELECT n.id, n.title, n.subject, n.file_url, n.file_type, n.downloads,
            n.rating_avg, n.rating_count, n.branch, n.year, n.status,
            u.name AS uploaded_by_name, n.uploaded_by
     FROM notes n
     JOIN users u ON u.id = n.uploaded_by
     WHERE ${clauses.join(" AND ")}
     ORDER BY n.created_at DESC`,
    values
  );

  return rows;
};

const listAllNotes = async () => {
  const [rows] = await pool.query(
    `SELECT n.id, n.title, n.subject, n.file_url, n.file_type, n.downloads,
            n.rating_avg, n.rating_count, n.branch, n.year, n.status,
            u.name AS uploaded_by_name, n.uploaded_by
     FROM notes n
     JOIN users u ON u.id = n.uploaded_by
     ORDER BY n.created_at DESC`
  );

  return rows;
};

const createNote = async (payload) => {
  const { title, subject, file_url, file_type, uploaded_by, branch, year } = payload;
  const [result] = await pool.query(
    `INSERT INTO notes (title, subject, file_url, file_type, uploaded_by, branch, year, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [title, subject, file_url, file_type, uploaded_by, branch, year]
  );

  const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [result.insertId]);
  return rows[0];
};

const incrementDownload = async (id) => {
  await pool.query("UPDATE notes SET downloads = downloads + 1 WHERE id = ?", [id]);
  const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
  return rows[0] || null;
};

const rateNote = async ({ note_id, student_id, rating }) => {
  const [existing] = await pool.query(
    "SELECT id FROM note_ratings WHERE note_id = ? AND student_id = ? LIMIT 1",
    [note_id, student_id]
  );

  if (existing.length) {
    await pool.query("UPDATE note_ratings SET rating = ? WHERE id = ?", [rating, existing[0].id]);
  } else {
    await pool.query("INSERT INTO note_ratings (note_id, student_id, rating) VALUES (?, ?, ?)", [note_id, student_id, rating]);
  }

  await pool.query(
    `UPDATE notes n
     JOIN (
       SELECT note_id, ROUND(AVG(rating), 2) avg_rating, COUNT(*) rating_count
       FROM note_ratings
       WHERE note_id = ?
     ) r ON r.note_id = n.id
     SET n.rating_avg = r.avg_rating,
         n.rating_count = r.rating_count
     WHERE n.id = ?`,
    [note_id, note_id]
  );

  const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [note_id]);
  return rows[0] || null;
};

const updateNoteStatus = async (id, status) => {
  await pool.query("UPDATE notes SET status = ? WHERE id = ?", [status, id]);
  const [rows] = await pool.query("SELECT * FROM notes WHERE id = ?", [id]);
  return rows[0] || null;
};

const deleteNote = async (id) => {
  const [result] = await pool.query("DELETE FROM notes WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = {
  listNotes,
  listAllNotes,
  createNote,
  incrementDownload,
  rateNote,
  updateNoteStatus,
  deleteNote,
};
