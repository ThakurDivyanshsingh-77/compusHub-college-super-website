# CampusHub – College Super App
## Project Documentation & Overview

### 1. Introduction
**CampusHub** is a modern, premium SaaS-style productivity platform designed specifically for college ecosystems. It serves as a unified "super app" that bridges the gap between students and administrators by centralizing academic activities, communication, and resources into a single, cohesive interface. The application features a rich, responsive design with smooth animations and intuitive user experiences.

### 2. Core Modules & Roles

#### A. Student Workspace
Students log in to a beautifully designed, personalized dashboard that tracks their daily academic life.
- **Smart Timetable**: Students can view their daily class schedules, room locations, and times. The timetable automatically adapts based on their enrolled branch and year.
- **Attendance Intelligence & Bunk Calculator**: Students can easily log and monitor their attendance across different subjects. The system highlights their current attendance percentage and visually warns them if they fall below the critical 75% threshold. A dedicated Bunk Calculator helps students plan their days off safely.
- **Notes Pipeline / Repository**: A collaborative platform where students can upload study materials, view notes uploaded by peers (once approved by admins), and rate the quality of the notes.
- **Campus Events**: Students can browse upcoming college events, fests, and workshops, and seamlessly register for them with a single click.
- **AI Study Helper**: Built directly into the application, this intelligent assistant allows students to ask questions, summarize complex topics, and generate quick multiple-choice quizzes for exam preparation.

#### B. Admin Control Center
Administrators and faculty members have access to a powerful control center to manage the institution's data.
- **Student Management**: Full CRUD capabilities to onboard new students, update their details (branch, year), or remove them from the system.
- **Attendance Management**: Admins have an overarching view of attendance and can manually adjust or override attendance records.
- **Timetable Management**: Easily publish and update the master timetable for various branches and years.
- **Notes Moderation**: To maintain quality, notes uploaded by students enter a pending queue. Admins can review the content and approve or reject it before it becomes visible to the rest of the college.
- **Event Coordination**: Admins can publish new events, update details, and instantly view a comprehensive list of all students who have registered for specific events.

### 3. Technology Stack

**Frontend (Client-Side)**
- **Framework**: React.js (via Vite for blazing-fast builds)
- **Styling**: Tailwind CSS for utility-first, fully responsive design.
- **Animations**: Framer Motion for sophisticated, fluid page transitions and micro-interactions.
- **Icons**: Lucide React for consistent, crisp vector icons.
- **Routing**: React Router DOM (v6) for seamless single-page application navigation.

**Backend (Server-Side)**
- **Environment**: Node.js & Express.js for scalable API development.
- **Database**: MySQL (relational database) with `mysql2/promise` for robust data integrity, relational constraints (Foreign Keys / Cascades), and efficient complex queries (JOINs).
- **Authentication**: Custom JWT (JSON Web Tokens) implementation for secure, role-based access control (Student vs. Admin authorization guards).
- **AI Integration**: Integration with LLM APIs (like Google Gemini / OpenAI) to power the built-in AI Study Helper.

### 4. Database Schema Overview
The relational database is structured to ensure data integrity and fast lookups:
- `users`: Stores all account credentials, roles (`student` or `admin`), and profile data (branch, year).
- `attendance`: Tracks subject-by-subject attendance records linked to specific students.
- `timetable`: Stores class schedules mapped to specific days, branches, and years.
- `notes`: Contains metadata, approval status, and file URLs for uploaded study materials.
- `events`: Holds details for campus activities.
- `event_registrations`: A junction table mapping `users` to `events` with unique constraints to prevent duplicate sign-ups.

### 5. Design Philosophy & UX
CampusHub breaks away from traditional, clunky educational software by adopting the aesthetics of premium SaaS products (akin to Linear, Vercel, or Notion).
- **Glassmorphism & Gradients**: Subtle background blurs and energetic gradients for a modern look.
- **Responsive Layouts**: The application is fully responsive. Mobile users get dedicated bottom/top navigation bars, while desktop users experience expansive sidebars and grid layouts.
- **State Feedback**: Extensive use of loading spinners, empty states, and toast-style notifications ensure the user is always aware of system processes.

### 6. Conclusion
CampusHub is not just a utility, but an **operating system for campus life**. By marrying a highly polished, interactive frontend with a secure, relational backend architecture, it provides an unparalleled toolset for modern educational institutions.
