$(document).ready(() => {

  function callAmazonAPI(){
    console.log("Calling amazon");
    $.ajax({
      method: "GET",
      url: "/api/amazon"
    }).done((response) => {
      console.log("amazon:", cresponse.result['ItemSearchResponse'].Items.Item);
    });
  }

  function callEbayAPI(){
    console.log("Calling eBay");
    $.ajax({
      method: "GET",
      url: "/api/ebay"
    }).done((response) => {
      console.log("ebay:", response);
    });
  }

  function callWalmartAPI(){
    console.log("Calling Walmart");
  }

  $('#amazon_api').on('click', () => {
    callAmazonAPI();
  });

  $('#ebay_api').on('click', () => {
    callEbayAPI();
  });

  $('#walmart_api').on('click', () => {
    callWalmartAPI();
  });
});
