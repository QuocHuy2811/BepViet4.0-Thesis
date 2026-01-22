<?php

use App\Http\Controllers\admin\AdminUserController; //Huy 21/01/2026
use App\Http\Controllers\admin\AdminController;
use App\Http\Controllers\admin\HomeController as AdminHomeController;
use App\Http\Controllers\user\CookbookController;
use App\Http\Controllers\user\HomeController;
use App\Http\Controllers\user\RecipeController;
use App\Http\Controllers\user\UserController;
use App\Http\Controllers\user\AiChefController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\user\UserCategoryController;
use App\Http\Middleware\checkAdmin;
use App\Http\Middleware\checkStatusUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\user\ExploreController;
use App\Http\Controllers\admin\ReportController;

use App\Http\Controllers\user\BlogController;
use App\Http\Controllers\Admin\SettingController;

//Nguyen Kien Duy 18/01/2026 8:00
//Nguyen Kien Duy 19/01/2026 12:46 (Cap nhat)
Route::post("/dang-ky", [UserController::class, "dangKy"]);
Route::post("/dang-nhap", [UserController::class, "dangNhap"]);

// Mở Group Middleware User
Route::middleware(['auth:sanctum', checkStatusUser::class])->group(function () {
    Route::post("/dang-xuat", [UserController::class, "dangXuat"]);
    Route::get("/bai-viet-followed", [HomeController::class, "timBaiVietCuaFollow"]); //(Cap nhat)

    //api gợi ý món ăn bằng AI
    Route::post('/ai/suggest-recipes', [AiChefController::class, 'suggestRecipes']);
    
    
    Route::get("/", [HomeController::class, "index"]);

    Route::get("/user", function (Request $request) {
        return response()->json([
            "status" => true,
            "user" => $request->user()
        ]);
    });

    //Phan Lac An 21/01/2026
    Route::get("/profile-info", [UserController::class, "thongTinProfile"]);
    Route::post("/profile-update", [UserController::class, "capNhatProfile"]);
    Route::post("/cookbooks/create", [UserController::class, "taoCookbook"]);
    Route::delete("/cookbooks/{id}", [UserController::class, "xoaCookbook"]);
    Route::delete("/recipes/{id}", [UserController::class, "xoaRecipe"]);
    Route::delete("/blogs/{id}", [UserController::class, "xoaBlog"]);
    Route::post("/recipes/update/{id}", [UserController::class, "capNhatRecipe"]);
    Route::get("/recipe-edit-data/{id}", [UserController::class, "layDuLieuSuaRecipe"]);

    Route::get("/nguoi-dung", function (Request $request) {
        return response()->json($request->user());
    });
    Route::get("/cookbook", [CookbookController::class, "loadCookbook"]);
    Route::post("/add-recipe-to-cookbook", [CookbookController::class, "themMonAnVaoCookbook"]);
    Route::post("/follow", [UserController::class, "follow"]);

    //Mguyen Kien Duy 21/01/2026 11:00
    Route::post('/blogs', [BlogController::class, 'blog']);
    Route::put('/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/blogs/{id}', [BlogController::class, 'delete']);

}); // <-- Đóng Group Middleware User tại đây là chính xác

Route::get('/settings', [SettingController::class, 'index']);
Route::match(['POST','PUT'], '/settings', [SettingController::class, 'update']);

Route::get("/home", [HomeController::class, "index"]);

//Mguyen Kien Duy 21/01/2026 11:00
Route::post("/forget-password", [UserController::class, "forgetPassword"]);
Route::post("/reset-password", [UserController::class, "resetPassword"]);

//Phan Lac An 20/01/2026
Route::get('/recipes/search', [ExploreController::class, 'searchFilter']);
Route::get('/categories', [UserCategoryController::class, 'listCategories']);

//----------Admin Routes----------//
//Phan Lac An 20/01/2026
Route::get('/reports', [ReportController::class, 'listReports']);
Route::get('/blogs', [BlogController::class, 'index']);


use App\Http\Controllers\RecipeController as OutRecipeController;
use App\Models\Category;


Route::get('/categoriess', function () {
    return Category::select('id', 'name')->get();
});


// Route YÊU CẦU ĐĂNG NHẬP (Token hợp lệ mới vào được đây)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/recipes', [OutRecipeController::class, 'store']);
    // --- KHU VỰC ADMIN ---
    Route::prefix('admin')->group(function () {
        // Lấy danh sách user: GET /api/admin/users
        Route::get('/users', [AdminUserController::class, 'index']);

        // Cập nhật trạng thái: PUT /api/admin/users/{id}/status
        Route::put('/users/{id}/status', [AdminUserController::class, 'updateStatus']);
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get("/", [HomeController::class, "index"]);
// Nguyen Kien Duy 21/01/2026 14:07
Route::get("/recipe/{slug}", [RecipeController::class, "chiTietCongThuc"]);
//Nguyen Kien Duy 21/01/2026 11:00
Route::post("/forget-password", [UserController::class, "forgetPassword"]);
Route::post("/reset-password", [UserController::class, "resetPassword"]);
//Nguyen Kien Duy 21/01/2026 11:00


//Nguyen Kien Duy 22/01/2026 
Route::prefix('/admin')->group(function () {
   
    Route::post("/dang-nhap", [AdminController::class, "dangNhap"]);

    Route::middleware(["auth:sanctum", checkAdmin::class])->group(function () {
        Route::post("/dang-xuat", [AdminController::class, "dangXuat"]);
        Route::get('/', [AdminHomeController::class, "index"]);
         // api load danh sách categories
    Route::get('/categories', [CategoryController::class, 'index'])->name('category.index');
    // api add category
    Route::post('/categories/add', [CategoryController::class, 'store'])->name('category.store');
    // api update category
    Route::get('/categories/{id}', [CategoryController::class, 'show'])->name('category.show');
    Route::put('/categories/{id}', [CategoryController::class, 'update'])->name('category.update');
    });
    
});