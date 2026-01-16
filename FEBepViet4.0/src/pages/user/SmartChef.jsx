import React, { useState } from 'react';
import { getRecipeSuggestions } from "../../services/geminiService";

// Giả lập hàm service để bạn dễ hình dung (bạn cứ dùng file service cũ của bạn)

const SmartChef = () => {
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const handleSuggest = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      // Đảm bảo service trả về mảng đúng
      const result = await getRecipeSuggestions(ingredients);
      
      if (Array.isArray(result) && result.length > 0) {
          setSuggestions(result);
      } else {
          setError('AI không tìm thấy công thức phù hợp hoặc lỗi định dạng dữ liệu.');
      }
    } catch (e) {
      console.error(e); // Log lỗi ra console để dev xem
      setError('Có lỗi xảy ra khi kết nối với đầu bếp AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 pb-24 md:pb-0">
       {/* ... Phần Header giữ nguyên ... */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white rounded-b-[2rem] shadow-xl">
        <div className="max-w-2xl mx-auto text-center">
            {/* ... SVG Icon ... */}
          <h1 className="text-3xl font-bold mb-2">Hôm nay ăn gì?</h1>
          <p className="text-orange-100 mb-6">Nhập nguyên liệu bạn có (Ví dụ: Trứng, cà chua), AI sẽ gợi ý món ngon!</p>
          
          <div className="bg-white rounded-2xl p-2 shadow-lg flex gap-2">
            <input 
              type="text" 
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSuggest()}
              placeholder="Ví dụ: thịt gà, sả, ớt..." 
              className="flex-1 px-4 py-3 text-gray-800 outline-none rounded-xl"
            />
            <button 
              onClick={handleSuggest}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors disabled:opacity-70 flex items-center gap-2 min-w-[120px] justify-center"
            >
              {loading ? (
                 <>
                   <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                   <span>Đợi xíu...</span>
                 </>
              ) : 'Gợi ý'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 text-center">
            {error}
          </div>
        )}

        {suggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{item.name || 'Món ăn không tên'}</h3>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                    ⏱ {item.cookingTime || 'N/A'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                
                <div className="bg-orange-50 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-orange-800 uppercase tracking-wide mb-2">Lý do phù hợp:</p>
                  <p className="text-sm text-orange-700 italic">{item.reason}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nguyên liệu:</p>
                  <div className="flex flex-wrap gap-2">
                    {/* Kiểm tra item.ingredients có phải mảng không trước khi map */}
                    {Array.isArray(item.ingredients) ? item.ingredients.map((ing, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
                        {ing}
                      </span>
                    )) : <span className="text-xs text-gray-400">Không có thông tin</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && (
           // Placeholder khi chưa có dữ liệu (giữ nguyên của bạn là đẹp rồi)
          <div className="text-center text-gray-400 mt-12">
            <p>Chưa có gợi ý nào. Hãy nhập nguyên liệu để bắt đầu!</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default SmartChef;