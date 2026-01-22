<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class checkAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()->role == "admin") {
            return $next($request);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Bạn không đủ quyền để vào trang này"
            ], 403);
        }
    }
}
