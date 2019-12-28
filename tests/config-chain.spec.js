const expect = require('chai').expect;
//const type = require('type-detect');

describe('#config-chaining', function() {
  it('correct', function() {
    // arrange
    const config = require('../config');
    // act
    const result = config.load();
    // assert
    expect(result).to.be.a('config');
  });
});
