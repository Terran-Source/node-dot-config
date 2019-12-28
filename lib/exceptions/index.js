'use strict';

class CustomException extends Error {
  constructor(message) {
    super(message || this.defaultMessage);
  }
}

class NotImplementedException extends CustomException {
  constructor(message) {
    this.defaultMessage = 'This functionality is not implemented yet.';
    super(message);
  }
}

class InvalidInitialization extends CustomException {
  constructor(message) {
    this.defaultMessage = 'This initialization process is invalid.';
    super(message);
  }
}

module.exports = {
  CustomException: CustomException,
  NotImplementedException: NotImplementedException,
  InvalidInitialization: InvalidInitialization
};
