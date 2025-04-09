import { test as baseTest } from "@playwright/test";
import { AuthAPI } from "../modules/authAPI.js";
import { CustomersAPI } from "../modules/customersAPI.js";
import { AuthUI } from "../modules/authUI.js";
import { CustomersUI } from "../modules/customersUI.js";
import { BillingUI } from "../modules/billingUI.js";
import { ShippingUI } from "../modules/shippingUI.js";

export const test = baseTest.extend({
  authAPI: async ({ page }, use) => {
    await use(new AuthAPI(page));
  },
  customersAPI: async ({ page }, use) => {
    await use(new CustomersAPI(page));
  },
  authUI: async ({ page }, use) => {
    await use(new AuthUI(page));
  },
  customersUI: async ({ page }, use) => {
    await use(new CustomersUI(page));
  },
  billingUI: async ({ page }, use) => {
    await use(new BillingUI(page));
  },
  shippingUI: async ({ page }, use) => {
    await use(new ShippingUI(page));
  },
});
