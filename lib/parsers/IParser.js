'use strict';

const Interface = require('../Interface');
const { NotImplementedException } = require('../exceptions');

class IParser extends Interface {
  constructor() {
    super();
    this[Symbol.toStringTag] = 'IParser';
  }

  /**
   * Parse the given fle & extract the json object
   * @param {string} filePath - primary file
   * @param {string} encoding - file encoding
   * @returns {JSON}
   */
  parse(filePath, encoding) {
    throw new NotImplementedException();
  }
}

module.exports = IParser;
