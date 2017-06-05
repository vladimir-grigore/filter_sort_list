const { OperationHelper } = require('apac'); // Amazon API call
const ebay = require('ebay-api'); // Ebay API call
const walmart = require('walmart')(process.env.WALMART_API_KEY); //Walmart API call
const express = require('express');
const router  = express.Router();

function makeEbayAPICall(){
  return new Promise((resolve, reject) => {
    var params = {
      keywords: ['iPod'],
      paginationInput: {
        entriesPerPage: 10
      },
      searchResult: {
        item: ['listingInfo']
      }
    };

    ebay.xmlRequest({
      serviceName: 'Finding',
      opType: 'findItemsByKeywords',
      devId: process.env.EBAY_DEV_ID,
      certId: process.env.CERT_ID,
      authToken: process.env.EBAY_AUTH_TOKEN,
      appId: process.env.EBAY_APP_ID,
      sandbox: true,
      params: params,
      parser: ebay.parseItemsFromResponse 
    }, (error, itemsResponse) => {
      if(error) reject(error);
      if(itemsResponse.searchResult){
        resolve(itemsResponse.searchResult.item);
      }
    });
  });
}

module.exports = () => {

  router.get('/amazon', (request, response) => {
    const opHelper = new OperationHelper({
      awsId:     process.env.AWS_ID,
      awsSecret: process.env.AWS_SECRET,
      assocId:   process.env.AWS_TRACKINGID,
      locale:    'CA'
    });

    opHelper.execute('ItemSearch', {
      'SearchIndex': 'Electronics',
      'Keywords': 'Canon',
      'ResponseGroup': 'Medium'
    }).then((results) => {
      response.json(results);
    }).catch((err) => {
      console.error("Something went wrong! ", err);
    });
  });

  router.get('/ebay', (request, response) => {
    makeEbayAPICall().then((results) => {
      response.json(results);
    }).catch((err) => {
      console.error("Something went wrong! ", err);
    });
  });

  router.get('/walmart', (request, response) => {
    walmart.search("toy").then((results) => {
      response.json(results);
    }).catch((err) => {
      console.error("Something went wrong! ", err);
    });
  });

  return router;
}
