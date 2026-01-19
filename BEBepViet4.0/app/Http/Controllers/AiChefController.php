<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;


class AiChefController extends Controller
{
    public function suggestRecipes(Request $request)
    {
        $request->validate([
            'ingredients' => 'required|string',
        ]);

        $ingredients = $request->input('ingredients');
        $apiKey = env('GEMINI_API_KEY');

        // 1. Kiểm tra API Key
        if (empty($apiKey)) {
            return response()->json([
                'error' => 'Chưa cấu hình GEMINI_API_KEY trong file .env của Laravel'
            ], 500);
        }
        
        $prompt = "
          Tôi có các nguyên liệu sau: \"$ingredients\".
          Hãy đóng vai một đầu bếp chuyên nghiệp của Bếp Việt. 
          Hãy gợi ý cho tôi chính xác 3 món ăn ngon.
          QUAN TRỌNG: Chỉ trả về duy nhất một JSON Array hợp lệ.
          Cấu trúc: [{\"name\": \"...\", \"description\": \"...\", \"cookingTime\": \"...\", \"difficulty\": \"...\", \"ingredients\": [{\"name\": \"...\", \"quantity\": \"...\"}], \"steps\": [\"...\"]}]
        ";

        try {
            // 2. Sử dụng Http::withoutVerifying() để fix lỗi SSL trên localhost
            $response = Http::withoutVerifying()
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key={$apiKey}", [
                    'contents' => [['parts' => [['text' => $prompt]]]],
                    'generationConfig' => ['responseMimeType' => 'application/json']
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $rawText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '[]';
                $cleanText = str_replace(['```json', '```'], '', $rawText);
                $recipes = json_decode($cleanText, true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                    return response()->json(['error' => 'AI trả về định dạng không hợp lệ', 'raw' => $cleanText], 500);
                }

                return response()->json(['data' => $recipes]);
            } else {
                // Log lỗi chi tiết ra file storage/logs/laravel.log
                Log::error('Gemini API Error', $response->json());
                return response()->json([
                    'error' => 'Lỗi kết nối Gemini API', 
                    'details' => $response->json() // Trả về chi tiết để Frontend hiển thị
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error($e);
            return response()->json(['error' => 'Lỗi Server: ' . $e->getMessage()], 500);
        }
    }
}