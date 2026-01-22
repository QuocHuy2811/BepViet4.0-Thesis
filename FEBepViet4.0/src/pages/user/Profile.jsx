import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ token }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateCookbook, setShowCreateCookbook] = useState(false);
  const [newCookbookName, setNewCookbookName] = useState('');

  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/profile-info", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status) {
        setData(res.data.user);
        setEditBio(res.data.user.bio || '');
        setPreviewAvatar(res.data.user.img_avatar);
      }
    } catch (err) {
      console.error("Lỗi tải hồ sơ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfileData();
  }, [token]);


  const handleSaveProfile = async () => {
    const formData = new FormData();
    formData.append('bio', editBio);
    if (selectedFile) formData.append('img_avatar', selectedFile);

    try {
      const res = await axios.post("http://localhost:8000/api/profile-update", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.data.status) {
        alert("Cập nhật thành công!");
        setShowEditModal(false);
        fetchProfileData();
      }
    } catch (err) {
      alert("Lỗi cập nhật hồ sơ");
    }
  };


  const handleCreateCookbook = async () => {
    if (!newCookbookName.trim()) return;
    try {
      const res = await axios.post("http://localhost:8000/api/cookbooks/create", 
        { name: newCookbookName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status) {
        // 1. Lấy đối tượng Cookbook mới vừa được tạo từ Backend
        const newCookbook = res.data.data; 

        // 2. Cập nhật State để React render lại giao diện ngay lập tức
        setData({
          ...data,
          // Thêm cookbook mới vào cuối danh sách hiện có
          cookbooks: [...data.cookbooks, { ...newCookbook, recipes: [] }], 
          cookbooks_count: (data.cookbooks_count || 0) + 1
        });

        // 3. Reset form và đóng modal
        setNewCookbookName('');
        setShowCreateCookbook(false);
        
        alert("Tạo bộ sưu tập thành công!");
      }
    } catch (err) {
      alert("Lỗi khi tạo bộ sưu tập!");
    }
  };


  const handleDeleteCookbook = async (id) => {
  if (!window.confirm("Bạn có chắc chắn muốn xóa bộ sưu tập này không?")) return;

    try {
      const res = await axios.delete(`http://localhost:8000/api/cookbooks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.status) {
        // Cập nhật State để xóa cookbook khỏi giao diện ngay lập tức
        setData({
          ...data,
          cookbooks: data.cookbooks.filter(cb => cb.id !== id),
          cookbooks_count: data.cookbooks_count - 1
        });
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Lỗi xóa cookbook:", err);
      alert("Không thể xóa bộ sưu tập lúc này!");
    }
  };

  const handleDeleteRecipe = async (id, e) => {
    e.stopPropagation(); // QUAN TRỌNG: Không cho nhảy vào trang chi tiết
    if (!window.confirm("Bạn có chắc muốn xóa công thức này?")) return;
    try {
      const res = await axios.delete(`http://localhost:8000/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status) {
        setData(prev => ({
          ...prev,
          recipes: prev.recipes.filter(r => r.id !== id),
          recipes_count: prev.recipes_count - 1
        }));
        alert(res.data.message);
      }
    } catch (err) {
      alert("Không thể xóa công thức. Vui lòng kiểm tra lại Backend!");
    }
  };

const handleDeleteBlog = async (id) => {
  if (!window.confirm("Bạn có chắc muốn xóa bài viết này không?")) return;
  try {
    const res = await axios.delete(`http://localhost:8000/api/blogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data.status) {
      setData({
        ...data,
        blogs: data.blogs.filter(b => b.id !== id),
        blogs_count: (data.blogs_count || 1) - 1
      });
      alert(res.data.message);
    }
  } catch (err) {
    alert("Không thể xóa bài viết!");
  }
};

  if (loading) return <div className="p-20 text-center font-bold text-orange-600">Đang tải thông tin...</div>;

  return (
    <div className="pb-24 md:pb-0">
      {/* Giao diện Banner & Avatar giữ nguyên */}
      <div className="h-48 bg-gradient-to-r from-orange-400 to-red-500 relative">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
           <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white">
             <img src={data?.img_avatar} alt="Avatar" className="w-full h-full object-cover" />
           </div>
        </div>
      </div>
      
      <div className="pt-20 px-4 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">{data?.full_name}</h1>
        <p className="text-gray-500 mb-4">{data?.bio || "@yeuamthuc • Food Blogger"}</p>
        
        {/* Số liệu thực từ loadCount */}
        <div className="flex justify-center gap-6 mb-8 text-sm">
           <div className="flex flex-col">
             <span className="font-bold text-lg text-gray-800">{data?.recipes_count || 0}</span>
             <span className="text-gray-500">Công thức</span>
           </div>
           <div className="flex flex-col">
             <span className="font-bold text-lg text-gray-800">{data?.followers_count || 0}</span>
             <span className="text-gray-500">Followers</span>
           </div>
           <div className="flex flex-col">
             <span className="font-bold text-lg text-gray-800">{data?.followings_count || 0}</span>
             <span className="text-gray-500">Following</span>
           </div>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-700" onClick={() => setShowEditModal(true)}>Chỉnh sửa</button>
        </div>
            {/* Edit Profile Modal */}
            {showEditModal && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
                  <h3 className="font-bold text-lg mb-4">Chỉnh sửa hồ sơ</h3>
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-24 h-24 rounded-full border-2 border-orange-400 overflow-hidden mb-2">
                      <img src={previewAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        setPreviewAvatar(URL.createObjectURL(file));
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      className="border px-3 py-2 rounded w-full outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Bio..."
                      value={editBio}
                      onChange={e => setEditBio(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button className="bg-orange-600 text-white px-4 py-2 rounded" onClick={handleSaveProfile}>Lưu</button>
                    <button className="text-gray-500 px-4 py-2" onClick={() => setShowEditModal(false)}>Hủy</button>
                  </div>
                </div>
              </div>
            )}
      </div>

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Blog & Review Section */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">Blog & Review</h2>
        {data?.blogs && data.blogs.length > 0 ? (
          <div className="space-y-4">
            {data.blogs.map(blog => (
              <div key={blog.id} className="border rounded-lg bg-white p-4 shadow-md max-w-2xl mx-auto hover:shadow-lg transition-shadow">
              
                {blog.thumbnail && blog.thumbnail !== "null" && (
                  <img src={`http://localhost:8000/storage/${blog.thumbnail}`}  className="w-full rounded-lg mb-3" />
                )}
               
                <h3 className="text-lg font-bold mb-2 text-gray-800">{blog.title}</h3>
                <p className="text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">{blog.content}</p>
                {blog.tags?.length > 0 && (
                  <div className="text-sm text-orange-600 mb-3">
                    {blog.tags.map(t => `#${t.name}`).join(" ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-400 italic mb-10">Bạn chưa đăng blog nào.</p>
        )}



        {/* Recipes posted by user */}
        <h2 className="text-lg font-bold text-gray-800 mb-4 mt-10">Công thức đã đăng</h2>
        {data?.recipes && data.recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.recipes.map(recipe => (
              <div key={recipe.id} onClick={() => navigate(`/recipe/${recipe.slug}`)} className="relative group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex hover:shadow-md transition">
                <button 
                  onClick={(e) => handleDeleteRecipe(recipe.id, e)}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 text-red-500 rounded-full group-hover:opacity-100 transition-opacity z-10 shadow-md hover:bg-red-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <img src={recipe.img_path} alt={recipe.title} className="w-32 h-32 object-cover" />
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">{recipe.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2">{recipe.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <img 
                      src={data?.img_avatar} 
                      alt={data?.full_name} 
                      className="w-5 h-5 rounded-full object-cover" 
                    />
                    <span>{recipe.user?.full_name}</span>
                    <span>•</span>
                    <span>{recipe.region}</span>
                    <span>•</span>
                    <span>{recipe.cook_time} phút</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 italic font-medium">Bạn chưa đăng công thức nào.</p>
          </div>
        )}

        {/* Cookbooks Section */}
        <h2 className="text-lg font-bold text-gray-800 mb-4 mt-12">Bộ sưu tập (Cookbook)</h2>
        <div className="mb-4">
          <button className="bg-orange-600 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-700" onClick={() => setShowCreateCookbook(true)}>Tạo Cookbook mới</button>
        </div>

        {showCreateCookbook && (
          <div className="mb-6 flex gap-2 items-center">
            <input 
              type="text" 
              className="border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-orange-500" 
              placeholder="Tên Cookbook..." 
              value={newCookbookName} 
              onChange={e => setNewCookbookName(e.target.value)} 
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded font-bold" onClick={handleCreateCookbook}>Tạo</button>
            <button className="text-gray-500 px-2" onClick={() => setShowCreateCookbook(false)}>Hủy</button>
          </div>
        )}
        {data?.cookbooks && data.cookbooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {data.cookbooks.map(cb => (
              <div key={cb.id} className="relative group bg-orange-50 rounded-xl p-4 border border-orange-200">
                <button 
                  onClick={() => handleDeleteCookbook(cb.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-full shadow-sm group-hover:opacity-100 transition-opacity hover:bg-red-50 z-20"
                  title="Xóa bộ sưu tập"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="font-bold text-orange-700 text-lg mb-2">{cb.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {cb.recipes?.map(r => (
                    <div key={r.id} onClick={() => navigate(`/recipe/${r.slug}`)} className="bg-white px-2 py-1 rounded text-xs flex items-center gap-1 shadow-sm cursor-pointer hover:bg-orange-100 transition-colors">
                       <img src={r.img_path} className="w-5 h-5 object-cover rounded" alt="" />
                       {r.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-12 text-gray-400 italic">Bạn chưa có bộ sưu tập nào.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;