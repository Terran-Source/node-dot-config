const extend = require("extend");
const fs = require("fs");
const IParser = require("./IParser");

class ParseJson extends IParser {
  constructor() {
    super();
  }

  parse(filePath, encoding, args) {
    let configJson = !filePath
      ? {}
      : JSON.parse(fs.readFileSync(filePath, encoding));
    if (args && args.length > 0)
      args.forEach(function(additionalFilePath) {
        let additionalConfig = JSON.parse(
          fs.readFileSync(additionalFilePath, encoding)
        );
        extend(true, configJson, additionalConfig);
      });
    return configJson;
  }
}

module.exports = new ParseJson();
