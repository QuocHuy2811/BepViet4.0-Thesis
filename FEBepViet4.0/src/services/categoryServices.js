
const API_URL= "http://localhost:8000/api/admin/categories"
const API_URL_ADD= "http://localhost:8000/api/admin/categories/add"
const API_URL_BASE ="http://localhost:8000/api/admin/categories"

export const getCategories =async()=>{
    const response = await fetch(API_URL);
    if(!response.ok)
    {
        throw new Error("Lỗi khi load category");
    }
    return await response.json();
};

export const createCaterogy = async(data) =>{
    const response = await fetch(API_URL_ADD,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data),
    });
    if (!response.ok) {
    const error = await response.json();
    throw error;
  }

    return await response.json();
    
}
export const getCategoryById = async (id)=>
{
    const response = await fetch(`${API_URL_BASE}/${id}`);
    if(!response.ok)
    {
        throw new Error("Lỗi Id category");
    }
    return await response.json();
}
export const updateCategory = async (id,data)=>
{
    const response = await fetch(`${API_URL_BASE}/${id}`,{
        'method':'PUT',
        'headers':{"Content-Type":"application/json"},
        body:JSON.stringify(data),
    });
    if(!response.ok)
    {
        throw await response.json();
    }
    return await response.json();

}