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
    monthValue = "03",
    yearValue = "2027",
    expiration_month = `li[aria-label='${monthValue}']`,
    expiration_year = `li[aria-label='${yearValue}']`,
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

  async updateShippingInfo({
    userID = VALID_USER_CREDENTIALS["VALID_ID"],
    first_name = VALID_SHIPPING_INFO["FIRST_NAME"],
    last_name = VALID_SHIPPING_INFO["LAST_NAME"],
    email = VALID_SHIPPING_INFO["EMAIL"],
    phone_number = VALID_SHIPPING_INFO["PHONE_NUMBER"],
    street_address = VALID_SHIPPING_INFO["STREET_AND_NUMBER"],
    city = VALID_SHIPPING_INFO["CITY"],
    postal_code = VALID_SHIPPING_INFO["POSTAL_CODE"],
    country = VALID_SHIPPING_INFO["COUNTRY"],
    valid = true,
  }) {
    if (
      (await this.shippingChangesButton.locator("span").textContent()).includes(
        "Make changes"
      )
    ) {
      await this.shippingChangesButton.click();
    }

    await expect(this.firstNameInput).toBeEditable();
    await this.firstNameInput.fill(first_name);
    await expect(this.lastNameInput).toBeEditable();
    await this.lastNameInput.fill(last_name);
    await expect(this.emailInput).toBeEditable();
    await this.emailInput.fill(email);
    await expect(this.phoneNumberInput).toBeEditable();
    await this.phoneNumberInput.fill(phone_number);
    await expect(this.streetAddressInput).toBeEditable();
    await this.streetAddressInput.fill(street_address);
    await expect(this.cityInput).toBeEditable();
    await this.cityInput.fill(city);
    await expect(this.postalCodeInput).toBeEditable();
    await this.postalCodeInput.fill(postal_code);
    await expect(this.countryInput).toBeEditable();
    await this.countryInput.fill(country);
    const shippingInfoUpdateResponse = this.page.waitForResponse(
      `/api/v1/customers/${userID}/shipping-info`
    );
    await this.shippingChangesButton.click();
    const response = await shippingInfoUpdateResponse;
    if (valid) {
      expect(response.status()).toBe(200);
    }

    if (!valid) {
      expect(response.status()).not.toBe(200);
      await expect(this.errorMessage.first()).toBeVisible();
    }
  }
}
