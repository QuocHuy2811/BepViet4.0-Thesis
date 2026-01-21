<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProfileRequest extends FormRequest
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
        $userId = $this->user()->id; // Lấy ID của người dùng đang đăng nhập

        return [
            "full_name"=> "nullable|string|max:100",
            "username"=> "nullable|string|max:50|unique:users,username," . $userId,
            "email"=> "nullable|email|max:255|unique:users,email," . $userId,
            "bio"=> "nullable|string|max:150",
            "img_avatar"=> "nullable|image|mimes:jpeg,png,jpg,gif|max:2048",
        ];
    }

    public function messages(): array
    {
        return [
            "username.unique" => "Tên đăng nhập này đã tồn tại",
            "email.unique"    => "Địa chỉ email này đã được đăng ký",
            "email.email"     => "Định dạng email không hợp lệ",
            "img_avatar.image" => "Tập tin phải là định dạng hình ảnh",
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            "status" => false,
            "message" => "Dữ liệu không hợp lệ",
            "errors" => $validator->errors()
        ], 422));
    }
}
