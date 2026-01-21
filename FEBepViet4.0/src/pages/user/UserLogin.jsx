import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserLogin({token,setUser})
{
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [errors,setErrors]=useState({});
  const navigate=useNavigate();
 const handleSubmit= async(e)=>{
        e.preventDefault();
        setErrors({});
       const res=await fetch("http://localhost:8000/api/dang-nhap",
            {
                method:'POST',
                body:JSON.stringify({username:username,password:password}),
                headers:{
                    "Content-type":"application/json",
                    "Accept": "application/json"
                }
            }
        )
        const result=await res.json();
        if(res.status===422)
        {
            console.log(result);
            setErrors(result.errors);
        }else if(res.ok)
        {
            localStorage.setItem("token",result.token);
            setUser(result.token);
            alert(result.message);
            navigate('/');

        }else{
            alert(result.message);
        }
 }
 useEffect(()=>{
        if(token)
        {
            navigate("/")
        }
 },[])
    return (
        <div className="row d-flex justify-content-center align-items-center vh-100">
            <div className="col-4 ">
                <div className="card shadow">
                    <div className="card-header">
                           <h4 className="text-align-center">Đăng Nhập</h4>
                    </div>
                    <div className="card-body">
                           <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label  className="form-label">Tên tài khoản</label>
    <input type="text" className="form-control"  onChange={(e)=>setUsername(e.target.value)}/>
    {
        errors.username && <span className=" text text-danger">
        {errors.username[0]}
    </span>
    }
  
  </div>
  <div className="mb-3">
    <label  className="form-label">Mật khẩu</label>
    <input type="password" className="form-control" onChange={(e)=>setPassword(e.target.value)} />
    {
        errors.password &&  
     <span className=" text text-danger">
        {errors.password[0]}
    </span>
    }
    
  </div>
    <nav className="mb-2">
        <Link to="/forget-password" >Quên mật khẩu</Link>
    </nav>
  <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
</form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserLogin;