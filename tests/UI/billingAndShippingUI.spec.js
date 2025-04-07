import { expect } from "@playwright/test";
import { test } from "../../fixtures/basePage.js";
import { AuthUI } from "../../modules/authUI.js";
import { URLS } from "../../fixtures/urls.js";
import { BillingShippingUI } from "../../modules/billingShippingUI.js";
import {
  INVALID_BILLING_INFO,
  VALID_USER_CREDENTIALS,
} from "../../fixtures/credentials.js";

test.describe("Tests regarding updating the billing and shipping info of the customer in the profile page", () => {
  let page;
  let authUI;
  let billingShippingUI;

  test.beforeAll("Log in", async ({ browser }) => {
    page = await browser.newPage();
    authUI = new AuthUI(page);
    billingShippingUI = new BillingShippingUI(page);
    await page.goto(URLS["LOGIN_PAGE"]);
    await authUI.login({ valid: true });
  });

  test.beforeEach("Visit the profile page", async ({}) => {
    // We go to the profile page and wait for the billing and shipping
    // info responses to load, otherwise the test goes too fast and innacurate
    // results are recieved.

    await page.goto(URLS["PROFILE"]);
    await expect(page).toHaveURL(URLS["PROFILE"]);
    await expect(billingShippingUI.billingForm).toBeVisible();
    await expect(billingShippingUI.shippingForm).toBeVisible();
    const billingResponse = await page.request.get(
      `/api/v1/customers/${VALID_USER_CREDENTIALS["VALID_ID"]}/billing-info`
    );
    const shippingResponse = await page.request.get(
      `/api/v1/customers/${VALID_USER_CREDENTIALS["VALID_ID"]}/shipping-info`
    );
    expect(billingResponse.status()).toBe(200);
    expect(shippingResponse.status()).toBe(200);
  });

  test(
    "Attempt to update billing info with empty cardholder, number and cvv fields",
    { tag: "@regression" },
    async ({}) => {
      await billingShippingUI.updateBillingInfo({
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
      await billingShippingUI.updateBillingInfo({
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
      await billingShippingUI.updateBillingInfo({
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
      await billingShippingUI.updateBillingInfo({
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
      await billingShippingUI.updateBillingInfo({
        valid: false,
        cardholder: "",
      });
    }
  );

  test(
    "Attempt to update billing info with empty number field",
    { tag: "@regression" },
    async ({}) => {
      await billingShippingUI.updateBillingInfo({
        valid: false,
        card_number: "",
      });
    }
  );

  test(
    "Attempt to update billing info with empty cvv field",
    { tag: "@regression" },
    async ({}) => {
      await billingShippingUI.updateBillingInfo({
        valid: false,
        cvv: "",
      });
    }
  );

  test(
    "Attempt to update billing info an integer cardholder",
    { tag: "@regression" },
    async ({}) => {
      await billingShippingUI.updateBillingInfo({
        valid: false,
        cardholder: INVALID_BILLING_INFO["CARDHOLDER_STRING_OF_NUMBERS"],
      });
    }
  );

  test(
    "Attempt to update billing info with with a short card number",
    { tag: "@regression" },
    async ({}) => {
      await billingShippingUI.updateBillingInfo({
        valid: false,
        card_number: INVALID_BILLING_INFO["SHORT_CARD_NUMBER"],
      });
    }
  );

  test(
    "Attempt to update billing info with with a long card number",
    { tag: "@regression" },
    async ({}) => {
      await billingShippingUI.updateBillingInfo({
        valid: false,
        card_number: INVALID_BILLING_INFO["LONG_CARD_NUMBER"],
      });
    }
  );

  test(
    "Attempt to update billing info with with a string for a card number",
    { tag: "@regression" },
    async ({}) => {
      await billingShippingUI.updateBillingInfo({
        valid: false,
        card_number: INVALID_BILLING_INFO["TEXT_CREDIT_CARD"],
      });
    }
  );

  test(
    "Attempt to update billing info with with a CVV shorter than 3 characters",
    { tag: "@regression" },
    async ({}) => {
      await billingShippingUI.updateBillingInfo({
        valid: false,
        cvv: INVALID_BILLING_INFO["SHORT_CVV"],
      });
    }
  );

  test(
    "Attempt to update billing info with with a CVV longer than 3 characters",
    { tag: "@regression" },
    async ({}) => {
      await billingShippingUI.updateBillingInfo({
        valid: false,
        cvv: INVALID_BILLING_INFO["LONG_CARD_NUMBER"],
      });
    }
  );

  test(
    "Attempt to update billing info with with a string CVV",
    { tag: "@regression" },
    async ({}) => {
      await billingShippingUI.updateBillingInfo({
        valid: false,
        cvv: INVALID_BILLING_INFO["CVV_STRING"],
      });
    }
  );

  test(
    "Attempt to update billing info with expired card",
    { tag: "@regression" },
    async ({}) => {
      await billingShippingUI.updateBillingInfo({
        valid: false,
        monthValue: "01",
        yearValue: "2025",
      });
    }
  );

  test(
    "Update billing info with valid credentials",
    { tag: "@smoke" },
    async ({}) => {
      await billingShippingUI.updateBillingInfo({});
    }
  );
});
