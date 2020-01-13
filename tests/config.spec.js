const context = require('./test-setup');
const expect = require('chai').expect;

describe('#config', function() {
  it("require('config') should return correct instance of config", function() {
    // assert
    expect(context.config).to.be.a('config');
  });
  it('config.loadConfig() should return {env: dev} config', function() {
    // act
    const result = context.config.loadConfig();
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
  it('config.loadConfig(test) should return {env: test} config', function() {
    // act
    const result = context.config.loadConfig('test');
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
  it('config.loadConfig({env: test}) should return {env: test} config', function() {
    // act
    const result = context.config.loadConfig({ env: 'test' });
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
  it('config.loadConfig(true, {env: test}) for {NODE_ENV: dev} should return {env: test} config', function() {
    // arrange
    process.env.NODE_ENV = 'dev';
    // act
    const result = context.config.loadConfig(true, { env: 'test' });
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
  it('config.loadConfig("test.ext") should return {env: test} config, even in {env: dev}', function() {
    // act
    const result = context.config.loadConfig('config.test.json');
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
  it('config.loadConfig(true) for {NODE_ENV: test} should return {env: test} config', function() {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.loadConfig(true);
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
  it('config.loadConfig() for {NODE_ENV: test} should return {env: dev} config', function() {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.loadConfig();
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
  it('config.loadConfig({env: dev}) for {NODE_ENV: test} should return {env: dev} config', function() {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.loadConfig({ env: 'dev' });
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
  it('config.loadConfig(true, {env: dev}) for {NODE_ENV: test} should return {env: dev} config', function() {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.loadConfig(true, { env: 'dev' });
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
  it('config.loadConfig("test", {env: dev}) should return {env: dev} config', function() {
    // act
    const result = context.config.loadConfig('test', { env: 'dev' });
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
  it('config.loadConfig("custom-filename.ext") should return only custom config file', function() {
    // act
    const result = context.config.loadConfig('cust-config.json');
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
  it('config.loadConfig("custom-filename.ext") for {env: test} should return custom {env: test} config', function() {
    // act
    const result = context.config.loadConfig('cust-config.json', {
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
  it('config.loadConfig(true) for {NODE_ENV: test, path: "custom-filename.ext"} should return custom {env: test} config', function() {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.loadConfig(true, {
      path: 'cust-config.json'
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
  it('config.loadConfig({env: test, path: "custom-filename.ext"}) should return custom {env: test} config', function() {
    // act
    const result = context.config.loadConfig({
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
  it('config.loadConfig({env: custom, path: "custom-filename.ext"}) should return custom {env: custom} config', function() {
    // act
    const result = context.config.loadConfig({
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
