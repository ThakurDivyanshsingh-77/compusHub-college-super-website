export default function DataTable({ columns, data = [] }) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50">
            {columns.map((col) => (
              <th key={col.accessor || col.label} className={`th ${col.className || ""}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 && (
            <tr>
              <td className="p-8 text-sm text-slate-500 text-center" colSpan={columns.length}>
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <p>No data found</p>
                </div>
              </td>
            </tr>
          )}
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="tr group">
              {columns.map((col) => (
                <td key={col.accessor || col.label} className={`td ${col.className || ""}`}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
