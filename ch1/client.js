var ws = new WebSocket("ws://localhost:8181");
ws.onopen = function(e) {
  console.log('Connection to server opened');
};

function sendMessage() {
  ws.send($('#message').val());
  $('#message').val('')
  alert('发送成功')
};
$("#send").click(function() {
  sendMessage()
});