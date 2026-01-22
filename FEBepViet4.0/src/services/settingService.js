const API_HOST = "http://127.0.0.1:8000";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    // KHÔNG set Content-Type khi dùng FormData
  };
};

export async function getSetting() {
  const res = await fetch(`${API_HOST}/api/settings`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data.data;
}

export async function updateSetting(formData) {
  formData.append("_method", "PUT");
  const res = await fetch(`${API_HOST}/api/settings`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

