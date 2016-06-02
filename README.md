# koa-accept-override

[![npm version](https://badge.fury.io/js/koa-accept-override.svg)](https://badge.fury.io/js/koa-accept-override)
[![Coverage Status](https://coveralls.io/repos/azhang/koa-accept-override/badge.svg?branch=master&service=github)](https://coveralls.io/github/azhang/koa-accept-override?branch=master)
[![Circle CI](https://circleci.com/gh/azhang/koa-accept-override.svg?style=shield)](https://circleci.com/gh/azhang/koa-accept-override)

## Middleware to override `accept` header with query or url path file extension

## Installation

  npm install koa-accept-override

## Usage

  var acceptOverride = require('koa-accept-override');

  app.use(acceptOverride(options));

## Options

  accepts: ['json', 'html', 'csv', 'txt'] // must be valid mime extensions
  query: 'format' // /path?format=csv
  resolveOrder: ['suffix', 'query', 'header'] // will use first match

resolveOrder options:
- suffix: /somepath.json, /somepath.csv
- query: /somepath?format=json, /somepath?format=csv (change 'format' to something else with options.query)
- header: 'accepts:text/csv'
