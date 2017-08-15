(function(){

console.log("스크립트 삽입 및 시작");
    var minimalist = {};
    minimalist.productName = "상품명";
    minimalist.price = 10000000;
    minimalist.url = "";
    minimalist.imgUrl = "";

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function updateMinimalist(productName, url, price, imgUrl) {
      if(minimalist.price > price) {
        minimalist.productName = productName;
        minimalist.price = price;
        minimalist.url = url;
        minimalist.imgUrl = imgUrl;
      }
    }

    function choosePrice(price, deliveryDom) {
      if(!deliveryDom) {
        return -1;
      }
      var deliveryFee = deliveryDom.innerText.replace("배송비 ","").replace("원","").replace(/,/g,"");
      if(deliveryFee == "무료") {
        return parseInt(price);
      } else {
        return (parseInt(price) + parseInt(deliveryFee));
      }
    }

    function processOneRecord(productOne){
      var name = productOne.querySelector("div.info > a").innerText;
      var imgUrl = productOne.querySelector("div.img_area > a > img").getAttribute("data-original");
      var url = productOne.querySelector("div.info > a").href;
      if(!(productOne.querySelector("span.num._price_reload"))) {
        console.log("가격정보 없음 : " + name);
        return;
      }
      var price = productOne.querySelector("span.num._price_reload").innerText.replace(/,/g,"");

      var deliveryDom = productOne.querySelector("div.info_mall > ul > li > em");
      var totalPrice = choosePrice(price, deliveryDom);
      if(totalPrice < 0 ) {
        console.log("배송비 없음 : " + name);
        return ;
      }

      var totalPriceString = numberWithCommas(totalPrice);
      // console.log("비용 : " + totalPriceString);

      if(!productOne.querySelector("span.price > p")) {
        var priceHtml = productOne.querySelector("span.price").innerHTML;
        productOne.querySelector("span.price").innerHTML = "<p id='tag'>배송비 포함 : " + totalPriceString + "</p>" + priceHtml;
      }

      updateMinimalist(name, url, totalPrice, imgUrl);

    }

    var productRecords = document.querySelectorAll("div ul.goods_list > li");
    productRecords.forEach(processOneRecord);

return minimalist;

})();
