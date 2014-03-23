// app.js

var express = require('express'),
    app = express(),
    port = Number(process.env.PORT || 5000),
    ejs = require('ejs'),
    Q = require('q'),
    fs = require('fs'),
    renderFile = Q.denodeify(ejs.renderFile),
    flexgrid = require('flexgrid'),
    ecstatic = require('ecstatic'),
    hackedServe; // Stolen from tag-serve... If I keep it should make it reusable

(function () {
  var ecstaticMiddleware = ecstatic({root: '/'});
  hackedServe = function (localFilename, res) {
    ecstaticMiddleware({url: localFilename, method: 'GET'}, res);
  };
})();

app.use(express.static(__dirname + '/public'));

function renderView(path, options, layout) {
  var htmlDfd = Q.defer(),
      layoutPath = 'ejs-layouts/' + (layout || 'standard') + '.ejs';

  renderFile(path, options).then(function (viewHtml) {
    renderFile(layoutPath, {body: viewHtml, locals: options.locals}).then(function (pageHtml) {
      htmlDfd.resolve(pageHtml);
    }, htmlDfd.reject);
  }, htmlDfd.reject);

  return htmlDfd.promise;
}

function renderContentPage(res, path, locals, layout) {
  options = {locals: locals};
  console.log('options', options);
  renderView(path, options, layout).then(function (pageHtml) {
    res.send(pageHtml);
  }, function (err) {
    console.log('err rendering view', err);
    res.send(500, 'Sorry! Something broke.');
  });
}

function bindPathToFile(sitePath, filePath) {
  app.get(sitePath, function (req, res) {
    hackedServe(filePath, res);
  });
}

// Bind all the flexgrid files into the server.
// TODO move this into the flexgrid module? It is pretty icky.
// Perhaps it would feel better as a middleware from the flexgrid module?

for (var flexfile in flexgrid) {
  if (flexgrid.hasOwnProperty(flexfile)) {
    bindPathToFile('/flexgrid/' + flexfile, flexgrid[flexfile]);
  }
}

app.get('/flex', function (req, res) {
  renderContentPage(res, 'ejs-views/flex_home.ejs', {active: 'home'}, 'flex');
});

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
