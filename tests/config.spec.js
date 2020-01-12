const context = require('./test-setup');
const expect = require('chai').expect;

describe('#config', function() {
  it("require('config') should return correct instance of config", function() {
    // assert
    expect(context.config).to.be.a('config');
  });
  it('config.load() should return {env: dev} config', function() {
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'devValue');
    expect(process.appConfig)
      .to.haveOwnProperty('devKey', 'devValue')
      .and.not.to.haveOwnProperty('testKey');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'devValue'
    });
  });
  it('config.load(test) should return {env: test} config', function() {
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'testValue');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'testValue'
    });
  });
  it('config.load("test.ext") should return {env: test} config, even in {env: dev}', function() {
    // act
    const result = context.config.load('config.test.json');
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'testValue');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'testValue'
    });
  });
  it('config.load(true) for {NODE_ENV: test} should return test config', function() {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.load(true);
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'testValue');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'testValue'
    });
  });
  it('config.load() for {NODE_ENV: test} should return dev config', function() {
    // arrange
    process.env.NODE_ENV = 'test';
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'devValue');
    expect(process.appConfig)
      .to.haveOwnProperty('devKey', 'devValue')
      .and.not.to.haveOwnProperty('testKey');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'devValue'
    });
  });
  it('config.load({env: dev}) for {NODE_ENV: test} should return dev config', function() {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.load({ env: 'dev' });
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'devValue');
    expect(process.appConfig)
      .to.haveOwnProperty('devKey', 'devValue')
      .and.not.to.haveOwnProperty('testKey');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'devValue'
    });
  });
  it('config.load("custom-filename.ext") should return only custom config file', function() {
    // act
    const result = context.config.load('cust-config.json');
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'baseValue');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'baseValue'
    });
  });
  it('config.load("custom-filename.ext") for {env: test} should return custom test config', function() {
    // act
    const result = context.config.load('cust-config.json', { env: 'test' });
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'testValue');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'testValue'
    });
  });
  it('config.load(true) for {NODE_ENV: test, path: "custom-filename.ext"} should return custom test config', function() {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.load(true, { path: 'cust-config.json' });
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'testValue');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'testValue'
    });
  });
  it('config.load({env: test, path: "custom-filename.ext"}) should return custom test config', function() {
    // act
    const result = context.config.load({
      path: 'cust-config.json',
      env: 'test'
    });
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'testValue');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'testValue'
    });
  });
  it('config.load({env: custom, path: "custom-filename.ext"}) should return custom env custom config', function() {
    // act
    const result = context.config.load({
      path: 'cust-config.json',
      env: 'custom'
    });
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'custom');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'custom')
      .and.not.to.haveOwnProperty('devKey');
    expect(process.appConfig).to.have.deep.property('subKey', {
      baseKey: 'custom'
    });
  });
});
