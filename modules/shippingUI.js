import { expect } from "@playwright/test";
import {
  VALID_USER_CREDENTIALS,
  VALID_SHIPPING_INFO,
} from "../fixtures/credentials.js";

export class ShippingUI {
  constructor(page) {
    this.page = page;
    this.shippingChangesButton = page.locator("button").nth(3);
    this.shippingForm = page.locator("form").nth(1);
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
    checkoutPage = false,
  }) {
    if (
      !checkoutPage &&
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
