# dotconfig  [![NPM version](https://img.shields.io/npm/v/@terran-source/dotconfig.svg?style=plastic)](https://www.npmjs.com/package/@terran-source/dotconfig)

[![Travis (.org)](https://img.shields.io/travis/Terran-Source/dotconfig?logo=travis&style=plastic)](https://travis-ci.org/Terran-Source/dotconfig) [![node](https://img.shields.io/node/v/@terran-source/dotconfig?logo=nodejs&style=plastic)](https://www.npmjs.com/package/@terran-source/dotconfig) [![GitHub](https://img.shields.io/github/license/Terran-Source/dotconfig?logo=github&style=plastic)](LICENSE)

App configuration made simple for Node.js

Supports:

1. app configuration file  of type `json` or `yml` or `env` (custom type parser's can also be implemented through implementing [`IParser`](#IParser) & using [`setParser`](#setParser))
2. [`Environment`](#env) specific configuration overloading
3. Now with the power of [interpolate-json](https://www.npmjs.com/package/interpolate-json) to support interpolation (or parameter substitution) inside app-configuration

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
*    app
*    |_ package.json
*    |_ index.js
*    |_ app-config.json
*    |_ app-config.dev.json
*    |_ app-config.test.json
*    |_ app-config.prod.json
*    
*/

//  app-config.json
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

//  app-config.dev.json
{
  "baseKey": "devValue"
}

//  app-config.test.json
{
  "scheme": "https",
  "server": "test.example.com",
  "baseKey": "testValue"
}

//  app-config.prod.json
{
  "scheme": "https",
  "server": "${APP_SERVER_NAME}",
  "port": "${APP_PORT}",
  "baseKey": "${BASE_KEY}"
}

// index.js
// declare the varible at the beginning
const { loadConfig } = require('@terran-source/dotconfig');

// load process.env.appConfig
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
  "url": "http://devuser:P%40ssw0rd@localhost:8080"
}
url: http://devuser:P%40ssw0rd@localhost:8080
```

To load environment specific configurations (recommended):
```javascript
let { parsed, error } = loadConfig({ env: 'test', path: 'app-config.json' });
// or
let { parsed, error } = loadConfig('test', { path: 'app-config.json' });
// or
let { parsed, error } = loadConfig(true, { path: 'app-config.json' }); // set Environment variable `NODE_ENV=test` before run

console.log(`parsed: ${JSON.stringify(parsed, null, 2)}`);
console.log(`url: ${process.appConfig.url}`);
```
```bash
# execute: 
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

xxxx

###### environment

- example: `dev`, `test`, `staging`, `prod`

xxxx

###### filename (with extension)

- example: "custom-config-file.ext"

xxxx

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
  error: null // or an Error object with `message`
}
```

xxxx

#### Configurations

xxxx

###### debug

- type: `boolean`

- default: `false`

Set it `true` to turn on logging to help debug why certain things are not working as expected. Can be turned on [globally](<#debug-1>).

###### encoding

- type: `string`
- default: `utf8`

xxxx

###### env

- type: `string`
- default: `dev`

xxxx

###### path

- type: `string`
- default: `config.json`

xxxx

###### type

- type: `string`
- default: `json`

xxxx

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
