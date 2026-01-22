<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class checkStatusUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $status = $request->user()->status;
        if ($status == 0) {
            return $next($request);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Tài khoản của bạn đã bị khóa, vui lòng liên hệ admin để mở khóa nếu bạn cho rằng đây chỉ là sự nhầm lẫn"
            ], 403);
        }
    }
}
