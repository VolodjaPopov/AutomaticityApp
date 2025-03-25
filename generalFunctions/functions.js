const generateRandomString = length => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  const generateRandomInt = length => {
    const characters =
      '123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  const generateRandomStringNoNumbers = length => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  const generateUserCredentials = length => {
    const baseString = generateRandomString(length);
  
    const username1 = baseString;
    const email1 = `${baseString}@gmail.com`;
    const password1 = `${baseString}123`;
  
    return { username1, email1, password1 };
  };
  
  function getCardType() {
    let card = ["Visa", "Mastercard", "Discover", "American Express"];
    const randomIndex = Math.floor(Math.random() * 4);
    return card[randomIndex];
  }

   function noID(id) {
    return `No customer found with ID ${id} found`;
}

   function billingInfoMessage(id) {
    return `Billing information for customer ID ${id}`;
}

   function shippingInfoMessage(id) {
    return `Shipping information for customer ID ${id}`;
}

   function authEndpoint() {
    return "/api/v1/auth";
   }

   function customersEndpoint() {
     return "/api/v1/customers";
   }

   

export { generateRandomString, generateRandomStringNoNumbers, generateRandomInt, getCardType, noID, billingInfoMessage, shippingInfoMessage, generateUserCredentials, authEndpoint, customersEndpoint }