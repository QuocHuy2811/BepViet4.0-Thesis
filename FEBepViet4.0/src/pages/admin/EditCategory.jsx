import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategoryById,updateCategory } from "../../services/categoryServices";
function EditCategory()
{
    const {id}=useParams();
    console.log(id);
    const [name,setName]=useState("");
    const [status, setStatus] = useState(1);
    const navigate=useNavigate();

    useEffect(()=>{
        const fetchCategoriesById = async()=>{
            try{
         const data = await getCategoryById(id);
            setName(data.name);
            setStatus(data.status)
            console.log(data);
            }catch(error)
            {
                alert("Không load được danh mục");
            }
          
        }
        fetchCategoriesById();
    },[id]);


    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(!name.trim())
        {
            alert("Tên danh mục không được để trống!");
            return;
        }
        try{
            
            await updateCategory(id,{name,status});
            alert("Sửa thành công");
            navigate(-1);
        }catch(error)
        {
            alert("Không thể sửa danh mục");
        }
    }

    return (
        <>
         <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card w-75">
                    <div className="card-header">
                        <h4 className="text-center">Sửa Danh Mục</h4>
                    </div>
                    <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label  className="form-label">Tên danh mục</label>
                                    <input  className="form-control" 
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(e)=>setName(e.target.value)}
                                    />
                                </div>
                                 {/* STATUS */}
                            <div className="mb-3">
                                <label className="form-label">Trạng thái</label>
                                <select
                                    className="form-select"
                                    value={status}
                                    onChange={(e) => setStatus(Number(e.target.value))}
                                >
                                    <option value={1}>Hoạt động</option>
                                    <option value={0}>Khóa</option>
                                </select>
                            </div>
                                 <button type="submit" className="btn btn-primary w-100">Lưu</button>
                             </form>
                    </div>
                </div>
        </div>
        </>
       
    );
}
export default EditCategory;