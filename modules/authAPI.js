import { expect } from '@playwright/test';
import { VALID_USER_CREDENTIALS } from "../fixtures/credentials";
import { generateUserCredentials, authEndpoint } from '../generalFunctions/functions.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../fixtures/messages.js';

const { username1, email1, password1 } = generateUserCredentials(5);


export class AuthAPI {
    constructor(page) {
      this.page = page;
    }

    getAcceptHeader() {
      return "application/json";
    }

    getAuthorizationHeader(token) {
      return `Bearer ${token}`;
    }
  
    async login({
      email = VALID_USER_CREDENTIALS["VALID_EMAIL"], 
      password = VALID_USER_CREDENTIALS["VALID_PASSWORD"], 
      statusCode = 200,  
      message = SUCCESS_MESSAGES["USER_LOGGED_IN"], 
      status = SUCCESS_MESSAGES["BASIC_SUCCESS_MESSAGE"], 
      error,
      method = "post", 
    }) {
      let response = await this.page.request[method](`${authEndpoint()}/login`, {
        data: { email: email, password: password,},
        headers: { Accept: this.getAcceptHeader() }, 
      });
      
      expect(response.status()).toBe(statusCode);
     
      let responseJSON = await response.json();      

      if(response.status() == 200) {
        expect(responseJSON).toEqual({
          status: expect.any(String), 
          message: expect.any(String), 
          user: {
            id: expect.any(Number), 
            username: expect.any(String), 
            email: expect.stringMatching(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), 
            email_verified_at: expect.any(Object), 
            password: expect.any(String), 
            created_at: expect.any(String), 
            updated_at: expect.any(String), 
          }, 
          auth: {
            token: expect.stringMatching(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*$/), 
            type: expect.stringMatching("Bearer"), 
          }
        });
        expect(responseJSON.message).toBe(message);
        expect(responseJSON.status).toBe(status);
      }

      else if(response.status() == 422) {
        expect(responseJSON).toEqual({
        message: expect.any(String), 
        errors: expect.any(Object), 
        });
        expect(responseJSON.message).toBe(message);
      }

      else {
        expect(responseJSON).toEqual({
        error: expect.any(String), 
        });
        expect(responseJSON.error).toBe(error);
      }
      return responseJSON;
    }

    async register({
        username = username1, 
        email = email1, 
        password = password1, 
        statusCode = 200, 
        status = SUCCESS_MESSAGES["BASIC_SUCCESS_MESSAGE"], 
        message = SUCCESS_MESSAGES["USER_CREATED_SUCCESSFULLY"], 
        method = "post"
      }) {
        let response = await this.page.request[method](`${authEndpoint()}/register`, {
          data: { username: username, email: email, password: password },
          headers: { Accept: this.getAcceptHeader() },
        });
        
        expect(response.status()).toBe(statusCode);
    
        let responseJSON = await response.json();
  
        if(response.status() == 200) {
          expect(responseJSON).toEqual({
            status: expect.any(String), 
            message: expect.any(String), 
            user: {
              username: expect.any(String), 
              email: expect.stringMatching(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), 
              password: expect.any(String), 
              updated_at: expect.any(String), 
              created_at: expect.any(String), 
              id: expect.any(Number), 
            }, 
            auth: {
              token: expect.stringMatching(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*$/), 
              type: expect.stringMatching("Bearer"),
            }
          });
          expect(responseJSON.status).toBe(status);
          expect(responseJSON.message).toBe(message);
        }

        if(response.status() != 200) {
          switch(response.status()) {

            case 405: 
            expect(responseJSON).toEqual({
            error: expect.any(String), 
            });
            expect(responseJSON.error).toBe(message);
            break;

            case 422: 
            expect(responseJSON).toEqual({
            message: expect.any(String), 
            errors: expect.any(Object), 
            });
            expect(responseJSON.message).toBe(message);
            break;
          }
        }
        
        return responseJSON;
      }

    async logout({
      token, 
      statusCode = 200,
      message = SUCCESS_MESSAGES["USER_LOGGED_OUT"],
    }) {
      let response = await this.page.request.post(`${authEndpoint()}/logout`, {
        headers: { Accept: this.getAcceptHeader(), Authorization: this.getAuthorizationHeader(token) }, 
      });

      expect(response.status()).toBe(statusCode);

       let responseJSON = await response.json();
       console.log(responseJSON);
       
       
        if(response.status() == 200) {
         expect(responseJSON).toEqual({
          message: expect.any(String), 
         });
         expect(responseJSON.message).toBe(message);
        }

        if(response.status() == 500) {
          expect(responseJSON.message).toBe(message)
        }
    }

    async profile({
      token, 
      statusCode = 200, 
      username, 
      email, 
    }) {
      let response = await this.page.request.post(`${authEndpoint()}/profile`, {
        headers: { Accept: this.getAcceptHeader(), Authorization: this.getAuthorizationHeader(token) }, 
      });

      expect(response.status()).toBe(statusCode);

      let responseJSON = await response.json();
      
      if(response.status() == 200) {
        expect(responseJSON).toEqual({
          id: expect.any(Number), 
          username: expect.any(String), 
          email: expect.any(String), 
          email_verified_at: expect.any(Object), 
          password: expect.any(String), 
          created_at: expect.any(String), 
          updated_at: expect.any(String), 
        });
        expect(responseJSON.username).toBe(username);
        expect(responseJSON.email).toBe(email);
      }

       if(response.status() == 500) {
         expect(responseJSON.message).toBe(ERROR_MESSAGES["INVALID_TOKEN"]);
       }
    }

    async refresh({
      statusCode = 200, 
      token, 
      message, 
    }) {
      let response = await this.page.request.post(`${authEndpoint()}/refresh`, {
        headers: { Accept: this.getAcceptHeader(), Authorization: this.getAuthorizationHeader(token) }, 
      });

      expect(response.status()).toBe(statusCode);
      let responseJSON = await response.json();      
      
      if(response.status() == 200) {
        expect(responseJSON).toEqual({
          access_token: expect.stringMatching(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/]*$/), 
          token_type: expect.stringMatching("bearer"), 
          expires_in: expect.any(Number), 
        });
      }

      if(response.status() == 500) {
        expect(responseJSON.message).toBe(message);
      }
      return responseJSON;
    }

    async checkIfTokenIsExpired(token) {
      let response = await this.page.request.get(`/api/v1/customers`, {
        headers: { Accept: this.getAcceptHeader(), Authorization: this.getAuthorizationHeader(token) }, 
      });

       let responseJSON = await response.json();
       
        if(response.status() == 200) {
         return false;
        }

        if(response.status() == 401) {
          return false
        }
    }
}
