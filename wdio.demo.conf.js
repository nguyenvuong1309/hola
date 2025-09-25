exports.config = {
  runner: 'local',
  port: 4723,
  specs: ['./e2e/specs/demo.spec.js'],
  exclude: [],
  maxInstances: 1,
  capabilities: [
    {
      platformName: 'iOS',
      'appium:platformVersion': '18.0',
      'appium:deviceName': 'iPhone 17 Pro Max',
      'appium:udid': '748B617D-EB7D-4161-8AB5-484E5CE3443B',
      'appium:bundleId': 'com.apple.MobileSafari', // Use Safari instead of our app for demo
      'appium:automationName': 'XCUITest',
      'appium:noReset': true,
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
    console.log('Test session started with capabilities:', capabilities);
  },
};