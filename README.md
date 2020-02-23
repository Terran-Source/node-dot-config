# dotconfig  [![NPM version](https://img.shields.io/npm/v/@terran-source/dotconfig.svg?style=plastic)](https://www.npmjs.com/package/@terran-source/dotconfig)

[![Travis (.org)](https://img.shields.io/travis/Terran-Source/dotconfig?logo=travis&style=plastic)](https://travis-ci.org/Terran-Source/dotconfig) [![node](https://img.shields.io/node/v/@terran-source/dotconfig?logo=nodejs&style=plastic)](https://www.npmjs.com/package/@terran-source/dotconfig) [![GitHub](https://img.shields.io/github/license/Terran-Source/dotconfig?logo=github&style=plastic)](LICENSE)

App configuration made simple for Node.js

Supports:

1. app configuration file  of type `json` or `env` (custom type parser's can also be implemented through implementing [`IParser`](#IParser) & using [`setParser`](#setParser))
2. [`Environment`](#env) specific configuration overloading
3. Now with the power of [interpolate-json](https://www.npmjs.com/package/interpolate-json) to support interpolation (or parameter substitution) inside app-configuration (strongly recommend to go through the [documentation](https://www.npmjs.com/package/interpolate-json) to know the full power of interpolation)

## Install

```bash
# with npm
npm install @terran-source/dotconfig

# or with Yarn
yarn add @terran-source/dotconfig
```

## Usage

#### Declaration

```javascript
// declare the varible at the beginning
const { loadConfig } = require('@terran-source/dotconfig');
```

#### json

```javascript
/**
*    App Directory structure
*    
*    app/
*     | -- package.json
*     | -- index.js
*     | -- app-config.json
*     | -- app-config.dev.json
*     | -- app-config.test.json
*     | -- app-config.prod.json
*    
*/

// ** app-config.json **
{
  "scheme": "http",
  "server": "localhost",
  "port": "8080",
  "baseKey": "baseValue",
  "user": {
    "name": "${USER_NAME}",
    "password": "${USER_PASSWORD}"
  },
  "url": "${scheme}://${=${user.name}.toLowerCase()=}:${= encodeURIComponent(${user.password}) =}@${server}:${port}"
}

// ** app-config.dev.json **
{
  "baseKey": "devValue",
   "someDevKey": "someDevValue"
}

// ** app-config.test.json **
{
  "scheme": "https",
  "server": "test.example.com",
  "baseKey": "testValue"
}

// ** app-config.prod.json **
{
  "scheme": "https",
  "server": "${APP_SERVER_NAME}",
  "port": "${APP_PORT}",
  "baseKey": "${BASE_KEY}"
}

// ** index.js **
// declare the varible at the beginning
const { loadConfig } = require('@terran-source/dotconfig');

// load process.appConfig
let { parsed, error } = loadConfig('app-config.json');

if (error) {
  console.log(error);
}

// now either use parsed or process.appConfig (recommended)
console.log(`parsed: ${JSON.stringify(parsed, null, 2)}`);
console.log(`url: ${process.appConfig.url}`);
```
```bash
# execute using: 
USER_NAME=DevUser USER_PASSWORD=P@ssw0rd node index.js
# output:  
parsed: {
  "scheme": "http",
  "server": "localhost",
  "port": "8080",
  "baseKey": "devValue",
  "user": {
    "name": "DevUser",
    "password": "P@ssw0rd"
  },
  "url": "http://devuser:P%40ssw0rd@localhost:8080",
   "someDevKey": "someDevValue"
}
url: http://devuser:P%40ssw0rd@localhost:8080
```

Let's break it up:

`USER_NAME` & `USER_PASSWORD` are set through environment variable. This will replace the placeholders `${USER_NAME}` & `${USER_PASSWORD}` in *app-config.json*. The [`environment`](#env) is not specified. Hence, it'll be set as default value `dev`. Now, the [`loadConfig`](#loadConfig) function will search for any `dev` environment specific configuration (i.e. any file with name *app-config.`dev`.json* in the same directory, where it finds the original *app-config.json*). If it finds the additional file, it loads the details & overwrite anything, that matches with the base configuration or add anything, that is not present. i.e.

- `"baseKey": "baseValue"` becomes `"baseKey": "devValue"`
- additional `"someDevKey": "someDevValue"` key is added

To load environment specific configurations:

```javascript
let { parsed, error } = loadConfig({ env: 'test', path: 'app-config.json' });
// or
let { parsed, error } = loadConfig('test', { path: 'app-config.json' });
// or
// set Environment variable `NODE_ENV=test` and then run (recommended)
let { parsed, error } = loadConfig(true, { path: 'app-config.json' });

console.log(`parsed: ${JSON.stringify(parsed, null, 2)}`);
console.log(`url: ${process.appConfig.url}`);
```
```bash
# execute: for  loadConfig(true, { path: 'app-config.json' })
NODE_ENV=test USER_NAME=TestUser USER_PASSWORD=P@ssw0rd node index.js
# output:
parsed: {
  "scheme": "https",
  "server": "test.example.com",
  "port": "8080",
  "baseKey": "testValue",
  "user": {
    "name": "TestUser",
    "password": "P@ssw0rd"
  },
  "url": "https://testuser:P%40ssw0rd@test.example.com:8080"
}
url: https://testuser:P%40ssw0rd@test.example.com:8080
```

## Definition

Syntax: `loadConfig([true | env | file.extension], options);`

The `loadConfig` function takes at most 2 parameters

#### Optional 1<sup>st</sup> parameter

###### boolean: true

If the `NODE_ENV` environment variable is set as the [`environment`](#environment), then passing `true` as first parameter signifies to get [`env`](#env) from `NODE_ENV` environment value.

```javascript
// ** index.js **
const { loadConfig } = require();
loadConfig(true, { path: 'app-config.json' });
// do your job
db.connect(process.appConfig.url);
```

```bash
# to load test config
NODE_ENV=test node index.js
# to load uat config
NODE_ENV=uat node index.js
# to load prod config
NODE_ENV=prod node index.js
```

###### environment

- example: `dev`, `test`, `uat`, `staging`, `prod` etc.

The application environment name, which to load the configuration file for. Should be lowercase (by tradition) & not contain any space or special character.

###### filename (with extension)

- example: "custom-config-file.ext"

The configuration file path (either relative or absolute).

```javascript
const { loadConfig } = require('@terran-source/dotconfig');
loadConfig('app-config.json');
```

#### options

- type: `json`
- default:

```javascript
{
  debug: false,
  encoding: 'utf8',
  env: 'dev',
  path: 'config.json',
  type: 'json'
}
```

more in [`Configurations`](#Configurations)

#### returns:

- type: `json`

```javascript
{
  parsed: {}, // same as process.appConfig if succeed
  error: null // or an Error object with `message` if anything goes wrong
}
```

If it succeeds to load the configuration file & to parse the information containing within, it sets the `process.appConfig` with the value & will return with an Object with 

- `parsed` key with the same value as `process.appConfig`. 
- `error` key, which is `null` if succeeds or the error details if fails.

#### Configurations

The [`options`](#options) setup.

###### debug

- type: `boolean`

- default: `false`

Set it `true` to turn on logging to help debug why certain things are not working as expected. Can be turned on [globally](<#debug-1>).

###### encoding

- type: `string`
- default: `utf8`

The encoding of the configuration file, supplied in [`path`](#path).

###### env

- type: `string`
- default: `dev`

In a multi-environment setup (e.g. dev, test, uat, prod), this is the specifier for environment type. In practical case, it seems more logical to not set this one through [`options`](#options), but to set the `NODE_ENV` environment variable and pass true as first parameter to [`loadConfig`](#Definition) function (see [Example](#boolean-true)).

###### path

- type: `string`
- default: `config.json`

The path of the configuration file. It can either be a relative path or an absolute one.

###### type

- type: `string`
- default: `json`
- supported types: `json`, ~`env`~ (env development undergoing)

The configuration file extension.

### Functions

```javascript
// When declared as a varible at the beginning
const dotconfig = require('@terran-source/dotconfig');
```

#### loadConfig()

Described so far since [`Declaration`](#Declaration) & [`Definition`](#Definition).

```javascript
// Syntax I
const dotconfig = require('@terran-source/dotconfig');
dotconfig.loadConfig(opt);

// Syntax II
const { loadConfig } = require('@terran-source/dotconfig');
loadConfig(opt);
```

#### IParser

IParser lets others to implement a custom type of parser (like toml, xml etc.)

```javascript
// ** custom-parser.js **
const { IParser } = require('@terran-source/dotconfig');

// declare a class that extends IParser
class CustomParseClass extends IParser {
  constructor() {
    super();
  }

  // declare a parse function, that takes two parameters
  parse(filePath, encoding) {
    let json = // read filePath & create a json Object
    return json;
  }
}

module.exports = new CustomParseClass();

// ** somewhere.js **
const { loadConfig, setParser } = require('@terran-source/dotconfig');
const customParser = require('/path/to/custom-parser');

// define customParser for customType
setParser('customType', customParser);

// now a configuration file with extension `.customType` can be loaded
loadConfig('custom-app-config.customType');
db.connect(process.appConfig.url);
```

#### setParser()

- syntax: setParser(customType, customParser, deafultFileName = null, resetType = false)

  - *customType* - {type: `string`} It generally represents the file extension

  - *customParser* - {type: [`IParser`](#IParser)} An [`IParser`](#IParser) implementation

  - *deafultFileName* - {type: `string`, default: `null`} (optional) default configurtion filename (without extension)

  - *resetType* - {type: `Boolean`} (optional) make the supplied customType as the default *type* when the config.loadConfig() runs next time

```javascript
  // ** somewhere.js **
const { loadConfig, setParser } = require('@terran-source/dotconfig');
const customParser = require('/path/to/custom-parser'); // custom-parser should implement IParser

// define customParser for customType & make it default
setParser('customType', customParser, 'custom-config-file', true);

// The following commad now loads
//   - `custom-config-file.customType`
//   - `custom-config-file.dev.customType`
loadConfig();

// or if NODE_ENV is set to a different environment, e.g. 'test'
// it loads
//   - `custom-config-file.customType`
//   - `custom-config-file.test.customType`
loadConfig(true);

// Now process.appConfig is available
db.connect(process.appConfig.url);
```

  

#### debug()

Globally turn on [`debug`](#debug) flag.

```javascript
// to globally turn it on
const dotconfig = require('@terran-source/dotconfig').debug();

// to globally turn off
dotconfig.debug(false);
```

#### reset()

Resets the [options](#options).

```javascript
const dotconfig = require('@terran-source/dotconfig');

// do some custom job
let result = dotconfig.loadConfig({
  debug: true, // globally turn it on
  env: 'test', // globally set environement
  path: 'app-config.json' // not affecting next call
});
// start using process.appConfig or result.parsed

let result2 = dotconfig.loadConfig(); // `dubug` is still set as true, `env` is still 'test', but, `path` will be default, i.e. `config.json`

// now if you want to reset debug & all other options
interpolation.reset();
```
