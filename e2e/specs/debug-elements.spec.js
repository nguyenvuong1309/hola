describe('Debug Elements Visibility', () => {
  it('should find and analyze all counter elements', async () => {
    console.log('🚀 Starting elements visibility debug...');

    await driver.pause(3000);

    const selectors = [
      '//*[@content-desc="counter-value"]',
      '//*[@content-desc="reset-button"]',
      '//*[@content-desc="increment-button"]',
      '//*[@content-desc="decrement-button"]',
      '//android.widget.TextView[@text="Simple Counter"]',
      '//android.widget.TextView[@text="Reset"]',
      '//*[contains(@text, "Simple Counter")]',
      '//*[contains(@text, "Reset")]'
    ];

    for (const selector of selectors) {
      try {
        console.log(`\n🔍 Testing selector: ${selector}`);

        const element = await $(selector);
        const exists = await element.isExisting();
        console.log(`  📍 Exists: ${exists}`);

        if (exists) {
          const displayed = await element.isDisplayed();
          console.log(`  👁️  Displayed: ${displayed}`);

          const enabled = await element.isEnabled();
          console.log(`  ⚡ Enabled: ${enabled}`);

          try {
            const bounds = await element.getLocation();
            console.log(`  📐 Location: x=${bounds.x}, y=${bounds.y}`);
          } catch (e) {
            console.log(`  📐 Location: Could not get - ${e.message}`);
          }

          try {
            const size = await element.getSize();
            console.log(`  📏 Size: width=${size.width}, height=${size.height}`);
          } catch (e) {
            console.log(`  📏 Size: Could not get - ${e.message}`);
          }

          try {
            const text = await element.getText();
            console.log(`  📝 Text: "${text}"`);
          } catch (e) {
            console.log(`  📝 Text: Could not get - ${e.message}`);
          }

          if (displayed) {
            console.log(`  ✅ Element is VISIBLE and ready for interaction`);
          } else {
            console.log(`  ⚠️  Element exists but NOT VISIBLE`);
          }
        }
      } catch (error) {
        console.log(`  ❌ Error with selector: ${error.message}`);
      }
    }

    // Check screen info
    try {
      console.log('\n📱 Screen Info:');
      const windowSize = await driver.getWindowSize();
      console.log(`  Screen size: ${windowSize.width}x${windowSize.height}`);
    } catch (error) {
      console.log(`  Could not get screen info: ${error.message}`);
    }

    // Try to scroll and check again
    console.log('\n🔄 Trying to scroll...');
    try {
      await driver.touchAction([
        { action: 'press', x: 540, y: 1200 },
        { action: 'moveTo', x: 540, y: 600 },
        { action: 'release' }
      ]);
      await driver.pause(1000);
      console.log('✅ Scrolled up');
    } catch (error) {
      console.log(`❌ Could not scroll: ${error.message}`);
    }

    // Check again after scroll
    console.log('\n🔍 Checking elements after scroll...');
    try {
      const counterElement = await $('//*[@content-desc="counter-value"]');
      if (await counterElement.isExisting()) {
        const displayed = await counterElement.isDisplayed();
        console.log(`📊 Counter element displayed after scroll: ${displayed}`);
      }
    } catch (error) {
      console.log(`❌ Error checking after scroll: ${error.message}`);
    }

    console.log('\n🏁 Elements debug completed');
  });
});