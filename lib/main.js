const extend = require('extend');
const fs = require('fs');
const path = require('path');
const type = require('type-detect');

const main = function() {
  let options = {
    debug: false,
    encoding: 'utf8',
    env: 'dev',
    path: path.resolve(process.cwd(), 'config.json'),
    type: 'json' // can be json | yml | env
  };

  const log = function(message) {
    if (options.debug)
      console.log(`[dotconfig][debug][${options.env}]: {message}`);
  };

const parse=function()

  const config = {
    [Symbol.toStringTag]: 'config',
    load: function(opt) {
      if (type(opt) === 'Object') {
        extend(options, opt);
        log(`config:options:\n${options}`);
      }
      return this;
    },
    error: null,
    parsed: {}
  };

  return config;
};

module.exports = main();
