const expect = require('chai').expect;
//const type = require('type-detect');

describe('#config', function() {
  it("require('config') should return correct instance of config", function() {
    // arrange
    const config = require('../config');
    // act
    //console.log(`Type: ${type(config)}`);
    // assert
    expect(config).to.be.a('config');
  });
});
