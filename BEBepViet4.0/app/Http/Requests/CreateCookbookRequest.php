<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateCookbookRequest extends FormRequest
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
            "name" => "required|string|max:255|unique:cookbooks,name,NULL,id,user_id," . $this->user()->id,
        ];
    }

    public function messages(): array
    {
        return [
            "name.required" => "Tên bộ sưu tập không được để trống",
            "name.unique"   => "Bạn đã có bộ sưu tập với tên này rồi",
        ];
    }

    // Trả về lỗi định dạng JSON đồng bộ với dự án của bạn
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            "status" => false,
            "message" => "Lỗi xác thực dữ liệu",
            "errors" => $validator->errors()
        ], 422));
    }
}
