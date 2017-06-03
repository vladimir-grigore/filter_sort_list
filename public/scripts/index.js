$(document).ready(() => {
  callAmazonAPI()
  callEbayAPI()
  callWalmartAPI();

  function cleanEscapedText(text){
    var regExp = /(&lt;\/li&gt;|&lt;\/ul&gt;|&lt;br&gt;|&lt;b&gt;|&lt;\/b&gt;|&lt;ul&gt;|&lt;li&gt;)/g;
    return text.replace(regExp, '');
  }

  function addAmazonProductsToList(productst_array){
    for(let item of productst_array){
      let image = item.MediumImage.URL;
      let title = item.ItemAttributes.Title;
      let description = item.EditorialReviews ?
        cleanEscapedText(item.EditorialReviews.EditorialReview.Content) :
        "Missing description";
      let price = item.OfferSummary.LowestNewPrice.FormattedPrice;
      populateItemsList(image, title, description, price);
    }
  }

  function addEbayProductsToList(productst_array){
    for(let item of productst_array){
      let image = item.galleryURL ? 
        item.galleryURL :
        "http://thumbs4.sandbox.ebaystatic.com/pict/1101987617634040_0.jpg";
      let title = item.title;
      let description = cleanEscapedText(item.title);
      let price = item.sellingStatus.currentPrice.amount + " " +item.sellingStatus.currentPrice.currencyId;
      populateItemsList(image, title, description, price);
    }
  }

  function addWalmartProductsToList(productst_array){
    for(let item of productst_array){
      let image = item.largeImage;
      let title = item.name;
      let description = cleanEscapedText(item.longDescription);
      let price = item.msrp ? item.msrp + " USD" : + item.salePrice + " USD";
      populateItemsList(image, title, description, price);
    }
  }

  function populateItemsList(image, productTitle, productDescription, productPrice){
    let $element = $("<li>").addClass("item").appendTo($("ul"));
    $("<img>").addClass("productImage").attr("src", image).appendTo($element);
    $("<div>").addClass("productTitle").text(productTitle).appendTo($element);
    $("<div>").addClass("productPrice").text(productPrice).appendTo($element);
    $("<div>").addClass("productDescription").text(productDescription).appendTo($element);

    // Apply list filtering
    let filter = localStorage.getItem("listFilter");
    $("#filter").val(filter).trigger("keyup");

    // Create sortable list that saves its state in the localStorage
    let container = document.getElementById("list-container");
    let sort = Sortable.create(container, {
      animation: 150, 
      store: {
        get: function (sortable) {
          let order = localStorage.getItem(sortable.options.group);
          return order ? order.split('|') : [];
        },
        set: function (sortable) {
          let order = sortable.toArray();
          localStorage.setItem(sortable.options.group, order.join('|'));
        }
      }
    });
  }

  function callAmazonAPI(){
    console.log("Calling amazon");
    $.ajax({
      method: "GET",
      url: "/api/amazon"
    }).done((response) => {
      console.log("amazon:", response.result['ItemSearchResponse'].Items.Item);
      addAmazonProductsToList(response.result['ItemSearchResponse'].Items.Item);
    });
  }

  function callEbayAPI(){
    console.log("Calling eBay");
    $.ajax({
      method: "GET",
      url: "/api/ebay"
    }).done((response) => {
      console.log("ebay:", response);
      addEbayProductsToList(response);
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

  // List filtering
  $("#filter").keyup(() => {
    let filter = document.getElementById("filter").value.toLowerCase();
    let li = document.getElementsByTagName("li");

    for(let i = 0; i < li.length; i++){
      let item = li[i].getElementsByClassName("productTitle")[0];
      if(item.innerHTML.toLowerCase().indexOf(filter) > -1){
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  });

  // Save current filter to localStorage
  $("#set-filter").click(() => {
    let filter = document.getElementById("filter").value.toLowerCase();
    localStorage.setItem("listFilter", filter);
  });
});
