import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserSignup()
{
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [fullName,setFullName]=useState("");
    const [email,setEmail]=useState("");
    const [avatar,setAvatar]=useState("");
    const [rePassword,setRePassword]=useState("");
    const [errors,setErrors]=useState({});
    const navigate=useNavigate();
 const handleSubmit= async(e)=>{
   e.preventDefault();
   setErrors({});
   const data=new FormData();
   data.append("username",username);
   data.append("password",password);
   data.append("full_name",fullName);
   data.append("email",email);
   data.append("img_avatar",avatar);
   data.append("password_confirmation",rePassword);
  const res=await fetch("http://localhost:8000/api/dang-ky",{
    method:"POST",
    body:data,
   })
   const result=await res.json();
  
    if(res.status===422)
    {
        console.log(result);
        setErrors(result.errors);
    }else if(res.ok){
        alert(result.message);
        navigate("/login");
    }
       
   
 }


     return (
        <div className="row d-flex justify-content-center align-items-center vh-100">
            <div className="col-4 ">
                <div className="card shadow">
                    <div className="card-header">
                           <h4 className="text-align-center">Đăng Ký</h4>
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
    <label  className="form-label">Email</label>
    <input type="email" className="form-control"  onChange={(e)=>setEmail(e.target.value)}/>
    {
        errors.email && <span className=" text text-danger">
        {errors.email[0]}
    </span>
    }
  
  </div>
  <div className="mb-3">
    <label  className="form-label">Họ và tên</label>
    <input type="text" className="form-control"  onChange={(e)=>setFullName(e.target.value)}/>
    {
        errors.full_name && <span className=" text text-danger">
        {errors.full_name[0]}
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
   <div className="mb-3">
    <label  className="form-label">Nhập lại mật khẩu</label>
    <input type="password" className="form-control" onChange={(e)=>setRePassword(e.target.value)} />
     {
        errors.password_confirmation &&  
     <span className=" text text-danger">
        {errors.password_confirmation[0]}
    </span>
    }
  </div>
   <div className="mb-3">
    <label  className="form-label">Ảnh đại diện</label>
    <input type="file" className="form-control" onChange={(e)=>setAvatar(e.target.files[0])} />
    {
        errors.img_avatar &&  
     <span className=" text text-danger">
        {errors.img_avatar[0]}
    </span>
    }
    
  </div>
  <button type="submit" className="btn btn-primary w-100">Đăng Ký</button>
</form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserSignup;