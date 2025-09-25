describe('Demo Test', () => {
  it('should demonstrate Appium setup', async () => {
    // This is a demo test to show that Appium is configured correctly
    console.log('Appium configuration is set up correctly');
    console.log('Driver capabilities:', browser.capabilities);

    // Check that browser object is available
    expect(browser).toBeDefined();
    expect(browser.capabilities).toBeDefined();

    // Basic test that always passes to demonstrate the setup
    expect(true).toBe(true);
  });

  it('should show available browser methods', async () => {
    // List some available browser methods
    console.log('Available browser methods include:');
    console.log('- browser.getTitle()');
    console.log('- browser.pause()');
    console.log('- $() for element selection');
    console.log('- element.click()');
    console.log('- element.getText()');

    // Demo test passes
    expect(typeof browser.pause).toBe('function');
  });
});