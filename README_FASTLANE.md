# Fastlane Setup cho dự án Hola

Fastlane đã được setup thành công! Dưới đây là hướng dẫn sử dụng:

## Cài đặt ban đầu

1. **Cài đặt dependencies:**
```bash
cd ios
bundle install
```

2. **Cấu hình environment variables:**
```bash
cd ios/fastlane
cp .env.default .env
# Chỉnh sửa file .env với thông tin thực tế của bạn
```

3. **Cập nhật Appfile:**
```bash
# Chỉnh sửa ios/fastlane/Appfile
# Bỏ comment và điền thông tin:
# - app_identifier
# - apple_id
# - team_id
```

## Các lanes có sẵn

### Testing
```bash
# Chạy tests
bundle exec fastlane test

# Build cho testing (không codesign)
bundle exec fastlane build_for_testing
```

### Building
```bash
# Build cho App Store
bundle exec fastlane build

# Build cho Ad Hoc distribution
bundle exec fastlane build_adhoc

# Build cho Development
bundle exec fastlane build_dev
```

### Deployment
```bash
# Deploy lên TestFlight
bundle exec fastlane beta

# Deploy lên App Store
bundle exec fastlane release
```

### Code Signing
```bash
# Sync certificates và provisioning profiles
bundle exec fastlane certificates

# Đăng ký device mới
bundle exec fastlane register_device name:"iPhone 15" udid:"device-udid-here"
```

### Screenshots
```bash
# Chụp screenshots tự động
bundle exec fastlane screenshots
```

## Cấu hình cần thiết

### 1. Apple Developer Account
- Apple ID
- Team ID
- App-specific password

### 2. App Store Connect
- Team ID
- App identifier

### 3. Match (Code Signing)
- Git repository cho certificates
- Match password

## Environment Variables

Tạo file `.env` trong `ios/fastlane/` với nội dung:

```bash
APPLE_ID=your-apple-id@email.com
FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD=your-app-specific-password
TEAM_ID=XXXXXXXXXX
ITC_TEAM_ID=123456789
APP_IDENTIFIER=com.yourcompany.hola
```

## CI/CD Integration

Fastlane đã được setup để hoạt động với CI/CD:
- GitHub Actions
- CircleCI
- Bitrise
- Jenkins

## Troubleshooting

1. **Code signing issues:** Sử dụng `fastlane certificates`
2. **Build errors:** Kiểm tra scheme và workspace names
3. **Upload errors:** Kiểm tra App Store Connect permissions

## Workflow được khuyến nghị

1. Development: `fastlane build_dev`
2. Testing: `fastlane test`
3. Internal testing: `fastlane build_adhoc`
4. TestFlight: `fastlane beta`
5. Production: `fastlane release`