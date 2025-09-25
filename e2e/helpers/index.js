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