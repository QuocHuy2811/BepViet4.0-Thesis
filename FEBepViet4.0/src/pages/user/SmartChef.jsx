import React, { useState } from 'react';
import getRecipeSuggestions from '../../services/geminiService';
import { useEffect } from 'react';
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
      const result = await getRecipeSuggestions(ingredients);
      setSuggestions(result);
    } catch (e) {
      console.error(e);
      // Hiển thị thông báo lỗi chi tiết hơn
      if (e.message.includes('Lỗi kết nối Gemini API')) {
         setError('Server không thể kết nối tới Google Gemini. Vui lòng kiểm tra API Key hoặc Console log để xem chi tiết.');
      } else {
         setError(e.message || 'Có lỗi xảy ra khi kết nối với đầu bếp AI.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 md:pb-0">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 md:py-6">
           <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-3 mb-2">
             <span className="text-4xl">👨‍🍳</span> AI Smart Chef
           </h1>
           <p className="text-gray-500 text-sm md:text-base">Nhập nguyên liệu bạn có, AI sẽ thiết kế thực đơn chi tiết cho bạn.</p>
           
           {/* Input Area */}
           <div className="mt-6 relative max-w-2xl">
              <div className="relative">
                <input 
                  type="text" 
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSuggest()}
                  placeholder="Ví dụ: thịt heo, bắp cải, cà chua..." 
                  className="w-full pl-5 pr-32 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-inner text-gray-700 font-medium"
                />
                <button 
                  onClick={handleSuggest}
                  disabled={loading || !ingredients.trim()}
                  className="absolute right-2 top-2 bottom-2 bg-orange-600 hover:bg-orange-700 text-white px-6 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Gợi ý <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                    </>
                  )}
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* Result Section */}
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 text-center animate-fade-in">
             <div className="font-bold mb-1">⚠️ Đã xảy ra lỗi</div>
             <div>{error}</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && suggestions.length === 0 && !error && (
           <div className="text-center py-20 opacity-50">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-4xl">🥗</span>
              </div>
              <p className="text-gray-500 font-medium">Hãy nhập nguyên liệu để bắt đầu nấu ăn!</p>
           </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
           <div className="space-y-8 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                   <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                   <div className="grid md:grid-cols-3 gap-8">
                      <div className="h-48 bg-gray-100 rounded-2xl col-span-1"></div>
                      <div className="col-span-2 space-y-3">
                         <div className="h-4 bg-gray-100 rounded w-full"></div>
                         <div className="h-4 bg-gray-100 rounded w-full"></div>
                         <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        )}

        {/* Suggestions List */}
        <div className="space-y-10">
          {suggestions.map((recipe, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Card Header */}
              <div className="p-6 md:p-8 border-b border-gray-100">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">{recipe.name}</h2>
                    <div className="flex items-center gap-2">
                       <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wide">
                          {recipe.difficulty}
                       </span>
                       <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                          {recipe.cookingTime}
                       </span>
                    </div>
                 </div>
                 <p className="text-gray-600 italic">{recipe.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8">
                 <div className="grid md:grid-cols-12 gap-8">
                    
                    {/* Left Column: Ingredients */}
                    <div className="md:col-span-5 lg:col-span-4">
                       <div className="bg-gray-50/80 rounded-2xl p-6 h-full border border-gray-100">
                          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                             <span className="bg-green-100 p-1.5 rounded-lg text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                             </span>
                             Nguyên liệu
                          </h3>
                          <ul className="space-y-3">
                             {recipe.ingredients.map((ing, i) => (
                                <li key={i} className="flex justify-between items-center text-sm group">
                                   <span className="text-gray-700 font-medium group-hover:text-orange-600 transition-colors">{ing.name}</span>
                                   <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-xs text-gray-500 font-mono shadow-sm whitespace-nowrap ml-2">
                                     {ing.quantity}
                                   </span>
                                </li>
                             ))}
                          </ul>
                       </div>
                    </div>

                    {/* Right Column: Steps */}
                    <div className="md:col-span-7 lg:col-span-8">
                       <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="bg-orange-100 p-1.5 rounded-lg text-orange-600">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                             </svg>
                          </span>
                          Cách làm
                       </h3>
                       <div className="space-y-6">
                          {recipe.steps.map((step, i) => (
                             <div key={i} className="flex gap-4 group">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                   {i + 1}
                                </div>
                                <div className="pt-1">
                                   <p className="text-gray-700 leading-relaxed text-sm md:text-base">{step}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                       
                       <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                             </svg>
                             Thêm công thức yêu thích
                          </button>
                       </div>
                    </div>

                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SmartChef;