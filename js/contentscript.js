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
}

function refreshScreen(sortMenuDom) {
  sortMenuDom.addEventListener('click', function(event){
    console.log("click 이벤트 먹음"+ event);
    setTimeout(findPrice, 500);
  });
}

function findPrice() {
  var productRecords = document.querySelectorAll("div ul.goods_list > li");
  productRecords.forEach(processOneRecord);

  var sortMenusDom = document.querySelectorAll("div.sort_area ul.sort_list > li");
  sortMenusDom.forEach(refreshScreen);

  var snbMenusDom = document.querySelectorAll("div.snb_search ul.snb_list > li");
  snbMenusDom.forEach(refreshScreen);

  var pageDom = document.querySelectorAll("div.co_paginate > a");
  pageDom.forEach(refreshScreen);
}

findPrice();
