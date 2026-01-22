import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectRoute({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/admin/dang-nhap");
      return;
    }

    fetch("http://localhost:8000/api/nguoi-dung", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        if ( result.role !== "admin") {
          navigate("/admin/dang-nhap");
        }
      })
  }, [navigate, token]);

  if (loading) {
    return <div>Đang kiểm tra quyền truy cập</div>;
  }

  return children;
}

export default ProtectRoute;