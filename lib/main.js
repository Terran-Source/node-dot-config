'use strict';

const extend = require('extend');
const fileFilter = require('./fileFilter');
const fs = require('fs');
const IParser = require('./parsers/IParser');
const path = require('path');
const type = require('type-detect');

const deafultConfigFileName = 'config';

const main = () => {
  let defaultOptions = {
    debug: false,
    encoding: 'utf8',
    env: 'dev',
    path: null,
    /**
     * can be json | yml | env | customType (use *config.setParser('<type>', <custom_parser>)*)
     */
    type: 'json'
  };

  const backupOptions = { ...defaultOptions };

  const resetPath = () => {
    defaultOptions.path = null;
  };

  let deafultConfigFileOverride = {
    env: ''
  };

  const getDefaultPath = (optionType, opt) =>
    path.resolve(
      process.cwd(),
      `${
        deafultConfigFileOverride.hasOwnProperty(optionType)
          ? deafultConfigFileOverride[optionType]
          : deafultConfigFileName
      }.${(opt || defaultOptions).type}`
    );

  const log = message => {
    if (defaultOptions.debug)
      console.log(`[dotconfig][debug][${defaultOptions.env}]: ${message}`);
  };

  const trace = message => {
    if (defaultOptions.debug)
      console.trace(`[dotconfig][error][${defaultOptions.env}]: ${message}`);
  };

  const traceNThrow = errMessage => {
    trace(errMessage);
    throw new Error(errMessage);
  };

  /**
   * Holds the combination of customParsers
   * as <customType>: new <customParser>() => IParser
   */
  let customParsers = {};

  const parse = options => {
    let parser = null;
    switch (options.type) {
      case 'json':
      case 'yml':
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
      let curConfigFileName = deafultConfigFileOverride.hasOwnProperty(
        options.type
      )
        ? deafultConfigFileOverride[options.type]
        : deafultConfigFileName;
      options.path =
        null === options.path
          ? getDefaultPath(options.type, options)
          : path.resolve(options.path);
      log(`Starts parsing ${options.path} of type:"${options.type}"`);
      let rootPath = path.dirname(options.path);
      let filterRegex = new RegExp(
        `${curConfigFileName}(\.${options.env})?.${options.type}$`
      );
      if (!fs.existsSync(options.path)) {
        log(`Default config file "${options.path}" does not exists.`);
        options.path = null;
      }

      return parser.parse(
        options.path,
        options.encoding,
        fileFilter(rootPath, filterRegex).filter(
          element => element !== options.path // omits file already defined in option
        )
      );
    }
    traceNThrow(
      `Parser of type:"${options.type}" is not registered.\nUse config.setParser('<type>', <custom_parser>)`
    );
  };

  const config = {
    [Symbol.toStringTag]: 'config',
    load: function(opt) {
      resetPath();
      let curOptions = { ...defaultOptions };
      if (type(opt) === 'Object') {
        extend(curOptions, opt);
      } else {
        if (true === opt) {
          curOptions.env = process.env.NODE_ENV;
        } else if (type(opt) === 'string') {
          curOptions.env = opt;
        }
        if (arguments[1] && type(arguments[1]) === 'Object')
          extend(curOptions, arguments[1]);
      }
      defaultOptions.debug = curOptions.debug;
      log(`config.options:\n${JSON.stringify(curOptions, null, 2)}`);

      try {
        this.parsed = parse(curOptions);
        this.error = null;
      } catch (e) {
        this.parsed = null;
        this.error = e;
        trace(e);
      }
      return this;
    },
    /**
     * Set a custom parser for a custom config file.
     * It should extend IParser & implement the parse method,
     * that parse the cofig file(s) & return a json
     * @param {string} customType - It generally represents the file extension
     * @param {IParser} customParser - IParser (config.Iparser) implementation
     * @param {string} deafultFileName - default config filename (without extension)
     * @param {boolean} resetType - make the supplied customType as the default *type* when the config.load() runs next time
     * @returns {'config'}
     */
    setParser: function(
      customType,
      customParser,
      deafultFileName = null,
      resetType = false
    ) {
      if (type(customType) !== 'string') {
        traceNThrow(
          'customType: should be a string. It generally represents the file extension'
        );
      } else if (type(customParser) !== 'IParser') {
        traceNThrow('customParser: should be an IParser implementation.');
      } else if (
        type(customType) === 'string' &&
        type(customParser) === 'IParser'
      ) {
        log(`registered new parser for type:"${customType}"`);
        customParsers[customType] = customParser;
        if (null !== deafultFileName)
          deafultConfigFileOverride[customType] = deafultFileName;
        if (true === resetType) {
          resetPath();
          defaultOptions.type = customType;
          log(
            `It is now set to load config for type:"${customType}" from 
            "${defaultOptions.path || getDefaultPath(customType)}" by default`
          );
        }
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
    debug: () => {
      defaultOptions.debug = true;
    },
    reset: () => {
      defaultOptions = { ...backupOptions };
    }
  };

  return config;
};

module.exports = main();
