<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddRecipeToCoobookRequest;
use App\Models\Cookbook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class CookbookController extends Controller
{
    public function loadCookbook(Request $request)
    {
        $cookbooks = Cookbook::where("user_id", $request->user()->id)->get();
        return response()->json([
            "status" => true,
            "cookbook" => $cookbooks
        ]);
    }
    public function themMonAnVaoCookbook(AddRecipeToCoobookRequest $request)
    {
        $cookbook = Cookbook::find($request->cookbook_id);
        if (Gate::allows("addCookbook", $cookbook->user_id)) {
            $exists = DB::table("recipe_cookbooks")
                ->where("cookbook_id", $request->cookbook_id)
                ->where("recipe_id", $request->recipe_id)
                ->exists();
            if ($exists) {
                return response()->json(['message' => 'Món ăn đã tồn tại trong bộ sưu tập này'], 400);
            }
            DB::table("recipe_cookbooks")->insert([
                "cookbook_id" => $request->cookbook_id,
                "recipe_id" => $request->recipe_id
            ]);
            return response()->json([
                "status" => true,
                "message" => "Thêm món ăn vào cookbook thành công"
            ], 200);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Bạn không có quyền thêm món ăn vào cookbook này"
            ], 403);
        }
    }
}
