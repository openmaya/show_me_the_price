/*
 * Copyright 2017 NAVER Corp.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function () {
  'use strict';
  console.log("확장앱 로드시 페이지의 로그, 페이지가 리프레시되면 다시 불러온다.");
  var defaultHome = document.location.href
  console.log(defaultHome);
  findPrice();

  whale.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("확장앱에서 메시지 수신");
    var result = message;
    console.log(message);
    if(message == "findPrice") {
        findPrice();
    }
  });

  /* sidebarAction.getBadgeText() / sidebarAction.setBadgeText() */
  document.getElementById('updateFromCurrentScreen').addEventListener('click', () => {
    console.log("업데이트 버튼 클릭");
    findPrice();
  }, false);

  /* whale.sidebarAction.onClicked.addListener() */
  whale.sidebarAction.onClicked.addListener((result) => {
    console.log(defaultHome);
    if(result.opened) {
      whale.sidebarAction.show({
        url: whale.runtime.getURL('index.html')
      });
      findPrice();
    }

  });

  function findPrice() {
    // 아래 스크립트를 웹페이지에서 실행하고 결과를 받음
    whale.tabs.executeScript({
      file: 'js/findPrice.js'
    }, function (result) {
      if (whale.extension.lastError) {
        console.log("내장스크립트 실행시 에러 :: " + chrome.extension.lastError.message);
        document.querySelector('#productImg').innerHTML = "네이버 지식쇼핑 검색화면에서 이용해 주세요 ^^ <img src='WhaleMain.png'/>" ;
        document.querySelector('#validScreen').style.display = 'none';
      } else {
        document.querySelector('#productImg').innerHTML = "" ;
        document.querySelector('#validScreen').style.display = 'block';
      }
      updateScreen(result[0]);
    });
  }

  function updateScreen(minimumProduct) {
    document.querySelector('#productName').innerHTML =
      "<a href='" + minimumProduct.url + "' >" + minimumProduct.productName + "</a>";
    document.querySelector('#productPrice').innerText =
      "배송비 포함 가격 : " + numberWithCommas(minimumProduct.price) + "원\n";
  }


  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


})();
