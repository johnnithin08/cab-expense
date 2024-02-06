import { expect } from 'detox';

// authenticator__text-field__input-email
// authenticator__text-field__input-password
// authenticator__text-field__input-confirm_password
// authenticator__text-field__input-name
// amplify__button

describe('Login Screen', () => {
  beforeEach(async () => {
    await device.launchApp();
  });

    it("Test Login Screen", async () => {
      const email: string = "johnnithin08@gmail.com"
      const password: string = "Password1!"
      await element(by.id('authenticator__text-field__input-username')).typeText(email);
      await element(by.id('authenticator__text-field__input-password')).typeText(password);
      await element(by.id('amplify__button')).tap();
      await expect(element(by.text("Dashboard"))).toBeVisible()
    })
});