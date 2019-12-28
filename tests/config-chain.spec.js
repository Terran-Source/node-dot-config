const expect = require('chai').expect;
//const type = require('type-detect');

describe('#config-chaining', function() {
  it('config.load should return config', function() {
    // arrange
    const config = require('../config');
    // act
    const result = config.load();
    // assert
    expect(result).to.be.a('config');
  });
  it('config.setParser should return config', function() {
    // arrange
    const config = require('../config');
    // act
    const result = config.setParser(
      'abcd',
      require('../lib/parsers/parse.json')
    );
    // assert
    expect(result).to.be.a('config');
  });
});
