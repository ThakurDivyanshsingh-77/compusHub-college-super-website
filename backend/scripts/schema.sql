CREATE DATABASE IF NOT EXISTS campushub;
USE campushub;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  branch VARCHAR(80) NOT NULL,
  year VARCHAR(30) NOT NULL,
  skills TEXT NULL,
  cgpa DECIMAL(3,2) NULL,
  internship_experience TEXT NULL,
  profile_photo VARCHAR(255) NULL,
  resume_url VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS timetable (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
  subject VARCHAR(120) NOT NULL,
  teacher VARCHAR(120) NOT NULL,
  room VARCHAR(40) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  branch VARCHAR(80) NOT NULL,
  year VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  subject VARCHAR(120) NOT NULL,
  total_classes INT NOT NULL DEFAULT 0,
  attended_classes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_student_subject (student_id, subject),
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subject VARCHAR(120) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  file_type VARCHAR(20) NOT NULL,
  uploaded_by INT NOT NULL,
  branch VARCHAR(80) NOT NULL,
  year VARCHAR(30) NOT NULL,
  downloads INT NOT NULL DEFAULT 0,
  rating_avg DECIMAL(3,2) NOT NULL DEFAULT 0,
  rating_count INT NOT NULL DEFAULT 0,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notes_user FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS note_ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  note_id INT NOT NULL,
  student_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_note_student_rating (note_id, student_id),
  CONSTRAINT fk_note_ratings_note FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  CONSTRAINT fk_note_ratings_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  student_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_event_student (event_id, student_id),
  CONSTRAINT fk_event_reg_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_reg_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT IGNORE INTO users (id, name, email, password, role, branch, year, skills, cgpa, internship_experience)
VALUES
  (1, 'Admin User', 'admin@campushub.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5l9Q7fW2H5hZ9YuqbWNoXDpUe1koRaK', 'admin', 'CSE', '4', 'Leadership, Operations', 9.10, 'Managed campus digital committee'),
  (2, 'Divya Student', 'student@campushub.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5l9Q7fW2H5hZ9YuqbWNoXDpUe1koRaK', 'student', 'CSE', '3', 'React, Node.js, DBMS', 8.45, 'Web intern at EdTech startup');

INSERT IGNORE INTO timetable (id, day, subject, teacher, room, start_time, end_time, branch, year)
VALUES
  (1, 'Monday', 'DBMS', 'Dr. Sharma', 'A-201', '09:00:00', '10:00:00', 'CSE', '3'),
  (2, 'Monday', 'Operating Systems', 'Prof. Nair', 'A-203', '10:15:00', '11:15:00', 'CSE', '3'),
  (3, 'Tuesday', 'Computer Networks', 'Dr. Rao', 'A-205', '09:00:00', '10:00:00', 'CSE', '3'),
  (4, 'Wednesday', 'Software Engineering', 'Prof. Kapoor', 'A-202', '11:30:00', '12:30:00', 'CSE', '3'),
  (5, 'Thursday', 'DBMS Lab', 'Ms. Iyer', 'Lab-2', '14:00:00', '16:00:00', 'CSE', '3');

INSERT IGNORE INTO attendance (id, student_id, subject, total_classes, attended_classes)
VALUES
  (1, 2, 'DBMS', 40, 33),
  (2, 2, 'Operating Systems', 38, 30),
  (3, 2, 'Computer Networks', 36, 29),
  (4, 2, 'Software Engineering', 32, 27);

INSERT IGNORE INTO events (id, title, description, date, location)
VALUES
  (1, 'Hackathon 2026', '24-hour inter-college coding challenge with prizes.', '2026-03-20', 'Innovation Center Hall'),
  (2, 'AI in Education Seminar', 'Guest talk on practical AI usage in academics.', '2026-03-25', 'Main Auditorium'),
  (3, 'Career Fair', 'Meet recruiters for internships and placements.', '2026-04-05', 'College Ground');
