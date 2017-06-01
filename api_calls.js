const { OperationHelper } = require('apac'); // Amazon API call
const express = require('express');
const router  = express.Router();

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
      console.log("Results object: ", results.result);
      console.log("Raw results body: ", results.responseBody);
      response.json(results);
    }).catch((err) => {
      console.error("Something went wrong! ", err);
    });
  });

  router.get('/ebay', (request, response) => {});
  router.get('/walmart', (request, response) => {});

  return router;
}
