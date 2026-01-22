import api from "./api";

export function getBlogs() {
  return api.get("/blogs");
}

export function createBlog({ user_id, title, content, tags, thumbnail }) {
  const fd = new FormData();
  fd.append("user_id", user_id);
  fd.append("title", title);
  fd.append("content", content);
  fd.append("status", "published");
  fd.append("tags", tags || "");
  if (thumbnail) fd.append("thumbnail", thumbnail);

  return api.post(`/blogs`, fd);
}
export function updateBlog(id, { title, content, tags, thumbnail, status = "published" }) {
  const fd = new FormData();
  fd.append("_method", "PUT"); 
  fd.append("title", title);
  fd.append("content", content);
  fd.append("status", status);
  fd.append("tags", tags || "");
  if (thumbnail) fd.append("thumbnail", thumbnail);

  return api.post(`/blogs/${id}`, fd);
}

export function deleteBlog(id) {
  return api.delete(`/blogs/${id}`);
}
