const path = require('path');

exports.config = {
  runner: 'local',
  port: 4723,
  specs: [
    '../specs/android/counter.spec.js'
  ],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'Android',
      'appium:platformVersion': '16',
      'appium:deviceName': 'sdk_gphone64_arm64',
      'appium:app': path.join(process.cwd(), 'android/app/build/outputs/apk/amazon/debug/app-amazon-debug.apk'),
      'appium:automationName': 'UiAutomator2',
      'appium:noReset': false,
      'appium:fullReset': true,
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
    console.log('🤖 Starting Android test session...');
  },
};