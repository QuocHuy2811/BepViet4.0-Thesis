import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navigation = () => {
  // Nếu cần Navigation riêng thì code ở đây
  return null;
};

export const DesktopSidebar = ({token,setUser}) => {
  const [showGearMenu, setShowGearMenu] = useState(false);
  const [info,setInfo]=useState({});
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch("http://localhost:8000/api/dang-xuat",{
        method:"POST",
        headers:
        {
          "Authorization":`Bearer ${token}`
        }
      }).then((res)=>res.json())
      .then((data)=>{
        console.log(data);
        localStorage.removeItem("token");
        setUser(null);
         alert('Đã đăng xuất!');
         navigate("/")
      })
    
   
  };
  const handleManageAccount = () => {
    setShowGearMenu(false);
    navigate('/account');
  };
  useEffect(()=>{
    if(token)
    {
        fetch("http://localhost:8000/api/user",{
      headers:{
        "Authorization": `Bearer ${token}`
      }
    })
    .then((res)=>res.json())
    .then((result)=>{
        setInfo(result);
       
    })
    }
    
  },[token])
 
  return (
    <div className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-100 shadow-xl fixed left-0 top-0 overflow-y-auto z-50">
     
      <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3 tracking-tight">
          <span className="text-3xl filter drop-shadow-sm">🍲</span> 
          <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
            Bếp Việt 4.0
          </span>
        </h1>
      </div>

     
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto " >
        <nav className="space-y-1 " >
        
          

          <Link to={"/"} className="no-underline group flex items-center gap-3 w-full p-3.5 rounded-2xl text-gray-600 font-medium hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 ease-in-out">
            <span className="text-xl">🏠</span>
            <span>Trang chủ</span>
          </Link>

          <Link to={"/explore"} className="no-underline group flex items-center gap-3 w-full p-3.5 rounded-2xl text-gray-600 font-medium hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 ease-in-out">
            <span className="text-xl">🌍</span>
            <span>Khám phá</span>
          </Link>


          <Link to={"/blog"} className="no-underline group flex items-center gap-3 w-full p-3.5 rounded-2xl text-gray-600 font-medium hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 ease-in-out">
            <span className="text-xl">📝</span>
            <span>Blog & Review</span>
          </Link>

          {
            token &&  <Link to={"/smart-chef"} className="no-underline group flex items-center gap-3 w-full p-3.5 rounded-2xl text-gray-600 font-medium hover:bg-orange-100 hover:text-orange-700 transition-all duration-200 ease-in-out">
            <span className="text-xl">🤖</span>
            <span className="flex-1">AI Chef</span>
            <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold group-hover:bg-orange-200">NEW</span>
          </Link>
          }
         


          <Link to={"/post"} className="no-underline group flex items-center gap-3 w-full p-3.5 rounded-2xl text-gray-600 font-medium hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 ease-in-out">
            <span className="text-xl">➕</span>
            <span>Đăng Công Thức</span>
          </Link>
        </nav>
      </div>

      {
        token ?<div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2">
        <Link to="/profile" className="no-underline">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-100">
            <img 
              src= {info?.user?.img_avatar} 
              alt="Me" 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:ring-orange-200 transition-all" 
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600 transition-colors">Người dùng</span>
              <span className="text-xs text-gray-500 font-medium">{info?.user?.full_name}</span>
            </div>
          </div>
        </Link>
        <button
          className="flex items-center gap-2 justify-center mt-2 p-2 rounded-full hover:bg-orange-50 transition-colors w-10 h-10 self-center"
          title="Cài đặt tài khoản"
          onClick={() => setShowGearMenu(v => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        {showGearMenu && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-20 bg-white border border-gray-200 rounded-xl shadow-lg w-56 z-50 flex flex-col animate-fadeIn">
            <button
              className="px-6 py-4 text-left text-gray-800 font-semibold border-b border-gray-100 hover:bg-orange-50 rounded-t-xl"
              onClick={handleManageAccount}
            >
              Quản lý tài khoản
            </button>
            <button
              className="px-6 py-4 text-left text-red-600 font-semibold hover:bg-orange-50 rounded-b-xl"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        )}

      </div>
      : 
      <nav className='p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-2'>
        <Link to="/signup" className='btn btn-danger'>Đăng ký</Link>
        <Link to="/login" className='btn btn-primary'>Đăng nhập</Link>
      </nav>
      }
    </div>
  );
}


