import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard.jsx';
import { RECIPES, ALL_RECIPES } from '../../data/mockData.js';

const ITEMS_PER_PAGE = 6;

const Home = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [trending, setTrending] = useState([]);
  const trendingScrollRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      setRecipes(ALL_RECIPES);
      
      setTrending([...RECIPES].sort((a, b) => b.rating - a.rating).slice(0, 6));
      setLoading(false);
    }, 800);
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(recipes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecipes = recipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  const scrollTrending = (direction) => {
    if (trendingScrollRef.current) {
      const scrollAmount = 300;
      if (direction === 'left') {
        trendingScrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        trendingScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Skeleton loading
  const SkeletonCard = () => (
    <div className="w-72 bg-gray-100 rounded-xl animate-pulse h-64 border" />
  );

  return (
    <div className="pb-24 md:pb-0">
      <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 p-4 shadow-sm">
        <h1 className="text-xl font-extrabold text-orange-600 flex items-center gap-2">
          <span>🍲</span> Bếp Việt 4.0
        </h1>
      </div>

      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Trending Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-red-500">🔥</span> Xu Hướng Tuần Này
            </h2>
          </div>
          <div className="relative group">
            {/* Left Button */}
            <button 
              onClick={() => scrollTrending('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm hidden md:block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div 
              ref={trendingScrollRef}
              className="overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
            >
              <div className="flex gap-4 w-max">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                  : trending.length > 0
                    ? trending.map((recipe) => (
                        <div 
                          key={recipe.id} 
                          onClick={() => handleRecipeClick(recipe)}
                          className="w-72 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all group/card"
                        >
                          <div className="h-40 overflow-hidden relative">
                            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                              HOT
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-bold text-gray-800 truncate mb-1 text-base">{recipe.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                {recipe.rating}
                              </span>
                              <span>•</span>
                              <span>{recipe.author.fullName}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    : <div className="text-gray-400 italic p-8">Không có công thức nổi bật tuần này.</div>
                }
              </div>
            </div>
            {/* Right Button */}
            <button 
              onClick={() => scrollTrending('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm hidden md:block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </section>

        {/* For You Section - 3 Columns with Pagination */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>✨</span> Dành Cho Bạn
            </h2>
            <div className="text-sm text-gray-500">
              Trang {currentPage} / {totalPages}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {loading
              ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
              : paginatedRecipes.length > 0
                ? paginatedRecipes.map(recipe => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      onClick={() => handleRecipeClick(recipe)}
                    />
                  ))
                : <div className="col-span-3 text-gray-400 italic p-8">Không có công thức nào phù hợp.</div>
            }
          </div>
          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                      currentPage === page 
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-200' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;