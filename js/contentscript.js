/*
 * Copyright 2017 NAVER Corp.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
console.log("본페이지에 삽입된 스크립트 시작 + 가격갱신");
whale.runtime.sendMessage("findPrice");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function extractDeliveryFee(productOneDom) {
  var deliveryObj = {};
  var deliveryDom = productOneDom.querySelector('ul[class^="basicList_mall_option"]  em[class^="basicList_option"]');
  if (!deliveryDom) {
    deliveryObj.type = "없음";
    deliveryObj.price = 0;
    return deliveryObj;
  }
  var deliveryFee = deliveryDom.innerText
    .replace("배송비 ", "").replace("원", "").replace(/,/g, "");

  if (deliveryFee == "무료" || deliveryFee == "착불") {
    deliveryObj.type = deliveryFee;
    deliveryObj.price = 0;
  } else {
    deliveryObj.type = "유료";
    deliveryObj.price = parseInt(deliveryFee);
  }
  return deliveryObj;
}

function processOneRecord(productOne) {

  // 배송비 추출
  var deliveryObj = extractDeliveryFee(productOne);

  if (deliveryObj.type == "없음") {
    // 배송비 정보 없음
    return;
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

  // 가격정보
  // basicList_price_area__1UXXR
  const priceDom = productOne.querySelector('div[class^="basicList_price_area"] span > span[class^="price_num"]');
  const priceDom2 = productOne.querySelector("span.num");

  var price = 0;
  if (priceDom) {
    let priceText = priceDom.innerText
      .replace(/,/g, "")
      .replace(/원/g, "");
    price = parseInt(priceText);
  } else if (priceDom2) {
    console.log("1차 가격정보 없음 : " + name);
    price = parseInt(priceDom2.innerText.replace(/,/g, ""));
  }

  var totalPrice = price + deliveryObj.price;
  var deliveryString = deliveryObj.type == "착불" ? "착불 : " : "배송비 포함 : ";

  var totalPriceString = numberWithCommas(totalPrice);

  // 합산 정보 넣음
  var priceAreaDom = productOne.querySelector('strong[class^="basicList_price"]');
  if (priceAreaDom) {
    let everdeenPriceDom = priceAreaDom.querySelector(".everdeen");
    if (everdeenPriceDom) {
      var originalFontSize = '12px';
      var originalDom = priceAreaDom.querySelector("span > span");
      if(originalDom) {
        originalDom.style.color = 'black';
        originalDom.style['font-weight'] = 'normal';
        originalDom.style['font-size'] = originalFontSize;
      } else {
        console.log('가격정보 없음');
      }
      
    } else {
      var sumDom = document.createElement("p");
      sumDom.className = 'everdeen';
      sumDom.style = "font-weight: bold;margin-bottom:3px ;font-size: 16px !important; color: #16a085;"
      sumDom.innerText = deliveryString + totalPriceString + "원";
      
      priceAreaDom.appendChild(sumDom)
    }

  }

}

function refreshScreen(sortMenuDom) {
  sortMenuDom.addEventListener('click', function (event) {
    console.log("click 이벤트 먹음" + event);
    setTimeout(findPrice, 500);
  });
}

function findPrice() {
  // 배송비 업데이트
  var productRecords = document.querySelectorAll('div[class^="basicList_inner"]');
  productRecords.forEach(processOneRecord);

  // 정렬 메뉴에 가격 새로고침 이벤트 붙임
  var sortMenusDom = document.querySelectorAll('div[class^="subFilter_sort"]');
  sortMenusDom.forEach(refreshScreen);

  // 필터 옵션에 가격 새로고침 이벤트 붙임
  var snbMenusDom = document.querySelectorAll('div[class^="subFilter_filter"]');
  snbMenusDom.forEach(refreshScreen);

  // 페이지 링크에도 추가
  var pageDom = document.querySelectorAll('a[class^="pagination_btn_page"]');
  pageDom.forEach(refreshScreen);
}

setInterval(findPrice, 1000);