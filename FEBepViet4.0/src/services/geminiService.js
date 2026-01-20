
const BACKEND_API_URL = 'http://localhost:8000/api/ai/suggest-recipes';

const getRecipeSuggestions = async (ingredients) => {
  try {
    const response = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
        throw new Error("Lỗi kết nối Gemini API"); 
    }
    let data;
    
      data = await response.json();
    
    return data.data || data; 
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};
export default getRecipeSuggestions;