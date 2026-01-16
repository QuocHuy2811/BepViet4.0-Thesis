<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
// 👇 Import thư viện Gemini
use Gemini\Laravel\Facades\Gemini; 

class AiChefController extends Controller
{
    public function suggestDish(Request $request)
    {
        // 👇👇 LỖI CỦA BẠN NẰM Ở ĐÂY (Thiếu chữ try {)
        try {
            $ingredients = $request->input('prompt');
            Log::info("1. Đã nhận nguyên liệu: " . $ingredients);

            // Gọi Gemini (Dùng bản 1.5 flash cho nhanh)
            $result = Gemini::generativeModel('gemini-1.5-flash')->generateContent(
                "Hãy gợi ý 3 món ăn ngon từ nguyên liệu: $ingredients. " .
                "Chỉ trả về định dạng JSON duy nhất theo cấu trúc này, không thêm chữ nào khác, không dùng markdown: " .
                "{ \"recipes\": [ { \"name\": \"Tên món\", \"description\": \"Mô tả ngắn\" } ] }"
            );

            $textResponse = $result->text();
            Log::info("2. Gemini trả về thô: " . $textResponse);

            // --- LÀM SẠCH DỮ LIỆU ---
            $cleanJson = str_replace(['```json', '```', 'json'], '', $textResponse);
            $cleanJson = trim($cleanJson);

            $data = json_decode($cleanJson, true);

            // Kiểm tra lỗi JSON
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error("3. Lỗi convert JSON: " . json_last_error_msg());
                return response()->json([
                    'recipes' => [
                        ['name' => 'Lỗi định dạng AI', 'description' => 'AI trả về dữ liệu lỗi. Vui lòng thử lại.']
                    ]
                ]);
            }

            return response()->json($data);

        } catch (\Exception $e) {
            // 👇 Phần này bắt lỗi nếu có
            Log::error("LỖI CONTROLLER: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}