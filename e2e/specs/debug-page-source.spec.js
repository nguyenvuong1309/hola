describe('Page Source Debug', () => {
  it('should print full page source', async () => {
    console.log('🚀 Starting page source debug...');

    // Wait for app to load
    await driver.pause(5000);

    try {
      const pageSource = await driver.getPageSource();

      // Save to file for easier reading
      const fs = require('fs');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `page-source-${timestamp}.xml`;

      fs.writeFileSync(filename, pageSource);
      console.log(`📄 Page source saved to: ${filename}`);

      // Also log to console (truncated)
      console.log('📄 Page Source (first 3000 chars):');
      console.log(pageSource.substring(0, 3000));

      // Check if it contains React Native indicators
      const hasReactNative = pageSource.includes('React') || pageSource.includes('react');
      console.log('⚛️  Contains React Native indicators:', hasReactNative);

      // Look for our specific elements
      const searchTerms = [
        'counter-value',
        'reset-button',
        'increment-button',
        'Simple Counter',
        'Reset',
        'testID',
        'content-desc'
      ];

      console.log('🔍 Searching for terms in page source:');
      searchTerms.forEach(term => {
        const found = pageSource.includes(term);
        console.log(`  - "${term}": ${found ? '✅' : '❌'}`);
      });

      // Get current activity
      const activity = await driver.getCurrentActivity();
      console.log('📱 Current Activity:', activity);

    } catch (error) {
      console.log('❌ Error getting page source:', error.message);
    }

    console.log('🏁 Page source debug completed');
  });
});