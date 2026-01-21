import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard.jsx';

const Home = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [view, setView] = useState([]);
  const [paginate,setPaginate]=useState([]);
  const trendingScrollRef = useRef(null);
  const vi_tri=useRef("tat_ca");

const fetchRecipe=(url)=>{
  fetch(`${url}`)
  .then((res)=>res.json())
  .then((data)=>{
    setRecipes(data.danh_sach.data);
     setPaginate(data.danh_sach.links);
  })
}


const fetchRecipeFollow=(url)=>{
   const token =localStorage.getItem("token");
  fetch(`${url}`,{
      headers:{
        "Authorization":`Bearer ${token}`
    }
  })
  .then((res)=>res.json())
  .then((data)=>{
    setRecipes(data.danh_sach.data);
     setPaginate(data.danh_sach.links);
  })
}

const fetchFollowed=()=>{
  vi_tri.current="follow"
  const token =localStorage.getItem("token");
  if(!token)
  {
      alert("Vui lòng đăng nhập để thực hiện chức năng");
  }else{
      fetch("http://localhost:8000/api/bai-viet-followed",
    {
      headers:{
        "Authorization":`Bearer ${token}`
      }
    }
  )
  .then((res)=>res.json())
  .then((data)=>{
    console.log(data);
    setRecipes(data.danh_sach.data);
    setPaginate(data.danh_sach.links)
  })
}
  }
  
const fetchAll=()=>{
   vi_tri.current="tat_ca";
  fetch("http://localhost:8000/api/")
  .then((res)=>res.json())
  .then((data)=>{
   setRecipes(data.danh_sach.data);
   setPaginate(data.danh_sach.links);
  })
}

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api")
      .then((res) => res.json())
      .then((data) => {
        setView(data.luot_xem_nhieu_nhat);
        setRecipes(data.danh_sach.data);
        setPaginate(data.danh_sach.links);
        setLoading(false);
      })
  }, []);





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

  if (loading) {
    return (
      <div className='text-center'>
        Đang Tải
      </div>
    );
  }

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
              <span className="text-red-500">🔥</span> Lượt Xem Nhiều Nhất
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
                {
                       view.map((recipe) => (
                        <div 
                          key={recipe.id} 
                          onClick={() => handleRecipeClick(recipe)}
                          className="w-72 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all group/card"
                        >
                          <div className="h-40 overflow-hidden relative">
                            <img src={recipe.image_path} alt={recipe.title} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                              HOT
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-bold text-gray-800 truncate mb-1 text-base">{recipe.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                {recipe.region}
                              </span>
                              <span>•</span>
                              <span>{recipe.user.full_name}</span>
                            </div>
                          </div>
                        </div>
                      ))
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
                  
          </div>
          <div className='mb-4'>
            <button className='btn btn-success mr-4' onClick={fetchAll}>Tất cả</button>
            <button className='btn btn-danger' onClick={fetchFollowed}>Đang theo dõi</button>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {
              recipes.length>0?
                  recipes.map((recipe)=>(
                      <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      onClick={() => handleRecipeClick(recipe)}
                    />
                  )):
                  <div className="col-span-3 text-gray-400 italic p-8">Không có công thức nào.</div>
                   
            }
           
          </div>
         <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
            {
             vi_tri==="tat_ca"?
            paginate.map((pagi, index) => (
              <button
                key={index}
                onClick={(e)=>{fetchRecipe(pagi.url)}}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${pagi.active 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'}
                `}
                dangerouslySetInnerHTML={{ __html: pagi.label }}
              />
            )): 
             paginate.map((pagi, index) => (
              <button
                key={index}
                onClick={(e)=>{fetchRecipeFollow(pagi.url)}}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${pagi.active 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'}
                `}
                dangerouslySetInnerHTML={{ __html: pagi.label }}
              />
            ))
            
            }
          </div>

        </section>
      </div>
    </div>
  );
};

export default Home;