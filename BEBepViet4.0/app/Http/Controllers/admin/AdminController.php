<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function dangNhap(LoginRequest $request)
    {

        if (Auth::attempt(["username" => $request->username, "password" => $request->password])) {
            return response()->json([
                "status" => true,
                "message" => "Đăng nhập thành công",
                "token" => Auth::user()->createToken("API TOKEN")->plainTextToken,
                "token_type" => "Bearer",
                "user" => $request->user()
            ], 200);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Đăng nhập thất bại",

            ], 401);
        }
    }
    public function dangXuat(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();
        return response()->json([
            "status" => true,
            "message" => "Đăng xuất thành công"
        ], 200);
    }
}
