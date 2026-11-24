import { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import StatusBadge from "../../../components/admin/StatusBadge";
import { mockComments } from "./mockComments";

const statusColor = { Approved: "green", Reported: "red", Hidden: "gray" };

export default function CommentModeration() {
  const [comments, setComments] = useState(mockComments);

  const updateStatus = (id, status) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const removeComment = (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bình luận này?")) return;
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Comment Moderation</h1>

      {comments.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">Không có bình luận nào.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const reported = c.status === "Reported";
            return (
              <div
                key={c.id}
                className={`rounded-lg border bg-white p-5 ${
                  reported ? "border-red-500" : "border-gray-200"
                }`}
              >
                {/* Hàng trên: avatar, tên, bài viết, trạng thái */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ${
                        reported ? "bg-[#b23b3b]" : "bg-[#2f4a3a]"
                      }`}
                    >
                      {c.user.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold">{c.user}</span>
                    <span className="text-xs text-gray-400">on</span>
                    <span className="text-sm text-[#a8523a]">{c.post}</span>
                  </div>
                  <StatusBadge color={statusColor[c.status]}>{c.status}</StatusBadge>
                </div>

                {/* Nội dung */}
                <p className={`mt-3 text-sm ${c.status === "Hidden" ? "text-gray-400 italic" : "text-gray-700"}`}>
                  {c.content}
                </p>

                {/* Nút hành động */}
                {reported ? (
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => updateStatus(c.id, "Approved")}
                      className="flex items-center gap-1 rounded-md bg-green-700 px-4 py-1.5 text-xs font-medium text-white hover:bg-green-800"
                    >
                      <FiCheck /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => removeComment(c.id)}
                      className="flex items-center gap-1 rounded-md bg-red-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                    >
                      <FiX /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex gap-4 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(c.id, c.status === "Hidden" ? "Approved" : "Hidden")
                      }
                      className="text-gray-500 hover:text-gray-800"
                    >
                      {c.status === "Hidden" ? "Show" : "Hide"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeComment(c.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}