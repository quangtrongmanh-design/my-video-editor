# VIP Video Studio — phiên bản phát triển 0.2.0

Ứng dụng Expo + React Native dùng chung mã nguồn cho Android và iOS. Gói này nối thêm trình cắt video native bằng `react-native-video-trim`.

## Đã có trong mã nguồn
- Giao diện tiếng Việt và chọn video từ thư viện.
- Xem trước video bằng `expo-video`.
- Nút **Cắt video** mở trình biên tập native, nhận sự kiện hoàn tất, cập nhật video đầu ra và yêu cầu lưu vào thư viện.
- Khung quảng cáo riêng và lớp trừu tượng để thay nhà cung cấp quảng cáo sau này.

## Chưa có / chưa được kiểm thử trên thiết bị thật
- Ghép nhiều clip vào một video, chèn chữ/nhạc, hiệu ứng, bộ lọc và chuyển cảnh.
- Quản lý dự án bền vững, giao diện quản trị chiến dịch quảng cáo, tích hợp SDK quảng cáo thật, phân tích doanh thu và quy trình đồng ý quyền riêng tư.
- Bản APK/AAB hoặc bản iOS đã ký để phát hành.

## Cách chạy

Cần cài Node.js LTS, Android Studio cho Android; để build iOS cần macOS và Xcode. Vì trình cắt dùng mã native, **Expo Go không hỗ trợ**; cần development build hoặc native build.

```bash
npm install
npx expo prebuild
# Android
npx expo run:android
# iOS (macOS + Xcode)
npx expo run:ios
```

Trước khi phát hành, cần kiểm tra phiên bản `react-native-video-trim` tương thích với Expo SDK/React Native đang dùng, quyền truy cập thư viện, cấu hình iOS/Android, và kiểm thử với video thực tế trên cả hai nền tảng. Nếu dependency cần chỉnh phiên bản, hãy làm theo hướng dẫn cài đặt chính thức của thư viện.

## Quảng cáo
`src/ads/` vẫn giữ kiến trúc provider độc lập. Hiện tại đây chỉ là khung và quảng cáo mẫu; chưa có quảng cáo mạng thật hay doanh thu. Không được đưa secret key vào ứng dụng di động.
