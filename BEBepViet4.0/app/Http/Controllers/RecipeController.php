<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use App\Models\Ingredient;
use App\Models\Step;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RecipeController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validate
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'cook_time' => 'required|integer',
            'difficult' => 'required|string',
            'region' => 'required|string',
            'image' => 'nullable|image|max:10240', // Ảnh đại diện
            'ingredients' => 'required|array',

            // Validate ảnh trong từng bước
            'steps' => 'required|array',
            'steps.*.content' => 'required|string',
            'steps.*.image' => 'nullable|image|max:5120',
        ]);

        DB::beginTransaction();
        try {
            // Xử lý ảnh đại diện món ăn
            $mainImagePath = '';
            if ($request->hasFile('image')) {
                $mainImagePath = $request->file('image')->store('recipes', 'public');
            }

            // Tạo Slug & Recipe (Giữ nguyên logic cũ)
            $originalSlug = Str::slug($request->title);
            $slug = $originalSlug;
            $count = 1;
            while (Recipe::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }

            $recipe = Recipe::create([
                'user_id' => $request->user()->id, // <--- LẤY ID TỪ TOKEN NGƯỜI DÙNG
                'category_id' => $request->category_id,
                'title' => $request->title,
                'slug' => $slug,
                'description' => $request->description,
                'region' => $request->region,
                'difficult' => $request->difficult,
                'cook_time' => $request->cook_time,
                'img_path' => $mainImagePath,
                'views' => 0
            ]);

            // Lưu Ingredients (Giữ nguyên)
            if ($request->has('ingredients')) {
                foreach ($request->ingredients as $ing) {
                    if (!empty($ing['name'])) {
                        Ingredient::create([
                            'recipe_id' => $recipe->id,
                            'name' => $ing['name'],
                            'amount' => $ing['amount'] ?? '',
                            'note' => $ing['note'] ?? ''
                        ]);
                    }
                }
            }

            // --- LƯU CÁC BƯỚC (CÓ XỬ LÝ ẢNH) ---
            if ($request->has('steps')) {
                // Lưu ý: $request->steps trả về mảng dữ liệu text.
                // Để lấy file, ta cần dùng $request->file("steps.$index.image")

                foreach ($request->steps as $index => $step) {
                    if (!empty($step['content'])) {

                        $stepImagePath = '';
                        // Kiểm tra xem bước thứ $index có gửi file ảnh lên không
                        if ($request->hasFile("steps.$index.image")) {
                            $stepImagePath = $request->file("steps.$index.image")->store('steps', 'public');
                        }

                        Step::create([
                            'recipe_id' => $recipe->id,
                            'step_number' => $step['stepNumber'], // Hoặc $index + 1
                            'content' => $step['content'],
                            'step_image' => $stepImagePath // <--- LƯU ĐƯỜNG DẪN ẢNH VÀO DB
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json(['message' => 'Đăng bài thành công!', 'data' => $recipe], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi Server: ' . $e->getMessage()], 500);
        }
    }
}