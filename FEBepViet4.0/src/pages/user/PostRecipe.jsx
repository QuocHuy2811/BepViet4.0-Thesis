import React, { useState, useEffect } from 'react'; // Thêm useEffect
import { useNavigate } from 'react-router-dom';

const PostRecipe = () => {
  const navigate = useNavigate();

  // State chứa danh sách danh mục lấy từ API
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cook_time: '',
    difficult: 'Dễ',
    region: 'Bắc',
    hashtags: '',
    category_id: '' // <--- Thêm trường này (quan trọng)
  });

  const [mainImage, setMainImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', note: '' }]);
  const [steps, setSteps] = useState([{ stepNumber: 1, content: '', image: null, preview: null }]);

  // --- 1. GỌI API LẤY DANH MỤC KHI VÀO TRANG ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          // Mặc định chọn danh mục đầu tiên nếu có
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, category_id: data[0].id }));
          }
        }
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // --- XỬ LÝ INPUT ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ... (Giữ nguyên các hàm xử lý ảnh, nguyên liệu, các bước như cũ) ...
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const addIngredient = () => setIngredients([...ingredients, { name: '', amount: '', note: '' }]);
  const removeIngredient = (index) => {
    const newIng = [...ingredients];
    newIng.splice(index, 1);
    setIngredients(newIng);
  };
  const updateIngredient = (index, field, value) => {
    const newIng = [...ingredients];
    newIng[index] = { ...newIng[index], [field]: value };
    setIngredients(newIng);
  };

  const handleStepImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newSteps = [...steps];
      // Lưu file thực để gửi lên server
      newSteps[index].image = file;
      // Tạo URL preview để hiển thị
      newSteps[index].preview = URL.createObjectURL(file);
      setSteps(newSteps);
    }
  };
  const addStep = () => {
    setSteps([...steps, {
      stepNumber: steps.length + 1,
      content: '',
      image: null,
      preview: null
    }]);
  };
  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].content = value;
    setSteps(newSteps);
  };

  // --- SUBMIT FORM ---
  const handleSubmit = async () => {
    // 1. KIỂM TRA ĐĂNG NHẬP
    // Lấy token từ localStorage (hoặc nơi bạn lưu khi login)
    const token = localStorage.getItem('token');

    if (!token) {
      alert("Vui lòng đăng nhập để đăng công thức!");
      // navigate('/login'); // Bỏ comment nếu muốn chuyển hướng sang trang login
      return;
    }

    // 2. VALIDATE DỮ LIỆU CƠ BẢN
    if (!formData.title || !formData.description) {
      alert("Vui lòng nhập tên món và mô tả!");
      return;
    }

    // 3. TẠO FORM DATA
    const data = new FormData();
    // Append thông tin chung
    data.append('category_id', formData.category_id);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('cook_time', formData.cook_time);
    data.append('difficult', formData.difficult);
    data.append('region', formData.region);
    data.append('hashtags', formData.hashtags);

    // Append ảnh đại diện (nếu có)
    if (mainImage) {
      data.append('image', mainImage);
    }

    // Append Nguyên liệu
    ingredients.forEach((ing, index) => {
      data.append(`ingredients[${index}][name]`, ing.name);
      data.append(`ingredients[${index}][amount]`, ing.amount);
      data.append(`ingredients[${index}][note]`, ing.note);
    });

    // Append Các bước & Ảnh của bước
    steps.forEach((step, index) => {
      data.append(`steps[${index}][stepNumber]`, step.stepNumber);
      data.append(`steps[${index}][content]`, step.content);

      // Nếu bước này có ảnh thì gửi kèm
      if (step.image) {
        data.append(`steps[${index}][image]`, step.image);
      }
    });

    // 4. GỬI REQUEST
    try {
      const response = await fetch('http://127.0.0.1:8000/api/recipes', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` // <--- QUAN TRỌNG: Gửi kèm Token
        },
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        alert("Đăng công thức thành công!");
        navigate('/'); // Chuyển về trang chủ
      } else {
        // Xử lý các lỗi thường gặp
        if (response.status === 401) {
          alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        } else {
          alert("Lỗi: " + (result.message || "Không thể đăng bài"));
        }
      }

    } catch (error) {
      console.error("Lỗi mạng:", error);
      alert("Có lỗi xảy ra khi kết nối tới server.");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-24 md:pb-0">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-3xl">📝</span> Đăng công thức mới
      </h1>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Thông tin chung</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên món ăn <span className="text-red-500">*</span></label>
              <input name="title" value={formData.title} onChange={handleInputChange} type="text" className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-orange-500" placeholder="Ví dụ: Phở Bò" />
            </div>

            {/* --- SELECT BOX DANH MỤC MỚI --- */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục món ăn</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg p-3 bg-white outline-none focus:border-orange-500"
              >
                {categories.length === 0 && <option>Đang tải danh mục...</option>}
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            {/* ------------------------------- */}

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hashtag</label>
              <input name="hashtags" value={formData.hashtags} onChange={handleInputChange} type="text" className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-orange-500" placeholder="#phobo, #ngon" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả hấp dẫn</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 h-24 outline-none focus:border-orange-500" placeholder="Mô tả món ăn..."></textarea>
            </div>

            {/* Phần Upload ảnh giữ nguyên */}
            <div className='md:col-span-2 mb-3'>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh đại diện</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer h-full flex flex-col items-center justify-center relative">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="h-32 object-cover rounded-lg mb-2" />
                ) : (
                  <p className="text-xs text-gray-500">Tải ảnh lên</p>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 md:col-span-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
                <input name="cook_time" value={formData.cook_time} onChange={handleInputChange} type="number" className="w-full border border-gray-200 rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Độ khó</label>
                <select name="difficult" value={formData.difficult} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 bg-white">
                  <option value="Dễ">Dễ</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Khó">Khó</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vùng miền</label>
                <select name="region" value={formData.region} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 bg-white">
                  <option value="Bắc">Miền Bắc</option>
                  <option value="Trung">Miền Trung</option>
                  <option value="Nam">Miền Nam</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Thành phần nguyên liệu</h2>
          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <input className="flex-1 border border-gray-200 rounded-lg p-2" placeholder="Tên" value={ing.name} onChange={(e) => updateIngredient(idx, 'name', e.target.value)} />
                <input className="w-24 border border-gray-200 rounded-lg p-2" placeholder="Lượng" value={ing.amount} onChange={(e) => updateIngredient(idx, 'amount', e.target.value)} />
                <button onClick={() => removeIngredient(idx)} className="text-red-500 p-2">X</button>
              </div>
            ))}
            <button onClick={addIngredient} className="text-orange-600 font-medium">+ Thêm nguyên liệu</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">Các bước thực hiện</h2>

          {steps.map((step, idx) => (
            <div key={idx} className="relative pl-8 border-l-2 border-orange-100 mb-6">
              {/* Số thứ tự */}
              <div className="absolute -left-2.5 top-0 bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                {step.stepNumber}
              </div>

              {/* Nội dung bước */}
              <div className="mb-3">
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-orange-500"
                  placeholder={`Mô tả chi tiết bước ${step.stepNumber}...`}
                  rows={3}
                  value={step.content}
                  onChange={(e) => updateStep(idx, e.target.value)}
                ></textarea>
              </div>

              {/* --- KHU VỰC ẢNH CỦA BƯỚC --- */}
              <div className="flex items-start gap-4">
                {/* Nút chọn ảnh */}
                <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  {step.preview ? 'Đổi ảnh' : 'Thêm ảnh minh họa'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleStepImageChange(idx, e)}
                  />
                </label>

                {/* Hiển thị ảnh Preview nếu có */}
                {step.preview && (
                  <div className="relative group">
                    <img
                      src={step.preview}
                      alt={`Bước ${step.stepNumber}`}
                      className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                    />
                    {/* Nút xóa ảnh (nếu muốn làm kỹ hơn) */}
                  </div>
                )}
              </div>
            </div>
          ))}

          <button onClick={addStep} className="w-full py-2 bg-orange-50 text-orange-600 rounded-xl font-medium hover:bg-orange-100 transition-colors">
            + Thêm bước thực hiện
          </button>
        </div>

        <button onClick={handleSubmit} className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 shadow-lg">Đăng công thức</button>
      </div>
    </div>
  );
};

export default PostRecipe;