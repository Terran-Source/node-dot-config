const context = require('./test-setup');
const expect = require('chai').expect;

describe('#config-chaining', function() {
  it('config.loadConfig(test) should return config', function() {
    // act
    const result = context.config.loadConfig('test');
    // assert
    expect(result).to.be.a('config');
    expect(process.appConfig).to.be.a('Object').and.not.be.undefined;
  });
  it('config.setParser should return config', function() {
    // act
    const result = context.config.setParser(
      'abcd',
      require('../lib/parsers/parse.json'),
      'con',
      true
    );
    // assert
    expect(result).to.be.a('config');
    expect(process.appConfig).to.be.undefined;
  });
  it('config.setParser.load should return config using custom parser', function() {
    // act
    const result = context.config
      .setParser('abcd', require('../lib/parsers/parse.json'), 'con', true)
      .loadConfig();
    // assert
    expect(result).to.be.a('config');
    expect(process.appConfig).to.be.a('Object').and.not.be.undefined;
  });
  it('config.setParser.load should return config without config file', function() {
    // act
    const result = context.config
      .setParser('xkcd', require('../lib/parsers/parse.json'), 'con', true)
      .loadConfig();
    // assert
    expect(result).to.be.a('config');
    expect(process.appConfig).to.be.deep.equal({});
  });
});
