import { expect } from "@playwright/test";
import {
  VALID_BILLING_INFO,
  VALID_USER_CREDENTIALS,
} from "../fixtures/credentials.js";

export class BillingUI {
  constructor(page) {
    this.page = page;
    this.billingChangesButton = page.locator("button").nth(2);
    this.shippingChangesButton = page.locator("button").nth(3);
    this.billingForm = page.locator("form").nth(0);
    this.cardholderInput = page.locator("#cardholder");
    this.cardTypeDropdown = page.locator("#card_type");
    this.cardNumberInput = page.locator("#card_number");
    this.cvvInput = page.locator("#cvv");
    this.expirationMonthDropdown = page.locator("#card_expiration_month");
    this.expirationYearDropdown = page.locator("#card_expiration_year");
    this.errorMessage = page.locator("p");
  }

  async updateBillingInfo({
    userID = VALID_USER_CREDENTIALS["VALID_ID"],
    cardholder = VALID_BILLING_INFO["CARDHOLDER"],
    card_number = VALID_BILLING_INFO["CARD_NUMBER"],
    cvv = VALID_BILLING_INFO["CVV"],
    monthValue = "03",
    yearValue = "2027",
    expiration_month = `li[aria-label='${monthValue}']`,
    expiration_year = `li[aria-label='${yearValue}']`,
    valid = true,
    checkoutPage = false,
  }) {
    if (checkoutPage) {
      this.billingChangesButton = this.page.locator("button").nth(3);
    }

    if (
      !checkoutPage &&
      (await this.billingChangesButton.locator("span").textContent()).includes(
        "Make changes"
      )
    ) {
      await this.billingChangesButton.click();
    }
    await expect(this.cardholderInput).toBeEditable();
    await this.cardholderInput.fill(cardholder);
    await expect(this.cardTypeDropdown).toBeVisible();
    await this.cardTypeDropdown.click();
    await this.page.locator("li[aria-label='Visa']").click();
    await expect(this.cardNumberInput).toBeEditable();
    await this.cardNumberInput.fill(card_number);
    await expect(this.cvvInput).toBeEditable();
    await this.cvvInput.fill(cvv);
    await expect(this.expirationMonthDropdown).toBeVisible();
    await this.expirationMonthDropdown.click();
    await this.page.locator(expiration_month).click();
    await expect(this.expirationYearDropdown).toBeVisible();
    await this.expirationYearDropdown.click();
    await this.page.locator(expiration_year).click();
    const succesfulBillingInfoUpdateResponse = this.page.waitForResponse(
      `/api/v1/customers/${userID}/billing-info`
    );
    await this.billingChangesButton.click();
    const response = await succesfulBillingInfoUpdateResponse;
    if (valid) {
      expect(response.status()).toBe(200);
    }

    if (!valid) {
      expect(response.status()).not.toBe(200);
      await expect(this.errorMessage.first()).toBeVisible();
    }
  }
}
