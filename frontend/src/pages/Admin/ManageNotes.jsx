import { useEffect, useState } from "react";
import { FileCheck2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import { approveNote, fetchAllNotesAdmin, rejectNote, removeNote } from "../../services/adminService";

export default function ManageNotes() {
  const [notes, setNotes] = useState([]);
  const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:5000";
  const buildFileUrl = (url) => (url?.startsWith("http") ? url : `${backendOrigin}${url}`);

  const load = async () => {
    const res = await fetchAllNotesAdmin();
    setNotes(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handle = async (id, action) => {
    if (action === "approve") await approveNote(id);
    if (action === "reject") await rejectNote(id);
    if (action === "delete") await removeNote(id);
    load();
  };

  const renderStatus = (status) => {
    if (status === "approved") return <span className="badge badge-primary bg-primary/10 text-primary border-primary/20">Approved</span>;
    if (status === "rejected") return <span className="badge badge-danger">Rejected</span>;
    return <span className="badge badge-warning">Pending Review</span>;
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-title">Manage Notes</h1>
        <p className="page-subtitle">Review student uploads, approve quality content, and remove invalid files.</p>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <FileCheck2 size={20} />
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900">Notes Moderation Queue</h2>
        </div>

        <DataTable
          columns={[
            { label: "Title", accessor: "title", className: "font-semibold text-slate-900" },
            { 
              label: "Subject", 
              render: (row) => <span className="badge badge-neutral bg-slate-100">{row.subject}</span> 
            },
            { 
              label: "Uploader", 
              render: (row) => <div className="text-sm font-medium text-slate-600">{row.uploaded_by_name}</div>
            },
            { label: "Status", render: (row) => renderStatus(row.status) },
            {
              label: "Actions",
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <a className="btn btn-outline text-xs" href={buildFileUrl(row.file_url)} target="_blank" rel="noreferrer">
                    View File
                  </a>
                  {row.status !== "approved" && (
                    <button className="btn btn-primary text-xs" onClick={() => handle(row.id, "approve")}>
                      Approve
                    </button>
                  )}
                  {row.status !== "rejected" && (
                    <button className="btn btn-secondary text-xs" onClick={() => handle(row.id, "reject")}>
                      Reject
                    </button>
                  )}
                  <button className="btn btn-outline text-red-600 hover:bg-red-50 hover:border-red-200 text-xs" onClick={() => handle(row.id, "delete")}>
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          data={notes}
        />
      </div>
    </DashboardLayout>
  );
}
