import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AccountPage({ token }) {
  const [showInfo, setShowInfo] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  

  // State lưu trữ dữ liệu tạm thời khi đang nhập
  const [editData, setEditData] = useState({
    full_name: '',
    email: ''
  });

  // State cho đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoutOtherDevices, setLogoutOtherDevices] = useState(true);

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Xử lý đổi mật khẩu ở đây
    alert("Đổi mật khẩu thành công!");
    setShowChangePassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };


  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status) {
        setUserInfo(res.data.user);
        // Cập nhật dữ liệu vào form chỉnh sửa
        setEditData({
          full_name: res.data.user.full_name,
          email: res.data.user.email
        });
      }
    } catch (err) {
      console.error("Lỗi tải thông tin tài khoản:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);

 
  const handleSaveInfo = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/profile-update", editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status) {
        alert("Cập nhật thông tin thành công!");
        setIsEditing(false);
        fetchUserData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi cập nhật hồ sơ");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-orange-600">Đang tải dữ liệu...</div>;
  if (!userInfo) return <div className="p-20 text-center">Không tìm thấy thông tin người dùng.</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
      {!showChangePassword && (
        <div className="d-flex justify-content-center align-items-center">
          <h4>Thông tin tài khoản</h4>
        </div>
      )}
      {showInfo && !showChangePassword && (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Họ và tên</label>
            {isEditing ? (
              <input 
                type="text"
                className="w-full px-3 py-2 rounded border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                value={editData.full_name}
                onChange={(e) => setEditData({...editData, full_name: e.target.value})}
              />
            ) : (
              <div className="px-3 py-2 rounded w-full bg-gray-100 border border-gray-200">{userInfo.full_name}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            {isEditing ? (
              <input 
                type="email"
                className="w-full px-3 py-2 rounded border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                value={editData.email}
                onChange={(e) => setEditData({...editData, email: e.target.value})}
              />
            ) : (
              <div className="px-3 py-2 rounded w-full bg-gray-100 border border-gray-200">{userInfo.email}</div>
            )}
          </div>

          <div className='flex justify-end gap-2 mb-6'>
            {isEditing ? (
              <>
                <button 
                  className='bg-gray-400 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-500 transition'
                  onClick={() => setIsEditing(false)}
                >
                  Hủy
                </button>
                <button 
                  className='bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition'
                  onClick={handleSaveInfo}
                >
                  Lưu
                </button>
              </>
            ) : (
              <button 
                className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition'
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </button>
            )}
          </div>
          {!isEditing && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Mật khẩu</label>
              <button
                className="px-3 py-2 rounded w-full bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                onClick={() => setShowChangePassword(true)}
              >
                Đổi mật khẩu
              </button>
            </div>
          )}
        </div>
      )}

      {showChangePassword && (
        <form onSubmit={handleChangePassword} className="animate-fadeIn">
          <h2 className="text-2xl font-bold mb-2">Đổi mật khẩu</h2>
          <input
            type="password"
            className="w-full mb-3 px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Mật khẩu hiện tại"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full mb-3 px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full mb-3 px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        
          <div className="flex gap-3 justify-center mt-4 ">
            <button
              type="button"
              className="px-5 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
              onClick={() => setShowChangePassword(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-blue-400 text-white font-semibold disabled:opacity-60 "
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Đổi mật khẩu
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
