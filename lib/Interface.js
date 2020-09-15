'use strict';

const {
  InvalidInitialization,
  NotImplementedException,
} = require('custom-exception');

// inspired by https://gist.github.com/grindfuk/2c5b4fd546f178fe8fe039346284164b
function main(cls, options) {
  let iname = options ? options.interfaceName : 'Interface';
  let metaData = {
    child: null,
    interfaceCls: {
      name: iname,
      required: [],
    },
  };
  let child = cls;
  let instance = [];
  let properties;
  metaData.child = child.constructor.name;
  do {
    properties = Object.getOwnPropertyNames(child);
    if (Object.getPrototypeOf(child).constructor.name === iname) {
      metaData.interfaceCls.name = child.constructor.name;
      if (cls.constructor.name === child.constructor.name) {
        throw new InvalidInitialization(
          `Abstract Interface ${metaData.child} cannot be initialized`
        );
      }
      let mismatch = [];
      for (let key in properties) {
        if (properties[key] !== 'constructor') {
          metaData.interfaceCls.required.push(properties[key]);
          if (instance.indexOf(properties[key]) < 0) {
            mismatch.push(properties[key]);
          }
        }
      }
      if (mismatch.length > 0) {
        throw new NotImplementedException(
          `Interface Instance ${metaData.child} does not implement: ${mismatch}`
        );
      }
      break;
    } else {
      for (let key in properties) {
        if (properties[key] !== 'constructor') {
          instance.push(properties[key]);
        }
      }
    }
    child = Object.getPrototypeOf(child);
  } while (child);
  return metaData;
}

class Interface {
  constructor() {
    this.metaData = main(this);
  }
}

module.exports = Interface;
