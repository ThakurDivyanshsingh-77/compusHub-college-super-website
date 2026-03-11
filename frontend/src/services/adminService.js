import api from "./api";

export const fetchAdminDashboard = async () => (await api.get("/admin/dashboard")).data;

export const fetchStudents = async () => (await api.get("/admin/students")).data;
export const updateStudent = async (id, payload) => (await api.put(`/admin/students/${id}`, payload)).data;
export const deleteStudent = async (id) => (await api.delete(`/admin/students/${id}`)).data;

export const addTimetableEntry = async (payload) => (await api.post("/timetable", payload)).data;
export const editTimetableEntry = async (id, payload) => (await api.put(`/timetable/${id}`, payload)).data;
export const deleteTimetableEntry = async (id) => (await api.delete(`/timetable/${id}`)).data;

export const fetchAllNotesAdmin = async () => (await api.get("/notes/admin/all")).data;
export const approveNote = async (id) => (await api.patch(`/notes/admin/${id}/approve`)).data;
export const rejectNote = async (id) => (await api.patch(`/notes/admin/${id}/reject`)).data;
export const removeNote = async (id) => (await api.delete(`/notes/admin/${id}`)).data;

export const createEvent = async (payload) => (await api.post("/events", payload)).data;
export const updateEvent = async (id, payload) => (await api.put(`/events/${id}`, payload)).data;
export const deleteEvent = async (id) => (await api.delete(`/events/${id}`)).data;
export const fetchEventRegistrations = async (id) => (await api.get(`/events/${id}/registrations`)).data;

export const upsertAttendance = async (payload) => (await api.post("/attendance", payload)).data;
export const fetchAllAttendance = async () => (await api.get("/attendance/admin")).data;
