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
      'appium:udid': '748B617D-EB7D-4161-8AB5-484E5CE3443B',
      'appium:bundleId': 'com.nguyenvuong.hola', // Use bundle ID instead of app path
      'appium:automationName': 'XCUITest',
      'appium:noReset': true,
      'appium:fullReset': false,
      'appium:autoLaunch': true // Auto-launch the app
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