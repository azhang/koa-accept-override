var mime = require('mime-types');
var url = require('url');

module.exports = exports = function(options) {
  options = options || {};

  // detect if req.connection exists eg. app.use(acceptsOverride)
  if (options.app) {
    throw new Error('Call accepts-middleware with options')
  }

  return function (ctx, next) {
    options = {
      accepts: options.accepts || ['json', 'html', 'csv', 'txt'], // must be valid mime extensions
      query: options.query || 'format', // /path?format=csv
      resolveOrder: options.resolveOrder || ['suffix', 'query', 'header'] // will use first match
    };

    var resolvers = {
      header: exports._getHeader,
      suffix: exports._getSuffix,
      query: exports._getQuery
    };

    var resolverOrder = options.resolveOrder.map(function(resolverName) {
      return resolvers[resolverName];
    });

    var result;
    resolverOrder.some(function(resolver) {
      result = resolver(ctx, options);
      if (result) return true;
    });

    if (result.header) ctx.req.headers.accept = result.header;
    if (result.url) ctx.req.url = result.url;

    return next();
  }
}

exports._getSuffix = function(ctx, options) {
  var parsedUrl = url.parse(ctx.req.url);
  var suffixMatch = parsedUrl.pathname.match(new RegExp("\\.(" + options.accepts.join('|') + ")$"));
  if (suffixMatch) {
    parsedUrl.pathname = parsedUrl.pathname.slice(0, suffixMatch.index);
    return {
      header: mime.lookup(suffixMatch[1]),
      url: url.format(parsedUrl)
    };
  }
}

exports._getQuery = function(ctx, options) {
  var queryMatch = ctx.request.query[options.query];
  if (queryMatch && options.accepts.indexOf(queryMatch) !== -1)
    return {
      header: mime.lookup(queryMatch)
    };
}

exports._getHeader = function(ctx) {
  return !!(ctx.get('accept'));
}
