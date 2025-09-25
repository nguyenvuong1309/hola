describe('Counter App', () => {
  beforeEach(async () => {
    // Wait for app to load
    await driver.pause(1000);

    // Reset counter to 0 before each test
    const resetButton = await $('~reset-button');
    await resetButton.waitForDisplayed({ timeout: 10000 });
    await resetButton.click();
    await driver.pause(500);
  });

  it('should display initial counter value of 0', async () => {
    const counterValue = await $('~counter-value');
    await counterValue.waitForDisplayed({ timeout: 10000 });

    const value = await counterValue.getText();
    expect(value).toBe('0');
  });

  it('should increment counter when + button is pressed', async () => {
    const incrementButton = await $('~increment-button');
    const counterValue = await $('~counter-value');

    await incrementButton.waitForDisplayed({ timeout: 10000 });
    await incrementButton.click();

    await driver.pause(500);
    const value = await counterValue.getText();
    expect(value).toBe('1');
  });

  it('should decrement counter when - button is pressed', async () => {
    const decrementButton = await $('~decrement-button');
    const counterValue = await $('~counter-value');

    // First increment to have a positive number
    const incrementButton = await $('~increment-button');
    await incrementButton.click();
    await driver.pause(500);

    // Then decrement
    await decrementButton.click();
    await driver.pause(500);

    const value = await counterValue.getText();
    expect(value).toBe('0');
  });

  it('should reset counter when reset button is pressed', async () => {
    const incrementButton = await $('~increment-button');
    const resetButton = await $('~reset-button');
    const counterValue = await $('~counter-value');

    // Increment a few times
    await incrementButton.click();
    await driver.pause(300);
    await incrementButton.click();
    await driver.pause(300);
    await incrementButton.click();
    await driver.pause(500);

    // Verify counter is not 0
    let value = await counterValue.getText();
    expect(value).toBe('3');

    // Reset
    await resetButton.click();
    await driver.pause(500);

    // Verify counter is back to 0
    value = await counterValue.getText();
    expect(value).toBe('0');
  });

  it('should allow multiple operations', async () => {
    const incrementButton = await $('~increment-button');
    const decrementButton = await $('~decrement-button');
    const counterValue = await $('~counter-value');

    // Perform a sequence of operations: +3, -1, +2 = 4
    await incrementButton.click();
    await driver.pause(300);
    await incrementButton.click();
    await driver.pause(300);
    await incrementButton.click();
    await driver.pause(300);

    await decrementButton.click();
    await driver.pause(300);

    await incrementButton.click();
    await driver.pause(300);
    await incrementButton.click();
    await driver.pause(500);

    const value = await counterValue.getText();
    expect(value).toBe('4');
  });

  it('should handle negative numbers', async () => {
    const decrementButton = await $('~decrement-button');
    const counterValue = await $('~counter-value');

    // Decrement from 0 to get negative number
    await decrementButton.click();
    await driver.pause(500);

    const value = await counterValue.getText();
    expect(value).toBe('-1');
  });
});