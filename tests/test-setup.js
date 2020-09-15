const chai = require('chai');

before(() => {
  // global arrange
  this.config = require('../app');
});

beforeEach(() => {
  // global reset
  this.config.debug();
});

afterEach(() => {
  // global reset
  this.config.reset();
});
