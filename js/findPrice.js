(function(){

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

    function extractDeliveryFee(productOneDom) {
      var deliveryObj = {};
      var deliveryDom = productOneDom.querySelector('ul[class^="basicList_mall_option"]  em[class^="basicList_option"]');
      if(!deliveryDom) {
        deliveryObj.type="없음";
        deliveryObj.price = 0;
        return deliveryObj;
      }
      var deliveryFee = deliveryDom.innerText
        .replace("배송비 ","").replace("원","").replace(/,/g,"");
    
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
      // 배송비 추출
      var deliveryObj = extractDeliveryFee(productOne);

      if(deliveryObj.type == "없음" ) {
        // 배송비 정보 없음
        return ;
      }

      // 상품명 추출
      const nameDom = productOne.querySelector('div[class^="basicList_title"] > a');
      if (!nameDom) {
        console.log('상품명 검색 실패');
        return;
      }
      // 상품명
      var name = nameDom.innerText;
      // 상품 링크
      var url = nameDom.href;

      // 상품 섬네일 
      const imageDom = productOne.querySelector('div[class^="thumbnail_thumb_wrap"] > a > img');
      // var imgUrl = imageDom.getAttribute("src");
      var imgUrl = "";

      // 가격정보
      // basicList_price_area__1UXXR
      const priceDom = productOne.querySelector('div[class^="basicList_price_area"] span > span[class^="price_num"]');
      const priceDom2 = productOne.querySelector("span.num");
      
      var price = 0;
      if(priceDom) {
        let priceText = priceDom.innerText
          .replace(/,/g,"")
          .replace(/원/g,"");
        price = parseInt(priceText);
      } else if (priceDom2) {
        console.log("1차 가격정보 없음 : " + name);
        price = parseInt(priceDom2.innerText.replace(/,/g,""));
      }
      
      var totalPrice = price + deliveryObj.price;
      var deliveryString = deliveryObj.type == "착불"? "착불 : ": "배송비 포함 : ";

      var totalPriceString = numberWithCommas(totalPrice);

      // 합산 정보 넣음
      var priceAreaDom = productOne.querySelector('strong[class^="basicList_price"]');
      if(priceAreaDom) {
        var originalFontSize = '12px';
        var originalDom = priceAreaDom.querySelector("span > span");
        originalDom.style.color = 'black';
        originalDom.style['font-weight'] = 'normal';
        originalDom.style['font-size'] = originalFontSize;
        var priceHtml = priceAreaDom.innerHTML;
        var style = "font-weight: bold;margin-bottom:3px ;font-size: 16px !important; color: #16a085;";
        priceAreaDom.innerHTML = "<p class='everdeen' style='" + style + "'>" + deliveryString + totalPriceString + "원</p>" + priceHtml;
      }

      updateMinimalist(name, url, totalPrice, imgUrl);

    }

    var productRecords = document.querySelectorAll('div[class^="basicList_inner"]');
    productRecords.forEach(processOneRecord);

return minimalist;

})();
