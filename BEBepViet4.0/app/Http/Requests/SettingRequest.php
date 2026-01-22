<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'logo'   => 'required|file|image|mimes:jpg,jpeg,png,webp|max:2048',
            'footer' => 'required|string|max:255',
            'gmail'  => 'required|email|max:255',
            'phone'  => 'required|string|max:30',
        ];
    }
    public function messages(): array
    {
        return [
            "logo.required" => "Logo là bắt buộc",
            "footer.required" => "Footer là bắt buộc",
            "gmail.required" => "Gmail là bắt buộc",
            "gmail.email" => "Gmail phải đúng định dạng",
            "phone.required" => "Số điện thoại là bắt buộc",
        ];
    }
}
