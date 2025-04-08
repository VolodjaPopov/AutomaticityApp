import { expect } from "@playwright/test";
import { test } from "../../fixtures/basePage.js";
import { AuthUI } from "../../modules/authUI.js";
import { URLS } from "../../fixtures/urls.js";
import { CustomersUI } from "../../modules/customersUI.js";
import { Checkout } from "../../modules/checkout.js";

test.describe("Tests regarding checking out an item in the card, and updating billing or shipping info if needed", () => {
  let page;
  let authUI;
  let customersUI;
  let checkout;

  test.beforeAll("Log in", async ({ browser }) => {
    page = await browser.newPage();
    authUI = new AuthUI(page);
    customersUI = new CustomersUI(page);
    checkout = new Checkout(page);
    await page.goto(URLS["LOGIN_PAGE"]);
    await authUI.login({});
  });

  test.beforeEach(
    "Visit the dashboard page and wait for all products to load",
    async ({}) => {
      // We wait for all products to load because the tests run
      // too fast otherwise and innacurate results are recieved

      await page.goto(URLS["DASHBOARD"]);
      await expect(page).toHaveURL(URLS["DASHBOARD"]);
      await expect(customersUI.spinner).toBeVisible();
      await customersUI.spinner.waitFor({ state: "hidden" });
      for (const prod of await customersUI.product.all()) {
        await expect(prod).toBeVisible();
      }
    }
  );

  test.afterAll("Close page", async ({}) => {
    await page.close();
  });

  test("Checkout item", { tag: "@smoke" }, async ({}) => {
    await checkout.checkoutItem({ updateShipping: true, updateBilling: true });
  });
});
