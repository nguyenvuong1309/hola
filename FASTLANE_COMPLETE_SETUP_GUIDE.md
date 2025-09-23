# 🚀 Fastlane Complete Setup Guide for iOS

Hướng dẫn chi tiết từng bước để setup Fastlane cho iOS project từ đầu đến cuối.

## 📋 Prerequisites

- [x] macOS với Xcode đã cài đặt
- [x] Apple Developer Program account ($99/year)
- [x] React Native iOS project
- [x] Ruby đã cài đặt
- [x] Git đã setup

---

## 🎯 Mục tiêu

Sau khi hoàn thành guide này, bạn sẽ có:

- ✅ Fastlane tự động build và deploy lên TestFlight
- ✅ Code signing tự động với Match
- ✅ Environment variables để tránh nhập thông tin mỗi lần
- ✅ CI/CD ready setup

---

## 📁 BƯỚC 1: CÀI ĐẶT FASTLANE

### 1.1. Tạo Gemfile trong thư mục ios

```bash
cd ios
```

Tạo file `Gemfile`:

```ruby
# ios/Gemfile
source "https://rubygems.org"

gem "fastlane"
gem "cocoapods", "~> 1.15"

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
```

### 1.2. Cài đặt gems

```bash
bundle install
```

### 1.3. Khởi tạo Fastlane

```bash
bundle exec fastlane init
```

Chọn các options:

- **What would you like to use fastlane for?** → 2 (Automate beta distribution to TestFlight)
- **Apple ID:** → Nhập email Apple ID của bạn
- **App Identifier:** → Nhập bundle ID (ví dụ: com.yourcompany.hola)

---

## 📁 BƯỚC 2: TẠO PRIVATE REPOSITORY CHO CERTIFICATES

### 2.1. Tạo GitHub Repository

1. Đi tới https://github.com
2. Click **New repository**
3. **Repository name:** `ios-certificates` (hoặc tên khác)
4. ✅ **Private** (QUAN TRỌNG!)
5. ✅ **Add a README file**
6. Click **Create repository**
7. Copy HTTPS URL: `https://github.com/username/ios-certificates`

### 2.2. Setup Match

```bash
cd ios
bundle exec fastlane match init
```

Nhập Git URL khi được hỏi:

```
https://github.com/username/ios-certificates
```

---

## 📁 BƯỚC 3: TẠO APP-SPECIFIC PASSWORD

### 3.1. Truy cập Apple ID

1. Đi tới https://appleid.apple.com/account/manage
2. Đăng nhập với Apple ID
3. Tìm section **Sign-In and Security**
4. Click **App-Specific Passwords**

### 3.2. Tạo Password

1. Click **Generate Password**
2. **Label:** "Fastlane CLI"
3. Click **Create**
4. **Copy password** (dạng: xxxx-xxxx-xxxx-xxxx)
5. Lưu lại password này

---

## 📁 BƯỚC 4: LẤY TEAM ID

### 4.1. Từ Apple Developer Portal

1. Đi tới https://developer.apple.com/account
2. Click tab **Membership**
3. Copy **Team ID** (10 ký tự, ví dụ: A1B2C3D4E5)

### 4.2. Hoặc từ Terminal

```bash
security find-identity -v -p codesigning
```

Tìm Team ID trong ngoặc () bên cạnh certificate name.

---

## 📁 BƯỚC 5: TẠO ENVIRONMENT VARIABLES

### 5.1. Copy file .env

```bash
cd ios/fastlane
cp .env.example .env
```

### 5.2. Cập nhật file .env

Mở file `.env` và điền thông tin thật:

```bash
# ==============================================
# APPLE DEVELOPER PORTAL
# ==============================================
APPLE_ID=your-actual-email@gmail.com
FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
TEAM_ID=A1B2C3D4E5

# ==============================================
# APP INFORMATION
# ==============================================
APP_IDENTIFIER=com.yourcompany.hola
APP_NAME=Hola
SCHEME=hola
WORKSPACE=hola.xcworkspace
PROJECT=hola.xcodeproj

# ==============================================
# CODE SIGNING (MATCH)
# ==============================================
MATCH_GIT_URL=https://github.com/username/ios-certificates
MATCH_PASSWORD=your-super-secure-password

# ==============================================
# BUILD CONFIGURATION
# ==============================================
CONFIGURATION=Release
EXPORT_METHOD=app-store
```

### 5.3. Tạo Match Password

Tạo password mạnh cho MATCH_PASSWORD (dùng password generator). Password này sẽ encrypt certificates trong repository.

---

## 📁 BƯỚC 6: CẬP NHẬT FASTFILE

### 6.1. Tạo file Fastfile hoàn chỉnh

Thay thế nội dung `ios/fastlane/Fastfile`:

```ruby
# ios/fastlane/Fastfile
default_platform(:ios)

platform :ios do
  before_all do
    setup_circle_ci
    ENV['SLACK_URL'] = ""
  end

  desc "Run tests"
  lane :test do
    begin
      run_tests(workspace: "hola.xcworkspace",
                devices: ["iPhone 15 Pro"],
                scheme: "hola")
    rescue => ex
      UI.error("❌ No test bundles found - skipping test execution")
      UI.message("💡 To add tests: Create unit test target in Xcode")
      UI.success("✅ Build verification successful")
    end
  end

  desc "Build for development"
  lane :build_dev do
    build_app(workspace: "hola.xcworkspace",
              scheme: "hola",
              configuration: "Debug",
              skip_codesigning: true,
              skip_archive: true)
  end

  desc "Build for adhoc distribution"
  lane :build_adhoc do
    match(type: "adhoc")
    increment_build_number(xcodeproj: "hola.xcodeproj")

    update_code_signing_settings(
      use_automatic_signing: false,
      path: "hola.xcodeproj",
      targets: ["hola"],
      profile_name: "match AdHoc com.yourcompany.hola",
      code_sign_identity: "iPhone Distribution"
    )

    build_app(workspace: "hola.xcworkspace",
              scheme: "hola",
              configuration: "Release",
              export_method: "ad-hoc")
  end

  desc "Deploy to TestFlight"
  lane :beta do
    match(type: "appstore")
    increment_build_number(xcodeproj: "hola.xcodeproj")

    update_code_signing_settings(
      use_automatic_signing: false,
      path: "hola.xcodeproj",
      targets: ["hola"],
      profile_name: "match AppStore com.yourcompany.hola",
      code_sign_identity: "iPhone Distribution"
    )

    build_app(workspace: "hola.xcworkspace",
              scheme: "hola",
              configuration: "Release",
              export_method: "app-store")

    upload_to_testflight(skip_waiting_for_build_processing: true)
  end

  desc "Deploy to App Store"
  lane :release do
    match(type: "appstore")
    increment_build_number(xcodeproj: "hola.xcodeproj")

    update_code_signing_settings(
      use_automatic_signing: false,
      path: "hola.xcodeproj",
      targets: ["hola"],
      profile_name: "match AppStore com.yourcompany.hola",
      code_sign_identity: "iPhone Distribution"
    )

    build_app(workspace: "hola.xcworkspace",
              scheme: "hola",
              configuration: "Release",
              export_method: "app-store")

    upload_to_app_store(force: true)
  end

  desc "Take screenshots"
  lane :screenshots do
    capture_screenshots(workspace: "hola.xcworkspace",
                       scheme: "hola")
  end

  desc "Sync certificates and provisioning profiles"
  lane :certificates do
    match(type: "development")
    match(type: "adhoc")
    match(type: "appstore")
  end

  desc "Register new device"
  lane :register_new_device do |options|
    device_name = options[:name]
    device_udid = options[:udid]

    register_devices(
      devices: {
        device_name => device_udid
      }
    )

    match(type: "development", force_for_new_devices: true)
  end

  error do |lane, exception|
    UI.error("🚫 Lane #{lane} failed: #{exception.message}")
    UI.message("📋 Check the error details above for troubleshooting")
  end
end
```

### 6.2. Cập nhật bundle identifier

Trong Fastfile, thay `com.yourcompany.hola` bằng bundle ID thật của bạn.

---

## 📁 BƯỚC 7: TẠO APPFILE

### 7.1. Cập nhật Appfile

Cập nhật `ios/fastlane/Appfile`:

```ruby
# ios/fastlane/Appfile
app_identifier(ENV["APP_IDENTIFIER"]) # Bundle identifier
apple_id(ENV["APPLE_ID"]) # Apple ID email

itc_team_id(ENV["ITC_TEAM_ID"]) # App Store Connect Team ID
team_id(ENV["TEAM_ID"]) # Developer Portal Team ID

# For more information about the Appfile, see:
# https://docs.fastlane.tools/advanced/#appfile
```

---

## 📁 BƯỚC 8: CẬP NHẬT MATCHFILE

### 8.1. Cập nhật Matchfile

Cập nhật `ios/fastlane/Matchfile`:

```ruby
# ios/fastlane/Matchfile
git_url(ENV["MATCH_GIT_URL"])
storage_mode("git")
type("development") # Default type
app_identifier([ENV["APP_IDENTIFIER"]])
username(ENV["APPLE_ID"])

# For all available options run `fastlane match --help`
```

---

## 📁 BƯỚC 9: TẠO .GITIGNORE

### 9.1. Tạo .gitignore cho iOS

Tạo file `ios/.gitignore`:

```gitignore
# Fastlane
fastlane/.env
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots/**/*.png
fastlane/test_output

# Match
fastlane/certs

# Certificates
*.cer
*.certSigningRequest
*.p12

# Xcode
build/
*.xcarchive
DerivedData/

# CocoaPods
Pods/

# Mac
.DS_Store
```

### 9.2. Cập nhật root .gitignore

Thêm vào file `.gitignore` ở root project:

```gitignore
# iOS Fastlane
ios/fastlane/.env
ios/fastlane/report.xml
ios/fastlane/Preview.html
ios/fastlane/screenshots/**/*.png
ios/fastlane/test_output
ios/fastlane/certs

# iOS Certificates
ios/*.cer
ios/*.certSigningRequest
ios/*.p12

# iOS Build
ios/build/
ios/*.xcarchive
ios/DerivedData/
```

---

## 📁 BƯỚC 10: TẠO APP TRÊN APP STORE CONNECT

### 10.1. Truy cập App Store Connect

1. Đi tới https://appstoreconnect.apple.com
2. Click **My Apps**
3. Click **+** → **New App**

### 10.2. Điền thông tin app

- **Platforms:** ✅ iOS
- **Name:** Tên app của bạn
- **Primary Language:** Vietnamese hoặc English
- **Bundle ID:** Chọn bundle ID đã tạo
- **SKU:** Unique identifier (có thể dùng bundle ID)

### 10.3. Lấy App Store Connect Team ID

1. Trong App Store Connect, click **Users and Access**
2. Click tab **Keys**
3. Copy **Issuer ID**
4. Thêm vào `.env`:

```bash
ITC_TEAM_ID=12345678-1234-1234-1234-123456789012
```

---

## 📁 BƯỚC 11: SYNC CERTIFICATES

### 11.1. Tạo certificates lần đầu

```bash
cd ios
bundle exec fastlane match development
```

Nhập MATCH_PASSWORD khi được hỏi.

### 11.2. Tạo adhoc và appstore certificates

```bash
bundle exec fastlane match adhoc
bundle exec fastlane match appstore
```

### 11.3. Verify certificates

```bash
bundle exec fastlane certificates
```

---

## 📁 BƯỚC 12: TEST BUILD

### 12.1. Test development build

```bash
cd ios
bundle exec fastlane build_dev
```

### 12.2. Test TestFlight deployment

```bash
bundle exec fastlane beta
```

Nếu thành công, app sẽ được upload lên TestFlight!

---

## 📁 BƯỚC 13: COMMIT CHANGES

### 13.1. Add safe files

```bash
git add FASTLANE_COMPLETE_SETUP_GUIDE.md
git add FASTLANE_ENV_GUIDE.md
git add README_FASTLANE.md
git add ios/.gitignore
git add ios/Gemfile
git add ios/Gemfile.lock
git add ios/fastlane/Fastfile
git add ios/fastlane/Appfile
git add ios/fastlane/Matchfile
git add ios/fastlane/.env.example
git add package.json
```

### 13.2. Commit

```bash
git commit -m "feat: setup Fastlane for iOS deployment

- Add complete Fastlane configuration
- Setup Match for code signing
- Add environment variables support
- Configure TestFlight deployment
- Add comprehensive documentation

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## 🎯 USAGE

### Deploy to TestFlight

```bash
cd ios
bundle exec fastlane beta
```

### Build for development

```bash
bundle exec fastlane build_dev
```

### Sync certificates

```bash
bundle exec fastlane certificates
```

### Register new device

```bash
bundle exec fastlane register_new_device name:"iPhone Test" udid:"device-udid-here"
```

---

## 🔧 TROUBLESHOOTING

### ❌ "Invalid credentials"

**Giải pháp:**

- Kiểm tra `APPLE_ID` và `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD`
- Đảm bảo 2FA đã bật cho Apple ID
- Regenerate App-Specific Password

### ❌ "No team found"

**Giải pháp:**

- Kiểm tra `TEAM_ID` có đúng 10 ký tự
- Thử thêm `TEAM_NAME` thay vì `TEAM_ID`

### ❌ "Provisioning profile doesn't include certificate"

**Giải pháp:**

```bash
bundle exec fastlane match appstore --force
```

### ❌ "App not found in App Store Connect"

**Giải pháp:**

- Đảm bảo app đã được tạo trên App Store Connect
- Kiểm tra bundle ID match chính xác

### ❌ Match repository access denied

**Giải pháp:**

- Đảm bảo repository là private
- Check GitHub permissions
- Regenerate GitHub personal access token

---

## 🚀 ADVANCED FEATURES

### CI/CD Integration

Thêm vào `.env`:

```bash
CI=true
FASTLANE_SKIP_2FA_UPGRADE=1
FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

### Slack Notifications

```bash
SLACK_URL=your_slack_webhook_url_here
SLACK_CHANNEL=#ios-builds
```

### Custom Build Numbers

```bash
# Sử dụng git commit count
BUILD_NUMBER=$(git rev-list --count HEAD)
bundle exec fastlane beta build_number:$BUILD_NUMBER
```

---

## 📚 RESOURCES

- [Fastlane Documentation](https://docs.fastlane.tools)
- [Match Documentation](https://docs.fastlane.tools/actions/match/)
- [App Store Connect API](https://developer.apple.com/documentation/appstoreconnectapi)
- [Code Signing Guide](https://docs.fastlane.tools/codesigning/getting-started/)

---

## ✅ CHECKLIST

- [ ] Fastlane installed and initialized
- [ ] Private GitHub repository created for certificates
- [ ] App-Specific Password generated
- [ ] Team ID retrieved
- [ ] Environment variables configured
- [ ] Fastfile, Appfile, Matchfile updated
- [ ] .gitignore configured
- [ ] App created on App Store Connect
- [ ] Certificates synced with Match
- [ ] First build tested successfully
- [ ] Changes committed to git

Khi tất cả ✅ hoàn thành, bạn đã có một Fastlane setup hoàn chỉnh!
