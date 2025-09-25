describe('Basic Debug Test', () => {
  it('should check if app starts and get page source', async () => {
    console.log('🚀 Starting basic debug test...');

    // Wait for app to start
    await driver.pause(5000);

    try {
      // Check if we can get any activity info
      const currentActivity = await driver.getCurrentActivity();
      console.log('📱 Current Activity:', currentActivity);
    } catch (error) {
      console.log('❌ Could not get current activity:', error.message);
    }

    try {
      // Get page source to see what's actually rendered
      const pageSource = await driver.getPageSource();
      console.log('📄 Page Source Length:', pageSource.length);

      // Look for our testIDs in page source
      const hasCounterValue = pageSource.includes('counter-value');
      const hasResetButton = pageSource.includes('reset-button');
      const hasIncrementButton = pageSource.includes('increment-button');
      const hasCounterText = pageSource.includes('Simple Counter');

      console.log('🔍 Found elements in source:');
      console.log('  - counter-value:', hasCounterValue);
      console.log('  - reset-button:', hasResetButton);
      console.log('  - increment-button:', hasIncrementButton);
      console.log('  - "Simple Counter" text:', hasCounterText);

      // Print a portion of page source for debugging
      const sourcePreview = pageSource.substring(0, 2000);
      console.log('📄 Page Source Preview:\n', sourcePreview);

    } catch (error) {
      console.log('❌ Could not get page source:', error.message);
    }

    // Try to find ANY elements on screen
    try {
      const allElements = await $$('//*');
      console.log(`📊 Total elements found: ${allElements.length}`);

      // Get info about first few elements
      for (let i = 0; i < Math.min(allElements.length, 5); i++) {
        try {
          const element = allElements[i];
          const tagName = await element.getTagName();
          const text = await element.getText().catch(() => '');
          const contentDesc = await element.getAttribute('content-desc').catch(() => '');
          const resourceId = await element.getAttribute('resource-id').catch(() => '');

          console.log(`Element ${i}: tag=${tagName}, text="${text}", desc="${contentDesc}", id="${resourceId}"`);
        } catch (e) {
          console.log(`Element ${i}: Could not get details`);
        }
      }
    } catch (error) {
      console.log('❌ Could not get elements:', error.message);
    }

    // Try to find elements with different text
    const textsToFind = ['Simple Counter', 'Reset', '+', '-', '0'];

    for (const text of textsToFind) {
      try {
        const element = await $(`android=new UiSelector().textContains("${text}")`);
        if (await element.isDisplayed()) {
          console.log(`✅ Found text "${text}"`);
        }
      } catch (error) {
        console.log(`❌ Could not find text "${text}"`);
      }
    }

    // Check if it's a React Native app at all
    try {
      const rnElement = await $('android=new UiSelector().className("com.facebook.react.ReactRootView")');
      if (await rnElement.isDisplayed()) {
        console.log('✅ React Native root view found');
      }
    } catch (error) {
      console.log('❌ React Native root view not found - this might not be a React Native app');
    }

    console.log('🏁 Debug test completed');
  });
});