const fs = require('fs');
const IParser = require('./IParser');

class ParseJson extends IParser {
  constructor() {
    super();
  }

  parse(filePath, encoding) {
    return !filePath ? {} : JSON.parse(fs.readFileSync(filePath, encoding));
  }
}

module.exports = new ParseJson();
