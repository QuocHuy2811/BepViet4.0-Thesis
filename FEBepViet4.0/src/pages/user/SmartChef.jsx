import React, { useState } from 'react';
import getRecipeSuggestions from '../../services/geminiService';

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
      console.log(result);
      setSuggestions(result.recipes);
    } catch (e) {
      console.error(e);
      if (e.message.includes('Lỗi kết nối Gemini API')) {
         setError('Không thể kết nối tới đầu bếp AI');
      } else {
         setError(e.message || 'Có lỗi xảy ra khi kết nối với đầu bếp AI.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7ed] pb-24 md:pb-0 font-sans">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 relative overflow-hidden rounded-b-[2.5rem] shadow-lg">
         {/* Decorative elements */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 rounded-full bg-yellow-300 blur-3xl"></div>
         </div>

         <div className="max-w-4xl mx-auto px-4 pt-12 pb-20 text-center relative z-10">
            {/* Sparkle Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6 text-white shadow-inner ring-1 ring-white/30 animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 00-1.423 1.423z" />
               </svg>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-sm">Hôm nay ăn gì?</h1>
            <p className="text-orange-50 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed opacity-90 mb-10">
               Nhập nguyên liệu bạn có trong tủ lạnh, AI sẽ gợi ý món ngon!
            </p>

            {/* Input Section - Inside Header */}
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-2.5 flex items-center border-4 border-white/20 transition-transform hover:-translate-y-1 duration-300">
                    <input 
                    type="text" 
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSuggest()}
                    placeholder="Ví dụ: thịt gà, sả, ớt, gừng..." 
                    className="flex-1 py-4 px-6 outline-none text-gray-700 text-lg placeholder-gray-400 bg-transparent"
                    />
                    <button 
                    onClick={handleSuggest}
                    disabled={loading || !ingredients.trim()}
                    className="bg-[#ea580c] hover:bg-orange-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed shrink-0 text-base"
                    >
                    {loading ? <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div> : 'Gợi ý'}
                    </button>
                </div>
            </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto p-4 md:p-8 mt-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-8 text-center animate-fade-in shadow-sm max-w-2xl mx-auto">
             <div className="font-bold mb-1 flex justify-center items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                Đã xảy ra lỗi
             </div>
             <div>{error}</div>
          </div>
        )}

        {/* Empty State */}
        {!loading && suggestions.length === 0 && !error && (
            <div className="text-center py-12 animate-fade-in">
               <div className="w-20 h-20 rounded-full border-2 border-orange-200 flex items-center justify-center mx-auto mb-4 text-orange-300 bg-white shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
               </div>
               <p className="text-gray-400 font-medium">Chưa có gợi ý nào. Hãy nhập nguyên liệu để bắt đầu!</p>
            </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
           <div className="space-y-8 animate-pulse mt-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-orange-50/50">
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
        <div className="space-y-10 mt-8">
          {suggestions.map((recipe, idx) => (
            <div key={idx} className="bg-white rounded-3xl shadow-lg shadow-orange-100/50 border border-orange-50 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Card Header */}
              <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-white to-orange-50/30">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">{recipe.name}</h2>
                    <div className="flex items-center gap-2">
                       <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wide border border-orange-200">
                          {recipe.difficulty}
                       </span>
                       <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold flex items-center gap-1 border border-blue-100">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                          {recipe.cookingTime}
                       </span>
                    </div>
                 </div>
                 <p className="text-gray-600 italic leading-relaxed">{recipe.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8">
                 <div className="grid md:grid-cols-12 gap-8">
                    
                    {/* Left Column: Ingredients */}
                    <div className="md:col-span-5 lg:col-span-4">
                       <div className="bg-[#fcf8f5] rounded-2xl p-6 h-full border border-orange-100/50 relative overflow-hidden">
                          {/* Decorative Pattern */}
                          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-100 rounded-full opacity-20"></div>
                          
                          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 relative z-10">
                             <span className="bg-white p-1.5 rounded-lg text-green-600 shadow-sm border border-green-50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                             </span>
                             Nguyên liệu
                          </h3>
                          <ul className="space-y-3 relative z-10">
                             {recipe.ingredients.map((ing, i) => (
                                <li key={i} className="flex justify-between items-center text-sm group border-b border-gray-200/50 last:border-0 pb-2 last:pb-0">
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
                          <span className="bg-white p-1.5 rounded-lg text-orange-600 shadow-sm border border-orange-100">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                             </svg>
                          </span>
                          Cách làm
                       </h3>
                       <div className="space-y-6">
                          {recipe.steps.map((step, i) => (
                             <div key={i} className="flex gap-4 group">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors mt-0.5">
                                   {i + 1}
                                </div>
                                <div className="pt-1">
                                   <p className="text-gray-700 leading-relaxed text-sm md:text-base">{step}</p>
                                </div>
                             </div>
                          ))}
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
};

export default SmartChef;
