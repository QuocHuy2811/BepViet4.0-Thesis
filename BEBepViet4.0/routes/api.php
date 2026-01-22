<?php

use App\Http\Controllers\admin\AdminController;
use App\Http\Controllers\admin\HomeController as AdminHomeController;
use App\Http\Controllers\user\CookbookController;
use App\Http\Controllers\user\HomeController;
use App\Http\Controllers\user\RecipeController;
use App\Http\Controllers\user\UserController;
use App\Http\Middleware\checkAdmin;
use App\Http\Middleware\checkStatusUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;










//Nguyen Kien Duy 18/01/2026 8:00
//Nguyen Kien Duy 19/01/2026 12:46 (Cap nhat)
Route::post("/dang-ky", [UserController::class, "dangKy"]);
Route::post("/dang-nhap", [UserController::class, "dangNhap"]);
Route::middleware(['auth:sanctum', checkStatusUser::class])->group(function () {
    Route::post("/dang-xuat", [UserController::class, "dangXuat"]);
    Route::get("/bai-viet-followed", [HomeController::class, "timBaiVietCuaFollow"]); //(Cap nhat)
    Route::get("/nguoi-dung", function (Request $request) {
        return response()->json($request->user());
    });
    Route::get("/cookbook", [CookbookController::class, "loadCookbook"]);
    Route::post("/add-recipe-to-cookbook", [CookbookController::class, "themMonAnVaoCookbook"]);
    Route::post("/follow", [UserController::class, "follow"]);
});
//Nguyen Kien Duy 18/01/2026 8:00
//Nguyen Kien Duy 19/01/2026 12:46 (Cap nhat)



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
    });
});
