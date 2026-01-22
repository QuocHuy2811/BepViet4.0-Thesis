<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class UserCategoryController extends Controller
{
    //Phan Lạc An 20/01/2026
    public function listCategories()
    {
        $categories = Category::getList();
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
}
