const fs = require('fs');
const IParser = require('./IParser');

const newLineRegex = /\n|\r|\r\n/g;
const cleanse = (str) =>
  str
    .trim()
    .replace(/^"(.+)"$/g, '$1') // trim double-quote(")
    .replace(/^'(.+)'$/g, '$1'); // trim single-quote(')

const getEnvJson = (str) => {
  let result = {};
  if (str && str.length > 0) {
    str.split(newLineRegex).forEach((line) => {
      let equalIndex = line.indexOf('=');
      if (equalIndex > -1) {
        result[cleanse(line.substr(0, equalIndex))] = cleanse(
          line.substr(equalIndex + 1)
        );
      }
    });
  }
  return result;
};

class ParseEnv extends IParser {
  constructor() {
    super();
  }

  parse(filePath, encoding) {
    return !filePath
      ? {}
      : getEnvJson(fs.readFileSync(filePath, encoding).toString());
  }
}

module.exports = new ParseEnv();
