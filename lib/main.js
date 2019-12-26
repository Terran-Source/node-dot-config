const fs = require('fs');
const path = require('path');
const type = require('type-detect');

const log = function(message) {
  if (options.debug) console.log(`[dotconfig][debug]: {message}`);
};

const main = function() {
  let options = {
    debug: false,
    env: 'dev'
  };

  let config = {};
  config[Symbol.toStringTag] = 'config';

  return config;
};

module.exports = main();
