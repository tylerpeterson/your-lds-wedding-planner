// app.js

var express = require('express'),
    app = express(),
    port = Number(process.env.PORT || 5000),
    ejs = require('ejs'),
    Q = require('q'),
    fs = require('fs'),
    renderFile = Q.denodeify(ejs.renderFile);

app.use(express.static(__dirname + '/public'));

function renderView(path, options) {
  var htmlDfd = Q.defer();

  renderFile(path, options).then(function (viewHtml) {
    renderFile('ejs-layouts/standard.ejs', {body: viewHtml, locals: options.locals}).then(function (pageHtml) {
      htmlDfd.resolve(pageHtml);
    }, htmlDfd.reject);
  }, htmlDfd.reject);

  return htmlDfd.promise;
}

function renderContentPage(res, path, locals) {
  options = {locals: locals};
  console.log('options', options);
  renderView(path, options).then(function (pageHtml) {
    res.send(pageHtml);
  }, function (err) {
    console.log('err rendering view', err);
    res.send(500, 'Sorry! Something broke.');
  });
}

app.get('/about-ann', function (req, res) {
  renderContentPage(res, 'ejs-views/about_ann.ejs', {active: 'author'});
});

app.get('/about-the-book', function (req, res) {
  renderContentPage(res, 'ejs-views/about_the_book.ejs', {active: 'book'});
});

app.get('/', function (req, res) {
  renderContentPage(res, 'ejs-views/index.ejs', {active: 'home'});
});

var server = app.listen(port, function () {
  console.log('listening on port %d', server.address().port);
});
