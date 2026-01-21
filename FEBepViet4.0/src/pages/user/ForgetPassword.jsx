import { useState } from "react";

function ForgetPassword()
{
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [errors,setErrors]=useState({});

    const handleSubmit= async(e)=>{
        e.preventDefault();
        setErrors({});
       const res=await fetch("http://localhost:8000/api/forget-password",{
            method:"POST",
            body:JSON.stringify({username:username,email:email}),
            headers:{
                "Content-type":"application/json"
            }
        });
        const result= await res.json();
        if(res.status===422)
        {
            setErrors(result.errors);
        }else 
        {
            alert(result.message)
        }
    }
      return (
        <div className="row d-flex justify-content-center align-items-center vh-100">
            <div className="col-4 ">
                <div className="card shadow">
                    <div className="card-header">
                           <h4 className="text-align-center">Quên Mật Khẩu</h4>
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
  <button type="submit" className="btn btn-primary w-100">Gửi Mail</button>
</form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ForgetPassword;