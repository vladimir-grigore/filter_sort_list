$(document).ready(() => {
  makeAPICalls();
  checkSorting();
  let sortableList; 

  function makeAPICalls(){
    callEbayAPI()
      .then((response) => { addEbayProductsToList(response); })
      .catch((err) => { console.log(err); });
      
    callAmazonAPI()
      .then((response) => { addAmazonProductsToList(response); })
      .catch((err) => { console.log(err); });

    callWalmartAPI()
      .then((response) => { addWalmartProductsToList(response); })
      .catch ((err) => { console.log(err); });
  }

  function cleanEscapedText(text){
    var regExp = /(&lt;\/li&gt;|&lt;\/ul&gt;|&lt;br&gt;|&lt;b&gt;|&lt;\/b&gt;|&lt;ul&gt;|&lt;li&gt;)/g;
    return text.replace(regExp, '');
  }

  function checkSorting() {
    let titleFilter = localStorage.getItem('titleSorting');
    let priceFilter = localStorage.getItem('priceSorting');

    if(titleFilter === 'z-a'){
      $('#title_filter').text('Title filter: Z-A');
    } else if(titleFilter === 'a-z'){
      $('#title_filter').text('Title filter: A-Z');
    } else {
      $('#title_filter').text('Title filter');
    }

    if(priceFilter === 'ascending'){
      $('#price_filter').text('Price: ascending');
    } else if(priceFilter === 'descending'){
      $('#price_filter').text('Price: descending');
    } else {
      $('#price_filter').text('Price filter');
    }
  }

  function addAmazonProductsToList(productst_array){
    for(let item of productst_array){
      let image = item.MediumImage.URL;
      let title = item.ItemAttributes.Title;
      let description = item.EditorialReviews ?
        cleanEscapedText(item.EditorialReviews.EditorialReview.Content) :
        "Missing description";
      let price = item.OfferSummary.LowestNewPrice ?
        item.OfferSummary.LowestNewPrice.FormattedPrice :
        item.OfferSummary.LowestUsedPrice.FormattedPrice;
      populateItemsList(image, title, description, price);
    }
    createSortableList();
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
    createSortableList();
  }

  function addWalmartProductsToList(productst_array){
    for(let item of productst_array){
      let image = item.largeImage;
      let title = item.name;
      let description = cleanEscapedText(item.longDescription);
      let price = item.msrp ? item.msrp + " USD" : + item.salePrice + " USD";
      populateItemsList(image, title, description, price);
    }
    createSortableList();
  }

  function populateItemsList(image, productTitle, productDescription, productPrice){
    let $element = $("<li>").addClass("item");
    $("<img>").addClass("productImage").attr("src", image).data("image", image).appendTo($element);
    $("<div>").addClass("productTitle").text(productTitle).data("productTitle", productTitle).appendTo($element);
    $("<div>").addClass("productPrice").text(productPrice).data("productPrice", productPrice).appendTo($element);
    $("<div>").addClass("productDescription").text(productDescription).data("productDescription", productDescription).appendTo($element);
    $("#list-container").append($element);

    // Apply list filtering
    let filter = localStorage.getItem("listFilter");
    $("#filter").val(filter).trigger("keyup");
  }

  // Create sortable list that saves its state in the localStorage
  function createSortableList(){
    let list = $('#list-container');
    let li_elements = list.children('li').get();

    if(li_elements.length >= 30){
      let container = document.getElementById("list-container");
      sortableList = Sortable.create(container, {
        group: 'list-sort',
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
  }

  function callAmazonAPI(){
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "GET",
        url: "/api/amazon"
      }).done((response) => {
        resolve(response.result['ItemSearchResponse'].Items.Item);
      }).fail((err) => {
        reject(err);
      });
    });
  }

  function callEbayAPI(){
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "GET",
        url: "/api/ebay"
      }).done((response) => {
        resolve(response);
      }).fail((err) => {
        reject(err);
      });
    });
  }

  function callWalmartAPI(){
    return new Promise((resolve, reject) => {
      $.ajax({
        method: "GET",
        url: "/api/walmart"
      }).done((response) => {
        resolve(response.items);
      }).fail((err) => {
        reject(err);
      });
    });
  }

  // List filtering
  $("#filter").keyup(() => {
    let filter = document.getElementById("filter").value.toLowerCase();
    localStorage.setItem("listFilter", filter);
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

  // Sort items by title
  $('#title_filter').click(() => {
    let list = $('#list-container');
    let li_elements = list.children('li').get();
    $('li').detach();

    let filterType = localStorage.getItem('titleSorting');
    if(!filterType || filterType === 'z-a'){
      li_elements.sort((a, b) => {
        let titleA = a.children[1].innerHTML.toUpperCase();
        let titleB = b.children[1].innerHTML.toUpperCase();
        return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
      });
      localStorage.setItem('titleSorting', 'a-z');
      localStorage.setItem('priceSorting', '');
    } else {
      li_elements.sort((a, b) => {
        let titleA = a.children[1].innerHTML.toUpperCase();
        let titleB = b.children[1].innerHTML.toUpperCase();
        return (titleA < titleB) ? 1 : (titleA > titleB) ? -1 : 0;
      });
      localStorage.setItem('titleSorting', 'z-a');
      localStorage.setItem('priceSorting', '');
    }

    $.each(li_elements, (id, item) => {
      list.append(item);
    });

    sortableList.options.store.set(sortableList);
    checkSorting();
  });

  // Sort items by price
  $('#price_filter').click(() => {
    let list = $('#list-container');
    let li_elements = list.children('li').get();
    $('li').detach();

    function extractPrice(price){
      let regExp = /[^\d\.]/g;
      return price.replace(regExp, '');
    }

    let filterType = localStorage.getItem('priceSorting');
    if(!filterType || filterType === 'descending'){
      li_elements.sort((a, b) => {
        let priceA = parseInt(extractPrice(a.children[2].innerHTML));
        let priceB = parseInt(extractPrice(b.children[2].innerHTML));
        return priceA - priceB;
      });
      localStorage.setItem('priceSorting', 'ascending');
      localStorage.setItem('titleSorting', '');
    } else {
      li_elements.sort((a, b) => {
        let priceA = parseInt(extractPrice(a.children[2].innerHTML));
        let priceB = parseInt(extractPrice(b.children[2].innerHTML));
        return priceB - priceA;
      });
      localStorage.setItem('priceSorting', 'descending');
      localStorage.setItem('titleSorting', '');
    }

    $.each(li_elements, (id, item) => {
      list.append(item);
    });

    sortableList.options.store.set(sortableList);
    checkSorting();
  });

});
