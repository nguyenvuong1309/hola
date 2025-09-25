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
      'appium:app': path.join(process.cwd(), 'android/app/build/outputs/apk/amazon/debug/app-amazon-debug.apk'),
      'appium:automationName': 'UiAutomator2',
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:avd': 'Pixel_9a'
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
    require('@babel/register');
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