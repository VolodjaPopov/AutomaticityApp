const SUCCESS_MESSAGES = {
  BASIC_SUCCESS_MESSAGE: "Success",
  USER_CREATED_SUCCESSFULLY: "User created successfully",
  USER_LOGGED_IN: "User logged in successfully",
  USER_LOGGED_OUT: "Successfully logged out",
  CUSTOMER_DELETED: "Customer deleted successfully.",
  UPDATED_BILLING_INFO: "Billinginfo updated successfully.",
  UPDATED_SHIPPING_INFO: "Shippinginfo updated successfully.",
};

const ERROR_MESSAGES = {
  GENERIC_ERROR: "Error",
  USERNAME_EMAIL_AND_PASSWORD_ALL_MISSING:
    "The username field is required. (and 2 more errors)",
  EMAIL_AND_PASSWORD_BOTH_MISSING:
    "The email field is required. (and 1 more error)",
  USERNAME_MISSING: "The username field is required.",
  EMAIL_MISSING: "The email field is required.",
  PASSWORD_MISSING: "The password field is required.",
  UNAUTHORIZED: "Unauthorized",
  UNAUTHENTICATED: "Unauthenticated.",
  INVALID_MAIL_FORMAT_FOR_LOGIN:
    "The email field must be a valid email address.",
  INVALID_MAIL_FORMAT_FOR_REGISTER: "The email field format is invalid.",
  PASSWORD_TOO_SHORT: "The password field must be at least 6 characters.",
  TAKEN_USERNAME: "The username has already been taken.",
  TAKEN_EMAIL: "The email has already been taken.",
  USER_ALREADY_EXISTS:
    "The username has already been taken. (and 1 more error)",
  INVALID_TOKEN: "Token could not be parsed from the request.",
  EXPIRED_TOKEN: "Token has expired",
  METHOD_NOT_ALLOWED: "Method Not Allowed",
  LONG_USERNAME: "The username field must not be greater than 255 characters.",
  USERNAME_IS_NULL: "The username field must be a string.",
  NO_CARDHOLDER: "The cardholder field is required.",
  NO_CARD_TYPE: "The card type field is required.",
  NO_CARD_NUMBER: "The card number field is required.",
  NO_CARD_EXPIRATION_DATE: "The card expiration date field is required.",
  NO_CVV: "The cvv field is required.",
  SHORT_CARD_NUMBER: "The card number field must be at least 12 characters.",
  LONG_CARD_NUMBER:
    "The card number field must not be greater than 20 characters.",
  INVALID_EXPIRATION_DATE:
    "The card expiration date format is invalid. Should be MM/YY",
  CARDHOLDER_INT: "The cardholder field must be a string.",
  INVALID_CVV: "The cvv field must be 3 digits.",
  STRING_CVV: "The cvv field must be an integer.",
  CARD_TYPE_INT: "The card type field must be a string.",
  NO_FIRST_NAME: "The first name field is required.",
  NO_LAST_NAME: "The last name field is required.",
  NO_STREET_AND_NUMBER: "The street and number field is required.",
  NO_PHONE_NUMBER: "The phone number field is required.",
  NO_CITY: "The city field is required.",
  NO_POSTAL_CODE: "The postal code field is required.",
  NO_COUNTRY: "The country field is required.",
  FIRST_NAME_INT: "The first name field must be a string.",
  FIRST_NAME_INVALID: "The first name field format is invalid.",
  POSTAL_CODE_STRING: "The postal code field must be an integer.",
  POSTAL_CODE_HI_LO:
    "The postal code field must not be lower than 4 and greater than 10 characters.",
  EMAIL_OR_PASS_INVALID: "The email address or password you entered is invalid",
};

export { SUCCESS_MESSAGES, ERROR_MESSAGES };
