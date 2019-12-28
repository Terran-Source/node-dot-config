'use strict';

const fs = require('fs');
const path = require('path');
const type = require('type-detect');

const fileFilter = function(rootPath, filter = null, isRecursive = false) {
  if (fs.existsSync(rootPath)) {
    let result = [];
    fs.readdirSync(rootPath).forEach(element => {
      let curPath = path.join(rootPath, element);
      if (fs.lstatSync(curPath).isDirectory() && isRecursive)
        result = result.concat(fileFilter(curPath, filter, isRecursive));
      switch (type(filter)) {
        case 'RegExp':
          if (filter.test(element)) result.push(curPath);
          break;
        case 'string':
          if (filter.startsWith('.')) {
            if (element.endsWith(filter)) result.push(curPath);
          } else if (element.contains(filter)) result.push(curPath);
      }
    });
    return result;
  }
  throw new Error(`Directory: "${rootPath}" doesn't exist`);
};

module.exports = fileFilter;
