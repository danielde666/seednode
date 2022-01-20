import Client from 'shopify-buy';
 
const client = Client.buildClient({
    storefrontAccessToken:'0f93ae5fbe193ab42f524166022d8cc8',
    domain: 'lucien-smith-studio.myshopify.com'
  });

  export{
      client
  }