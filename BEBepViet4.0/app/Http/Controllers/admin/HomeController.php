<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $users = User::count();
        $recipes = Recipe::count();
        $blogs = Blog::count();
        $recipes_month = Recipe::selectRaw("Month(created_at) as month, COUNT(*) as revenue")
            ->whereYear("created_at", date("Y"))
            ->groupByRaw("Month(created_at)")
            ->get();
        $user_month = User::selectRaw("Month(created_at) as month, COUNT(*) as revenue")
            ->whereYear("created_at", date("Y"))
            ->groupByRaw("Month(created_at)")
            ->get();

        
        return response()->json([
            "status" => true,
            "nguoi_dung" => $users,
            "cong_thuc" => $recipes,
            "bai_viet" => $blogs,
            "recipes" => $recipes_month,
            "users" => $user_month
        ], 200);
    }
}
