const pool = require("../config/db");

const listEvents = async () => {
  const [rows] = await pool.query(
    "SELECT id, title, description, date, location, created_at FROM events ORDER BY date ASC"
  );
  return rows;
};

const createEvent = async ({ title, description, date, location }) => {
  const [result] = await pool.query(
    "INSERT INTO events (title, description, date, location) VALUES (?, ?, ?, ?)",
    [title, description, date, location]
  );

  const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [result.insertId]);
  return rows[0];
};

const updateEvent = async (id, payload) => {
  const fields = Object.keys(payload);
  if (!fields.length) {
    const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);
    return rows[0] || null;
  }

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = fields.map((field) => payload[field]);
  values.push(id);

  await pool.query(`UPDATE events SET ${setClause} WHERE id = ?`, values);

  const [rows] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);
  return rows[0] || null;
};

const deleteEvent = async (id) => {
  const [result] = await pool.query("DELETE FROM events WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

const registerForEvent = async ({ event_id, student_id }) => {
  const [existing] = await pool.query(
    "SELECT id FROM event_registrations WHERE event_id = ? AND student_id = ? LIMIT 1",
    [event_id, student_id]
  );

  if (existing.length) {
    return { alreadyRegistered: true };
  }

  await pool.query(
    "INSERT INTO event_registrations (event_id, student_id) VALUES (?, ?)",
    [event_id, student_id]
  );

  return { alreadyRegistered: false };
};

const getEventRegistrations = async (event_id) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.branch, u.year, er.created_at as registered_at 
     FROM event_registrations er
     JOIN users u ON er.student_id = u.id
     WHERE er.event_id = ?
     ORDER BY er.created_at DESC`,
    [event_id]
  );
  return rows;
};

module.exports = {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations,
};
