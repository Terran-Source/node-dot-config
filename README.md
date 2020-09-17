# dots-config [![NPM version](https://img.shields.io/npm/v/dots-config.svg?style=plastic)](https://www.npmjs.com/package/dots-config)

[![Travis (.org)](https://img.shields.io/travis/Terran-Source/node-dot-config?logo=travis&style=plastic)](https://travis-ci.org/Terran-Source/node-dot-config) [![node](https://img.shields.io/node/v/dots-config?logo=nodejs&style=plastic)](https://www.npmjs.com/package/dots-config) [![GitHub](https://img.shields.io/github/license/Terran-Source/node-dot-config?logo=github&style=plastic)](LICENSE)

App configuration made simple for Node.js (Previously known as `@terran-source/dotconfig`)

Supports:

1. app configuration file of type `json` or `env` (custom type parser can also be implemented through implementing [`IParser`](#iparser) & using [`setparser`](#setparser))
2. [`Environment`](#env) specific configuration overloading
3. Now with the power of [interpolate-json](https://www.npmjs.com/package/interpolate-json) to support interpolation (or parameter substitution) inside app-configuration (strongly recommend to go through the [documentation](https://www.npmjs.com/package/interpolate-json) to know the full power of interpolation)

> NOTE: There is one major breaking change from v1.x
> 
> previously: `loadConfig()` used to return a combined object `{ parsed, error }`
> ```javascript
> let { parsed, error } = loadConfig('app-config.json');
> ```
> now: it only returns the object containing the app-configuration
> ```javascript
> let appConfig = loadConfig('app-config.json');
> ```

## Install

```bash
# with npm
npm install dots-config

# or with Yarn
yarn add dots-config
```

## Usage

#### Declaration

```javascript
// declare the variable at the beginning
const { loadConfig } = require('dots-config');
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
// declare the variable at the beginning
const { loadConfig } = require('dots-config');

// load process.appConfig
try {
let appConfig = loadConfig('app-config.json');
} catch (ex) {
  console.log(ex);
}

/** 
 * now use any one of
 *    - `appConfig` or
 *    - `process.env.appConfig` or
 *    - `process.appConfig` (recommended)
 *  virtually they are all set to same object
*/
console.log(`appConfig: ${JSON.stringify(appConfig, null, 2)}`); // using `appConfig`
console.log(`url: ${process.appConfig.url}`); // using `process.appConfig`
```

```bash
# execute using:
USER_NAME=DevUser USER_PASSWORD=P@ssw0rd node index.js
# output:
appConfig: {
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

`USER_NAME` & `USER_PASSWORD` are set through environment variable. This will replace the placeholders `${USER_NAME}` & `${USER_PASSWORD}` in _app-config.json_. The [`environment`](#env) is not specified. Hence, it'll be set as default value `dev`. Now, the [`loadConfig`](#loadconfig) function will search for any `dev` environment specific configuration (i.e. any file with name _app-config.`dev`.json_ in the same directory, where it finds the original _app-config.json_). If it finds the additional file, it loads the details & overwrite anything, that matches with the base configuration or add anything, that is not present. i.e.

- `"baseKey": "baseValue"` becomes `"baseKey": "devValue"`
- additional `"someDevKey": "someDevValue"` key is added

To load environment specific configurations:

```javascript
let appConfig = loadConfig({ env: 'test', path: 'app-config.json' });
// or
let appConfig = loadConfig('test', { path: 'app-config.json' });
// or
// set Environment variable `NODE_ENV=test` and then run (recommended)
let appConfig = loadConfig(true, { path: 'app-config.json' });

console.log(`appConfig: ${JSON.stringify(appConfig, null, 2)}`);
console.log(`url: ${process.appConfig.url}`);
```

```bash
# execute: for  loadConfig(true, { path: 'app-config.json' })
NODE_ENV=test USER_NAME=TestUser USER_PASSWORD=P@ssw0rd node index.js
# output:
appConfig: {
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

#### env

```javascript
/**
*    App Directory structure
*
*    app/
*     | -- package.json
*     | -- index.js
*     | -- .env
*     | -- dev.env
*     | -- test.env
*     | -- prod.env
*
*/

// ** .env **
key = "value"
"baseKey"= "baseValue"
'subKey'="subValue"
"someKey"= 'someValue'

// ** dev.env **
devKey=devValue
"baseKey"= "devValue"
'subKey'="subDevValue"
"someKey"= 'someDevValue'

// ** test.env **
testKey=testValue
"baseKey"= "testValue"
'subKey'="subTestValue"
"someKey"= 'someTestValue'

// ** prod.env **
"baseKey"= "${BASE_KEY}"
'subKey'="${SUB_KEY}"
"someKey"= '${SOME_KEY}'

// ** index.js **
// declare the variable at the beginning
const { loadConfig } = require('dots-config');

// load process.appConfig
try {
let appConfig = loadConfig(true, { path: '.env' });
} catch (ex) {
  console.log(ex);
}

// now either use appConfig or process.appConfig (recommended)
console.log(`appConfig: ${JSON.stringify(appConfig, null, 2)}`);
console.log(`baseKey: ${process.appConfig.baseKey}`);
```
For the Production environment, set the proper `ENVIRONMENT_VARIABLE` to be interpolated.

```bash
# execute: for  loadConfig(true, { path: '.env' })
NODE_ENV=prod BASE_KEY='some base key' SUB_KEY='some sub key' SOME_KEY='some other key' node index.js
# output:
appConfig: {
  "key": "value",
  "baseKey": "some base key",
  "subKey": "some sub key",
  "someKey": "some other key"
}
baseKey: some base key
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
const { loadConfig } = require('dots-config');
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

more in [`Configurations`](#configurations)

#### returns:

- type: `json Object`

If it succeeds to load the configuration file & to parse the information containing within, it sets the `process.appConfig` with the value & will return with an Object with the same value as `process.appConfig`.

#### Configurations

The [`options`](#options) setup.

###### debug

- type: `boolean`

- default: `false`

Set it `true` to turn on logging to help debug why certain things are not working as expected. Can be turned on [globally](#debug-1).

###### encoding

- type: `string`
- default: `utf8`

The encoding of the configuration file, supplied in [`path`](#path).

###### env

- type: `string`
- default: `dev`

In a multi-environment setup (e.g. dev, test, uat, prod), this is the specifier for environment type. In practical case, it seems more logical to not set this one through [`options`](#options), but to set the `NODE_ENV` environment variable and pass true as first parameter to [`loadConfig`](#definition) function (see [Example](#boolean-true)).

###### path

- type: `string`
- default: `config.json`

The path of the configuration file. It can either be a relative path or an absolute one.

###### type

- type: `string`
- default: `json`
- supported types: `json`, `env`

The configuration file extension.

### Functions

```javascript
// When declared as a variable at the beginning
const dotconfig = require('dots-config');
```

#### loadConfig()

Described so far since [`Declaration`](#declaration) & [`Definition`](#definition).

```javascript
// Syntax I
const dotconfig = require('dots-config');
dotconfig.loadConfig(opt);

// Syntax II
const { loadConfig } = require('dots-config');
loadConfig(opt);
```

#### IParser

IParser lets others to implement a custom type of parser (like toml, xml etc.)

```javascript
// ** custom-parser.js **
const { IParser } = require('dots-config');

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
const { loadConfig, setParser } = require('dots-config');
const customParser = require('/path/to/custom-parser');

// define customParser for customType
setParser('customType', customParser);

// now a configuration file with extension `.customType` can be loaded
loadConfig('custom-app-config.customType');
db.connect(process.appConfig.url);
```

#### setParser()

- syntax: setParser(customType, customParser, defaultFileName = null, resetType = false)

  - _customType_ - {type: `string`} It generally represents the file extension

  - _customParser_ - {type: [`IParser`](#iparser)} An [`IParser`](#iparser) implementation

  - _defaultFileName_ - {type: `string`, default: `null`} (optional) default configuration filename (without extension)

  - _resetType_ - {type: `Boolean`} (optional) make the supplied customType as the default _type_ when the config.loadConfig() runs next time

```javascript
// ** somewhere.js **
const { loadConfig, setParser } = require('dots-config');
const customParser = require('/path/to/custom-parser'); // custom-parser should implement IParser

// define customParser for customType & make it default
setParser('customType', customParser, 'custom-config-file', true);

// The following command now loads
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
const dotconfig = require('dots-config').debug();

// to globally turn off
dotconfig.debug(false);
```

#### reset()

Resets the [options](#options).

```javascript
const dotconfig = require('dots-config');

// do some custom job
let appConfig = dotconfig.loadConfig({
  debug: true, // globally turn it on
  env: 'test', // globally set environment
  path: 'app-config.json', // not affecting next call
});
// start using process.appConfig or appConfig

let result2 = dotconfig.loadConfig(); // `debug` is still set as true, `env` is still 'test', but, `path` will be default, i.e. `config.json`

// now if you want to reset debug & all other options
dotconfig.reset();
```
