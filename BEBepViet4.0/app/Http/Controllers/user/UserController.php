<?php

namespace App\Http\Controllers\user;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgetPasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\SignupRequest;
use App\Mail\ForgetPasswordMail;
use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\CreateCookbookRequest;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Support\Str;

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

    //Phan Lac An 22/01/2026
    public function xoaCookbook(Request $request, $id)
    {
        // Tìm cookbook thuộc về user đang đăng nhập để đảm bảo tính bảo mật
        $cookbook = $request->user()->cookbooks()->find($id);

        if (!$cookbook) {
            return response()->json([
                "status" => false,
                "message" => "Không tìm thấy bộ sưu tập hoặc bạn không có quyền xóa"
            ], 404);
        }

        $cookbook->delete();

        return response()->json([
            "status" => true,
            "message" => "Xóa bộ sưu tập thành công"
        ], 200);
    }

    //Nguyen Kien Duy 21/01/2025 10:00
    public function forgetPassword(ForgetPasswordRequest $request)
    {
        $token = Str::random(64);
        DB::table("forget_password")->updateOrInsert([
            "username" => $request->username,
            "email" => $request->email,
        ], [

            "token" => $token,
            "expires_at" => now()->addMinutes(60)
        ]);
        $link = "http://localhost:3000/reset-password/" . $token;
        Mail::to($request->email)->send(new ForgetPasswordMail($link));
        return response()->json([
            "status" => true,
            "message" => "Đã gửi mail"
        ]);
    }
    //Nguyen Kien Duy 21/01/2025 10:00
    public function resetPassword(ResetPasswordRequest $request)
    {
        $updatePassword = DB::table("forget_password")
            ->where("username", $request->username)
            ->where("email", $request->email)
            ->where("token", $request->token)
            ->first();
        if (!$updatePassword || now()->gt($updatePassword->expires_at)) {
            return response()->json([
                "status" => false,
                "message" => "Token không tồn tại hoặc token đã hết hạn"
            ], 400);
        }
        $update = User::where("username", $request->username)->update(["password" => Hash::make($request->password)]);
        DB::table("forget_password")
            ->where("username", $request->username)
            ->where("email", $request->email)
            ->where("token", $request->token)->delete();
        return response()->json([
            "status" => true,
            "message" => "Cập nhật mật khẩu thành công"
        ], 200);
    }

    //Nguyen Kien Duy 21/01/2026
    public function follow(Request $request)
    {
        $exists = Follow::where("follower_id", $request->user()->id)->where("followed_id", $request->user_id)->exists();
        if ($exists) {
            return response()->json([
                "status" => false,
                "message" => "Bạn đã theo dõi người này"
            ], 400);
        }
        Follow::insert([
            "follower_id" => $request->user()->id,
            "followed_id" => $request->user_id
        ]);
        return response()->json([
            "status" => true,
            "message" => "Theo dõi người dùng này thành công"
        ], 200);
    }
}
