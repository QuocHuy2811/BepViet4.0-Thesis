<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use Illuminate\Http\Request;

class RecipeController extends Controller
{
    //Nguyen Kien Duy 21/01/2026 14:00
    public function chiTietCongThuc(string $slug)
    {
        $recipe = Recipe::with("user")->with("ingredients")->withWhereHas("steps", function ($query) {
            $query->orderBy("step_number", "asc");
        })->where("slug", $slug)->first();
        if (!$recipe) {
            return response()->json([
                "status" => false,
                "message" => "Không tìm thấy món ăn"
            ], 404);
        }
        $recipe->increment("views", 1);
        return response()->json([
            "status" => true,
            "recipe" => $recipe
        ], 200);
    }
}
