import { useEffect, useState } from "react";
import { getSetting, updateSetting } from "../../services/settingService";

function Setting() {
  const [footer, setFooter] = useState("");
  const [gmail, setGmail] = useState("");
  const [phone, setPhone] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getSetting();
        setFooter(data?.footer || "");
        setGmail(data?.gmail || "");
        setPhone(data?.phone || "");
      } catch (err) {
        if (err?.errors) {
          const all = Object.values(err.errors).flat().join(" | ");
          setError(all || "Không tải được cài đặt");
        } else {
          setError(err?.message || "Không tải được cài đặt");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // required cơ bản phía FE
    if (!logoFile) return setError("Logo là bắt buộc");
    if (!footer.trim()) return setError("Nội dung footer là bắt buộc");
    if (!gmail.trim()) return setError("Gmail là bắt buộc");
    if (!phone.trim()) return setError("Phone là bắt buộc");

    const fd = new FormData();
    fd.append("logo", logoFile);
    fd.append("footer", footer);
    fd.append("gmail", gmail);
    fd.append("phone", phone);

    try {
      setSaving(true);
      const res = await updateSetting(fd);
      setSuccess(res?.message || "Lưu cài đặt thành công");
    } catch (err) {
      if (err?.errors) {
        const all = Object.values(err.errors).flat().join(" | ");
        setError(all || "Dữ liệu không hợp lệ");
      } else {
        setError(err?.message || "Lưu thất bại");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h1 className="mt-2">Quản lý cài đặt</h1>

      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card w-75 shadow-sm">
          <div className="card-header">
            <h4 className="text-center mb-0">Cài đặt</h4>
          </div>

          <div className="card-body">
            {loading && (
              <div className="alert alert-secondary mb-3" role="alert">
                Đang tải dữ liệu...
              </div>
            )}

            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success mb-3" role="alert">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Logo</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
                
              </div>

              <div className="mb-3">
                <label className="form-label">Nội dung footer</label>
                <input
                  type="text"
                  className="form-control"
                  value={footer}
                  onChange={(e) => setFooter(e.target.value)}
                  placeholder="VD: © 2026 Bếp Việt 4.0"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Gmail</label>
                <input
                  type="email"
                  className="form-control"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  placeholder="VD: support@gmail.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="VD: 0909xxxxxx"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Setting;
