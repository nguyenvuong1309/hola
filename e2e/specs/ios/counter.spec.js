describe('Counter App (iOS)', () => {
  beforeEach(async () => {
    console.log('🍎 Starting iOS test setup...');

    // Wait for app to load
    await driver.pause(2000);

    // Reset counter to 0 before each test (iOS selectors)
    try {
      const resetButton = await $('~reset-button');
      await resetButton.waitForDisplayed({ timeout: 10000 });
      await resetButton.click();
      await driver.pause(500);
      console.log('✅ Reset button clicked successfully');
    } catch (error) {
      console.log('⚠️ Could not click reset button:', error.message);
    }
  });

  it('should display initial counter value of 0', async () => {
    console.log('🧪 Testing initial counter value...');

    const counterValue = await $('~counter-value');
    await counterValue.waitForDisplayed({ timeout: 10000 });

    const value = await counterValue.getText();
    console.log(`📊 Counter value: "${value}"`);

    expect(value).toBe('0');
    console.log('✅ Initial value test passed');
  });

  it('should increment counter when + button is pressed', async () => {
    console.log('🧪 Testing increment functionality...');

    const incrementButton = await $('~increment-button');
    const counterValue = await $('~counter-value');

    await incrementButton.waitForDisplayed({ timeout: 10000 });
    console.log('✅ Increment button found');

    await incrementButton.click();
    await driver.pause(500);
    console.log('✅ Increment button clicked');

    const value = await counterValue.getText();
    console.log(`📊 Counter value after increment: "${value}"`);

    expect(value).toBe('1');
    console.log('✅ Increment test passed');
  });

  it('should decrement counter when - button is pressed', async () => {
    console.log('🧪 Testing decrement functionality...');

    const decrementButton = await $('~decrement-button');
    const counterValue = await $('~counter-value');
    const incrementButton = await $('~increment-button');

    // First increment to have a positive number
    await incrementButton.click();
    await driver.pause(500);
    console.log('✅ Incremented first');

    // Then decrement
    await decrementButton.click();
    await driver.pause(500);
    console.log('✅ Decremented');

    const value = await counterValue.getText();
    console.log(`📊 Counter value after decrement: "${value}"`);

    expect(value).toBe('0');
    console.log('✅ Decrement test passed');
  });

  it('should reset counter when reset button is pressed', async () => {
    console.log('🧪 Testing reset functionality...');

    const incrementButton = await $('~increment-button');
    const resetButton = await $('~reset-button');
    const counterValue = await $('~counter-value');

    // Increment a few times
    for (let i = 0; i < 3; i++) {
      await incrementButton.click();
      await driver.pause(300);
    }
    console.log('✅ Incremented 3 times');

    // Verify counter is not 0
    let value = await counterValue.getText();
    console.log(`📊 Counter value before reset: "${value}"`);
    expect(value).toBe('3');

    // Reset
    await resetButton.click();
    await driver.pause(500);
    console.log('✅ Reset button clicked');

    // Verify counter is back to 0
    value = await counterValue.getText();
    console.log(`📊 Counter value after reset: "${value}"`);
    expect(value).toBe('0');
    console.log('✅ Reset test passed');
  });

  it('should handle negative numbers', async () => {
    console.log('🧪 Testing negative numbers...');

    const decrementButton = await $('~decrement-button');
    const counterValue = await $('~counter-value');

    // Decrement from 0 to get negative number
    await decrementButton.click();
    await driver.pause(500);
    console.log('✅ Decremented from 0');

    const value = await counterValue.getText();
    console.log(`📊 Counter value (should be negative): "${value}"`);

    expect(value).toBe('-1');
    console.log('✅ Negative number test passed');
  });

  it('should allow multiple operations', async () => {
    console.log('🧪 Testing multiple operations...');

    const incrementButton = await $('~increment-button');
    const decrementButton = await $('~decrement-button');
    const counterValue = await $('~counter-value');

    // Perform sequence: +3, -1, +2 = 4
    for (let i = 0; i < 3; i++) {
      await incrementButton.click();
      await driver.pause(300);
    }
    console.log('✅ Added 3');

    await decrementButton.click();
    await driver.pause(300);
    console.log('✅ Subtracted 1');

    for (let i = 0; i < 2; i++) {
      await incrementButton.click();
      await driver.pause(300);
    }
    console.log('✅ Added 2');

    const value = await counterValue.getText();
    console.log(`📊 Final counter value: "${value}"`);

    expect(value).toBe('4');
    console.log('✅ Multiple operations test passed');
  });
});