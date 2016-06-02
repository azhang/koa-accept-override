var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var request = require('supertest-koa-agent');
var _getHeader = require('../../index')._getHeader;

describe('_getHeader', function() {
  before(function() {
    app = new Koa();
    app.use(bodyParser());
    app.use(function(ctx, next) {
      return next().then(function() {
        ctx.body = {result: _getHeader(ctx)};
      });
    });
  });

  it('should determine existence of accept header', function(done) {
    request(app)
      .get('')
      .set('Accept', 'something')
      .expect(200, {result: true}, done);
  });
});