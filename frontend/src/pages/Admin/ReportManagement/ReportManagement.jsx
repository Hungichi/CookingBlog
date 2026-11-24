import { useState } from "react";
import { FiEye, FiCheck, FiX } from "react-icons/fi";
import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import FilterTabs from "../../../components/admin/FilterTabs";
import { mockReports } from "./mockReports";

const TABS = ["All", "Pending", "Resolved", "Dismissed"];
const statusColor = { Pending: "yellow", Resolved: "green", Dismissed: "gray" };

export default function ReportManagement() {
  const [reports, setReports] = useState(mockReports);
  const [tab, setTab] = useState("All");

  const filtered = tab === "All" ? reports : reports.filter((r) => r.status === tab);

  const updateStatus = (id, status) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const viewReport = (id) => {
    console.log("View report", id);
  };

  const columns = [
    { key: "content", label: "Content" },
    { key: "reporter", label: "Reporter" },
    { key: "reason", label: "Reason" },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge color={statusColor[r.status]}>{r.status}</StatusBadge>,
    },
    { key: "date", label: "Date" },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div className="flex items-center gap-3">
          <button type="button" title="Xem" onClick={() => viewReport(r.id)}
            className="text-gray-500 hover:text-gray-800">
            <FiEye />
          </button>
          {r.status === "Pending" && (
            <>
              <button type="button" title="Xử lý (Resolve)"
                onClick={() => updateStatus(r.id, "Resolved")}
                className="text-green-600 hover:text-green-700">
                <FiCheck />
              </button>
              <button type="button" title="Bỏ qua (Dismiss)"
                onClick={() => updateStatus(r.id, "Dismissed")}
                className="text-red-600 hover:text-red-700">
                <FiX />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Report Management</h1>
        <FilterTabs options={TABS} value={tab} onChange={setTab} />
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="Không có báo cáo nào." />
    </div>
  );
}