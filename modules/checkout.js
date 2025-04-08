import { expect } from "@playwright/test";
import { VALID_USER_CREDENTIALS } from "../fixtures/credentials.js";
import { URLS } from "../fixtures/urls.js";
import { BillingShippingUI } from "./billingShippingUI.js";

export class Checkout {
  constructor(page) {
    this.page = page;
    this.headerAfterLogin = page.locator("#app > div > div").first();
    this.button = this.headerAfterLogin.locator("button");
    this.cartButton = this.button.nth(0);
    this.checkoutButton = page.locator("button").last();
    this.binItemButton = page.locator("button").nth(2);
    this.increaseItemButton = page.locator("button").nth(3);
    this.reduceItemButton = page.locator("button").nth(4);
    this.makeChangesButton = page.locator("button").nth(3);
    this.nextStepButton = page.locator("button").last();
    this.placeOrderButton = page.locator("button").nth(2);
    this.billingShippingUI = new BillingShippingUI(page);
  }

  async checkoutItem({
    userID = VALID_USER_CREDENTIALS["VALID_ID"],
    binItem = false,
    updateShipping = false,
    updateBilling = false,
  }) {
    await this.cartButton.click();
    await expect(this.checkoutButton).toBeEnabled();
    const checkoutResponsePromise = this.page.waitForResponse(
      `/api/v1/cart/${userID}`
    );
    await this.checkoutButton.click();
    const checkoutResponse = await checkoutResponsePromise;
    expect(checkoutResponse.status()).toBe(200);
    await expect(this.page).toHaveURL(URLS["CHECKOUT_PAGE"]);
    if (binItem) {
      await this.binItemButton.click();
      const binResponse = await checkoutResponsePromise;
      expect(binResponse.status()).toBe(200);
      await expect(this.page).toHaveURL(URLS["DASHBOARD"]);
    } else {
      await expect(this.nextStepButton).toBeEnabled();
      const shippingInfoResponsePromise = this.page.waitForResponse(
        `/api/v1/customers/${userID}/shipping-info`
      );
      await this.nextStepButton.click();
      const shippingResponse = await shippingInfoResponsePromise;
      expect(shippingResponse.status()).toBe(200);
      if (updateShipping) {
        this.nextStepButton = this.page.locator("button[type='submit']");
        await this.makeChangesButton.click();
        await this.billingShippingUI.updateShippingInfo({ checkoutPage: true });
      }
      await expect(this.nextStepButton).toBeEnabled();
      const billingInfoResponsePromise = this.page.waitForResponse(
        `/api/v1/customers/${userID}/billing-info`
      );
      await this.nextStepButton.click();
      const billingResponse = await billingInfoResponsePromise;
      expect(billingResponse.status()).toBe(200);
      if (updateBilling) {
        await this.makeChangesButton.click();
        await this.billingShippingUI.updateBillingInfo({ checkoutPage: true });
      }
      await expect(this.nextStepButton).toBeEnabled();
      await this.nextStepButton.click();
      const billingResponse2 = await billingInfoResponsePromise;
      const shippingResponse2 = await shippingInfoResponsePromise;
      expect(billingResponse2.status()).toBe(200);
      expect(shippingResponse2.status()).toBe(200);
      await expect(this.placeOrderButton).toBeEnabled();
      await this.placeOrderButton.click();
      const orderPlacedResponse = await checkoutResponsePromise;
      expect(orderPlacedResponse.status()).toBe(200);
      await expect(this.page).toHaveURL(URLS["DASHBOARD"]);
    }
  }
}
