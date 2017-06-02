const { OperationHelper } = require('apac'); // Amazon API call
const ebay = require('ebay-api'); // Ebay API call
const express = require('express');
const router  = express.Router();

function makeEbayAPICall(){
  return new Promise((resolve, reject) => {
    var params = {
      keywords: ["Camera"],
      paginationInput: {
        entriesPerPage: 10
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
    }, function itemsCallback(error, itemsResponse) {
      if (error) reject(error);
      let items = itemsResponse.searchResult.item;
      resolve(items); 
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
      'SearchIndex': 'Books',
      'Keywords': 'harry potter',
      'ResponseGroup': 'ItemAttributes,Offers'
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

  router.get('/walmart', (request, response) => {});

  return router;
}
