const context = require('./test-setup');
const expect = require('chai').expect;

describe('#config', function() {
  it("require('config') should return correct instance of config", function() {
    // arrange
    // const config = require('../config');
    // assert
    expect(context.config).to.be.a('config');
  });
  it('config.load should return dev config', function() {
    // act
    const result = context.config.load();
    // assert
    expect(result).to.be.a('config');
    console.log(
      `process.appConfig:\n${JSON.stringify(process.appConfig, null, 2)}`
    );
    expect(result.parsed).to.be.a('Object');
    expect(process.appConfig).to.be.a('Object');
    expect(process.appConfig).to.deep.equal(
      result.parsed,
      'config.parsed !== process.appConfig'
    );
    expect(process.appConfig).to.haveOwnProperty('devKey', 'devValue');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'devValue'
    });
  });
  it('config.load(test) should return test config', function() {
    // act
    const result = context.config.load('test');
    // assert
    expect(result).to.be.a('config');
    console.log(
      `process.appConfig:\n${JSON.stringify(process.appConfig, null, 2)}`
    );
    expect(result.parsed).to.be.a('Object');
    expect(process.appConfig).to.be.a('Object');
    expect(process.appConfig).to.deep.equal(
      result.parsed,
      'config.parsed !== process.appConfig'
    );
    expect(process.appConfig).to.haveOwnProperty('testKey', 'testValue');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'testValue'
    });
  });
});
