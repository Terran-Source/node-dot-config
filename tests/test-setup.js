const chai = require('chai');

before(() => {
  // global arrange
  this.config = require('../config');
});

beforeEach(() => {
  // global reset
  this.config.debug();
});

afterEach(() => {
  // global reset
  this.config.reset();
});
