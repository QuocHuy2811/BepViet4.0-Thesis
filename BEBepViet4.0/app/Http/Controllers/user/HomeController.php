<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Models\Follow;
use App\Models\Recipe;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $luot_xem_nhieu_nhat = Recipe::with("user")->orderBy("views", "desc")->limit(10)->get();
        $danh_sach_bai_dang = Recipe::with("user")->selectRaw("recipes.*,(views-1)/(POW(TIMESTAMPDIFF(HOUR,created_at,NOW()) +2,1.8)) as score")->orderBy("score", "desc")->paginate(9);
        return response()->json([
            "status" => true,
            "luot_xem_nhieu_nhat" => $luot_xem_nhieu_nhat,
            "danh_sach" => $danh_sach_bai_dang,
        ], 200);
    }
    public function timBaiVietCuaFollow(Request $request)
    {
        $mang_nguoi_dung_hien_tai_follow = Follow::where("follower_id", $request->user()->id)->pluck("followed_id");
        $bai_dang_cua_followed = Recipe::with("user")->whereIn("id", $mang_nguoi_dung_hien_tai_follow)->paginate(9);
        return response()->json([
            "status" => true,
            "danh_sach" => $bai_dang_cua_followed
        ], 200);
    }
}
