var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var request = require('supertest-koa-agent');
var _getQuery = require('../../index')._getQuery;

describe('_getQuery', function() {
  before(function() {
    var options = {
      accepts: ['json', 'html', 'csv', 'txt'], // must be valid mime extensions
      query: 'format', // /path?format=csv
    };

    app = new Koa();
    app.use(bodyParser());
    app.use(function(ctx, next) {
      return next().then(function() {
        ctx.body = _getQuery(ctx, options);
      });
    });
  });

  it('should not return with no query', function(done) {
    request(app)
      .get('')
      .expect(204, done);
  });

  it('should return modified header with proper query', function(done) {
    request(app)
      .get('?format=html')
      .expect(200, {header: 'text/html'}, done);
  });

  it('should not return with invalid query', function(done) {
    request(app)
      .get('?format=asdf')
      .expect(204, done);
  });
});