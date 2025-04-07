import { expect } from "@playwright/test";
import { test } from "../../fixtures/basePage.js";
import { CustomersUI } from "../../modules/customersUI.js";
import { AuthUI } from "../../modules/authUI.js";
import { URLS } from "../../fixtures/urls.js";

test.describe("Test regarding applying filters in order to narrow down the search for an item", () => {
  let page;
  let authUI;
  let customersUI;

  test.beforeAll("Log in", async ({ browser }) => {
    page = await browser.newPage();
    authUI = new AuthUI(page);
    customersUI = new CustomersUI(page);
    await page.goto(URLS["LOGIN_PAGE"]);
    await authUI.login({ valid: true });
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

  test("Aplly filters", { tag: "@sanity" }, async ({}) => {
    await customersUI.apllyFilters({
      gpus_1: true,
      cpus_2: true,
    });
  });

  test("Search for a product", { tag: "@sanity" }, async ({}) => {
    await customersUI.searchForItem({ item: "apple" });
  });

  test("Aplly filter for price", { tag: "@sanity" }, async ({}) => {
    await customersUI.applyPriceFilter({});
  });
});
