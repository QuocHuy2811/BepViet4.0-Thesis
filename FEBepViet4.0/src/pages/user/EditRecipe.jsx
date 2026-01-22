import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditRecipe = ({ token }) => {
    const { id } = useParams(); // Lấy ID công thức từ URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    // State quản lý toàn bộ dữ liệu form
    const [recipe, setRecipe] = useState({
        title: '',
        description: '',
        region: 'Miền Bắc',
        difficult: 'Dễ',
        cook_time: 30,
        category_id: 1
    });

    const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
    const [steps, setSteps] = useState([{ step_number: 1, content: '' }]);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // 1. Lấy dữ liệu cũ từ API khi vào trang
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                // Giả sử bạn có endpoint lấy chi tiết theo ID hoặc dùng slug cũ
                const res = await axios.get(`http://localhost:8000/api/recipe-edit-data/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.data.status) {
                    const d = res.data.recipe;
                    setRecipe({
                        title: d.title,
                        description: d.description,
                        region: d.region,
                        difficult: d.difficult,
                        cook_time: d.cook_time,
                        category_id: d.category_id
                    });
                    setIngredients(d.ingredients);
                    setSteps(d.steps);
                    setPreviewImage(d.img_path); // Ảnh cũ từ server
                }
            } catch (err) {
                console.error("Lỗi lấy dữ liệu:", err);
                alert("Không thể tải dữ liệu công thức!");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id, token]);

    // 2. Các hàm xử lý thay đổi Input
    const handleAddIngredient = () => setIngredients([...ingredients, { name: '', amount: '' }]);
    const handleAddStep = () => setSteps([...steps, { step_number: steps.length + 1, content: '' }]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    // 3. Gửi dữ liệu cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', recipe.title);
        formData.append('description', recipe.description);
        formData.append('region', recipe.region);
        formData.append('difficult', recipe.difficult);
        formData.append('cook_time', recipe.cook_time);
        
        if (selectedFile) formData.append('img_path', selectedFile);

        // Chuyển mảng thành chuỗi JSON để gửi qua FormData
        formData.append('ingredients', JSON.stringify(ingredients));
        formData.append('steps', JSON.stringify(steps));

        try {
            const res = await axios.post(`http://localhost:8000/api/recipes/update/${id}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data" 
                }
            });
            if (res.data.status) {
                alert("Cập nhật công thức thành công!");
                navigate('/profile');
            }
        } catch (err) {
            alert("Lỗi khi cập nhật!");
        }
    };

    if (loading) return <div className="text-center p-20">Đang tải dữ liệu...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl my-10">
            <h1 className="text-2xl font-bold text-orange-600 mb-6">Chỉnh sửa công thức</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Ảnh đại diện */}
                <div className="flex flex-col items-center border-b pb-6">
                    <img src={previewImage} className="w-64 h-40 object-cover rounded-lg mb-4 border" alt="Preview" />
                    <input type="file" onChange={handleImageChange} className="text-sm" />
                </div>

                {/* Thông tin cơ bản */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Tên món ăn" className="border p-2 rounded" 
                        value={recipe.title} onChange={e => setRecipe({...recipe, title: e.target.value})} required />
                    <input type="number" placeholder="Thời gian nấu (phút)" className="border p-2 rounded" 
                        value={recipe.cook_time} onChange={e => setRecipe({...recipe, cook_time: e.target.value})} />
                </div>

                <textarea placeholder="Mô tả ngắn" className="w-full border p-2 rounded" rows="3"
                    value={recipe.description} onChange={e => setRecipe({...recipe, description: e.target.value})} />

                {/* Nguyên liệu */}
                <div>
                    <h3 className="font-bold mb-2">Nguyên liệu</h3>
                    {ingredients.map((ing, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input type="text" placeholder="Tên nguyên liệu" className="flex-1 border p-2 rounded" 
                                value={ing.name} onChange={e => {
                                    const newIng = [...ingredients];
                                    newIng[index].name = e.target.value;
                                    setIngredients(newIng);
                                }} />
                            <input type="text" placeholder="Lượng" className="w-32 border p-2 rounded" 
                                value={ing.amount} onChange={e => {
                                    const newIng = [...ingredients];
                                    newIng[index].amount = e.target.value;
                                    setIngredients(newIng);
                                }} />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddIngredient} className="text-orange-600 text-sm font-bold">+ Thêm nguyên liệu</button>
                </div>

                {/* Các bước làm */}
                <div>
                    <h3 className="font-bold mb-2">Các bước thực hiện</h3>
                    {steps.map((step, index) => (
                        <div key={index} className="mb-4">
                            <label className="text-sm font-bold">Bước {index + 1}</label>
                            <textarea className="w-full border p-2 rounded" rows="2" 
                                value={step.content} onChange={e => {
                                    const newSteps = [...steps];
                                    newSteps[index].content = e.target.value;
                                    setSteps(newSteps);
                                }} />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddStep} className="text-orange-600 text-sm font-bold">+ Thêm bước làm</button>
                </div>

                <div className="flex gap-4 pt-6">
                    <button type="submit" className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700">Lưu thay đổi</button>
                    <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-200 py-3 rounded-lg font-bold">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default EditRecipe;