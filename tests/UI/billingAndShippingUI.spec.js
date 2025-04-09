import { expect } from "@playwright/test";
import { test } from "../../fixtures/basePage.js";
import { AuthUI } from "../../modules/authUI.js";
import { URLS } from "../../fixtures/urls.js";
import { BillingUI } from "../../modules/billingUI.js";
import { ShippingUI } from "../../modules/shippingUI.js";
import {
  INVALID_BILLING_INFO,
  INVALID_USER_CREDENTIALS,
  VALID_BILLING_INFO,
  VALID_SHIPPING_INFO,
  VALID_USER_CREDENTIALS,
} from "../../fixtures/credentials.js";

test.describe("Tests regarding updating the billing and shipping info of the customer in the profile page", () => {
  let page;
  let authUI;
  let billingUI;
  let shippingUI;
  let userID = VALID_USER_CREDENTIALS["VALID_ID"];

  test.beforeAll("Log in", async ({ browser }) => {
    page = await browser.newPage();
    authUI = new AuthUI(page);
    billingUI = new BillingUI(page);
    shippingUI = new ShippingUI(page);
    await page.goto(URLS["LOGIN_PAGE"]);
    await authUI.login({ valid: true });
  });

  test.beforeEach("Visit the profile page", async ({}) => {
    /* We go to the profile page and wait for the billing and shipping
       info responses to load, otherwise the tests go too fast and innacurate
       results are recieved. */

    const billingResponsePromise = page.waitForResponse(
      `/api/v1/customers/${userID}/billing-info`
    );
    const shippingResponsePromise = page.waitForResponse(
      `/api/v1/customers/${userID}/shipping-info`
    );
    await page.goto(URLS["PROFILE"]);
    await expect(page).toHaveURL(URLS["PROFILE"]);
    await expect(billingUI.billingForm).toBeVisible();
    await expect(shippingUI.shippingForm).toBeVisible();
    const billingResponse = await billingResponsePromise;
    const shippingResponse = await shippingResponsePromise;
    expect(billingResponse.status()).toBe(200);
    expect(shippingResponse.status()).toBe(200);
  });

  test.afterAll("Close page", async ({}) => {
    await page.close();
  });

  test(
    "Attempt to update billing info with empty cardholder, number and cvv fields",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        cardholder: "",
        card_number: "",
        cvv: "",
      });
    }
  );

  test(
    "Attempt to update billing info with empty cardholder and number fields",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        cardholder: "",
        card_number: "",
      });
    }
  );

  test(
    "Attempt to update billing info with empty cardholder and cvv fields",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        cardholder: "",
        cvv: "",
      });
    }
  );

  test(
    "Attempt to update billing info with empty number and cvv fields",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        card_number: "",
        cvv: "",
      });
    }
  );

  test(
    "Attempt to update billing info with empty cardholder field",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        cardholder: "",
      });
    }
  );

  test(
    "Attempt to update billing info with empty number field",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        card_number: "",
      });
    }
  );

  test(
    "Attempt to update billing info with empty cvv field",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        cvv: "",
      });
    }
  );

  test(
    "Attempt to update billing info an integer cardholder",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        cardholder: INVALID_BILLING_INFO["CARDHOLDER_STRING_OF_NUMBERS"],
      });
    }
  );

  test(
    "Attempt to update billing info with with a short card number",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        card_number: INVALID_BILLING_INFO["SHORT_CARD_NUMBER"],
      });
    }
  );

  test(
    "Attempt to update billing info with with a long card number",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        card_number: INVALID_BILLING_INFO["LONG_CARD_NUMBER"],
      });
    }
  );

  test(
    "Attempt to update billing info with with a string for a card number",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        card_number: INVALID_BILLING_INFO["TEXT_CREDIT_CARD"],
      });
    }
  );

  test(
    "Attempt to update billing info with with a CVV shorter than 3 characters",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        cvv: INVALID_BILLING_INFO["SHORT_CVV"],
      });
    }
  );

  test(
    "Attempt to update billing info with with a CVV longer than 3 characters",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        cvv: INVALID_BILLING_INFO["LONG_CARD_NUMBER"],
      });
    }
  );

  test(
    "Attempt to update billing info with with a string CVV",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        cvv: INVALID_BILLING_INFO["CVV_STRING"],
      });
    }
  );

  test(
    "Attempt to update billing info with expired card",
    { tag: "@regression" },
    async ({}) => {
      await billingUI.updateBillingInfo({
        valid: false,
        monthValue: "01",
        yearValue: "2025",
      });
    }
  );

  test(
    "Attempt to update shipping info with empty strings in every field",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        street_address: "",
        city: "",
        postal_code: "",
        country: "",
        valid: false,
      });
    }
  );

  test(
    "Attempt to update first name to an integer",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        first_name: INVALID_BILLING_INFO["CARDHOLDER_STRING_OF_NUMBERS"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update last name to an integer",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        last_name: INVALID_BILLING_INFO["CARDHOLDER_STRING_OF_NUMBERS"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update email to an invalid type",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        email: INVALID_USER_CREDENTIALS["INVALID_MAIL_FORMAT"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update phone number to only 3 characters",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        phone_number: VALID_BILLING_INFO["CVV"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update phone number to 100 characters",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        phone_number: INVALID_BILLING_INFO["LONG_CARD_NUMBER"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update phone number to string",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        phone_number: INVALID_BILLING_INFO["TEXT_CREDIT_CARD"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update address to only an integer",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        street_address: INVALID_BILLING_INFO["CARDHOLDER_STRING_OF_NUMBERS"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update address to string with no street number",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        street_address: VALID_SHIPPING_INFO["CITY"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update city to integer",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        city: INVALID_BILLING_INFO["CARDHOLDER_STRING_OF_NUMBERS"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update postal code to less than 4 characters",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        postal_code: INVALID_BILLING_INFO["SHORT_CVV"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update postal code to more than 10 characters",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        postal_code: VALID_BILLING_INFO["CARD_NUMBER"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update postal code to string",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        postal_code: VALID_SHIPPING_INFO["FIRST_NAME"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update country to integer",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        country: INVALID_BILLING_INFO["CARDHOLDER_STRING_OF_NUMBERS"],
        valid: false,
      });
    }
  );

  test(
    "Attempt to update country to only 1 character",
    { tag: "@regression" },
    async ({}) => {
      await shippingUI.updateShippingInfo({
        country: INVALID_BILLING_INFO["ONE_CHAR"],
        valid: false,
      });
    }
  );

  test(
    "Update billing info with valid credentials",
    { tag: "@smoke" },
    async ({}) => {
      await billingUI.updateBillingInfo({});
    }
  );

  test(
    "Update shipping info with valid credentials",
    { tag: "@smoke" },
    async ({}) => {
      await shippingUI.updateShippingInfo({});
    }
  );
});
