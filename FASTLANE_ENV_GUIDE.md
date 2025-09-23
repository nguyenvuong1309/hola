# 🔐 Hướng dẫn lấy Environment Variables cho Fastlane

## 📋 Checklist các thông tin cần thiết

- [ ] Apple ID
- [ ] App-specific Password
- [ ] Team ID
- [ ] App Store Connect Team ID
- [ ] Bundle Identifier
- [ ] Match Repository & Password

---

## 🍎 APPLE DEVELOPER PORTAL

### 1. Apple ID (`APPLE_ID`)

- **Giá trị:** Email Apple ID của bạn
- **Ví dụ:** `developer@yourcompany.com`
- **Lấy ở đâu:** Email bạn dùng để đăng nhập Apple Developer Portal

### 2. App-Specific Password (`FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD`)

- **Cần thiết:** Bắt buộc cho 2FA
- **Cách lấy:**
  1. Đi tới https://appleid.apple.com/account/manage
  2. Đăng nhập với Apple ID
  3. **Sign-In and Security** → **App-Specific Passwords**
  4. Click **Generate Password**
  5. Nhập label: "Fastlane CLI"
  6. Copy password (dạng: xxxx-xxxx-xxxx-xxxx)

### 3. Team ID (`TEAM_ID`)

- **Cách lấy:**
  1. Đi tới https://developer.apple.com/account
  2. **Membership** tab
  3. Copy **Team ID** (10 ký tự)
- **Ví dụ:** `A1B2C3D4E5`

---

## 🏪 APP STORE CONNECT

### 4. App Store Connect Team ID (`ITC_TEAM_ID`)

- **Lưu ý:** Có thể khác với Developer Portal Team ID
- **Cách lấy:**
  1. Đi tới https://appstoreconnect.apple.com
  2. **Users and Access** → **Keys**
  3. Copy **Issuer ID** (số dài)
- **Ví dụ:** `12345678-1234-1234-1234-123456789012`

---

## 📱 APP INFORMATION

### 5. Bundle Identifier (`APP_IDENTIFIER`)

- **Cách lấy:**
  1. Mở Xcode project
  2. Select target "hola"
  3. **General** tab → **Bundle Identifier**
- **Hoặc:** Xem trong `ios/hola/Info.plist`
- **Ví dụ:** `com.yourcompany.hola`

---

## 🔒 CODE SIGNING (MATCH)

### 6. Match Git Repository (`MATCH_GIT_URL`)

- **Cần tạo:** Private GitHub repository
- **Cách tạo:**
  1. Đi tới GitHub
  2. Tạo **private repository**
  3. Tên gợi ý: `ios-certificates` hoặc `match-certificates`
  4. Copy HTTPS URL
- **Ví dụ:** `https://github.com/username/ios-certificates`

### 7. Match Password (`MATCH_PASSWORD`)

- **Tự tạo:** Password mạnh để encrypt certificates
- **Gợi ý:** Dùng password generator
- **Lưu ý:** Lưu password này an toàn, cần để decrypt certificates

---

## 🛠️ CÁCH SETUP CHI TIẾT

### Bước 1: Tạo file .env

```bash
cd ios/fastlane
cp .env.example .env
```

### Bước 2: Điền thông tin cơ bản

```bash
# Mở file .env và điền:
APPLE_ID=your-actual-email@gmail.com
TEAM_ID=YOUR_TEAM_ID
APP_IDENTIFIER=com.yourcompany.hola
```

### Bước 3: Tạo App-Specific Password

1. Vào https://appleid.apple.com/account/manage
2. **Sign-In and Security** → **App-Specific Passwords**
3. **Generate Password** → Label: "Fastlane"
4. Copy vào `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD`

### Bước 4: Setup Match Repository

```bash
# Tạo private repo trên GitHub
# Sau đó chạy:
cd ios
bundle exec fastlane match init

# Điền Git URL khi được hỏi
# Cập nhật MATCH_GIT_URL và MATCH_PASSWORD trong .env
```

### Bước 5: Test setup

```bash
cd ios
bundle exec fastlane certificates
```

---

## 🔍 CÁCH TÌM THÔNG TIN NHANH

### Team ID từ Xcode:

```bash
# Mở Terminal, chạy:
security find-identity -v -p codesigning
# Tìm dòng có "iPhone Developer" hoặc "iPhone Distribution"
# Team ID nằm trong ngoặc ()
```

### Bundle ID từ Terminal:

```bash
# Từ thư mục ios:
/usr/libexec/PlistBuddy -c "Print CFBundleIdentifier" hola/Info.plist
```

### Kiểm tra Apple ID Teams:

```bash
cd ios
bundle exec fastlane run get_info_plist_value path:"hola/Info.plist" key:"CFBundleIdentifier"
```

---

## ⚠️ LƯU Ý BẢO MẬT

1. **KHÔNG commit file .env** - Thêm vào `.gitignore`
2. **App-specific password:** Chỉ hiển thị 1 lần, lưu ngay
3. **Match password:** Cần để decrypt certificates sau này
4. **Private repository:** Match repo phải là private
5. **CI/CD:** Dùng encrypted secrets, không hardcode

---

## 🧪 KIỂM TRA SETUP

```bash
cd ios

# Test basic setup
bundle exec fastlane run get_certificates

# Test build
bundle exec fastlane build_dev

# Test TestFlight upload (cần có app trên App Store Connect)
bundle exec fastlane beta
```

---

## 🆘 TROUBLESHOOTING

### Lỗi "Invalid credentials"

- Kiểm tra APPLE_ID và App-specific password
- Đảm bảo 2FA đã bật cho Apple ID

### Lỗi "No team found"

- Kiểm tra TEAM_ID có đúng 10 ký tự
- Thử dùng TEAM_NAME thay vì TEAM_ID

### Lỗi Match

- Kiểm tra MATCH_GIT_URL có accessible
- Đảm bảo GitHub token có quyền access private repo

### Lỗi Bundle ID

- Kiểm tra APP_IDENTIFIER match với Xcode project
- Đảm bảo app đã được tạo trên App Store Connect
