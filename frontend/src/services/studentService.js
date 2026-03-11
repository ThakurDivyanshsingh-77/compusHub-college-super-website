import api from "./api";

export const fetchStudentDashboard = async () => (await api.get("/dashboard/student")).data;
export const fetchTimetable = async (params = {}) => (await api.get("/timetable", { params })).data;
export const fetchAttendance = async () => (await api.get("/attendance/me")).data;
export const fetchAttendanceAnalytics = async () => (await api.get("/attendance/analytics")).data;
export const calculateBunk = async (payload) => (await api.post("/attendance/bunk-calc", payload)).data;

export const fetchNotes = async (params = {}) => (await api.get("/notes", { params })).data;
export const uploadNote = async (formData) =>
  (await api.post("/notes/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })).data;
export const downloadNote = async (id) => (await api.post(`/notes/${id}/download`)).data;
export const rateNote = async (id, rating) => (await api.post(`/notes/${id}/rate`, { rating })).data;

export const fetchEvents = async () => (await api.get("/events")).data;
export const registerEvent = async (id) => (await api.post(`/events/${id}/register`)).data;

export const askStudyHelper = async (payload) => (await api.post("/ai/study-helper", payload)).data;

export const fetchProfile = async () => (await api.get("/profile/me")).data;
export const updateProfile = async (formData) =>
  (await api.put("/profile/me", formData, { headers: { "Content-Type": "multipart/form-data" } })).data;
