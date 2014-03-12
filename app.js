// app.js

var express = require('express'),
    app = express();

app.get('/', function (req, res) {
  res.send('Hello new bride!');
});

var server = app.listen(5000, function () {
  console.log('listening on port %d', server.address().port);
});
