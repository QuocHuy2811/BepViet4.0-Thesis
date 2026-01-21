<?php

use App\Http\Controllers\user\HomeController;
use App\Http\Controllers\user\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\user\ExploreController;
use App\Http\Controllers\user\CategoryController;
use App\Http\Controllers\admin\ReportController;


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
    //Phan Lac An 21/01/2026
    Route::get("/profile-info", [UserController::class, "thongTinProfile"]);
    Route::post("/profile-update", [UserController::class, "capNhatProfile"]);
    Route::post("/cookbooks/create", [UserController::class, "taoCookbook"]);
});
Route::get("/", [HomeController::class, "index"]);
//Nguyen Kien Duy 18/01/2026 8:00
//Nguyen Kien Duy 19/01/2026 12:46 (Cap nhat)


//Phan Lac An 20/01/2026
Route::get('/recipes/search', [ExploreController::class, 'searchFilter']);
Route::get('/categories', [CategoryController::class, 'listCategories']);

//----------Admin Routes----------//
//Phan Lac An 20/01/2026
Route::get('/reports', [ReportController::class, 'listReports']);