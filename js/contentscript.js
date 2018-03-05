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
  var deliveryDom = productOneDom.querySelector("div.info_mall > ul > li > em");
  if(!deliveryDom) {
    return -1;
  }
  var deliveryFee = deliveryDom.innerText.replace("배송비 ","").replace("원","").replace(/,/g,"");
  if(deliveryFee == "무료") {
    return 0;
  } else {
    return parseInt(deliveryFee);
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
  var priceString = productOne.querySelector("span.num._price_reload").innerText
  var price = priceString.replace(/,/g,"");
  var deliveryDom = productOne.querySelector("div.info_mall > ul > li > em");
  var deliveryFee = extractDeliveryFee(productOne);

  if(deliveryFee < 0 ) {
    console.log("배송비 없음 : " + name);
    return ;
  }

  var totalPrice = parseInt(price) + deliveryFee;
  var deliveryString = deliveryFee == 0?"배송비 무료": "배송비" + numberWithCommas(deliveryFee) + "원";

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
    productOne.querySelector("span.price").innerHTML = "<p class='everdeen' style='" + style + "'>배송비 포함 : " + totalPriceString + "원</p>" + priceHtml;

  }
}

var productRecords = document.querySelectorAll("div ul.goods_list > li");
productRecords.forEach(processOneRecord);
