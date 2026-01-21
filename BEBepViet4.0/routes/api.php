<?php


use App\Http\Controllers\user\HomeController;
use App\Http\Controllers\user\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


//Nguyen Kien Duy 18/01/2026 8:00
//Nguyen Kien Duy 19/01/2026 12:46 (Cap nhat)
Route::post("/dang-ky", [UserController::class, "dangKy"]);
Route::post("/dang-nhap", [UserController::class, "dangNhap"]);
Route::middleware('auth:sanctum')->group(function () {
    Route::post("/dang-xuat", [UserController::class, "dangXuat"]);
    Route::get("/bai-viet-followed", [HomeController::class, "timBaiVietCuaFollow"]); //(Cap nhat)
    Route::get("/user", function (Request $request) {
        return response()->json([
            "status" => true,
            "user" => $request->user()
        ]);
    });
});
Route::get("/", [HomeController::class, "index"]);
//Mguyen Kien Duy 21/01/2026 11:00
Route::post("/forget-password", [UserController::class, "forgetPassword"]);
Route::post("/reset-password", [UserController::class, "resetPassword"]);
//Mguyen Kien Duy 21/01/2026 11:00
//Nguyen Kien Duy 18/01/2026 8:00
//Nguyen Kien Duy 19/01/2026 12:46 (Cap nhat)

//
use App\Http\Controllers\RecipeController;
use App\Models\Category;


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

use App\Http\Controllers\user\AiChefController;
use App\Http\Controllers\admin\CategoryController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// api load danh sách categories
Route::get('/admin/categories', [CategoryController::class, 'index'])->name('category.index');
// api add category
Route::post('admin/categories/add', [CategoryController::class, 'store'])->name('category.store');
// api update category
Route::get('admin/categories/{id}', [CategoryController::class, 'show'])->name('category.show');
Route::put('admin/categories/{id}', [CategoryController::class, 'update'])->name('category.update');
//api gợi ý món ăn bằng AI
Route::post('/ai/suggest-recipes', [AiChefController::class, 'suggestRecipes']);
