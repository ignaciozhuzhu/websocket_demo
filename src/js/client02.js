var ws = new WebSocket("ws://localhost:8181");
var stock_request = {
    "stocks": ["AAPL", "MSFT", "AMZN", "GOOG", "YHOO"]
};
var isClose = false;
var stocks = {
    "AAPL": 0,
    "MSFT": 0,
    "AMZN": 0,
    "GOOG": 0,
    "YHOO": 0
};
var serviceurl = process.env.API_URL;
a();

function a() {
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
}


function updataUI() {
    ws.onopen = function(e) {
            console.log('Connection to server opened');
            isClose = false;
            ws.send(JSON.stringify(stock_request));
            console.log("sened a mesg");
        }
        // UI update function
    var changeStockEntry = function(symbol, originalValue, newValue) {
            var valElem = $('#' + symbol + ' span');
            valElem.html(newValue.toFixed(2));
            if (newValue < originalValue) {
                valElem.addClass('label-danger');
                valElem.removeClass('label-success');
            } else if (newValue > originalValue) {
                valElem.addClass('label-success');
                valElem.removeClass('label-danger');
            }
        }
        // WebSocket message handler
    ws.onmessage = function(e) {
        var stocksData = JSON.parse(e.data);
        console.log(stocksData);
        for (var symbol in stocksData) {
            if (stocksData.hasOwnProperty(symbol)) {
                changeStockEntry(symbol, stocks[symbol], stocksData[symbol]);
                stocks[symbol] = stocksData[symbol];
            }
        }
    };
}

updataUI();

$(".btn-primary").click(function() {
    if (isClose) {
        ws = new WebSocket("ws://localhost:8181");
    }
    updataUI();
});
$(".btn-danger").click(function() {
    ws.close();
});

ws.onclose = function(e) {
    console.log("Connection closed", e);
    isClose = true;
};