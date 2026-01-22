import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const RecipeDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState('details');

   const [showCookbookModal, setShowCookbookModal] = useState(false);
   const [selectedCookbookId, setSelectedCookbookId] = useState('');
   const [addSuccess, setAddSuccess] = useState(false);
   const [loading,setLoading]=useState(true);
   const [recipe,setRecipe]=useState(null);
   const [cookbook,setCookbook]=useState([]);
   const [errors,setErrors]=useState({});
   useEffect(()=>{
      async function getRecipeDetail()
      {
             const res= await fetch(`http://localhost:8000/api/recipe/${slug}`)
            const result= await res.json();
            if(res.status===404)
            {
                  setRecipe(null); 
                  setLoading(false);
            }else if(res.ok){
               setRecipe(result.recipe);
               setLoading(false);
               
            }
      }
      getRecipeDetail()
 
},[slug])

const handleCookbook=()=>{
   const token=localStorage.getItem("token");
   if(token)
   {
       fetch("http://localhost:8000/api/cookbook",{
         headers:{
            "Authorization":`Bearer ${token} `
         }
    })
    .then((res)=>res.json())
    .then((result)=>{
      console.log(result);
      setCookbook(result.cookbook);
    })
          setShowCookbookModal(true);
   
   }else{
      alert("Vui lòng đăng nhập để thực hiện chức năng này");
   }
   
}

const handleAdd=async()=>{
   const token=localStorage.getItem("token");
   setErrors({});
  const res=await fetch("http://localhost:8000/api/add-recipe-to-cookbook",{
   method:"POST",
   body:JSON.stringify({cookbook_id:selectedCookbookId,recipe_id:recipe.id}),
      headers:{
          "Authorization":`Bearer ${token} `,
          "Content-type":"application/json"
      }
   })
  const result=await res.json();
  if(res.status===422)
  {
         setErrors(result.errors);
  }else if(res.status===403)
  {
      alert(result.message);
  }else{
   alert(result.message);
   setShowCookbookModal(false);
  }

}

const handleFollow=async()=>{
 const token=localStorage.getItem("token");
 const res=await  fetch("http://localhost:8000/api/follow",{
      method:"POST",
      body:JSON.stringify({user_id:recipe.user_id}),
      headers:{
         "Content-type":"application/json",
         "Authorization":`Bearer ${token}`
      }
   })
  const result=await res.json();

  if(res.status===400)
  {
   alert(result.message);
  }else if(res.ok){
   alert(result.message);
  }


}

if(loading)
{
   return (
      <div className='text text-center'>
            Đang tải
      </div>
   );
}
 if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <h2 className="text-xl font-bold mb-2">Không tìm thấy công thức</h2>
        <button onClick={() => navigate('/')} className="text-orange-600 hover:underline">
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header Image */}
      <div className="relative h-[40vh] md:h-[50vh]">
         <img src={recipe.img_path} alt={recipe.title} className="w-full h-full object-cover" />
         <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors backdrop-blur-sm z-10"
         >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-800">
             <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
           </svg>
         </button>
         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-24 text-white">
            <div className="max-w-4xl mx-auto">
               <div className="flex gap-2 mb-2">
                 <span className="bg-orange-600 text-xs font-bold px-2 py-1 rounded">{recipe.region}</span>
                 <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">{recipe.difficult}</span>
               </div>
               <h1 className="text-3xl md:text-4xl font-bold mb-2">{recipe.title}</h1>
               <div className="flex items-center gap-4 text-sm text-gray-200">
                 <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {recipe.cook_time}p
                 </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    {recipe.views} người
                 </span>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
         {/* Author Info */}
         <div className="flex items-center justify-between py-4 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-3">
               <img src={recipe.user.img_avatar} alt={recipe.user.full_name} className="w-10 h-10 rounded-full object-cover" />
               <div>
                  <h3 className="font-bold text-gray-800">{recipe.user.full_name}</h3>
               </div>
            </div>
            <button onClick={handleFollow} className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-orange-200 transition-colors">
               Theo dõi
            </button>
         </div>

         {/* Content Tabs */}
         <div className="flex gap-6 border-b border-gray-200 mb-6">
            <button 
              className={`pb-3 font-semibold text-sm transition-colors relative ${activeTab === 'details' ? 'text-orange-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
               Công thức
               {activeTab === 'details' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>}
            </button>
             <button 
              className={`pb-3 font-semibold text-sm transition-colors relative ${activeTab === 'comments' ? 'text-orange-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('comments')}
            >
               Bình luận & Đánh giá
               {activeTab === 'comments' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>}
            </button>
         </div>

         {activeTab === 'details' ? (
            <div className="grid md:grid-cols-3 gap-8">
               {/* Ingredients Column */}
               <div className="md:col-span-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <span className="text-green-500">🥗</span> Nguyên liệu
                  </h3>
                  <ul className="bg-gray-50 rounded-2xl p-4 space-y-3">
                     {
                        recipe.ingredients.map((ingredient)=>(
                            <li key={ingredient.id} className="flex justify-between items-center text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                           <span className="font-medium text-gray-700">{ingredient.name}</span>
                           <span className="text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 text-xs">{ingredient.amount}</span>
                        </li>
                        ))
                     }
                  </ul>
                           <button
                              className="w-full mt-4 py-2 border border-orange-200 text-orange-600 rounded-xl text-sm font-medium hover:bg-orange-50 transition-colors"
                              onClick={handleCookbook}
                           >
                              + Thêm công thức yêu thích
                           </button>

                           {/* Modal chọn Cookbook */}
                           {showCookbookModal && (
                              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                                 <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
                                    <h3 className="font-bold text-lg mb-4">Chọn bộ sưu tập để thêm công thức</h3>
                                    <select
                                       className="border px-3 py-2 rounded w-full mb-4"
                                       value={selectedCookbookId}
                                       onChange={e => setSelectedCookbookId(e.target.value)}
                                    >
                                       <option value="">Chọn Cookbook...</option>
                                       
                                          {
                                             cookbook.map((item)=>(
                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                             ))
                                          }
                                              
                                    </select>
                                    {
                                       errors.cookbook_id &&
                                       <span className='text text-danger'>{errors.cookbook_id} </span>
                                    }
                                    <div className="flex gap-2">
                                       <button
                                          className="bg-orange-600 text-white px-4 py-2 rounded"
                                          onClick={handleAdd}
                                       >Thêm</button>
                                       <button className="text-gray-500 px-4 py-2" onClick={() => setShowCookbookModal(false)}>Đóng</button>
                                    </div>
                                    {addSuccess && (
                                       <div className="mt-4 text-green-600 font-semibold">Đã thêm vào bộ sưu tập!</div>
                                    )}
                                 </div>
                              </div>
                           )}
               </div>

               {/* Steps Column */}
              <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                     <span className="text-orange-500">🍳</span> Cách làm
                  </h3>
                  <div className="space-y-6">
         
                     {
                        recipe.steps.map((step)=>(
                                <div key={step.id} className="flex gap-4">
                           <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-sm mt-1">
                              {step.step_number}
                           </div>
                           <div>
                              <p className="text-gray-700 leading-relaxed">{step.content}</p>
                              {step.step_image && (
                                 <img src={step.step_image} alt={`Step ${step.step_number}`} className="mt-3 rounded-lg w-full md:w-2/3" />
                              )}
                           </div>
                        </div>
                        ))
                     }
                  </div>
               </div>
            </div>
             ) : (
                  <div className="bg-gray-50 rounded-2xl p-6">
                     <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="text-yellow-500">⭐</span> Bình luận & Đánh giá
                     </h3>
                     {/* Đánh giá trung bình */}
                     <div className="flex items-center gap-2 mb-6">
                        <span className="text-2xl font-bold text-orange-600">4.7</span>
                        <div className="flex gap-1">
                           {[...Array(5)].map((_, i) => (
                              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={i < 5 ? '#f59e42' : '#e5e7eb'} className="w-5 h-5">
                                 <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                              </svg>
                           ))}
                        </div>
                        <span className="text-gray-500 text-sm">(32 đánh giá)</span>
                     </div>
                     {/* Form gửi bình luận */}
                     <div className="bg-white rounded-xl p-4 shadow-sm mb-8">
                        <form className="flex flex-col md:flex-row gap-3 items-start">
                           <div className="flex gap-2 items-center mb-2 md:mb-0">
                              <span className="text-sm text-gray-700 font-semibold">Đánh giá:</span>
                              <div className="flex gap-1">
                                 {[...Array(5)].map((_, i) => (
                                    <button type="button" key={i} className="focus:outline-none">
                                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#f59e42" className="w-5 h-5">
                                          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                       </svg>
                                    </button>
                                 ))}
                              </div>
                           </div>
                           <textarea className="flex-1 border border-gray-200 rounded-lg p-3 text-sm" placeholder="Viết bình luận của bạn..." rows={2}></textarea>
                           <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors">Gửi</button>
                        </form>
                     </div>
                     {/* Danh sách bình luận */}
                     <div className="space-y-6">
                        {/* Bình luận mẫu */}
                        <div className="flex gap-3 items-start">
                           <img src="https://picsum.photos/id/64/100/100" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                           <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="font-bold text-gray-800 text-sm">Chef Hùng</span>
                                 <span className="text-xs text-gray-400">2 ngày trước</span>
                                 <div className="flex gap-1 ml-2">
                                    {[...Array(5)].map((_, i) => (
                                       <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={i < 5 ? '#f59e42' : '#e5e7eb'} className="w-4 h-4">
                                          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                       </svg>
                                    ))}
                                 </div>
                              </div>
                              <p className="text-gray-700 text-sm">Nước dùng rất trong và ngọt, đúng chuẩn vị Bắc. Cảm ơn bạn đã chia sẻ công thức!</p>
                           </div>
                        </div>
                        <div className="flex gap-3 items-start">
                           <img src="https://picsum.photos/id/65/100/100" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                           <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="font-bold text-gray-800 text-sm">Mẹ Bống</span>
                                 <span className="text-xs text-gray-400">1 ngày trước</span>
                                 <div className="flex gap-1 ml-2">
                                    {[...Array(4)].map((_, i) => (
                                       <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={i < 4 ? '#f59e42' : '#e5e7eb'} className="w-4 h-4">
                                          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                       </svg>
                                    ))}
                                 </div>
                              </div>
                              <p className="text-gray-700 text-sm">Cách làm chi tiết, dễ thực hiện. Mình đã thử và thành công ngay lần đầu!</p>
                           </div>
                        </div>
                     </div>
                  </div>
             )}
      </div>
    </div>
  );
};

export default RecipeDetail;