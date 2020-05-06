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
      console.log("배송비 택스트 ::" + deliveryFee);
      if(deliveryFee == "무료") {
        return parseInt(price);
      } else {
        return (parseInt(price) + parseInt(deliveryFee));
      }
    }

    function extractDeliveryFee(productOneDom) {
      var deliveryObj = {};
      var deliveryDom = productOneDom.querySelector("div.info_mall > ul > li > em");
      if(!deliveryDom) {
        deliveryObj.type="없음";
        deliveryObj.price = 0;
        return deliveryObj;
      }
      var deliveryFee = deliveryDom.innerText.replace("배송비 ","").replace("원","").replace(/,/g,"");
    
      if(deliveryFee == "무료" || deliveryFee == "착불") {
        deliveryObj.type = deliveryFee;
        deliveryObj.price = 0;
      } else {
        deliveryObj.type = "유료";
        deliveryObj.price = parseInt(deliveryFee);
      }
      return deliveryObj;
    }

    function processOneRecord(productOne){
      const nameDom = productOne.querySelector("div.tit > a");
      if (!nameDom) {
        console.log('상품명 검색 실패');
        return;
      }
      var name = nameDom.innerText;
      const imageDom = productOne.querySelector("div.img_area > a > img");
      var imgUrl = imageDom.getAttribute("data-original");
      var url = nameDom.href;
      const priceDom = productOne.querySelector("span.num._price_reload");
      const priceDom2 = productOne.querySelector("span.num");
      
      var price = 0;
      if(priceDom) {
        price = parseInt(priceDom.innerText.replace(/,/g,""));
      } else if (priceDom2) {
        console.log("1차 가격정보 없음 : " + name);
        price = parseInt(priceDom2.innerText.replace(/,/g,""));
      }
      
      var deliveryObj = extractDeliveryFee(productOne);

      if(deliveryObj.type == "없음" ) {
        // 배송비 정보 없음
        return ;
      }

      var totalPrice = price + deliveryObj.price;
      var deliveryString = deliveryObj.type == "착불"? "착불 : ": "배송비 포함 : ";

      var totalPriceString = numberWithCommas(totalPrice);

      if(!productOne.querySelector("span.price > p")) {
        var originalFontSize = '12px';
        var originalDom = productOne.querySelector("span.price > em");
        originalDom.style.color = 'black';
        originalDom.style['font-weight'] = 'normal';
        originalDom.style['font-size'] = originalFontSize;
        originalDom.querySelector("span").style['font-size'] = originalFontSize;
        var priceHtml = productOne.querySelector("span.price").innerHTML;
        var style = "font-weight: bold;margin-bottom:3px ;font-size: 16px !important; color: #16a085;";
        productOne.querySelector("span.price").innerHTML = "<p class='everdeen' style='" + style + "'>" + deliveryString + totalPriceString + "원</p>" + priceHtml;

      }

      updateMinimalist(name, url, totalPrice, imgUrl);

    }

    var productRecords = document.querySelectorAll("div ul.goods_list > li");
    productRecords.forEach(processOneRecord);

return minimalist;

})();
