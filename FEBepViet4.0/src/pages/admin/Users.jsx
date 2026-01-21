import React, { useEffect, useState } from 'react';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy token từ localStorage để xác thực
    const token = localStorage.getItem("token");

    // Hàm gọi API lấy danh sách user
    const fetchUsers = () => {
        fetch("http://localhost:8000/api/admin/users", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        })
        .then(res => res.json())
        .then(res => {
            if (res.status) {
                setUsers(res.data);
            }
            setLoading(false);
        })
        .catch(err => {
            console.error("Lỗi tải trang:", err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Hàm xử lý Khóa/Mở khóa
    const handleToggleStatus = (userId, currentStatus) => {
        // Nếu đang là 0 (hoạt động) -> Muốn khóa thì gửi 1
        // Nếu đang là 1 (bị khóa) -> Muốn mở thì gửi 0
        const newStatus = currentStatus === 0 ? 1 : 0;
        const confirmMsg = newStatus === 1 ? "Bạn có chắc muốn KHÓA tài khoản này?" : "Bạn có chắc muốn MỞ KHÓA tài khoản này?";

        if (!window.confirm(confirmMsg)) return;

        fetch(`http://localhost:8000/api/admin/users/${userId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(res => res.json())
        .then(res => {
            if (res.status) {
                alert(res.message);
                // Cập nhật lại danh sách user ở máy client (để không phải load lại trang)
                setUsers(users.map(u => {
                    if (u.id === userId) {
                        return { ...u, status: newStatus };
                    }
                    return u;
                }));
            } else {
                alert("Có lỗi xảy ra: " + res.message);
            }
        })
        .catch(err => console.error(err));
    };

    if (loading) return <div>Đang tải danh sách người dùng...</div>;

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý người dùng</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1"></i>
                    Danh sách tài khoản
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Avatar</th>
                                <th scope="col">Tên tài khoản</th>
                                <th scope="col">Tên đầy đủ</th>
                                <th scope="col">Email</th>
                                <th scope="col">Trạng thái</th>
                                <th scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <th scope="row">{user.id}</th>
                                        <td>
                                            <img 
                                                src={user.img_avatar || "https://via.placeholder.com/40"} 
                                                alt="avatar" 
                                                style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}}
                                            />
                                        </td>
                                        <td>{user.username}</td>
                                        <td>{user.full_name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {user.status === 0 ? (
                                                <span className="badge bg-success">Hoạt động</span>
                                            ) : (
                                                <span className="badge bg-danger">Đã khóa</span>
                                            )}
                                        </td>
                                        <td>
                                            {/* Nút bấm thay đổi dựa theo trạng thái hiện tại */}
                                            {user.status === 0 ? (
                                                <button 
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleToggleStatus(user.id, user.status)}
                                                >
                                                    Khóa
                                                </button>
                                            ) : (
                                                <button 
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleToggleStatus(user.id, user.status)}
                                                >
                                                    Mở Khóa
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">Chưa có người dùng nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Users;