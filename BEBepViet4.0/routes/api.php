<?php
//
use App\Http\Controllers\RecipeController;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route công khai (Ai cũng xem được danh mục)
Route::get('/categories', function () {
    return Category::select('id', 'name')->get();
});

// Route YÊU CẦU ĐĂNG NHẬP (Token hợp lệ mới vào được đây)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Di chuyển route đăng bài vào trong nhóm này
    Route::post('/recipes', [RecipeController::class, 'store']);
});
