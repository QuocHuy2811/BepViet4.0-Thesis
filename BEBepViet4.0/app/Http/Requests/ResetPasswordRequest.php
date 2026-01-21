<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ResetPasswordRequest extends FormRequest
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
            "username" => "required|exists:users,username",
            "email" => "required|email|exists:users,email",
            "token" => 'required',
            "password" => "required|string|min:6|confirmed",
            "password_confirmation" => "required"
        ];
    }
    public function messages()
    {
        return [
            "username.required" => "Tên tài khoản là bắt buộc",
            "username.exists" => "Tên tài khoản không tồn tại",
            "email.required" => "Email là bắt buộc",
            "email.email" => "Email phải đúng định dạng",
            "email.exists" => "Email không tồn tại",
            "token.required" => "Token là bắt buộc",
            "password.required" => "Mật khẩu là bắt buộc",
            "password.min" => "Mật khẩu có độ dài tối thiểu là :min",
            "password.confirmed" => "Mật khẩu nhập lại không khớp",
            "password_confirmation" => "Nhập lại mật khẩu là bắt buộc"
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            "status" => false,
            "message" => "Lỗi nhập dữ liệu",
            "errors" => $validator->errors()
        ], 422));
    }
}
