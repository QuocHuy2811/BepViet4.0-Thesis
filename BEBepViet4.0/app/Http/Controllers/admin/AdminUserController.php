<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    // 1. Lấy danh sách tất cả người dùng
    public function index()
    {
        // Lấy tất cả user, sắp xếp mới nhất lên đầu
        $users = User::orderBy('id', 'desc')->get();
        
        return response()->json([
            'status' => true,
            'data' => $users
        ]);
    }

    // 2. Cập nhật trạng thái (Khóa/Mở khóa)
    public function updateStatus(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }

        // Validate đầu vào (chỉ nhận 0 hoặc 1)
        $request->validate([
            'status' => 'required|in:0,1' 
        ]);

        // Cập nhật status
        $user->status = $request->status;
        $user->save();

        $message = ($request->status == 1) ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản';

        return response()->json([
            'status' => true,
            'message' => $message,
            'user' => $user
        ]);
    }
}