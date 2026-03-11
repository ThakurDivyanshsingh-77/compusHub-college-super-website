import { useEffect, useState } from "react";
import { UserCog } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import { deleteStudent, fetchStudents, updateStudent } from "../../services/adminService";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const load = async () => {
    const res = await fetchStudents();
    setStudents(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (student) => {
    setEditing(student.id);
    setForm({
      name: student.name,
      email: student.email,
      branch: student.branch,
      year: student.year,
      skills: student.skills || "",
      cgpa: student.cgpa || "",
      internship_experience: student.internship_experience || "",
    });
  };

  const save = async () => {
    await updateStudent(editing, form);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    await deleteStudent(id);
    load();
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Manage Students</h1>
        <p className="page-subtitle">View student records and update academic profile details as needed.</p>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <UserCog size={20} />
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900">Student Records</h2>
        </div>

        <DataTable
          columns={[
            {
              label: "Name",
              render: (row) => (
                <div className="font-medium text-slate-900">
                  {row.name} <span className="text-xs text-slate-500 font-normal">({row.id})</span>
                </div>
              ),
            },
            { label: "Email", accessor: "email", className: "text-slate-600" },
            { 
              label: "Branch", 
              render: (row) => <span className="badge badge-neutral bg-slate-100">{row.branch}</span> 
            },
            { label: "Year", accessor: "year", className: "text-slate-600 font-medium" },
            {
              label: "Actions",
              render: (row) => (
                <div className="flex gap-2">
                  <button className="btn btn-secondary text-xs" onClick={() => startEdit(row)}>
                    Edit
                  </button>
                  <button className="btn btn-outline text-red-600 hover:bg-red-50 hover:border-red-200 text-xs" onClick={() => remove(row.id)}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          data={students}
        />
      </div>

      {editing && (
        <div className="card p-6 bg-slate-50 border-primary/20">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <h2 className="text-lg font-heading font-bold text-slate-900">Edit Student <span className="text-primary">#{editing}</span></h2>
            <button className="text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            {Object.keys(form).map((key) => (
              <div key={key} className="space-y-1.5">
                <label className="label uppercase tracking-widest text-[10px] text-slate-500 !mb-0">{key.replaceAll("_", " ")}</label>
                <input
                  className="input-field"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button className="btn btn-primary px-8" onClick={save}>
              Save Changes
            </button>
            <button className="btn btn-secondary" onClick={() => setEditing(null)}>
              Discard
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
