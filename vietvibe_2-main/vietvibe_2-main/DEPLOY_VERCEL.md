# Deploy VietVibe lên Vercel

1. Import repository `leetaun/vietvibe_2`, nhánh `main`.
2. Đặt **Root Directory** thành `vietvibe_2-main/vietvibe_2-main`, chọn preset **Vite**.
3. Thêm Environment Variables cho **Production and Preview**:

   | Key | Value |
   | --- | --- |
   | `GEMINI_API_KEY` | API key của bạn |
   | `GEMINI_TEXT_MODEL` | `gemini-3.8-flash` |
   | `GEMINI_IMAGE_MODEL` | `gemini-nano-banana-2.1` |

4. Bấm **Deploy**. Nếu đã deploy trước đó, chọn **Redeploy** sau khi cập nhật các biến môi trường.

`vercel.json` đặt lệnh cài dependency, build và thư mục đầu ra `dist`.
Các file `api/ai/*.ts` cung cấp API Gemini trên cùng domain với giao diện,
với thời gian chạy tối đa 180 giây. Không cần chạy `npm start` hay cấu hình `PORT` trên Vercel.

API key chỉ được đọc ở server. Không đặt tên key thành `VITE_GEMINI_API_KEY`
và không đưa `.env.local` lên GitHub.

Sau deployment, mở `/api/ai/status`: phản hồi phải là JSON và `configured` phải là `true`.
Sau đó thử tạo gợi ý phối đồ và thử đồ bằng ảnh.

Ảnh thử đồ được thu nhỏ và nén trước khi gửi. Vercel giới hạn cả request và response
của Function ở 4.5 MB; ảnh kết quả vượt giới hạn sẽ có thông báo để tạo lại.
Xem [giới hạn Vercel Functions](https://vercel.com/docs/functions/limitations).

Lệnh chạy trên máy vẫn là `npm run dev`; API và giao diện dùng chung cổng 3000.
