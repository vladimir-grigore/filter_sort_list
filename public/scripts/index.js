$(document).ready(() => {

  function callAmazonAPI(){
    console.log("Calling amazon");
    $.ajax({
      method: "GET",
      url: "/api/amazon"
    }).done((response) => {
      console.log(response.result['ItemSearchResponse'].Items.Item);
    });
  }

  $('#amazon_api').on('click', () => {
    callAmazonAPI();
  });
});
