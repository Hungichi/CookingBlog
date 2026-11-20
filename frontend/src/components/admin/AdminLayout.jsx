import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiUsers, FiFileText, FiMessageSquare, FiFlag } from "react-icons/fi";

const menu = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/users", label: "Users", icon: FiUsers },
  { to: "/admin/posts", label: "Posts", icon: FiFileText },
  { to: "/admin/comments", label: "Comments", icon: FiMessageSquare },
  { to: "/admin/reports", label: "Reports", icon: FiFlag },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-56 shrink-0 bg-neutral-900 p-4 text-gray-300">
        <div className="px-3 pb-6 text-lg font-bold text-white">Admin Panel</div>
        <nav className="space-y-1">
          {menu.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  isActive ? "bg-neutral-700 text-white" : "hover:bg-neutral-800"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-end border-b bg-white px-6 text-sm text-gray-600">
          Xin chào, Admin
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}