<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ForgetPasswordRequest extends FormRequest
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
            "email" => "required|email|exists:users,email"
        ];
    }
    public function messages()
    {
        return [
            "username.required" => "Tên tài khoản là bắt buộc",
            "username.exists" => "Tên tài khoản không tồn tại",
            "email.required" => "Email là bắt buộc",
            "email.email" => "Email phải đúng định dạng",
            "email.exists" => "Email không tồn tại"
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw  new HttpResponseException(response()->json([
            "status" => true,
            "message" => "Lỗi xác thực dữ liệu",
            "errors" => $validator->errors()
        ], 422));
    }
}
