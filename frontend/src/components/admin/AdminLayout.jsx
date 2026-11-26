import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiUsers, FiFileText, FiMessageSquare, FiFlag, FiSettings } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";

const menu = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/users", label: "Users", icon: FiUsers },
  { to: "/admin/posts", label: "Posts", icon: FiFileText },
  { to: "/admin/comments", label: "Comments", icon: FiMessageSquare },
  { to: "/admin/reports", label: "Reports", icon: FiFlag },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
    isActive
      ? "bg-neutral-700 text-white"
      : "text-gray-400 hover:bg-neutral-800 hover:text-gray-200"
  }`;

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-body text-[#1a1a1a]">

      <aside className="flex w-56 shrink-0 flex-col bg-neutral-900 p-4">
        <div className="mb-6 flex items-center gap-2 px-3">
          <LuChefHat size={20} className="text-primary" />
          <span className="font-heading text-lg font-bold text-white">Admin Panel</span>
        </div>

        <nav className="space-y-1">
          {menu.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="my-4 border-t border-neutral-700" />

        <div
          title="Chưa làm"
          className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-500"
        >
          <FiSettings size={18} />
          Settings
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-8 [&_h1]:font-heading [&_h1]:text-3xl [&_h1]:font-bold">
        <Outlet />
      </main>
    </div>
  );
}