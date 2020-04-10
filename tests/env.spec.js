const context = require('./test-setup');
const expect = require('chai').expect;

describe('#loadConfig for env', function () {
  it('config.loadConfig({ type: env }) should return {env: dev} config', function () {
    // act
    const result = context.config.loadConfig({ type: 'env' });
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
    expect(process.appConfig).to.haveOwnProperty('someOtherKey', 'devValue');
    expect(process.appConfig)
      .to.haveOwnProperty('devKey', 'devValue')
      .and.not.to.haveOwnProperty('testKey');
  });
  it('config.loadConfig(test) should return {env: test} config', function () {
    // act
    const result = context.config.loadConfig('test', { type: 'env' });
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
    expect(process.appConfig).to.haveOwnProperty('someOtherKey', 'testValue');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
  });
  it('config.loadConfig({env: test}) should return {env: test} config', function () {
    // act
    const result = context.config.loadConfig({ type: 'env', env: 'test' });
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
    expect(process.appConfig).to.haveOwnProperty('someOtherKey', 'testValue');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
  });
  it('config.loadConfig(true, {env: test}) for {NODE_ENV: dev} should return {env: test} config', function () {
    // arrange
    process.env.NODE_ENV = 'dev';
    // act
    const result = context.config.loadConfig(true, {
      type: 'env',
      env: 'test',
    });
    delete process.env.NODE_ENV;
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
    expect(process.appConfig).to.haveOwnProperty('someOtherKey', 'testValue');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
  });
  it('config.loadConfig("test.ext") should return {env: test} config, even in {env: dev}', function () {
    // act
    const result = context.config.loadConfig('test.env');
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
    expect(process.appConfig).not.to.haveOwnProperty('someOtherKey');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
  });
  it('config.loadConfig(true) for {NODE_ENV: test} should return {env: test} config', function () {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.loadConfig(true, { type: 'env' });
    delete process.env.NODE_ENV;
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
    expect(process.appConfig).to.haveOwnProperty('someOtherKey', 'testValue');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
  });
  it('config.loadConfig() for {NODE_ENV: test} should return {env: dev} config', function () {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.loadConfig({ type: 'env' });
    delete process.env.NODE_ENV;
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
    expect(process.appConfig).to.haveOwnProperty('someOtherKey', 'devValue');
    expect(process.appConfig)
      .to.haveOwnProperty('devKey', 'devValue')
      .and.not.to.haveOwnProperty('testKey');
  });
  it('config.loadConfig({env: dev}) for {NODE_ENV: test} should return {env: dev} config', function () {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.loadConfig({ env: 'dev', type: 'env' });
    delete process.env.NODE_ENV;
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
    expect(process.appConfig).to.haveOwnProperty('someOtherKey', 'devValue');
    expect(process.appConfig)
      .to.haveOwnProperty('devKey', 'devValue')
      .and.not.to.haveOwnProperty('testKey');
  });
  it('config.loadConfig(true, {env: dev}) for {NODE_ENV: test} should return {env: dev} config', function () {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.loadConfig(true, { env: 'dev', type: 'env' });
    delete process.env.NODE_ENV;
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
    expect(process.appConfig).to.haveOwnProperty('someOtherKey', 'devValue');
    expect(process.appConfig)
      .to.haveOwnProperty('devKey', 'devValue')
      .and.not.to.haveOwnProperty('testKey');
  });
  it('config.loadConfig("test", {env: dev}) should return {env: dev} config', function () {
    // act
    const result = context.config.loadConfig('test', {
      env: 'dev',
      type: 'env',
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'devValue');
    expect(process.appConfig).to.haveOwnProperty('someOtherKey', 'devValue');
    expect(process.appConfig)
      .to.haveOwnProperty('devKey', 'devValue')
      .and.not.to.haveOwnProperty('testKey');
  });
  it('config.loadConfig("custom-filename.ext") should return only custom config file', function () {
    // act
    const result = context.config.loadConfig('custom-config.env');
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'customValue');
    expect(process.appConfig).to.haveOwnProperty('someOtherKey', 'customValue');
  });
  it('config.loadConfig("custom-filename.ext") for {env: test} should return custom {env: test} config', function () {
    // act
    const result = context.config.loadConfig('custom-config.env', {
      env: 'test',
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'customTestValue');
    expect(process.appConfig).to.haveOwnProperty(
      'someOtherKey',
      'customTestValue'
    );
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
  });
  it('config.loadConfig(true) for {NODE_ENV: test, path: "custom-filename.ext"} should return custom {env: test} config', function () {
    // arrange
    process.env.NODE_ENV = 'test';
    // act
    const result = context.config.loadConfig(true, {
      path: 'custom-config.env',
    });
    delete process.env.NODE_ENV;
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'customTestValue');
    expect(process.appConfig).to.haveOwnProperty(
      'someOtherKey',
      'customTestValue'
    );
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
  });
  it('config.loadConfig({env: test, path: "custom-filename.ext"}) should return custom {env: test} config', function () {
    // act
    const result = context.config.loadConfig({
      path: 'custom-config.env',
      env: 'test',
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'customTestValue');
    expect(process.appConfig).to.haveOwnProperty(
      'someOtherKey',
      'customTestValue'
    );
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
  });
  it('config.loadConfig({env: test, path: "custom-filename.ext"}) with Environment Variables should return custom overridden {env: test} config', function () {
    // act
    process.env.baseKey = 'EnvTestValue';
    const result = context.config.loadConfig({
      path: 'custom-config.env',
      env: 'test',
    });
    delete process.env.baseKey;
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
    expect(process.appConfig).to.haveOwnProperty('baseKey', 'customTestValue');
    expect(process.appConfig).to.haveOwnProperty(
      'someOtherKey',
      'EnvTestValue'
    );
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'testValue')
      .and.not.to.haveOwnProperty('devKey');
  });
  it('config.loadConfig({env: custom, path: "custom-filename.ext"}) should return custom {env: custom} config', function () {
    // act
    const result = context.config.loadConfig({
      path: 'custom-config.env',
      env: 'custom',
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
    expect(process.appConfig).to.haveOwnProperty('someOtherKey', 'custom');
    expect(process.appConfig)
      .to.haveOwnProperty('testKey', 'customTest')
      .and.not.to.haveOwnProperty('devKey');
  });
});
