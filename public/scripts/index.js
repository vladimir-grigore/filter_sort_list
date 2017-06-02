$(document).ready(() => {
  function cleanEscapedText(text){
    var regExp = /(&lt;\/li&gt;|&lt;\/ul&gt;|&lt;br&gt;|&lt;b&gt;|&lt;\/b&gt;|&lt;ul&gt;|&lt;li&gt;)/g;
    return text.replace(regExp, '');
  }

  function addAmazonProductsToList(productst_array){
    for(let item of productst_array){
      // console.log("Title", item.ItemAttributes.Title);
      // console.log("Image", item.MediumImage.URL);
      // if(item.EditorialReviews){
      //   console.log("Description", item.EditorialReviews.EditorialReview.Content);
      // }
      // console.log("Price", item.OfferSummary.LowestNewPrice.FormattedPrice);
      let image = item.MediumImage.URL;
      let title = item.ItemAttributes.Title;
      let description = item.EditorialReviews ?
        item.EditorialReviews.EditorialReview.Content :
        "Missing description";
      let price = item.OfferSummary.LowestNewPrice.FormattedPrice;
      populateItemsList(image, title, description, price);
    }
  }

  function addEbayProductsToList(productst_array){
    for(let item of productst_array){
      // console.log("Title", item.title);
      // console.log("Image", item.galleryURL);
      // console.log("Description", item.title);
      // console.log("Price", item.sellingStatus.currentPrice.amount, item.sellingStatus.currentPrice.currencyId);
      let image = item.galleryURL ? 
        item.galleryURL :
        "http://thumbs4.sandbox.ebaystatic.com/pict/1101987617634040_0.jpg";
      let title = item.title;
      let description = item.title;
      let price = item.sellingStatus.currentPrice.amount + " " +item.sellingStatus.currentPrice.currencyId;
      populateItemsList(image, title, description, price);
    }
  }

  function addWalmartProductsToList(productst_array){
    for(let item of productst_array){
      // console.log("Title", item.name);
      // console.log("Image", item.largeImage);
      // console.log("Description", item.longDescription);
      // console.log("Price", item.msrp, "USD");
      let image = item.largeImage;
      let title = item.name;
      let description = cleanEscapedText(item.longDescription);
      let price = item.msrp + " USD"
      populateItemsList(image, title, description, price);
    }
  }

  function populateItemsList(image, productTitle, productDescription, productPrice){
    let $list = $("ul");
    let $element = $("<li>").addClass("item").appendTo($list);
    $("<img>").addClass("productImage").attr("src", image).appendTo($element);
    $("<div>").addClass("productTitle").text(productTitle.substring(0, 20) + "...").appendTo($element);
    $("<div>").addClass("productDescription").text(productDescription.substring(0, 150) + "...").appendTo($element);
    $("<div>").addClass("productPrice").text(productPrice).appendTo($element);
  }

  function callAmazonAPI(){
    console.log("Calling amazon");
    $.ajax({
      method: "GET",
      url: "/api/amazon"
    }).done((response) => {
      addAmazonProductsToList(response.result['ItemSearchResponse'].Items.Item);
      console.log("amazon:", response.result['ItemSearchResponse'].Items.Item);
    });
  }

  function callEbayAPI(){
    console.log("Calling eBay");
    $.ajax({
      method: "GET",
      url: "/api/ebay"
    }).done((response) => {
      addEbayProductsToList(response);
      console.log("ebay:", response);
    });
  }

  function callWalmartAPI(){
    console.log("Calling Walmart");
    $.ajax({
      method: "GET",
      url: "/api/walmart"
    }).done((response) => {
      console.log("walmart:", response.items);
      addWalmartProductsToList(response.items)
    });
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
