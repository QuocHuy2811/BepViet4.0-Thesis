<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Recipe;

class ExploreController extends Controller
{
    //Phan Lạc An 19/01/2026
    public function searchFilter(Request $request)
    {
        $searchTerm = $request->query('query');
        
        // Nhận dữ liệu lọc từ Frontend dưới dạng mảng
        $filters = [
            'region' => $request->query('region'),
            'difficult' => $request->query('difficult'),
            'time_range' => $request->query('time_range'),
            'category_id' => $request->query('category_id'),
        ];

        // Kết hợp Search và Filter
        $recipes = Recipe::with(['user:id,full_name,img_avatar', 'tags', 'category:id,name'])
            ->withAvg('ratings', 'rating')
            ->search($searchTerm)     // Gọi hàm tìm kiếm
            ->filters($filters)       // Gọi hàm bộ lọc
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $recipes
        ]);
    }
}
