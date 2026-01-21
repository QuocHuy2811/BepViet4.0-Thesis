<?php

namespace App\Http\Controllers\user;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;
class AiChefController extends Controller
{
    public function suggestRecipes(Request $request)
    {
        $request->validate([
            'ingredients' => 'required|string',
        ]);
        $ingredients = $request->input('ingredients');
        $apiKey = config('services.gemini.key'); 

        $prompt = "
          Dữ liệu đầu vào từ người dùng (USER_INPUT): \"$ingredients\".
          Yêu cầu cao nhất: (phải đưa ra được vài món ít nhất là 3)
          - Ngôn ngữ: Tiếng Việt chuẩn 100%, trang trọng. TUYỆT ĐỐI KHÔNG dùng tiếng Trung , không dùng tiếng Anh bồi vào.
        -ƯU TIÊN PHƯƠNG PHÁP TRUYỀN THỐNG
          - với các kết quả trả ra là các công thức (các món) có độ khó: dễ , trung  bình , khó xen lẫn nhau 
          PHẦN 1: VAI TRÒ & TƯ DUY (PERSONAL)
          Bạn là một Nghệ nhân Ẩm thực Việt Nam lão luyện và là chuyên gia về Cơm Nhà.
          - Phong cách: Chuyên nghiệp, tinh tế, am hiểu sâu sắc văn hóa ẩm thực 3 miền.
          - Ngôn ngữ: Tiếng Việt chuẩn 100%, trang trọng. 
          PHẦN 2: PHÂN TÍCH & XỬ LÝ (LOGIC)
          Hãy phân tích 'USER_INPUT' và tự động chọn 1 trong 3 kịch bản sau để trả lời:

          ➤ TRƯỜNG HỢP 1: NẾU 'USER_INPUT' LÀ TÊN MỘT MÓN ĂN CỤ THỂ (Ví dụ: \"Phở bò\", \"Bún chả\")
             - Nhiệm vụ: Hướng dẫn cách nấu món đó chuẩn vị nhà hàng nhất (với các bước làm càng chi tiết càng tốt).
           

          ➤ TRƯỜNG HỢP 2: NẾU 'USER_INPUT' LÀ DANH SÁCH NGUYÊN LIỆU (Ví dụ: \"thịt gà, gừng\", \"trứng, cà chua\")
             - Nhiệm vụ: phối hợp các nguyên liệu đó để tạo ra vài món ngon nhất chuẩn vị cơm nhà Việt Nam.
             - Yêu cầu: Phải tận dụng tối đa nguyên liệu người dùng có. (với các bước làm càng chi tiết càng tốt)

          ➤ TRƯỜNG HỢP 3: NẾU 'USER_INPUT' HỎI VỀ VĂN HÓA / VÙNG MIỀN / THỰC ĐƠN (Ví dụ: \"Món ăn ngày Tết\", \"Đặc sản Huế\")
             - Nhiệm vụ: Đóng vai hướng dẫn viên ẩm thực, tuyển chọn các món đại diện xuất sắc nhất cho chủ đề đó.
             - Mô tả (description): Phải lồng ghép câu chuyện văn hóa hoặc nguồn gốc của món ăn.
             -Yêu cầu: (với các bước làm càng chi tiết càng tốt)

          PHẦN 3: YÊU CẦU CHI TIẾT CHO TỪNG MÓN (BẮT BUỘC)
          1. Tên món:  phải ý nghĩa và thật chính xác.
          2. Mô tả: Viết 3-4 câu hấp dẫn, miêu tả hương vị, màu sắc, khơi gợi vị giác.
          3. Nguyên liệu (hãy liệt kê ra các nguyên liệu thật chính xác và thật chuẩn định lượng ):
             - Định lượng chính xác (gram, kg, ml, thìa...).
             - Đơn vị đo lường Tiếng Việt chuẩn: 'thìa cà phê', 'muỗng canh'.
             - không dùng  
          4. Các bước làm (steps) nhắc lại là càng chi tiết càng tốt:
             - Hướng dẫn cực kỳ chi tiết (thật thật chi tiết càng chi tiết càng tốt), bao gồm nhiệt độ lửa và thời gian.
             - Thêm các mẹo (tips) của đầu bếp.
            - CẤM: Không được đánh số thứ tự (1, 2, 3...) hay ghi 'Bước 1' ở đầu câu. Chỉ ghi nội dung hành động.

          PHẦN 4: ĐỊNH DẠNG ĐẦU RA (JSON)
          Dù rơi vào trường hợp nào, bạn cũng CHỈ được trả về duy nhất một JSON Object theo cấu trúc sau (không markdown, không lời dẫn):
          {
             \"recipes\": [

                {
                    \"name\": \"Tên món\",

                    \"description\": \"Mô tả \",

                    \"cookingTime\": \"Thời gian nấu\",

                    \"difficulty\": \"Độ khó\",

                    \"ingredients\": [{\"name\": \"...\" không thêm định lượng ở trước, \"quantity\": \"...\"}] ,

                    \"steps\": [\"...\", \"...\"]
                }
            ]
          }
        ";

        try {
            /** @var \Illuminate\Http\Client\Response $response */
            $response = Http::withoutVerifying()
            ->timeout(60)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . $apiKey, 
                ])
                ->post("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", [
                    'model' => 'gemini-2.5-flash',
                    'messages' => [
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ]
                    ],
                    'response_format' => ['type' => 'json_object']
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $rawText = $data['choices'][0]['message']['content'] ?? '';
                
                $recipes = json_decode($rawText, true);                    // biến chuỗi json về mảng php
                return response()->json(['data' => $recipes]);

            } else {
                Log::error('API Error', $response->json());
                return response()->json([
                    'error' => 'Lỗi kết nối API đầu bếp ', 
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error($e);
            return response()->json(['error' => 'Lỗi Server: ' . $e->getMessage()], 500);
        }
    }
}