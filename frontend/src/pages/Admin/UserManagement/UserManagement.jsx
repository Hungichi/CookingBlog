import { useState } from "react";
import { FiSearch, FiEye, FiSlash, FiTrash2 } from "react-icons/fi";
import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import { mockUsers } from "./mockUsers";

const avatarColors = ["bg-[#a8523a]", "bg-[#2f4a3a]"];

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [keyword, setKeyword] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.email.toLowerCase().includes(keyword.toLowerCase())
  );

  const toggleStatus = (id) =>
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u
      )
    );

  const removeUser = (id) => {
    if (window.confirm("Xóa người dùng này?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const columns = [
    {
      key: "name",
      label: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium text-white ${
              avatarColors[u.id % 2]
            }`}
          >
            {u.name[0]}
          </div>
          <span className="font-medium">{u.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "posts", label: "Posts" },
    {
      key: "status",
      label: "Status",
      render: (u) => (
        <StatusBadge color={u.status === "Active" ? "green" : "red"}>
          {u.status}
        </StatusBadge>
      ),
    },
    { key: "joined", label: "Joined" },
    {
      key: "actions",
      label: "Actions",
      render: (u) => (
        <div className="flex items-center gap-3 text-gray-500">
          <button title="Xem" className="hover:text-gray-900">
            <FiEye size={16} />
          </button>
          <button title="Khóa / Mở khóa" onClick={() => toggleStatus(u.id)} className="hover:text-gray-900">
            <FiSlash size={16} />
          </button>
          <button title="Xóa" onClick={() => removeUser(u.id)} className="text-red-500 hover:text-red-700">
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-400"
          />
        </div>
      </div>
      <DataTable columns={columns} data={filtered} emptyMessage="Không tìm thấy người dùng" />
    </div>
  );
}