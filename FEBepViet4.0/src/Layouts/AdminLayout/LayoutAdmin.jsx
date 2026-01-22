import "../../assets/css/style.css";
import avatar from "../../assets/avatar.png";
import { Link, Outlet, useNavigate } from "react-router-dom";


export default  function LayoutAdmin()
{


    const navigate=useNavigate();
const handleLogout=()=>{
    const token=localStorage.getItem("token");
    fetch("http://localhost:8000/api/admin/dang-xuat",
        {
            method:"POST",
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
    )
    .then((res)=>res.json())
    .then((result)=>{
        localStorage.removeItem("token");
        alert(result.message);
        navigate("/admin/dang-nhap")
    })
}



    return (
        <div className="container-fluid">
                 <div className="row">
            <div className="col-3">
                <div className="bg-sider">
                    <div className=" flex justify-center m-42">
                             <img src={avatar} className="border-radius-10 w-217 h-210 "/>
                    </div>
                   
                    <p className="fz-40 color-94A3B8 text-align-center">Admin</p>
                    <ul className="d-flex flex-column justify-content-center align-items-center list-style-type-none ml">
                        <li>
                            <nav>
                                <Link className="text-decoration-none color-94A3B8" to="/admin">Trang chủ</Link>
                            </nav>
                        </li>
                        <li>
                            <nav>
                                <Link className="text-decoration-none color-94A3B8" to="/admin/quan-ly-nguoi-dung">Quản lý người dùng</Link>
                            </nav>
                        </li>
                        <li>
                            <nav>
                                <Link className="text-decoration-none color-94A3B8" to="/admin/quan-ly-bai-dang">Quản lý bài đăng</Link>
                            </nav>
                        </li>
                        <li>
                            <nav>
                                <Link className="text-decoration-none color-94A3B8" to="/admin/quan-ly-danh-muc">Quản lý danh mục</Link>
                            </nav>
                        </li>
                        <li>
                            <nav>
                                <Link className="text-decoration-none color-94A3B8" to="/admin/bao-cao">Quản lý báo cáo người dùng</Link>
                            </nav>
                        </li>
                          <li>
                            <nav>
                                <Link className="text-decoration-none color-94A3B8" to="/admin/quan-ly-binh-luan" >Quản lý bình luận</Link>
                            </nav>
                        </li>
                        <li>
                            <nav>
                                <Link className="text-decoration-none color-94A3B8" to="/admin/quan-ly-cong-thuc" >Quản lý công thức nấu ăn</Link>
                            </nav>
                        </li>
                        <li>
                            <nav>
                                <Link className="text-decoration-none color-94A3B8" to="/admin/cai-dat" >Quản lý cài đặt</Link>
                            </nav>
                        </li>
                    </ul>
                    <button className="btn btn-danger w-119 position" onClick={handleLogout}>Đăng xuất</button>
                </div>
            </div>
            <div className="col-9">
               <Outlet/>
            </div>
        </div>
        </div>
       
    );

}