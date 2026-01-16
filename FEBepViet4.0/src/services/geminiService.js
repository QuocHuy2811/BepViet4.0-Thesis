// Không cần import axios nữa
const API_URL = 'http://127.0.0.1:8000/api/ai/suggest'; 

export const getRecipeSuggestions = async (ingredients) => {
    try {
        console.log("🚀 Đang gửi yêu cầu tới:", API_URL);

        // Dùng fetch có sẵn của trình duyệt (thay cho axios)
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ prompt: ingredients })
        });

        console.log("📡 Trạng thái phản hồi:", response.status);

        if (!response.ok) {
            throw new Error(`Lỗi Server: ${response.status}`);
        }

        const data = await response.json();
        console.log("📦 Dữ liệu nhận được:", data);

        // Trả về đúng mảng recipes
        return data.recipes || [];

    } catch (error) {
        // Hiện popup lỗi lên màn hình để bạn thấy ngay
        alert("❌ LỖI KẾT NỐI: " + error.message); 
        console.error("Chi tiết lỗi:", error);
        return [];
    }
};
