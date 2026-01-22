import React, { useEffect, useState } from "react";
import { createBlog, getBlogs, updateBlog, deleteBlog } from "../../services/blogService";

const API_HOST = "http://localhost:8000";

export default function BlogFeed() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [msg, setMsg] = useState(""); 

  const user_id = Number(localStorage.getItem("user_id") || 1);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getBlogs();
      setBlogs(res?.data?.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  const reset = () => {
    setEditingId(null);
    setForm({ title: "", content: "", tags: "" });
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setMsg("");
  };

  const openCreate = () => { 
    reset(); 
    setOpen(true); 
  };

  const openEdit = (b) => {
    reset();
    setEditingId(b.id);
    setForm({
      title: b.title || "",
      content: b.content || "",
      tags: Array.isArray(b.tags) ? b.tags.map(t => t.name).join(",") : "",
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!form.title.trim() || !form.content.trim()) {
      setMsg("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }

    try {
      const payload = {
        user_id,
        title: form.title.trim(),
        content: form.content.trim(),
        tags: form.tags.trim(),
        thumbnail: file,
        status: "published",
      };

      if (editingId) await updateBlog(editingId, payload);
      else await createBlog(payload);

      await load();
      setOpen(false);
      reset();
    } catch (err) {
      const text =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join("\n")
          : "Có lỗi xảy ra");
      setMsg(text);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Xóa blog này?")) return;
    try {
      await deleteBlog(id);
      await load();
    } catch {
      alert("Bạn không có quyền xóa bài viết này");
    }
  };

  const pickFile = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Góc Chia Sẻ & Review</h1>
        <button className="bg-orange-600 text-white px-4 py-2 rounded" onClick={openCreate}>
          Viết Blog
        </button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : blogs.length === 0 ? (
        <div className="text-gray-500">Không có bài viết nào.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((b) => (
            <div key={b.id} className="border rounded-xl bg-white overflow-hidden">
              {b.thumbnail && b.thumbnail !== "null" && (
                <img src={`${API_HOST}/storage/${b.thumbnail}`} alt="" className="w-full h-48 object-cover" />
              )}

              <div className="p-4">
                <div className="font-bold">{b.title}</div>
                <div className="text-sm text-gray-600 mt-1">{b.content}</div>

                {b.tags?.length > 0 && (
                  <div className="text-sm text-orange-600 mt-2">
                    {b.tags.map(t => t.name).join(" ")}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <button className="px-3 py-1 bg-gray-100 rounded" onClick={() => openEdit(b)}>Sửa</button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => del(b.id)}>Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
            <button className="absolute top-3 right-3 text-xl" onClick={() => setOpen(false)}>&times;</button>

            <h2 className="text-lg font-bold mb-4">{editingId ? "Sửa blog" : "Tạo blog"}</h2>

            <form className="space-y-3" onSubmit={save}>
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Tiêu đề"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <textarea
                className="w-full border rounded px-3 py-2"
                rows={5}
                placeholder="Nội dung"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />

              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Tags (dấu phẩy)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />

              <input type="file" accept="image/*" onChange={pickFile} className="w-full border rounded px-3 py-2" />
              {preview && <img src={preview} alt="" className="w-full h-40 object-cover rounded" />}

              {msg && <div className="text-red-600 text-sm whitespace-pre-line">{msg}</div>}

              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 bg-gray-100 rounded" onClick={() => setOpen(false)}>
                  Đóng
                </button>
                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
