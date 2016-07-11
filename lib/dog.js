"use strict";

class Dog {

  constructor(isInside) {
    this._isInside = isInside || true;
  }

  wentOutside() { this._isInside = false; }
  cameInside() { this._isInside = true; }

  isInside() { return this._isInside; }
  isOutside() { return !this._isInside; }

}

module.exports = Dog;
