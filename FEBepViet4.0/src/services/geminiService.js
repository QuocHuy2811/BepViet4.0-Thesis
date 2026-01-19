
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

    const contentType = response.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Non-JSON response from backend:", text);
      throw new Error(`Lỗi Server (${response.status}): Phản hồi không phải JSON.`);
    }

    if (!response.ok) {
      // Log chi tiết lỗi ra console để debug (quan trọng)
      if (data.details) {
        console.error("❌ CHI TIẾT LỖI TỪ GOOGLE/BACKEND:", JSON.stringify(data.details, null, 2));
      }

      // Ưu tiên lấy message lỗi từ backend gửi về
      const errorMessage = data.error || data.message || `Backend Error: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    return data.data || data; 
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};
export default getRecipeSuggestions;