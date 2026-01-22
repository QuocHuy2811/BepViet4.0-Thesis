import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from './RecipeCard.jsx';

const Explore = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [dbCategories, setDbCategories] = useState([]);

  // Quản lý việc đóng/mở từng phần của bộ lọc
  const [expanded, setExpanded] = useState({ region: false, difficult: false, time: false, category: false });
  
  // Trạng thái các bộ lọc đang chọn (mặc định mảng rỗng = chưa chọn gì)
  const [filters, setFilters] = useState({ region: [], difficult: [], time_range: [], category_id: [] });

  // Lấy danh sách danh mục thật khi trang web khởi chạy
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories');
        if (response.data.success) {
          setDbCategories(response.data.data);
        }
      } catch (error) {
        console.error("Không thể lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);


  const toggleAccordion = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleToggleValue = (key, value) => {
    setFilters(prev => {
      const isSelected = prev[key].includes(value);
      return {
        ...prev,
        [key]: isSelected ? prev[key].filter(v => v !== value) : [...prev[key], value]
      };
    });
    setHasSearched(true); // Đánh dấu đã bắt đầu lọc
  };


  // Xử lý Real-time Search với Debounce
  useEffect(() => {
    // KIỂM TRA: Nếu tất cả đều trống thì không load dữ liệu
    const isSearchEmpty = searchTerm.trim() === '';
    const isFilterEmpty = filters.region.length === 0 && 
                          filters.difficult.length === 0 && 
                          filters.time_range.length === 0 &&
                          filters.category_id.length === 0;

    if (isSearchEmpty && isFilterEmpty) {
      setRecipes([]);
      setHasSearched(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters]);



  const fetchData = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await axios.get('http://localhost:8000/api/recipes/search', {
        params: { 
          query: searchTerm,
          region: filters.region,
          difficult: filters.difficult,
          time_range: filters.time_range,
          category_id: filters.category_id
        }
      });

      // Ánh xạ dữ liệu từ Laravel DB  sang format RecipeCard.jsx cần
      const mappedData = response.data.data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        img_path: item.img_path === 'null' ? 'https://via.placeholder.com/400' : item.img_path,
        region: item.region,
        cook_time: item.cook_time + ' phút',
        difficult: item.difficult,
        views: item.views,
        user: {
          full_name: item.user?.full_name || "Người dùng",
          img_avatar: item.user?.img_avatar || 'https://picsum.photos/100/100'
        },
        // Lấy đánh giá trung bình từ API
        // rating: item.ratings_avg_rating 
        // ? parseFloat(item.ratings_avg_rating).toFixed(1) 
        // : "0.0",
        rating: 4.8, // Giả lập đánh giá trung bình 
        //tags: item.tags.map(t => t.name) // Lấy danh sách tên tag
        tags: item.tags ? item.tags.map(t => t.name) : []
      }));

      setRecipes(mappedData);
    } catch (error) {
      console.error("Lỗi fetch dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-0">
      {/* SIDEBAR BỘ LỌC */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24  h-[calc(100vh-6rem)] overflow-y-auto">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18l-7 8.25V19.5l-4 2.25v-9L3 4.5z"/>
            </svg>
            Bộ lọc tìm kiếm
          </h2>


          {/* BỘ LỌC DANH MỤC */}
          <div className="mb-4 border-b border-gray-50 pb-2">
            <button onClick={() => toggleAccordion('category')} className="flex justify-between items-center w-full py-2 font-bold text-gray-700 hover:text-orange-600 transition-colors">
              Danh mục <span>{expanded.category ? '-' : '+'}</span>
            </button>
            {expanded.category && (
              <div className="flex flex-col gap-2 mt-2">
                {dbCategories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => handleToggleValue('category_id', cat.id)}
                    className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition ${filters.category_id.includes(cat.id) ? 'bg-orange-600 text-white shadow-md' : 'text-gray-500 hover:bg-orange-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Vùng miền Accordion */}
          <div className="mb-4 border-b border-gray-50 pb-2">
            <button onClick={() => toggleAccordion('region')} className="flex justify-between items-center w-full py-2 font-bold text-gray-700 hover:text-orange-600 transition-colors">
              Vùng miền <span>{expanded.region ? '-' : '+'}</span>
            </button>
            {expanded.region && (
              <div className="flex flex-col gap-2 mt-2 ml-1">
                {['Miền Bắc', 'Miền Trung', 'Miền Nam'].map(r => (
                  <button 
                    key={r}
                    onClick={() => handleToggleValue('region', r)}
                    className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition ${filters.region.includes(r) ? 'bg-orange-600 text-white shadow-md' : 'text-gray-500 hover:bg-orange-50'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Độ khó Accordion */}
          <div className="mb-4 border-b border-gray-50 pb-2">
            <button onClick={() => toggleAccordion('difficult')} className="flex justify-between items-center w-full py-2 font-bold text-gray-700 hover:text-orange-600">
              Độ khó <span>{expanded.difficult ? '-' : '+'}</span>
            </button>
            {expanded.difficult && (
              <div className="flex flex-col gap-2 mt-2 ml-1">
                {['Dễ', 'Trung Bình', 'Khó'].map(d => (
                  <button 
                    key={d}
                    onClick={() => handleToggleValue('difficult', d)}
                    className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition ${filters.difficult.includes(d) ? 'bg-orange-600 text-white shadow-md' : 'text-gray-500 hover:bg-orange-50'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Thời gian Accordion */}
          <div className="mb-4">
            <button onClick={() => toggleAccordion('time')} className="flex justify-between items-center w-full py-2 font-bold text-gray-700 hover:text-orange-600">
              Thời gian <span>{expanded.time ? '-' : '+'}</span>
            </button>
            {expanded.time && (
              <div className="flex flex-col gap-2 mt-2 ml-1">
                <button onClick={() => handleToggleValue('time_range', 'fast')} className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition ${filters.time_range.includes('fast') ? 'bg-orange-600 text-white' : 'text-gray-500 hover:bg-orange-50'}`}>Dưới 30 phút</button>
                <button onClick={() => handleToggleValue('time_range', 'medium')} className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition ${filters.time_range.includes('medium') ? 'bg-orange-600 text-white' : 'text-gray-500 hover:bg-orange-50'}`}>30 - 60 phút</button>
                <button onClick={() => handleToggleValue('time_range', 'slow')} className={`text-left px-4 py-2 rounded-xl text-sm font-medium transition ${filters.time_range.includes('slow') ? 'bg-orange-600 text-white' : 'text-gray-500 hover:bg-orange-50'}`}>Trên 60 phút</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DANH SÁCH KẾT QUẢ */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Khám phá Ẩm thực</h1>
         <div className="relative mb-6">
            <input 
            type="text"
            placeholder="Tìm kiếm món ăn"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-4 top-3.5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-orange-600 animate-pulse text-lg">Đang tìm món ngon cho bạn...</div>
        ) : (
          <>
            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} onClick={() => navigate(`/recipe/${recipe.slug}`)}/>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400 italic">
                {hasSearched ? "Không tìm thấy món ăn nào phù hợp." : "Hãy nhập từ khóa hoặc chọn bộ lọc để bắt đầu khám phá!"}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;