var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({
    port: 8181
  });
var stocks = {
    "AAPL": 95.0,
    "MSFT": 50.0,
    "AMZN": 300.0,
    "GOOG": 550.0,
    "YHOO": 35.0
  }
  /*
  var http = require('http');
  var url = require('url');
  var util = require('util');

  http.createServer(function(req, res) {
      res.writeHead(200, {
          'Content-Type': 'text/plain'
      });
      res.end(util.inspect(url.parse(req.url, true)));
  }).listen(3000);*/
var http = require('http');
http.createServer(function(request, response) {
  var postData = "";
  var pathname = url.parse(request.url).pathname;
  request.setEncoding("utf8");
  request.addListener("data", function(postDataChunk) {
    postData += postDataChunk;
  });
  request.addListener("end", function() {

    info = querystring.parse(postData);
    console.log(info);
  });
}).listen(8888);

/*var serviceurl = process.env.API_URL;
getApiData();

function getApiData() {
    $.ajax({
        url: serviceurl + "ajax/API.ashx?fn=getdata",
        type: 'GET',
        dataType: "json",
        contentType: "application/json",
        data: "",
        success: function(result) {
            //  debugger
            console.log(result)
        },
        error: function(XMLHttpRequest) {
            console.log(XMLHttpRequest.responseJSON.message);
        }
    })
}*/

function randomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
var stockUpdater;
var randomStockUpdater = function() {
  for (var symbol in stocks) {
    if (stocks.hasOwnProperty(symbol)) {
      var randomizedChange = randomInterval(-150, 150);
      var floatChange = randomizedChange / 100;
      stocks[symbol] += floatChange;
    }
  }
  var randomMSTime = randomInterval(500, 2500);
  stockUpdater = setTimeout(function() {
    randomStockUpdater();
  }, randomMSTime);
}
randomStockUpdater();
var clientStocks = [];
wss.on('connection', function(ws) {
  var sendStockUpdates = function(ws) {
    if (ws.readyState == 1) {
      var stocksObj = {};
      for (var i = 0; i < clientStocks.length; i++) {
        var symbol = clientStocks[i];
        stocksObj[symbol] = stocks[symbol];
      }
      if (stocksObj.length !== 0) {
        ws.send(JSON.stringify(stocksObj));
        console.log("更新", JSON.stringify(stocksObj));
      }

    }
  }
  var clientStockUpdater = setInterval(function() {
    sendStockUpdates(ws);
  }, 3000);
  ws.on('message', function(message) {
    var stockRequest = JSON.parse(message);
    console.log("收到消息", stockRequest);
    clientStocks = stockRequest['stocks'];
    sendStockUpdates(ws);
  });
  ws.on('close', function() {
    if (typeof clientStockUpdater !== 'undefined') {
      clearInterval(clientStockUpdater);
    }
  });
});