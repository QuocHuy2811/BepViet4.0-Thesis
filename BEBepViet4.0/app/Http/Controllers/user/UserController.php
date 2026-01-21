<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\CreateCookbookRequest;
use App\Http\Requests\UpdateProfileRequest;

class UserController extends Controller
{
    //Nguyen Kien Duy 18/01/2026 9:36
    //Nguyen Kien Duy 19/01/2026 14:39
    public function dangKy(SignupRequest $request)
    {
        if ($request->hasFile("img_avatar")) {
            $path = $request->file("img_avatar")->store("avatars", "public");
        } else {
            $path = null;
        }
        $user = User::create([
            "username" => $request->username,
            "email" => $request->email,
            "password" => $request->password,
            "full_name" => $request->full_name,
            "img_avatar" => $path
        ]);
        return response()->json([
            "status" => true,
            "message" => "Đăng ký thành công"
        ], 201);
    }
    //Nguyen Kien Duy 19/01/2026 14:39
    public function dangNhap(LoginRequest $request)
    {

        if (Auth::attempt(["username" => $request->username, "password" => $request->password])) {
            /** @var \App\Models\User $user */
            $user = Auth::user();
            return response()->json([
                "status" => true,
                "message" => "Đăng nhập thành công",
                "token" => $user->createToken("API TOKEN")->plainTextToken,
                "token_type" => "Bearer"
            ], 200);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Đăng nhập thất bại"
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
    //Nguyen Kien Duy 18/01/2026 9:36

    //Phan Lac An 21/01/2026
    public function thongTinProfile(Request $request)
    {
        $user = $request->user()->getFullProfile();
        return response()->json([
            "status" => true,
            "user"   => $user
        ], 200);
    }

    //Phan Lac An 21/01/2026
    public function capNhatProfile(UpdateProfileRequest $request)
    {
        $data = $request->validated();
        
        $status = $request->user()->updateProfile(
            $data, // Truyền mảng dữ liệu bao gồm full_name, username, email, bio
            $request->file('img_avatar')
        );
        return response()->json([
            "status"  => $status,
            "message" => "Cập nhật thông tin thành công!",
            "user"    => $request->user()->fresh() // Trả về data mới nhất để React cập nhật giao diện
        ], 200);
    }

    //Phan Lac An 21/01/2026
    public function taoCookbook(CreateCookbookRequest $request)
    {
        $cookbook = $request->user()->createNewCookbook($request->name);
        return response()->json([
            "status" => true,
            "message" => "Tạo bộ sưu tập thành công",
            "data" => $cookbook
        ], 201);
    }
}
