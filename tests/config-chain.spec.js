const context = require('./test-setup');
const expect = require('chai').expect;

describe('#config-chaining', function() {
  it('config.load should return config', function() {
    // act
    const result = context.config.load('test', { debug: true });
    // assert
    expect(result).to.be.a('config');
  });
  it('config.setParser should return config', function() {
    // act
    context.config.debug();
    const result = context.config.setParser(
      'abcd',
      require('../lib/parsers/parse.json'),
      'con',
      true
    );
    // assert
    expect(result).to.be.a('config');
  });
  it('config.setParser.load should return config', function() {
    // act
    context.config.debug();
    const result = context.config
      .setParser('abcd', require('../lib/parsers/parse.json'), 'con', true)
      .load();
    // assert
    expect(result).to.be.a('config');
  });
});
