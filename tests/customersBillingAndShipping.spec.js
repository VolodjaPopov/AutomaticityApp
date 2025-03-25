import { test } from '../fixtures/basePage.js';
import { INVALID_BILLING_INFO, INVALID_ID, INVALID_USER_CREDENTIALS, VALID_BILLING_INFO, VALID_SHIPPING_INFO } from '../fixtures/credentials.js';
import { ERROR_MESSAGES } from '../fixtures/messages.js';
import { noID } from '../generalFunctions/functions.js';

test.describe("Customer API tests regarding billing and shipping info", () => {

    let bearerToken;

    test.beforeEach("Get user token and ID", async ({ authAPI }) => {
        const response = await authAPI.login({});
        bearerToken = await response.auth.token;
    });

    test("Attempt to get billing info without a token", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.getBillingInfo({ token: "", statusCode: 401, message: ERROR_MESSAGES["UNAUTHENTICATED"] });
    });

    test("Attempt to get billing info of a customer with no valid ID", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.getBillingInfo({ token: bearerToken, userID: INVALID_ID, statusCode: 404, message: noID(INVALID_ID) });
    });

    test("Attempt to get billing info using invalid methods", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.getBillingInfo({ token: bearerToken, method: "post", statusCode: 405, message: ERROR_MESSAGES["METHOD_NOT_ALLOWED"] });
        await customersAPI.getBillingInfo({ token: bearerToken, method: "patch", statusCode: 405, message: ERROR_MESSAGES["METHOD_NOT_ALLOWED"] });
        await customersAPI.getBillingInfo({ token: bearerToken, method: "delete", statusCode: 405, message: ERROR_MESSAGES["METHOD_NOT_ALLOWED"] });
    });

    test("Attempt to update billing info without a token", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: "", statusCode:401, message: ERROR_MESSAGES["UNAUTHENTICATED"] })
    });

    test("Attempt to update billing info of a customer with no valid ID", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, userID: INVALID_ID, statusCode: 404, message: noID(INVALID_ID) });
    });

    test("Attempt to update billing info to empty strings", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, cardholder: "", card_number: "", card_type: "", cvv: "", card_expiration_date: "", statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"] });
    });

    test("Attempt to update credit card number to a 5 digit number", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, card_number: INVALID_BILLING_INFO["SHORT_CARD_NUMBER"], statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"], card_number_error: ERROR_MESSAGES["SHORT_CARD_NUMBER"] });
    });

    test("Attempt to update credit card number to a text value", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, card_number: INVALID_BILLING_INFO["TEXT_CREDIT_CARD"], statusCode: 422 });
    });

    test("Attempt to update credit card to a 100 digit number", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, card_number: INVALID_BILLING_INFO["LONG_CARD_NUMBER"], statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"], card_number_error: ERROR_MESSAGES["LONG_CARD_NUMBER"] });
    });

    test("Attempt to update card type to an interger value", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, statusCode: 422, card_type: INVALID_BILLING_INFO["CARDHOLDER_INT"], message: ERROR_MESSAGES["GENERIC_ERROR"], card_type_error: ERROR_MESSAGES["CARD_TYPE_INT"] });
    });

    test("Attempt to update card type to an string of integers", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, statusCode: 422, card_type: INVALID_BILLING_INFO["CARDHOLDER_STRING_OF_NUMBERS"], message: ERROR_MESSAGES["GENERIC_ERROR"], card_type_error: ERROR_MESSAGES["CARD_TYPE_INT"] });
    });

    test("Attempt to update expiration date to invalid date format", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, card_expiration_date: INVALID_BILLING_INFO["INVALID_EXPIRATION_DATE"], statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"], card_expiration_date_error: ERROR_MESSAGES["INVALID_EXPIRATION_DATE"] });
    });

    test("Attempt to update expiration date to past date", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, card_expiration_date: INVALID_BILLING_INFO["EXPIRED_CARD"], statusCode: 422 });
    });

    test("Attempt to update cardholder to an integer", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, cardholder: INVALID_BILLING_INFO["CARDHOLDER_INT"], statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"], cardholder_error: ERROR_MESSAGES["CARDHOLDER_INT"] });
    });

    test("Attempt to update cardholder to an string of numbers", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, cardholder: INVALID_BILLING_INFO["CARDHOLDER_STRING_OF_NUMBERS"], statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"], cardholer_error: ERROR_MESSAGES["CARDHOLDER_INT"] });
    });

    test("Attempt to update cvv to a 10 digit number", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, cvv: INVALID_BILLING_INFO["CARDHOLDER_STRING_OF_NUMBERS"], statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"], cvv_error: ERROR_MESSAGES["INVALID_CVV"] });
    });

    test("Attempt to update cvv to a string", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken, cvv: INVALID_BILLING_INFO["CVV_STRING"], statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"], cvv_error: ERROR_MESSAGES["STRING_CVV"] });
    });

    test("Attempt to get shipping info of customer without a token", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.getShippingInfo({ token: "", statusCode: 401, message: ERROR_MESSAGES["UNAUTHENTICATED"] });
    });

    test("Attempt to get shipping info of customer iwth invalid ID", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.getShippingInfo({ token: bearerToken, statusCode: 404, userID: INVALID_ID, message: noID(INVALID_ID) });
    });

    test("Attempt to get shipping info using invalid methods", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.getShippingInfo({ token: bearerToken, method: "post", statusCode: 405, message: ERROR_MESSAGES["METHOD_NOT_ALLOWED"] });
        await customersAPI.getShippingInfo({ token: bearerToken, method: "patch", statusCode: 405, message: ERROR_MESSAGES["METHOD_NOT_ALLOWED"] });
        await customersAPI.getShippingInfo({ token: bearerToken, method: "delete", statusCode: 405, message: ERROR_MESSAGES["METHOD_NOT_ALLOWED"] });
    });

    test("Attempt to update shipping info to empty strings", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateShippingInfo({ token: bearerToken, first_name: "", last_name: "", email: "", street_and_number: "", phone_number: "", city: "", postal_code: "", country: "", statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"] });
    });

    test("Attempt to update first name to an integer", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateShippingInfo({ token: bearerToken, first_name: INVALID_BILLING_INFO["CARDHOLDER_INT"], statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"], first_name_error: ERROR_MESSAGES["FIRST_NAME_INT"] });
    });

    test("Attempt to update first name to a string of integers", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateShippingInfo({ token: bearerToken, first_name: INVALID_BILLING_INFO["CARDHOLDER_STRING_OF_NUMBERS"], statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"], first_name_error: ERROR_MESSAGES["FIRST_NAME_INVALID"] });
    });

    test("Attempt to update street and number without a number", { tag: "@regression" }, async({ customersAPI }) => {
        await customersAPI.updateShippingInfo({ token: bearerToken, street_and_number: VALID_SHIPPING_INFO["FIRST_NAME"], statusCode: 422 });
    });

    test("Attempt to update postal code to a string", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateShippingInfo({ token: bearerToken, postal_code: VALID_SHIPPING_INFO["FIRST_NAME"], statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"], postal_code_error: ERROR_MESSAGES["POSTAL_CODE_STRING"] });
    });

    test("Attempt to update postal code to 3 digit number", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateShippingInfo({ token: bearerToken, postal_code: VALID_BILLING_INFO["CVV"], statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"], postal_code_error: ERROR_MESSAGES["POSTAL_CODE_HI_LO"] });
    });

    test("Attempt to update email to an invalid format", { tag: "@regression" }, async ({ customersAPI }) => {
        await customersAPI.updateShippingInfo({ token: bearerToken, email: INVALID_USER_CREDENTIALS["INVALID_MAIL_FORMAT"], statusCode: 422, message: ERROR_MESSAGES["GENERIC_ERROR"], email_error: ERROR_MESSAGES["INVALID_MAIL_FORMAT_FOR_REGISTER"] });
    });

    test("Get billing info of customer", { tag: "@smoke" }, async ({ customersAPI }) => {
        await customersAPI.getBillingInfo({ token: bearerToken });
    });

    test("Update billing info of customer", { tag: "@smoke" }, async ({ customersAPI }) => {
        await customersAPI.updateBillingInfo({ token: bearerToken });
    });

    test("Get shipping info of customer", { tag: "@smoke" }, async ({ customersAPI }) => {
        await customersAPI.getShippingInfo({ token: bearerToken });
    });

    test("Update shipping info of customer", { tag: "@smoke" }, async ({ customersAPI }) => {
        await customersAPI.updateShippingInfo({ token: bearerToken });
    });
});
