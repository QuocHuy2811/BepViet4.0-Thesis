import { useState } from "react";
import { createCaterogy } from "../../services/categoryServices";
import { useNavigate } from "react-router-dom";
function AddCategory()
{
    const [name,setName]=useState("");
    const navigate = useNavigate();
    
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(!name.trim())
        {
            alert("Tên danh mục không được để trống");
            return;
        }
        try{
            await createCaterogy({name});
            alert("Thêm danh mục thành công");
            navigate(-1);
        }catch(error)
        {
            alert("Không thể thêm danh mục");
        }
    }

    return (
        <>
       
       
         <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card w-75">
                    <div className="card-header">
                        <h4 className="text-center">Thêm Danh Mục</h4>
                    </div>
                    <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label  className="form-label">Tên danh mục</label>
                                    <input className="form-control" 
                                    type="text" 
                                    name="name"
                                    value={name}  
                                    onChange={(e)=>setName(e.target.value)}
                                    />
                                </div>
                                 <button type="submit" className="btn btn-primary w-100">Lưu</button>
                             </form>
                    </div>
                </div>
        </div>
        </>
       
    );
}
export default AddCategory;