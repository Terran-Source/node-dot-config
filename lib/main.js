'use strict';

const extend = require('extend');
const fileFilter = require('./fileFilter');
const fs = require('fs');
const IParser = require('./parsers/IParser');
const path = require('path');
const type = require('type-detect');

let deafultConfigFileName = 'config';

const main = function() {
  let options = {
    debug: false,
    encoding: 'utf8',
    env: 'dev',
    path: null,
    /**
     * can be json | yml | env | customType (use *config.setParser('<type>', <custom_parser>)*)
     */
    type: 'json'
  };

  const getDefaultConfigFileName = () =>
    path.resolve(process.cwd(), `${deafultConfigFileName}.${options.type}`);

  const log = function(message) {
    if (options.debug)
      console.log(`[dotconfig][debug][${options.env}]: ${message}`);
  };

  const trace = function(message) {
    if (options.debug)
      console.trace(`[dotconfig][error][${options.env}]: ${message}`);
  };

  /**
   * Holds the combination of customParsers
   * as <customType>: <customParser():IParser>
   */
  let customParsers = {};

  const parse = function() {
    let parser = null;
    switch (options.type) {
      case 'json':
      case 'yml':
      case 'env':
        if ('env' === options.type) {
          deafultConfigFileName = '';
        }
        parser = require(`./parsers/parse.${options.type}`);
        if (type(parser) !== 'IParser') {
          let errMessage = `parser for type:"${options.type}" should be an IParser implementation.`;
          trace(errMessage);
          throw new Error(errMessage);
        }
        break;
      default:
        if (Object.hasOwnProperty(customParsers, options.type)) {
          try {
            parser = customParsers[options.type];
          } catch (e) {
            trace(e.message);
            throw e;
          }
        }
        break;
    }
    if (parser) {
      log(`Starts parsing ${options.path} of type:"${options.type}"`);
      let rootPath = path.dirname(options.path);
      let filterRegex = new RegExp(
        `${deafultConfigFileName}(\.${options.env})?.${options.type}$`
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
    var errMessage = `Parser of type:"${options.type}" is not registered.\nUse config.setParser('<type>', <custom_parser>)`;
    trace(errMessage);
    throw new Error(errMessage);
  };

  const config = {
    [Symbol.toStringTag]: 'config',
    load: function(opt) {
      if (true === opt) {
        options.env = process.env.NODE_ENV;
      } else if (type(opt) === 'Object') {
        extend(options, opt);
      }
      if (null === options.path) options.path = getDefaultConfigFileName();
      log(`config:options:\n${options}`);

      try {
        this.parsed = parse();
        this.error = null;
      } catch (e) {
        this.parsed = null;
        this.error = e.message;
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
     * @param {boolean} resetType - make the supplied customType as the default *type* when the config.load() runs next time
     * @param {string} deafultFileName - default config filename (without extension)
     * @returns {'config'}
     */
    setParser: function(
      customType,
      customParser,
      resetType = false,
      deafultFileName = null
    ) {
      if (type(customType) !== 'string') {
        let errMessage =
          'customType: should be a string. It generally represents the file extension';
        trace(errMessage);
        throw new Error(errMessage);
      } else if (type(customParser) !== 'IParser') {
        let errMessage = 'customParser: should be an IParser implementation.';
        trace(errMessage);
        throw new Error(errMessage);
      } else if (
        type(customType) === 'string' &&
        type(customParser) === 'IParser'
      ) {
        log(`registered new parser for type:"${customType}"`);
        customParsers[customType] = customParser;
        if (true === resetType) {
          options.type = customType;
          if (null !== deafultFileName) deafultConfigFileName = deafultFileName;
          options.path = getDefaultConfigFileName();
          log(
            `It is now set to load config for type:"${customType}" from "${options.path}" by default`
          );
        }
      } else {
        let errMessage = 'PLease supply valid arguments';
        trace(errMessage);
        throw new Error(errMessage);
      }
      return this;
    },
    /**
     * The IParser Interface to declare a custom file (e.g. XML, toml etc.) parser
     */
    IParser: IParser,
    error: null,
    parsed: {}
  };

  return config;
};

module.exports = main();
