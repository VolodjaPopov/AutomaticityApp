import { expect } from '@playwright/test';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../fixtures/messages.js';
import { billingInfoMessage, shippingInfoMessage, generateUserCredentials, customersEndpoint } from '../generalFunctions/functions.js';
import { CUSTOMER_FOR_UPDATES, VALID_BILLING_INFO, VALID_SHIPPING_INFO, VALID_USER_CREDENTIALS } from '../fixtures/credentials.js';
import Joi from 'joi';

const { username1, email1 } = generateUserCredentials(5);

export class CustomersAPI {
    constructor(page) {
        this.page = page;
      }
  
      getAcceptHeader() {
        return "application/json";
      }
  
      getAuthorizationHeader(token) {
        return `Bearer ${token}`;
      }

  async getCustomers({
    token, 
    statusCode = 200, 
    message = SUCCESS_MESSAGES["BASIC_SUCCESS_MESSAGE"], 
    method = "get"
  }) {
    let response = await this.page.request[method](`${customersEndpoint()}`, {
      headers: { Accept: this.getAcceptHeader(), Authorization: this.getAuthorizationHeader(token) }, 
    });

    expect(response.status()).toBe(statusCode);
    let responseJSON = await response.json();   

    if (statusCode == 200) {
      expect(responseJSON.status).toBe(message);
    }

    else if(statusCode == 405) {
      expect(responseJSON).toEqual({
      error: expect.any(String), 
      });
      expect(responseJSON.error).toBe(message);
    }

    else {
      expect(responseJSON).toEqual({
      message: expect.any(String), 
      });
      expect(responseJSON.message).toBe(message);
    }

    return responseJSON;
  }

  async getSpecificCustomer({
    token, 
    userID = VALID_USER_CREDENTIALS["VALID_ID"], 
    statusCode = 200, 
    message = SUCCESS_MESSAGES["BASIC_SUCCESS_MESSAGE"], 
  }) {
    let response = await this.page.request.get(`${customersEndpoint()}/${userID}`, {
      headers: { Accept: this.getAcceptHeader(), Authorization: this.getAuthorizationHeader(token) }, 
    });

    expect(response.status()).toBe(statusCode);
    let responseJSON = await response.json();

    if(statusCode == 200) {
      const schema = Joi.object({
        responseJSON: {
          status: Joi.string().required(), 
          customer: {
            id: Joi.number().required(), 
            user_id: Joi.number().required(), 
            cart_id: Joi.number().allow(null), 
            username: Joi.string().required(), 
            first_name: Joi.string().allow(null), 
            last_name: Joi.string().allow(null), 
            email: Joi.string().email().required(), 
            password: Joi.string().required(), 
            date_of_birth: Joi.string().allow(null), 
            created_at: Joi.string(), 
            updated_at: Joi.string(), 
          }, 
        }
      });
      expect(schema.validate({responseJSON}).error).toBe(undefined);
      expect(responseJSON.customer.id).toBe(userID);
    }

    if(statusCode != 200) {

      switch(response.status()) {

        case 401:
        expect(responseJSON).toEqual({
        message: expect.any(String), 
        });
        expect(responseJSON.message).toBe(message);
        break;

        case 404:
        expect(responseJSON).toEqual({
        error: expect.any(String), 
        });
        expect(responseJSON.error).toBe(message);
        break;

        case 405:
        expect(responseJSON).toEqual({
        error: expect.any(String), 
        });
        expect(responseJSON.error).toBe(message);
        break;

        case 500:
        expect(responseJSON).toEqual({
        message: expect.any(String), 
        });
        expect(responseJSON.message).toBe(message);
        break;

      }
    }
    
    return responseJSON;
  }

  async updateCustomer({
    token, 
    userID = CUSTOMER_FOR_UPDATES, 
    statusCode = 200, 
    message = SUCCESS_MESSAGES["BASIC_SUCCESS_MESSAGE"], 
    username = username1, 
    email = email1, 
    password = VALID_USER_CREDENTIALS["VALID_PASSWORD"], 
  }) {
    let response = await this.page.request.put(`${customersEndpoint()}/${userID}`, {
    data: { username: username, email: email, password: password }, 
    headers: { Accept: this.getAcceptHeader(), Authorization: this.getAuthorizationHeader(token) }, 
    });

    let responseJSON = await response.json();
    

    expect(response.status()).toBe(statusCode);
    if (statusCode == 200) {
      expect(responseJSON).toEqual({
        status: expect.any(String), 
        message: expect.any(String), 
        customer: expect.any(Object), 
        cart: expect.any(Object), 
      });
    }

     if (statusCode != 200) {
       switch(response.status()) {

         case 401:
          expect(responseJSON).toEqual({
          message: expect.any(String), 
          });
          expect(responseJSON.message).toBe(message);
          break;

          case 404:
          expect(responseJSON).toEqual({
            error: expect.any(String), 
          });
          expect(responseJSON.error).toBe(message);
          break;

          case 405:
          expect(responseJSON).toEqual({
            message: expect.any(String), 
          });
          expect(responseJSON.message).toBe(message);
          
          case 422: 
          expect(responseJSON).toEqual({
            message: expect.any(String), 
            errors: expect.any(Object), 
          });
          expect(responseJSON.message).toBe(message);
          break;

          case 500: 
          expect(responseJSON.message).toBe(message)
          break;
       }
     }

    return responseJSON;
  }

  async delete({
    userID, 
    statusCode = 200, 
    token, 
    message = SUCCESS_MESSAGES["CUSTOMER_DELETED"], 
  }) {
    let response = await this.page.request.delete(`${customersEndpoint()}/${userID}`, {
      headers: { Accept: this.getAcceptHeader(), Authorization: this.getAuthorizationHeader(token) },
    });

    expect(response.status()).toBe(statusCode);
    let responseJSON = await response.json();
    
    if(response.status() == 200) {

      const schema = Joi.object({
        responseJSON: {
          status: Joi.string().required(), 
          message: Joi.string().required(), 
          customer: {
            id: Joi.number().required(), 
            user_id: Joi.number().required(), 
            cart_id: Joi.number().allow(null), 
            username: Joi.string().required(), 
            first_name: Joi.string().allow(null), 
            last_name: Joi.string().allow(null), 
            email: Joi.string().email().required(), 
            password: Joi.string().required(), 
            date_of_birth: Joi.string().allow(null), 
            created_at: Joi.string(), 
            updated_at: Joi.string(), 
            billing_info: Joi.string().allow(null), 
            shipping_info: Joi.string().allow(null), 
          }, 
        }
      });

      expect(schema.validate({responseJSON}).error).toBe(undefined);
      expect(responseJSON.customer.id).toBe(userID);
      expect(responseJSON.message).toBe(message);
    }

    if(response.status() != 200) {
      switch(response.status()) {

        case 401:
         expect(responseJSON).toEqual({
         message: expect.any(String), 
         });
         expect(responseJSON.message).toBe(message);
         break;

         case 404:
         expect(responseJSON).toEqual({
           error: expect.any(String), 
         });
         expect(responseJSON.error).toBe(message);
         break;

         case 405:
         expect(responseJSON).toEqual({
           message: expect.any(String), 
         });
         expect(responseJSON.message).toBe(message);

         case 500: 
         expect(responseJSON.message).toBe(message)
         break;
      }
    }   
    return responseJSON;     
  }

  async getBillingInfo({
    userID = VALID_USER_CREDENTIALS["VALID_ID"], 
    statusCode = 200, 
    token, 
    status = SUCCESS_MESSAGES["BASIC_SUCCESS_MESSAGE"], 
    message = billingInfoMessage(userID), 
    method = "get"
  }) {
    let response = await this.page.request[method](`${customersEndpoint()}/${userID}/billing-info`, {
      headers: { Accept: this.getAcceptHeader(), Authorization: this.getAuthorizationHeader(token) },
    });
    let responseJSON = await response.json();
    expect(response.status()).toBe(statusCode);

    if(response.status() == 200) {
      expect(responseJSON).toEqual({
        status: expect.any(String), 
        message: expect.any(String), 
        billing_info: expect.any(Object), 
      });
      expect(responseJSON.status).toBe(status);
      expect(responseJSON.message).toBe(message);
    }

    if(response.status() != 200) {
      switch(response.status()) {

        case 401:
        expect(responseJSON).toEqual({
          message: expect.any(String), 
        });
        expect(responseJSON.message).toBe(message);
        break; 

        case 404: 
        expect(responseJSON).toEqual({
          error: expect.any(String), 
        });
        expect(responseJSON.error).toBe(message);
        break;

        case 405:
        expect(responseJSON).toEqual({
          error: expect.any(String), 
        });
        expect(responseJSON.error).toBe(message);
        break;

      }
    }
    
    
    return responseJSON;
  }

  async updateBillingInfo({
    userID = VALID_USER_CREDENTIALS["VALID_ID"], 
    statusCode = 200, 
    token,  
    status = SUCCESS_MESSAGES["BASIC_SUCCESS_MESSAGE"], 
    message = SUCCESS_MESSAGES["UPDATED_BILLING_INFO"],   
    cardholder = VALID_BILLING_INFO["CARDHOLDER"], 
    card_type = VALID_BILLING_INFO["CARD_TYPE"], 
    card_number = VALID_BILLING_INFO["CARD_NUMBER"], 
    cvv = VALID_BILLING_INFO["CVV"], 
    card_expiration_date = VALID_BILLING_INFO["EXPIRATION_DATE"], 
    cardholder_error = ERROR_MESSAGES["NO_CARDHOLDER"], 
    card_type_error = ERROR_MESSAGES["NO_CARD_TYPE"], 
    card_number_error = ERROR_MESSAGES["NO_CARD_NUMBER"], 
    cvv_error = ERROR_MESSAGES["NO_CVV"], 
    card_expiration_date_error = ERROR_MESSAGES["NO_CARD_EXPIRATION_DATE"], 
  }) {
    let response = await this.page.request.put(`${customersEndpoint()}/${userID}/billing-info`, { 
      data: { cardholder: cardholder, card_type: card_type, card_number: card_number, cvv: cvv, card_expiration_date: card_expiration_date }, 
      headers: { Accept: this.getAcceptHeader(), Authorization: this.getAuthorizationHeader(token) }, 
    });

    let responseJSON = await response.json();
    
    expect(response.status()).toBe(statusCode);

    if(response.status() == 200) {
      expect(responseJSON).toEqual({
        status: expect.any(String), 
        message: expect.any(String), 
        billing_info: expect.any(Object), 
      });
      expect(responseJSON.status).toBe(status);
      expect(responseJSON.message).toBe(message);
      expect(responseJSON.billing_info.customer_id).toBe(userID);
      expect(responseJSON.billing_info.cardholder).toBe(cardholder);
      expect(responseJSON.billing_info.card_type).toBe(card_type);
      expect(responseJSON.billing_info.card_number).toBe(card_number);
      expect(responseJSON.billing_info.cvv).toBe(cvv);
      expect(responseJSON.billing_info.card_expiration_date).toBe(card_expiration_date);
    }

    if (response.status() != 200) {
      switch(response.status()) {

        case 401:
        expect(responseJSON).toEqual({
          message: expect.any(String), 
        });
        expect(responseJSON.message).toBe(message);
        break;  

        case 404: 
        expect(responseJSON).toEqual({
          error: expect.any(String), 
        });
        expect(responseJSON.error).toBe(message);
        break;

        case 422: 
        expect(responseJSON).toEqual({
          status: expect.any(String), 
          errors: expect.any(Object), 
        });
        expect(responseJSON.status).toBe(message);

        if (responseJSON.errors.cardholder != undefined) {
          expect(responseJSON.errors.cardholder).toContain(cardholder_error);
        }
        if (responseJSON.errors.card_number != undefined) {
          expect(responseJSON.errors.card_number).toContain(card_number_error);
        }
        if (responseJSON.errors.card_type != undefined) {
          expect(responseJSON.errors.card_type).toContain(card_type_error);
        }
        if (responseJSON.errors.cvv != undefined) {
          expect(responseJSON.errors.cvv).toContain(cvv_error);
        }
        if (responseJSON.errors.card_expiration_date != undefined) {
          expect(responseJSON.errors.card_expiration_date).toContain(card_expiration_date_error);
        }

        break;

      }
    }
    return responseJSON;
    
  }

  async getShippingInfo({
    userID = VALID_USER_CREDENTIALS["VALID_ID"], 
    token, 
    statusCode = 200, 
    status = SUCCESS_MESSAGES["BASIC_SUCCESS_MESSAGE"], 
    message = shippingInfoMessage(userID), 
    method = "get"
  }) {
    let response = await this.page.request[method](`${customersEndpoint()}/${userID}/shipping-info`, {  
      headers: { Accept: this.getAcceptHeader(), Authorization: this.getAuthorizationHeader(token) }, 
    });
    let responseJSON = await response.json();
    expect(response.status()).toBe(statusCode);

    if (response.status() == 200) {
      expect(responseJSON).toEqual({
        status: expect.any(String), 
        message: expect.any(String), 
        shipping_info: expect.any(Object), 
      });
      expect(responseJSON.status).toBe(status);
      expect(responseJSON.message).toBe(message);
    }

    if(response.status() != 200) {
      switch(response.status()) {

        case 401:
        expect(responseJSON).toEqual({
          message: expect.any(String), 
        });
        expect(responseJSON.message).toBe(message);
        break; 

        case 404: 
        expect(responseJSON).toEqual({
          error: expect.any(String), 
        });
        expect(responseJSON.error).toBe(message);
        break;

        case 405:
        expect(responseJSON).toEqual({
          error: expect.any(String), 
        });
        expect(responseJSON.error).toBe(message);
        break;
      }
    }

    return responseJSON;
  }

  async updateShippingInfo({
    token, 
    statusCode = 200, 
    userID = VALID_USER_CREDENTIALS["VALID_ID"], 
    status = SUCCESS_MESSAGES["BASIC_SUCCESS_MESSAGE"], 
    message = SUCCESS_MESSAGES["UPDATED_SHIPPING_INFO"], 
    error, 
    first_name = VALID_SHIPPING_INFO["FIRST_NAME"], 
    last_name = VALID_SHIPPING_INFO["LAST_NAME"], 
    email = VALID_SHIPPING_INFO["EMAIL"], 
    street_and_number = VALID_SHIPPING_INFO["STREET_AND_NUMBER"], 
    phone_number = VALID_SHIPPING_INFO["PHONE_NUMBER"], 
    city = VALID_SHIPPING_INFO["CITY"], 
    postal_code = VALID_SHIPPING_INFO["POSTAL_CODE"], 
    country = VALID_SHIPPING_INFO["COUNTRY"], 
    first_name_error = ERROR_MESSAGES["NO_FIRST_NAME"], 
    last_name_error = ERROR_MESSAGES["NO_LAST_NAME"], 
    email_error = ERROR_MESSAGES["EMAIL_MISSING"], 
    street_and_number_error = ERROR_MESSAGES["NO_STREET_AND_NUMBER"], 
    phone_number_error = ERROR_MESSAGES["NO_PHONE_NUMBER"], 
    city_error = ERROR_MESSAGES["NO_CITY"], 
    postal_code_error = ERROR_MESSAGES["NO_POSTAL_CODE"], 
    country_error = ERROR_MESSAGES["NO_COUNTRY"], 
  }) {
    let response = await this.page.request.put(`${customersEndpoint()}/${userID}/shipping-info`, { 
      data: { first_name: first_name, last_name: last_name, email: email, street_and_number: street_and_number, phone_number: phone_number, city: city, postal_code: postal_code, country: country }, 
      headers: { Accept: this.getAcceptHeader(), Authorization: this.getAuthorizationHeader(token) }, 
    });
    let responseJSON = await response.json();
    expect(response.status()).toBe(statusCode);

    if(response.status() == 200) {
      expect(responseJSON).toEqual({
        status: expect.any(String), 
        message: expect.any(String), 
        shipping_info: expect.any(Object), 
      });
      expect(responseJSON.status).toBe(status);
      expect(responseJSON.message).toBe(message);
      expect(responseJSON.shipping_info.customer_id).toBe(userID);
      expect(responseJSON.shipping_info.first_name).toBe(first_name);
      expect(responseJSON.shipping_info.last_name).toBe(last_name);
      expect(responseJSON.shipping_info.street_and_number).toBe(street_and_number);
      expect(responseJSON.shipping_info.city).toBe(city);
      expect(responseJSON.shipping_info.postal_code).toBe(postal_code);
      expect(responseJSON.shipping_info.country).toBe(country);
      expect(responseJSON.shipping_info.phone_number).toBe(phone_number);
      expect(responseJSON.shipping_info.email).toBe(email);
    }

    if(response.status() != 200) {
      switch(response.status()) {

        case 401: 
        expect(responseJSON).toEqual({
          message: expect.any(String), 
        });
        expect(responseJSON.message).toBe(error);
        break;

        case 404:
        expect(responseJSON).toEqual({
          error: expect.any(String),
        });
        expect(responseJSON.error).toBe(error);
        break;

        case 422: 
        expect(responseJSON).toEqual({
          status: expect.any(String), 
          errors: expect.any(Object), 
        });
        expect(responseJSON.status).toBe(message);

        if (responseJSON.errors.first_name != undefined) {
          expect(responseJSON.errors.first_name).toContain(first_name_error);
        }
        if (responseJSON.errors.last_name != undefined) {
          expect(responseJSON.errors.last_name).toContain(last_name_error);
        }
        if (responseJSON.errors.email != undefined) {
          expect(responseJSON.errors.email).toContain(email_error);
        }
        if (responseJSON.errors.street_and_number != undefined) {
          expect(responseJSON.errors.street_and_number).toContain(street_and_number_error);
        }
        if (responseJSON.errors.phone_number != undefined) {
          expect(responseJSON.errors.phone_number).toContain(phone_number_error);
        }
        if (responseJSON.errors.city != undefined) {
          expect(responseJSON.errors.city).toContain(city_error);
        }
        if (responseJSON.errors.postal_code != undefined) {
          expect(responseJSON.errors.postal_code).toContain(postal_code_error);
        }
        if (responseJSON.errors.country != undefined) {
          expect(responseJSON.errors.country).toContain(country_error);
        }
        break;
      }
    }
    return responseJSON;
  }
}
