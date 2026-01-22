<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\SettingRequest;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    // GET /api/settings
    public function index()
    {
        $setting = Setting::first();

        if (!$setting) {
            return response()->json([
                'data' => [
                    'id' => null,
                    'logo' => '',
                    'footer' => '',
                    'gmail' => '',
                    'phone' => '',
                ]
            ], 200);
        }

        return response()->json(['data' => $setting], 200);
    }

    // PUT /api/settings
    public function update(SettingRequest $request)
    {
        $setting = Setting::first() ?? new Setting();

        $path = $request->file('logo')->store('settings', 'public');

        if ($setting->exists && $setting->logo && Storage::disk('public')->exists($setting->logo)) {
            Storage::disk('public')->delete($setting->logo);
        }

        $setting->logo = $path;
        $setting->footer = $request->footer;
        $setting->gmail = $request->gmail;
        $setting->phone = $request->phone;

        $setting->save();

        return response()->json([
            'message' => 'Cập nhật cài đặt thành công',
            'data' => $setting
        ], 200);
    }

}
