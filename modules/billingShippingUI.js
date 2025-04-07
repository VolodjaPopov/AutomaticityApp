import { expect } from "@playwright/test";
import {
  VALID_BILLING_INFO,
  VALID_USER_CREDENTIALS,
  VALID_SHIPPING_INFO,
} from "../fixtures/credentials.js";

export class BillingShippingUI {
  constructor(page) {
    this.page = page;
    this.billingChangesButton = page.locator("button").nth(2);
    this.shippingChangesButton = page.locator("button").nth(3);
    this.billingForm = page.locator("form").nth(0);
    this.shippingForm = page.locator("form").nth(1);
    this.cardholderInput = page.locator("#cardholder");
    this.cardTypeDropdown = page.locator("#card_type");
    this.cardNumberInput = page.locator("#card_number");
    this.cvvInput = page.locator("#cvv");
    this.expirationMonthDropdown = page.locator("#card_expiration_month");
    this.expirationYearDropdown = page.locator("#card_expiration_year");
    this.firstNameInput = page.locator("#first_name");
    this.lastNameInput = page.locator("#last_name");
    this.emailInput = page.locator("#email");
    this.phoneNumberInput = page.locator("#phone_number");
    this.streetAddressInput = page.locator("#street_and_number");
    this.cityInput = page.locator("#city");
    this.postalCodeInput = page.locator("#postal_code");
    this.countryInput = page.locator("#country");
    this.errorMessage = page.locator("p");
  }

  async updateBillingInfo({
    userID = VALID_USER_CREDENTIALS["VALID_ID"],
    cardholder = VALID_BILLING_INFO["CARDHOLDER"],
    card_number = VALID_BILLING_INFO["CARD_NUMBER"],
    cvv = VALID_BILLING_INFO["CVV"],
    valid = true,
  }) {
    if (
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
    await this.page.locator("li[aria-label='03']").click();
    await expect(this.expirationYearDropdown).toBeVisible();
    await this.expirationYearDropdown.click();
    await this.page.locator("li[aria-label='2027']").click();
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
