import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Home()
{
    const [loading,setLoading]=useState(true)
    const [data,setData]=useState({});
    const monthNames = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];
    const [chartRecipe,setChartRecipe]=useState(null);
    const [chartUser,setChartUser]=useState(null);
    useEffect(()=>{
        const token=localStorage.getItem("token");
        fetch("http://localhost:8000/api/admin",{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        })
        .then((res)=>res.json())
        .then((result)=>{
            setData(result);
            const recipes=result.recipes.map((item)=>(
                {
                    month:monthNames[item.month-1],
                    revenue:item.revenue
                }
            ))
            const users=result.users.map((item)=>(
                {
                    month:monthNames[item.month-1],
                    revenue:item.revenue
                }
            ))
            setChartRecipe(recipes);
            setChartUser(users);
            setLoading(false)
        })
    },[])
    if(loading)
    {
        return (
            <div className='text text-center'>
                Đang tải
            </div>
        );
    }
    return (
        <>
            <h1 className="mt-2">Trang chủ</h1>
            <div className="row mb-3">
                <div className="col-4">
                    <div className="card shadow">
                            <div className="card-body">
                                    <p className="text-center">{data.nguoi_dung} Người Dùng</p>
                                    
                            </div>
                    </div>
                
                </div>
                 <div className="col-4">
                    <div className="card shadow">
                            <div className="card-body">
                                    <p className="text-center">{data.cong_thuc} Công thức nấu ăn</p>
                                    
                            </div>
                    </div>
                
                </div>
                 <div className="col-4">
                    <div className="card shadow">
                            <div className="card-body">
                                    <p className="text-center">{data.bai_viet} Bài Đăng</p>
                                    
                            </div>
                    </div>
                
                </div>
            </div>        
            <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartRecipe}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {/* Lưới ngang cho biểu đồ */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          
          {/* Trục X hiển thị tháng */}
          <XAxis dataKey="month" />
          
          {/* Trục Y hiển thị giá trị */}
          <YAxis />
          
          {/* Hiệu ứng khi di chuột vào cột */}
          <Tooltip />
          
          {/* Chú thích */}
          <Legend />
          
          {/* Cột biểu đồ: bạn có thể đổi màu tại stroke và fill */}
          <Bar dataKey="revenue" name="Biểu đồ số lượng công thức nấu ăn trong năm 2026" fill="#0d6efd" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
             </div>
            <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                data={chartUser}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                {/* Lưới ngang cho biểu đồ */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                
                {/* Trục X hiển thị tháng */}
                <XAxis dataKey="month" />
                
                {/* Trục Y hiển thị giá trị */}
                <YAxis />
                
                {/* Hiệu ứng khi di chuột vào cột */}
                <Tooltip />
                
                {/* Chú thích */}
                <Legend />
                
                {/* Cột biểu đồ: bạn có thể đổi màu tại stroke và fill */}
                <Bar dataKey="revenue" name="Biểu đồ số lượng người dùng trong năm 2026" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            </div>
        </>
    );
}
export default Home;