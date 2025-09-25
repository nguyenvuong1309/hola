class CommonHelpers {
  static async waitAndClick(element, timeout = 10000) {
    await element.waitForDisplayed({ timeout });
    await element.click();
    await driver.pause(500);
  }

  static async getElementText(element, timeout = 10000) {
    await element.waitForDisplayed({ timeout });
    return await element.getText();
  }

  static async performMultipleClicks(element, count, delay = 300) {
    for (let i = 0; i < count; i++) {
      await element.click();
      await driver.pause(delay);
    }
  }

  static async logTestStep(message) {
    console.log(`🧪 ${message}`);
  }

  static async logSuccess(message) {
    console.log(`✅ ${message}`);
  }

  static async logWarning(message) {
    console.log(`⚠️ ${message}`);
  }

  static async logCounter(value, context = '') {
    console.log(`📊 Counter value${context ? ` ${context}` : ''}: "${value}"`);
  }
}

module.exports = CommonHelpers;