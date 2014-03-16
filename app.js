// app.js

var express = require('express'),
    app = express(),
    port = Number(process.env.PORT || 5000),
    ejs = require('ejs'),
    Q = require('q'),
    fs = require('fs'),
    readFile = Q.denodeify(fs.readFile);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  readFile('ejs-views/index.ejs', 'utf-8').then(function (template) {
    res.send(ejs.render(template, {}));
  }, function (err) {
    console.log('err getting template', err);
    res.send(500, 'Sorry! Something broke.');
  });
});

var server = app.listen(port, function () {
  console.log('listening on port %d', server.address().port);
});
