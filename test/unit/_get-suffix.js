var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var request = require('supertest-koa-agent');
var _getSuffix = require('../../index')._getSuffix;

describe('_getSuffix', function() {
  before(function() {
    var options = {
      accepts: ['json', 'html', 'csv', 'txt'] // must be valid mime extensions 
    };

    app = new Koa();
    app.use(bodyParser());
    app.use(function(ctx, next) {
      return next().then(function() {
        ctx.body = _getSuffix(ctx, options);
      });
    });
  });

  it('should not return with no suffix', function(done) {
    request(app)
      .get('')
      .expect(204, done);
  });

  it('should return modified header with proper suffix', function(done) {
    request(app)
      .get('/test.csv')
      .expect(200, {header: 'text/csv', url: '/test'}, done);
  });

  it('should not return with invalid suffix', function(done) {
    request(app)
      .get('/test.asdf')
      .expect(204, done);
  });
});
