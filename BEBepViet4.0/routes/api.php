<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
