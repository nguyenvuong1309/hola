describe('Counter App (Android)', () => {
  it('should debug and find elements', async () => {
    console.log('Starting Android debug test...');

    // Wait longer for app to load
    await driver.pause(5000);

    // Try to get page source for debugging
    try {
      const pageSource = await driver.getPageSource();
      console.log('Page Source:', pageSource);
    } catch (error) {
      console.log('Could not get page source:', error.message);
    }

    // Try different selector strategies for reset button
    const selectors = [
      '~reset-button', // Accessibility ID
      '[accessibilityId="reset-button"]', // Accessibility ID alternative
      'android=new UiSelector().text("Reset")', // By text
      '//android.widget.TextView[@text="Reset"]', // XPath by text
      '//*[@content-desc="reset-button"]', // XPath by content-desc
    ];

    let resetButton = null;
    let workingSelector = null;

    for (const selector of selectors) {
      try {
        console.log(`Trying selector: ${selector}`);
        resetButton = await $(selector);
        await resetButton.waitForDisplayed({ timeout: 3000 });
        workingSelector = selector;
        console.log(`✅ Found reset button with: ${selector}`);
        break;
      } catch (error) {
        console.log(`❌ Selector ${selector} failed: ${error.message}`);
      }
    }

    if (!resetButton || !workingSelector) {
      // Try to find all elements
      const allElements = await $$('//*');
      console.log(`Found ${allElements.length} total elements`);

      for (let i = 0; i < Math.min(allElements.length, 10); i++) {
        try {
          const element = allElements[i];
          const text = await element.getText().catch(() => 'N/A');
          const contentDesc = await element
            .getAttribute('content-desc')
            .catch(() => 'N/A');
          const className = await element
            .getAttribute('className')
            .catch(() => 'N/A');

          console.log(
            `Element ${i}: text="${text}", contentDesc="${contentDesc}", class="${className}"`,
          );
        } catch (e) {
          console.log(`Element ${i}: Could not get info`);
        }
      }

      throw new Error('Could not find reset button with any selector');
    }

    // Test the working selector
    await resetButton.click();
    console.log('✅ Successfully clicked reset button');

    // Try to find counter value with working selector pattern
    const counterSelectors = [
      '~counter-value',
      '[accessibilityId="counter-value"]',
      '//*[@content-desc="counter-value"]',
    ];

    let counterValue = null;
    for (const selector of counterSelectors) {
      try {
        counterValue = await $(selector);
        await counterValue.waitForDisplayed({ timeout: 3000 });
        console.log(`✅ Found counter value with: ${selector}`);
        break;
      } catch (error) {
        console.log(`❌ Counter selector ${selector} failed: ${error.message}`);
      }
    }

    if (counterValue) {
      const value = await counterValue.getText();
      console.log(`Counter value: ${value}`);
      expect(value).toBe('0');
    }
  });

  it('should work with basic counter operations', async () => {
    // Wait for app
    await driver.pause(2000);

    // Use selectors that worked in debug test
    const counterValue = await $('~counter-value');
    const incrementButton = await $('~increment-button');
    const decrementButton = await $('~decrement-button');
    const resetButton = await $('~reset-button');

    // Wait for elements
    await counterValue.waitForDisplayed({ timeout: 10000 });
    await incrementButton.waitForDisplayed({ timeout: 10000 });
    await resetButton.waitForDisplayed({ timeout: 10000 });

    // Reset first
    await resetButton.click();
    await driver.pause(500);

    // Test increment
    await incrementButton.click();
    await driver.pause(500);

    let value = await counterValue.getText();
    expect(value).toBe('1');

    // Test decrement
    await decrementButton.click();
    await driver.pause(500);

    value = await counterValue.getText();
    expect(value).toBe('0');

    console.log('✅ Basic counter operations working');
  });
});
