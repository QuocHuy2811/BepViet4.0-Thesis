
const BACKEND_API_URL = 'http://localhost:8000/api/ai/suggest-recipes';

const getRecipeSuggestions = async (ingredients) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      throw new Error("Lỗi kết nối với server");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};
export default getRecipeSuggestions;