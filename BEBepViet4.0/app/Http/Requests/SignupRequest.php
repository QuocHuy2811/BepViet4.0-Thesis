<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class SignupRequest extends FormRequest
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
            "username" => "required|alpha_dash|unique:users,username|min:5|max:50",
            "email" => "required|email",
            "password" => "required|string|min:6|confirmed",
            "full_name" => "required|string|max:100",
            "img_avatar" => "nullable|mimes:png,jpeg,jpg|max:3000",
            "password_confirmation" => "required"
        ];
    }
    public function messages()
    {
        return [
            "username.required" => "Tên tài khoản là bắt buộc",
            "username.alpha_dash" => "Tên tài khoản chỉ chứa ký tự chữ, số, dấu - và dấu _",
            "username.unique" => "Tên tài khoản đã tồn tại",
            "username.min" => "Tên tài khoản phải tối thiểu là :min ký tự",
            "username.max" => "Tên tài khoản chỉ được tối đa là :max ký tự",
            "email.required" => "Email là bắt buộc",
            "email.email" => "Email phải đúng định dạng",
            "password.required" => "Trường Mật khẩu là bắt buộc",
            "password.min" => "Trường Mật khẩu tối thiểu phải có :min ký tự",
            "password.confirmed" => "Xác nhận mật khẩu không khớp",
            "full_name.required" => "Tên người dùng là bắt buộc",
            "full_name.max" => "Tên người dùng chỉ được tối đa :max ký tự",
            "img_avatar.mimes" => "Ảnh Đại Diện chỉ được là :values",
            "img_avatar.max" => "Ảnh Đại Diện tối đa là :max KB",
            "password_confirmation.required" => "Đặt lại mật khẩu là bắt buộc"
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            "status" => false,
            "message" => "Lỗi xác thực dữ liệu",
            "errors" => $validator->errors()
        ], 422));
    }
}
