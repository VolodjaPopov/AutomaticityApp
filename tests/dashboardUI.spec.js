import { expect } from "@playwright/test";
import { test } from "../fixtures/basePage.js";
import { AuthUI } from "../modules/authUI.js";
import { URLS } from "../fixtures/urls.js";

test.describe("Dasboard tests", () => {

    let page;
    let authUI;

    test.beforeAll("Log in", async ({ browser }) => {
        page = await browser.newPage();
        authUI = new AuthUI(page);
        await page.goto(URLS["LOGIN_PAGE"]);
        await authUI.login({ valid: true });
    });

    test.afterAll("Close page", async ({}) => {
        await page.close();
    });
     
    test("Add a product to cart", { tag: "@smoke" }, async({}) => {
        await page.goto(URLS["PROFILE"]);
        await expect(page).toHaveURL(URLS["PROFILE"]);
    });

    test("Generic test", { tag: "@smoke" }, async ({}) => {
       await page.goto(URLS["DASHBOARD"]);
       await expect(page).toHaveURL(URLS["DASHBOARD"]);
    });
});
