// app.js

var express = require('express'),
    app = express(),
    port = Number(process.env.PORT || 5000);

app.get('/', function (req, res) {
  res.send('Hello new bride!');
});

var server = app.listen(port, function () {
  console.log('listening on port %d', server.address().port);
});
