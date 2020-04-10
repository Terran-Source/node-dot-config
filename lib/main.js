'use strict';

const extend = require('extend');
const fileFilter = require('./fileFilter');
const fs = require('fs');
const { interpolation } = require('interpolate-json');
const IParser = require('./parsers/IParser');
const path = require('path');
const type = require('type-detect');

const defaultConfigFileName = 'config';

const main = () => {
  let defaultOptions = {
    debug: false,
    encoding: 'utf8',
    env: 'dev',
    path: null,
    /**
     * **config file extension.**
     * can be json | env | <customType> (use *config.setParser('<customType>', <customParser: IParser>)*)
     */
    type: 'json',
  };

  const backupOptions = { ...defaultOptions };

  let defaultConfigFileOverride = {
    env: '',
  };

  const getDefaultFileName = (optionType) =>
    defaultConfigFileOverride.hasOwnProperty(optionType)
      ? defaultConfigFileOverride[optionType]
      : defaultConfigFileName;

  const getDefaultPath = (optionType, opt) =>
    path.resolve(
      process.cwd(),
      `${getDefaultFileName(optionType)}.${(opt || defaultOptions).type}`
    );

  const log = (message) => {
    if (defaultOptions.debug)
      console.log(`[dotconfig][debug][${defaultOptions.env}]: ${message}`);
  };

  const trace = (message) => {
    if (defaultOptions.debug)
      console.trace(`[dotconfig][error][${defaultOptions.env}]: ${message}`);
  };

  const traceNThrow = (errMessage) => {
    trace(errMessage);
    throw new Error(errMessage);
  };

  /**
   * Holds the combination of customParsers
   * like <customType>: new <customParser:[IParser]>()
   */
  let customParsers = {};

  const getBaseName = (filePath, ext) => {
    const result = path.basename(filePath, ext);
    const filename = path.basename(filePath);
    return result === filename ? '' : result;
  };

  const parse = (options) => {
    let parser = null;
    switch (options.type) {
      case 'json':
      case 'env':
        parser = require(`./parsers/parse.${options.type}`);
        break;
      default:
        if (customParsers.hasOwnProperty(options.type)) {
          parser = customParsers[options.type];
        }
        break;
    }
    if (parser) {
      if (type(parser) !== 'IParser')
        traceNThrow(
          `parser for type:"${options.type}" should be an IParser implementation.`
        );
      options.path = !options.path
        ? getDefaultPath(options.type, options)
        : path.resolve(options.path);
      let curConfigFileName = getBaseName(options.path, `.${options.type}`);
      log(`Starts parsing "${options.path}" of type:"${options.type}"`);
      let rootPath = path.dirname(options.path);
      let filterRegex = new RegExp(
        `^${curConfigFileName}` +
          `(${curConfigFileName ? '\\.' : ''}${options.env})` +
          `?.${options.type}$`
      );
      if (!fs.existsSync(options.path)) {
        log(`Default config file "${options.path}" does not exists.`);
        options.path = null;
      }
      let additionalFiles = fileFilter(rootPath, filterRegex).filter(
        (element) => element !== options.path // omits file already defined in option
      );

      let configJson = parser.parse(options.path, options.encoding);
      if (additionalFiles && additionalFiles.length > 0) {
        additionalFiles.forEach(function (additionalFilePath) {
          log(`taking additional config from "${additionalFilePath}".`);
          extend(
            true,
            configJson,
            parser.parse(additionalFilePath, options.encoding)
          );
        });
      }
      // use interpolation to fill the gap for any parameterized elements
      configJson = interpolation.expand(configJson, process.env);
      return configJson;
    }
    traceNThrow(
      `Parser of type:"${options.type}" is not registered.\nUse config.setParser('<type>', <custom_parser>)`
    );
  };

  // todo: (maybe) convert it as a class
  const config = {
    [Symbol.toStringTag]: 'config',
    loadConfig: function (opt) {
      let curOptions = { ...defaultOptions };
      let _opt = {};
      if (type(opt) === 'Object') {
        _opt = opt;
      } else {
        if (arguments[1] && type(arguments[1]) === 'Object')
          _opt = arguments[1];
        if (true === opt) {
          _opt.env = _opt.env || process.env.NODE_ENV || 'dev';
        } else if (type(opt) === 'string') {
          if (opt.indexOf('.') > -1) {
            _opt.path = opt;
          } else _opt.env = _opt.env || opt;
        }
      }
      if (_opt.path) _opt.type = _opt.type || _opt.path.split('.').pop();
      extend(curOptions, _opt);
      defaultOptions.debug = curOptions.debug;
      defaultOptions.env = curOptions.env;
      log(`config.options:\n${JSON.stringify(curOptions, null, 2)}`);

      let result = !this ? {} : this;
      try {
        let configJson = parse(curOptions);
        process.appConfig = configJson;
        result.parsed = configJson;
        result.error = null;
      } catch (e) {
        result.parsed = null;
        result.error = e;
        trace(e);
      }
      return result;
    },
    /**
     * Set a custom parser for a custom config file.
     * It should extend IParser & implement the parse method,
     * that parse the config file(s) & return a json
     * @param {string} customType - It generally represents the file extension
     * @param {IParser} customParser - IParser (config.Iparser) implementation
     * @param {string} defaultFileName - default config filename (without extension)
     * @param {boolean} resetType - make the supplied customType as the default *type* when the config.loadConfig() runs next time
     * @returns {'config'}
     */
    setParser: function (
      customType,
      customParser,
      defaultFileName = null,
      resetType = false
    ) {
      if (type(customType) === 'string' && type(customParser) === 'IParser') {
        customParsers[customType] = customParser;
        if (null !== defaultFileName)
          defaultConfigFileOverride[customType] = defaultFileName;
        if (true === resetType) {
          defaultOptions.type = customType;
          log(
            `It is now set to load config for type:"${customType}" from 
            "${getDefaultPath(customType)}" by default`
          );
        }
        log(`registered new parser for type:"${customType}"`);
      } else if (type(customType) !== 'string') {
        traceNThrow(
          'customType: should be a string. It generally represents the file extension'
        );
      } else if (type(customParser) !== 'IParser') {
        traceNThrow('customParser: should be an IParser implementation.');
      } else {
        traceNThrow('Please supply valid arguments');
      }
      return this;
    },
    /**
     * The IParser Interface to declare a custom file (e.g. XML, toml etc.) parser
     */
    IParser: IParser,
    error: null,
    parsed: {},
    debug: (flag = true) => {
      defaultOptions.debug = flag;
      return this;
    },
    reset: () => {
      defaultOptions = { ...backupOptions };
      delete process.appConfig;
      return this;
    },
  };

  return config;
};

module.exports = main();
