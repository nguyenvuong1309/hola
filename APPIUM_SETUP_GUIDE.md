# 📱 Hướng dẫn setup Appium cho React Native từ A-Z

> **Cực kỳ chi tiết - Từng bước một cách cụ thể**

## 🎯 Tổng quan

Hướng dẫn này sẽ giúp bạn setup hoàn chỉnh Appium testing cho React Native project, bao gồm:
- ✅ Cài đặt tất cả dependencies
- ✅ Tạo Counter app đơn giản để test
- ✅ Viết test suite hoàn chỉnh
- ✅ Cấu hình cho iOS và Android
- ✅ Chạy test thành công

## 📋 Prerequisites

Trước khi bắt đầu, đảm bảo bạn đã có:
- ✅ Node.js >= 20
- ✅ React Native project đã setup
- ✅ Xcode (cho iOS testing)
- ✅ Android Studio (cho Android testing)
- ✅ iOS Simulator hoặc Android Emulator

---

# 🚀 BƯỚC 1: CÀI ĐẶT DEPENDENCIES

## 1.1 Cài đặt Appium và WebDriverIO

```bash
# Navigate vào project directory
cd /path/to/your/react-native-project

# Cài đặt tất cả dependencies cần thiết
npm install --save-dev @wdio/cli webdriverio @wdio/local-runner @wdio/mocha-framework @wdio/spec-reporter @wdio/appium-service appium appium-uiautomator2-driver appium-xcuitest-driver @babel/register
```

**Giải thích từng package:**
- `@wdio/cli` - WebDriverIO command line interface
- `webdriverio` - Core WebDriverIO library
- `@wdio/local-runner` - Local test runner
- `@wdio/mocha-framework` - Mocha testing framework
- `@wdio/spec-reporter` - Spec reporter cho test results
- `@wdio/appium-service` - Appium service cho WebDriverIO
- `appium` - Appium server
- `appium-uiautomator2-driver` - Android driver
- `appium-xcuitest-driver` - iOS driver
- `@babel/register` - Babel compilation cho tests

## 1.2 Cài đặt Appium drivers

```bash
# Cài đặt iOS driver
npx appium driver install xcuitest

# Cài đặt Android driver
npx appium driver install uiautomator2

# Kiểm tra drivers đã cài
npx appium driver list --installed
```

**Expected output:**
```
✔ Listing installed drivers
- xcuitest@9.10.5 [installed (npm)]
- uiautomator2@4.2.9 [installed (npm)]
```

---

# 🚀 BƯỚC 2: TẠO COUNTER APP ĐỂ TEST

## 2.1 Tạo Counter component

**Tạo file:** `src/screens/Counter.tsx`

```bash
# Tạo thư mục nếu chưa có
mkdir -p src/screens

# Tạo file Counter.tsx
touch src/screens/Counter.tsx
```

**Nội dung file `src/screens/Counter.tsx`:**

```tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Simple Counter</Text>

        <View style={styles.counterContainer}>
          <Text style={styles.counterText} testID="counter-value">
            {count}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={decrement}
            testID="decrement-button"
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={reset}
            testID="reset-button"
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={increment}
            testID="increment-button"
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#333',
  },
  counterContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    marginBottom: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  counterText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    minWidth: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

## 2.2 Cập nhật App.tsx để hiển thị Counter

**Mở file `App.tsx` và cập nhật:**

```tsx
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import React from 'react';
import { Counter } from './src/screens/Counter';
import { withIAPContext } from 'react-native-iap';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <View style={styles.container}>
      <Counter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withIAPContext(App);
```

---

# 🚀 BƯỚC 3: TẠO CẤU HÌNH WEBDRIVERIO

## 3.1 Cấu hình cho iOS

**Tạo file:** `wdio.conf.js`

```bash
# Tạo file cấu hình iOS
touch wdio.conf.js
```

**Nội dung file `wdio.conf.js`:**

```javascript
const path = require('path');

exports.config = {
  runner: 'local',
  port: 4723,
  specs: ['./e2e/specs/**/*.spec.js'],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'iOS',
      'appium:platformVersion': '18.0',
      'appium:deviceName': 'iPhone 17 Pro Max',
      'appium:udid': '748B617D-EB7D-4161-8AB5-484E5CE3443B', // Replace với UDID của bạn
      'appium:app': path.join(process.cwd(), 'ios/build/Build/Products/Debug-iphonesimulator/hola.app'),
      'appium:automationName': 'XCUITest',
      'appium:noReset': false,
      'appium:fullReset': false
    }
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          relaxedSecurity: true,
          address: 'localhost',
          port: 4723,
        },
      },
    ],
  ],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  beforeSession: function (config, capabilities, specs) {
    // Setup before session
  },
  before: function (capabilities, specs) {
    // Setup before tests
  },
  afterTest: function(test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
      browser.takeScreenshot();
    }
  },
};
```

## 3.2 Cấu hình cho Android

**Tạo file:** `wdio.android.conf.js`

```bash
# Tạo file cấu hình Android
touch wdio.android.conf.js
```

**Nội dung file `wdio.android.conf.js`:**

```javascript
const path = require('path');

exports.config = {
  runner: 'local',
  port: 4723,
  specs: ['./e2e/specs/**/*.spec.js'],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'Android',
      'appium:platformVersion': '13.0',
      'appium:deviceName': 'Android Emulator',
      'appium:app': path.join(process.cwd(), 'android/app/build/outputs/apk/debug/app-debug.apk'),
      'appium:automationName': 'UiAutomator2',
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:avd': 'Pixel_API_33'
    }
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          relaxedSecurity: true,
          address: 'localhost',
          port: 4723,
        },
      },
    ],
  ],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  beforeSession: function (config, capabilities, specs) {
    // Setup before session
  },
  before: function (capabilities, specs) {
    // Setup before tests
  },
  afterTest: function(test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
      browser.takeScreenshot();
    }
  },
};
```

## 3.3 Cấu hình Bundle ID approach (Recommended)

**Tạo file:** `wdio.working.conf.js`

```bash
# Tạo file cấu hình working
touch wdio.working.conf.js
```

**Nội dung file `wdio.working.conf.js`:**

```javascript
const path = require('path');

exports.config = {
  runner: 'local',
  port: 4723,
  specs: ['./e2e/specs/counter.spec.js'],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'iOS',
      'appium:platformVersion': '18.0',
      'appium:deviceName': 'iPhone 17 Pro Max',
      'appium:udid': '748B617D-EB7D-4161-8AB5-484E5CE3443B', // Replace với UDID của bạn
      'appium:bundleId': 'com.nguyenvuong.hola', // Replace với bundle ID của bạn
      'appium:automationName': 'XCUITest',
      'appium:noReset': true,
      'appium:fullReset': false,
      'appium:autoLaunch': true
    }
  ],
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost:4723',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  before: function (capabilities, specs) {
    console.log('Starting test session...');
  },
};
```

---

# 📖 HƯỚNG DẪN CHI TIẾT: CÁCH LẤY CONFIGURATION VALUES

> **Phần này giải thích cực kỳ chi tiết cách lấy từng giá trị config trong các file cấu hình trên**

## 🔍 3.4 Cách lấy iOS Simulator UDID

### Phương pháp 1: Dùng Simulator App (Dễ nhất)

1. **Mở Simulator app:**
```bash
# Mở Simulator từ Xcode
open -a Simulator

# Hoặc từ terminal
xcrun simctl list devices
```

2. **Trong Simulator App:**
   - Mở simulator bạn muốn dùng (ví dụ: iPhone 17 Pro Max)
   - Vào menu `Device` → `Device Information`
   - Copy UDID từ dialog hiện ra

**Output mẫu:**
```
Device Information
Name: iPhone 17 Pro Max
UDID: 748B617D-EB7D-4161-8AB5-484E5CE3443B
Runtime: iOS 18.0 (22A3354)
```

### Phương pháp 2: Command Line (Chi tiết hơn)

```bash
# List tất cả iOS simulators
xcrun simctl list devices iOS

# Output sẽ như thế này:
# == Devices ==
# -- iOS 18.0 --
#     iPhone 15 (1234-5678-ABCD-EFGH) (Shutdown)
#     iPhone 17 Pro Max (748B617D-EB7D-4161-8AB5-484E5CE3443B) (Booted)
```

**Giải thích output:**
- `iPhone 17 Pro Max` = deviceName
- `748B617D-EB7D-4161-8AB5-484E5CE3443B` = UDID (copy cái này)
- `(Booted)` = trạng thái simulator
- `iOS 18.0` = platformVersion

### Phương pháp 3: Xem chi tiết với JSON format

```bash
# Xem chi tiết định dạng JSON
xcrun simctl list devices --json iOS

# Filter ra device bạn muốn
xcrun simctl list devices --json iOS | jq '.devices."iOS 18.0"[] | select(.name=="iPhone 17 Pro Max")'
```

**Output JSON mẫu:**
```json
{
  "availability": "(available)",
  "dataPath": "/Users/ducvuong/Library/Developer/CoreSimulator/Devices/748B617D-EB7D-4161-8AB5-484E5CE3443B/data",
  "dataPathSize": 15032320,
  "logPath": "/Users/ducvuong/Library/Logs/CoreSimulator/748B617D-EB7D-4161-8AB5-484E5CE3443B",
  "udid": "748B617D-EB7D-4161-8AB5-484E5CE3443B",
  "isAvailable": true,
  "deviceTypeIdentifier": "com.apple.CoreSimulator.SimDeviceType.iPhone-15-Pro-Max",
  "state": "Booted",
  "name": "iPhone 17 Pro Max"
}
```

## 🔍 3.5 Cách lấy Bundle ID từ React Native App

### Phương pháp 1: Từ iOS project settings

1. **Mở Xcode:**
```bash
# Navigate to iOS folder và mở workspace
cd ios
open hola.xcworkspace
```

2. **Trong Xcode:**
   - Select project root (hola) ở navigator bên trái
   - Select target "hola"
   - Vào tab "General"
   - Tìm "Bundle Identifier" → copy value đó

**Vị trí:** `hola` target → General tab → Identity section → Bundle Identifier

### Phương pháp 2: Từ Info.plist file

```bash
# Navigate to iOS project
cd ios/hola

# Đọc Bundle ID từ Info.plist
/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" Info.plist

# Output: com.nguyenvuong.hola
```

### Phương pháp 3: Từ built app (chính xác nhất)

```bash
# Build app trước
npx react-native run-ios --simulator="iPhone 17 Pro Max"

# Sau khi build xong, check bundle ID từ built app
/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" ios/build/Build/Products/Debug-iphonesimulator/hola.app/Info.plist

# Output: com.nguyenvuong.hola
```

### Phương pháp 4: Từ installed app trên Simulator

```bash
# List tất cả apps installed trên simulator
xcrun simctl listapps 748B617D-EB7D-4161-8AB5-484E5CE3443B

# Hoặc search theo tên app
xcrun simctl listapps 748B617D-EB7D-4161-8AB5-484E5CE3443B | grep -A 5 -B 5 "hola"
```

**Output mẫu:**
```json
{
  "com.nguyenvuong.hola": {
    "ApplicationType": "User",
    "CFBundleDisplayName": "hola",
    "CFBundleExecutable": "hola",
    "CFBundleIdentifier": "com.nguyenvuong.hola",
    "CFBundleName": "hola"
  }
}
```

## 🔍 3.6 Cách lấy Device Name và Platform Version

### Lấy Device Name:

```bash
# List tất cả device types available
xcrun simctl list devicetypes

# Output sẽ show tất cả device names có thể dùng:
# iPhone SE (3rd generation) (com.apple.CoreSimulator.SimDeviceType.iPhone-SE-3rd-generation)
# iPhone 15 (com.apple.CoreSimulator.SimDeviceType.iPhone-15)
# iPhone 17 Pro Max (com.apple.CoreSimulator.SimDeviceType.iPhone-15-Pro-Max)
```

**Lưu ý:** Device name phải match chính xác với tên trong Simulator list

### Lấy Platform Version:

```bash
# List tất cả iOS runtimes
xcrun simctl list runtimes iOS

# Output:
# == Runtimes ==
# iOS 17.0 (17.0 - 21A328) - com.apple.CoreSimulator.SimRuntime.iOS-17-0
# iOS 18.0 (18.0 - 22A3354) - com.apple.CoreSimulator.SimRuntime.iOS-18-0
```

**Sử dụng:** Version string như `18.0`, `17.0`, etc.

## 🔍 3.7 Cách lấy App Path cho iOS

### Khi dùng app path thay vì bundle ID:

```bash
# Build app trước
npx react-native run-ios --simulator="iPhone 17 Pro Max"

# App path sẽ ở:
ls ios/build/Build/Products/Debug-iphonesimulator/

# Full path:
echo "$(pwd)/ios/build/Build/Products/Debug-iphonesimulator/hola.app"
```

**Structure thư mục:**
```
ios/
└── build/
    └── Build/
        └── Products/
            └── Debug-iphonesimulator/
                └── hola.app/          <- Đây là app path
                    ├── Info.plist
                    ├── hola           <- Binary
                    └── ...
```

## 🔍 3.8 Cách lấy Android Configuration

### Lấy Android Emulator Name (AVD):

```bash
# List tất cả Android emulators
emulator -list-avds

# Output mẫu:
# Pixel_API_33
# Pixel_7_API_34
```

### Lấy Android App Path:

```bash
# Build Android app
cd android
./gradlew assembleDebug

# App path sẽ ở:
ls app/build/outputs/apk/debug/

# Full path:
echo "$(pwd)/app/build/outputs/apk/debug/app-debug.apk"
```

### Lấy Android Package Name:

```bash
# Từ Android manifest
cat android/app/src/main/AndroidManifest.xml | grep package

# Output: package="com.nguyenvuong.hola"
```

## 🔍 3.9 Testing Configuration Values

### Verify UDID:

```bash
# Check if UDID exists và có thể connect
xcrun simctl list devices | grep "748B617D-EB7D-4161-8AB5-484E5CE3443B"

# Boot simulator nếu chưa boot
xcrun simctl boot "748B617D-EB7D-4161-8AB5-484E5CE3443B"
```

### Verify Bundle ID:

```bash
# Check if app với bundle ID này có installed
xcrun simctl listapps "748B617D-EB7D-4161-8AB5-484E5CE3443B" | grep "com.nguyenvuong.hola"
```

### Verify App Path:

```bash
# Check if app path tồn tại
ls -la "ios/build/Build/Products/Debug-iphonesimulator/hola.app"

# Check if binary executable
file "ios/build/Build/Products/Debug-iphonesimulator/hola.app/hola"
```

## ⚠️ Troubleshooting Configuration

### Lỗi Invalid UDID:
```bash
# Error: Invalid device: 748B617D-EB7D-4161-8AB5-484E5CE3443B
# Solution: List lại devices và copy UDID chính xác
xcrun simctl list devices iOS
```

### Lỗi Bundle ID không tồn tại:
```bash
# Error: App with bundle identifier 'com.wrong.bundle' is not installed
# Solution 1: Install app trước
npx react-native run-ios --simulator="iPhone 17 Pro Max"

# Solution 2: Check bundle ID chính xác
/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" ios/hola/Info.plist
```

### Lỗi App Path không tồn tại:
```bash
# Error: App path does not exist
# Solution: Build app trước
npm run build:debug:ios
# hoặc
npx react-native run-ios --simulator="iPhone 17 Pro Max"
```

---

# 🚀 BƯỚC 4: TẠO TEST SUITE

## 4.1 Tạo thư mục test

```bash
# Tạo thư mục e2e và các subfolders
mkdir -p e2e/specs
mkdir -p e2e/helpers
```

## 4.2 Tạo helper functions

**Tạo file:** `e2e/helpers/index.js`

```bash
# Tạo helper file
touch e2e/helpers/index.js
```

**Nội dung file `e2e/helpers/index.js`:**

```javascript
/**
 * Helper functions for e2e tests
 */

/**
 * Wait for element to be displayed and return it
 * @param {string} selector - Element selector
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<WebdriverIO.Element>}
 */
export async function waitForElement(selector, timeout = 10000) {
  const element = await $(selector);
  await element.waitForDisplayed({ timeout });
  return element;
}

/**
 * Tap element with retry logic
 * @param {string} selector - Element selector
 * @param {number} retries - Number of retries
 */
export async function tapWithRetry(selector, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const element = await waitForElement(selector);
      await element.click();
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      await driver.pause(1000);
    }
  }
}

/**
 * Get element text with retry logic
 * @param {string} selector - Element selector
 * @param {number} retries - Number of retries
 * @returns {Promise<string>}
 */
export async function getTextWithRetry(selector, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const element = await waitForElement(selector);
      return await element.getText();
    } catch (error) {
      if (i === retries - 1) throw error;
      await driver.pause(1000);
    }
  }
}
```

## 4.3 Tạo Counter test suite

**Tạo file:** `e2e/specs/counter.spec.js`

```bash
# Tạo test file
touch e2e/specs/counter.spec.js
```

**Nội dung file `e2e/specs/counter.spec.js`:**

```javascript
describe('Counter App', () => {
  beforeEach(async () => {
    // Wait for app to load
    await driver.pause(1000);

    // Reset counter to 0 before each test
    const resetButton = await $('~reset-button');
    await resetButton.waitForDisplayed({ timeout: 10000 });
    await resetButton.click();
    await driver.pause(500);
  });

  it('should display initial counter value of 0', async () => {
    const counterValue = await $('~counter-value');
    await counterValue.waitForDisplayed({ timeout: 10000 });

    const value = await counterValue.getText();
    expect(value).toBe('0');
  });

  it('should increment counter when + button is pressed', async () => {
    const incrementButton = await $('~increment-button');
    const counterValue = await $('~counter-value');

    await incrementButton.waitForDisplayed({ timeout: 10000 });
    await incrementButton.click();

    await driver.pause(500);
    const value = await counterValue.getText();
    expect(value).toBe('1');
  });

  it('should decrement counter when - button is pressed', async () => {
    const decrementButton = await $('~decrement-button');
    const counterValue = await $('~counter-value');

    // First increment to have a positive number
    const incrementButton = await $('~increment-button');
    await incrementButton.click();
    await driver.pause(500);

    // Then decrement
    await decrementButton.click();
    await driver.pause(500);

    const value = await counterValue.getText();
    expect(value).toBe('0');
  });

  it('should reset counter when reset button is pressed', async () => {
    const incrementButton = await $('~increment-button');
    const resetButton = await $('~reset-button');
    const counterValue = await $('~counter-value');

    // Increment a few times
    await incrementButton.click();
    await driver.pause(300);
    await incrementButton.click();
    await driver.pause(300);
    await incrementButton.click();
    await driver.pause(500);

    // Verify counter is not 0
    let value = await counterValue.getText();
    expect(value).toBe('3');

    // Reset
    await resetButton.click();
    await driver.pause(500);

    // Verify counter is back to 0
    value = await counterValue.getText();
    expect(value).toBe('0');
  });

  it('should allow multiple operations', async () => {
    const incrementButton = await $('~increment-button');
    const decrementButton = await $('~decrement-button');
    const counterValue = await $('~counter-value');

    // Perform a sequence of operations: +3, -1, +2 = 4
    await incrementButton.click();
    await driver.pause(300);
    await incrementButton.click();
    await driver.pause(300);
    await incrementButton.click();
    await driver.pause(300);

    await decrementButton.click();
    await driver.pause(300);

    await incrementButton.click();
    await driver.pause(300);
    await incrementButton.click();
    await driver.pause(500);

    const value = await counterValue.getText();
    expect(value).toBe('4');
  });

  it('should handle negative numbers', async () => {
    const decrementButton = await $('~decrement-button');
    const counterValue = await $('~counter-value');

    // Decrement from 0 to get negative number
    await decrementButton.click();
    await driver.pause(500);

    const value = await counterValue.getText();
    expect(value).toBe('-1');
  });
});
```

---

# 🚀 BƯỚC 5: CẬP NHẬT PACKAGE.JSON

## 5.1 Thêm test scripts

**Mở file `package.json` và thêm scripts:**

```json
{
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint .",
    "start": "react-native start",
    "test": "jest",
    "e2e:ios": "wdio wdio.conf.js",
    "e2e:android": "wdio wdio.android.conf.js",
    "e2e:working": "wdio wdio.working.conf.js",
    "build:debug:ios": "cd ios && xcodebuild -workspace hola.xcworkspace -scheme hola -configuration Debug -sdk iphonesimulator -derivedDataPath build",
    "build:debug:android": "cd android && ./gradlew assembleDebug"
  }
}
```

---

# 🚀 BƯỚC 6: SETUP SIMULATOR/EMULATOR

## 6.1 Tìm iOS Simulator UDID

```bash
# Liệt kê tất cả available simulators
xcrun simctl list devices available

# Tìm iPhone simulators
xcrun simctl list devices available | grep iPhone
```

**Expected output:**
```
iPhone 17 Pro (06B05EDD-A259-428D-B59A-A98F9DCD51B9) (Shutdown)
iPhone 17 Pro Max (748B617D-EB7D-4161-8AB5-484E5CE3443B) (Booted)
```

**Lấy UDID (ở đây là `748B617D-EB7D-4161-8AB5-484E5CE3443B`) và update vào file config.**

## 6.2 Tìm Bundle ID của app

```bash
# Sau khi build app, tìm bundle ID
find /Users/$(whoami)/Library/Developer/CoreSimulator/Devices/[UDID]/data/Containers/Bundle/Application -name "*.app" -type d 2>/dev/null

# Kiểm tra bundle ID
plutil -p "/path/to/your/app.app/Info.plist" | grep CFBundleIdentifier
```

**Update bundle ID vào file `wdio.working.conf.js`**

---

# 🚀 BƯỚC 7: CHẠY TESTS

## 7.1 Build app

```bash
# Build React Native app cho iOS simulator
npx react-native run-ios --simulator="iPhone 17 Pro Max"
```

**Đợi app build xong và xuất hiện trên simulator.**

## 7.2 Start Appium server (terminal khác)

```bash
# Mở terminal mới và chạy Appium server
npx appium server --relaxed-security --address localhost --port 4723
```

**Expected output:**
```
[Appium] Welcome to Appium v2.19.0
[Appium] Appium REST http interface listener started on http://localhost:4723
[Appium] Available drivers:
[Appium]   - uiautomator2@4.2.9 (automationName 'UiAutomator2')
[Appium]   - xcuitest@9.10.5 (automationName 'XCUITest')
```

## 7.3 Chạy tests

```bash
# Trong terminal gốc, chạy tests
npm run e2e:working
```

**Expected output:**
```
Counter App
   ✓ should display initial counter value of 0
   ✓ should increment counter when + button is pressed
   ✓ should decrement counter when - button is pressed
   ✓ should reset counter when reset button is pressed
   ✓ should allow multiple operations
   ✓ should handle negative numbers

6 passing (23s)
```

---

# 🚨 TROUBLESHOOTING

## Issue 1: Port đã được sử dụng

**Lỗi:** `Error: listen EADDRINUSE: address already in use :::4723`

**Giải pháp:**
```bash
# Kill processes sử dụng port 4723
lsof -ti:4723 | xargs kill -9

# Restart Appium server
npx appium server --relaxed-security --address localhost --port 4723
```

## Issue 2: App không tìm thấy

**Lỗi:** `An unknown server-side error occurred while processing the command. Original error: App with bundle identifier 'xxx' unknown`

**Giải pháp:**
1. Đảm bảo app đã build và chạy trên simulator
2. Kiểm tra bundle ID trong config file
3. Sử dụng bundle ID thay vì app path

## Issue 3: WebDriverAgent không build được

**Lỗi:** WebDriverAgent timeout

**Giải pháp:**
```bash
# Xóa derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Clean và rebuild
cd ios && xcodebuild clean
```

## Issue 4: Element không tìm thấy

**Lỗi:** `An element could not be located on the page using the given search parameters`

**Giải pháp:**
1. Kiểm tra `testID` trong React Native component
2. Thêm wait time: `await element.waitForDisplayed({ timeout: 10000 })`
3. Kiểm tra app đã load hoàn toàn chưa

---

# 📁 CẤU TRÚC FILE CUỐI CÙNG

```
your-project/
├── e2e/
│   ├── specs/
│   │   └── counter.spec.js          # Test suite chính
│   └── helpers/
│       └── index.js                 # Helper functions
├── src/
│   └── screens/
│       └── Counter.tsx              # Counter component
├── wdio.conf.js                     # iOS config
├── wdio.android.conf.js             # Android config
├── wdio.working.conf.js             # Working config (recommended)
├── package.json                     # Scripts updated
└── App.tsx                          # App updated
```

---

# 🎯 KẾT QUẢ CUỐI CÙNG

Khi hoàn thành tất cả các bước trên, bạn sẽ có:

✅ **Appium server chạy ổn định**
✅ **React Native Counter app hoạt động**
✅ **6 test cases pass hoàn toàn**
✅ **Infrastructure sẵn sàng cho việc thêm tests mới**

**Test Results:**
```
Counter App
   ✓ should display initial counter value of 0          (2.1s)
   ✓ should increment counter when + button is pressed  (1.9s)
   ✓ should decrement counter when - button is pressed  (2.3s)
   ✓ should reset counter when reset button is pressed  (3.2s)
   ✓ should allow multiple operations                    (4.1s)
   ✓ should handle negative numbers                      (1.8s)

6 passing (23s)
Spec Files: 1 passed, 1 total (100% completed)
```

---

# 💡 BEST PRACTICES

## Cho Testing:
1. **Luôn reset state** giữa các test cases
2. **Sử dụng testID** thay vì text selectors
3. **Thêm proper waits** cho async operations
4. **Keep tests independent** - mỗi test có thể chạy riêng lẻ

## Cho Maintenance:
1. **Update UDID** khi thay đổi simulator
2. **Update bundle ID** khi thay đổi app config
3. **Clean derived data** khi gặp build issues
4. **Monitor Appium logs** để debug issues

## Cho CI/CD:
1. **Use headless simulators** cho CI environment
2. **Parallelize tests** cho faster execution
3. **Generate test reports** cho team visibility
4. **Screenshot on failure** cho debugging

---

**🎉 HOÀN THÀNH! Appium setup đã sẵn sàng cho production testing!**