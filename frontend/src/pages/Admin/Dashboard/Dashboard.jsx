import { FiUsers, FiFileText, FiCheckCircle, FiFlag, FiBell } from "react-icons/fi";
import StatCard from "../../../components/admin/StatCard";
import { mockStats, mockActivities } from "./mockDashboard";

export default function Dashboard() {
  const cards = [
    { title: "Total Users", icon: FiUsers, iconClass: "bg-green-100 text-green-700", ...mockStats.totalUsers },
    { title: "Total Posts", icon: FiFileText, iconClass: "bg-orange-100 text-[#a8523a]", ...mockStats.totalPosts },
    { title: "Published", icon: FiCheckCircle, iconClass: "bg-green-100 text-green-700", ...mockStats.published },
    { title: "Pending Reports", icon: FiFlag, iconClass: "bg-red-100 text-red-600", ...mockStats.pendingReports },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button type="button" title="Thông báo" className="text-gray-600 hover:text-gray-900">
            <FiBell size={20} />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            A
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.title} {...c} />
        ))}
      </div>

      <div className="mt-6 rounded-lg border bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>

        {mockActivities.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">Chưa có hoạt động nào.</p>
        ) : (
          <ul>
            {mockActivities.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between border-b py-3 text-sm last:border-b-0"
              >
                <p>
                  <span className="font-semibold">{a.actor}</span>{" "}
                  {a.action && <span className="text-gray-600">{a.action} </span>}
                  <span className="text-[#a8523a]">{a.target}</span>
                </p>
                <span className="shrink-0 text-xs text-gray-400">{a.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}