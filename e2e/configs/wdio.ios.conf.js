const path = require('path');

exports.config = {
  runner: 'local',
  port: 4723,
  specs: [
    '../specs/ios/counter.spec.js'
  ],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'iOS',
      'appium:platformVersion': '18.0',
      'appium:deviceName': 'iPhone 17 Pro Max',
      'appium:udid': '748B617D-EB7D-4161-8AB5-484E5CE3443B', // Update with your UDID
      'appium:bundleId': 'com.nguyenvuong.hola', // Update with your bundle ID
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
    console.log('🍎 Starting iOS test session...');
  },
};