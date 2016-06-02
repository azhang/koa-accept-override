var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var request = require('supertest-koa-agent');
var acceptsOverride = require('../../index');

describe('Middleware', function() {
  var app;

  before(function() {
    app = new Koa();
    app.use(bodyParser());
    app.use(acceptsOverride());
    app.use(function(ctx, next) {
      return next().then(function() {
        switch (ctx.accepts('txt', 'csv')) {
          case 'txt':
            ctx.type = 'txt';
            ctx.body = '';
            break;
          case 'csv':
            ctx.type = 'csv';
            ctx.body = 'a,b,c';
            break;
        }
      });
    });
  });

it('should use first res.format with no suffix, query, header', function(done) {
    request(app)
      .get('')
      .expect('content-type', 'text/plain; charset=utf-8')
      .expect(200, '', done);
  });

  it('should use correct res.format with proper suffix', function(done) {
    request(app)
      .get('/test.csv')
      .expect('content-type', 'text/csv; charset=utf-8')
      .expect(200, 'a,b,c', done);
  });

  it('should use first res.format with invalid suffix', function(done) {
    request(app)
      .get('/test.asdf')
      .expect('content-type', 'text/plain; charset=utf-8')
      .expect(200, '', done);
  });
});

describe('Middleware incorrect use', function() {
  var app;

  before(function() {
    app = new Koa();
    app.use(bodyParser());
    app.use(acceptsOverride);
    app.use(function(ctx, next) {
      return next().then(function() {
        switch (ctx.accepts('txt', 'csv')) {
          case 'txt':
            ctx.body = '';
            break;
          case 'csv':
            ctx.body = 'a,b,c';
            break;
        }
      });
    });
  });

  it('should throw error if acceptsOverride mounted incorrectly', function(done) {
    request(app)
      .get('')
      .expect(500, done);
  });
});