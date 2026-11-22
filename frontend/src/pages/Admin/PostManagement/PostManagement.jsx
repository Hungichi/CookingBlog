import { useState } from "react";
import { FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";
import DataTable from "../../../components/admin/DataTable";
import StatusBadge from "../../../components/admin/StatusBadge";
import FilterTabs from "../../../components/admin/FilterTabs";
import { mockPosts } from "./mockPosts";

const TABS = ["All", "Published", "Draft", "Archived"];

// Màu cho StatusBadge (green / yellow / red / gray)
const statusColor = { Published: "green", Draft: "yellow", Archived: "gray" };
const typeColor = { Recipe: "red", Story: "gray" };

export default function PostManagement() {
  const [posts, setPosts] = useState(mockPosts);
  const [tab, setTab] = useState("All");

  const filtered = tab === "All" ? posts : posts.filter((p) => p.status === tab);

  // Ẩn bài = chuyển sang Archived; bấm lần nữa để hiện lại (Published)
  const toggleHidden = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Archived" ? "Published" : "Archived" }
          : p
      )
    );
  };

  const deletePost = (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const viewPost = (id) => {
    // TODO: chuyển tới trang chi tiết bài viết khi có route, ví dụ navigate(`/posts/${id}`)
    console.log("View post", id);
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    {
      key: "type",
      label: "Type",
      render: (p) => <StatusBadge color={typeColor[p.type]}>{p.type}</StatusBadge>,
    },
    {
      key: "status",
      label: "Status",
      render: (p) => <StatusBadge color={statusColor[p.status]}>{p.status}</StatusBadge>,
    },
    { key: "date", label: "Date" },
    {
      key: "actions",
      label: "Actions",
      render: (p) => (
        <div className="flex items-center gap-3">
          <button type="button" title="Xem" onClick={() => viewPost(p.id)}
            className="text-gray-500 hover:text-gray-800">
            <FiEye />
          </button>
          <button type="button" title={p.status === "Archived" ? "Hiện lại" : "Ẩn"}
            onClick={() => toggleHidden(p.id)}
            className="text-gray-500 hover:text-gray-800">
            {p.status === "Archived" ? <FiEye /> : <FiEyeOff />}
          </button>
          <button type="button" title="Xóa" onClick={() => deletePost(p.id)}
            className="text-red-600 hover:text-red-700">
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Post Management</h1>
        <FilterTabs options={TABS} value={tab} onChange={setTab} />
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="Không có bài viết nào." />
    </div>
  );
}